const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const logger = require('../utils/logger');

let genAI = null;
if (env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (err) {
    logger.warn('[Gemini AI Init Warning] Failed to initialize GoogleGenerativeAI instance:', err.message);
  }
}

const SYSTEM_INSTRUCTION = `You are an empathetic, judgment-free AI Recovery Coach on the Recovery & Prevention Platform. 
Your goal is to support users in addiction recovery, emotional wellness, craving management, and relapse prevention.
Always speak with warmth, active listening, and calm encouragement. Use markdown formatting (bold text, bullet points) when helpful.
IMPORTANT: You are an AI Recovery Coach, not a medical doctor or therapist. Do not diagnose conditions or prescribe medications.
If a user expresses severe distress, self-harm thoughts, or overwhelming crisis, immediately remind them of Indian emergency helplines: National Emergency 112, iCall TISS Helpline (9152987821), Vandrevala Foundation 24/7 (1860-2662-345), or NIMHANS Mental Health Helpline (080-46110007).`;

/**
 * Generate Recovery Coach chat response
 */
const generateRecoveryCoachResponse = async (history = [], prompt = '') => {
  if (!genAI) {
    return getFallbackCoachResponse(prompt);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Format previous messages cleanly for Gemini SDK
    const formattedHistory = [];
    for (const msg of history) {
      if (!msg.text) continue;
      const role = msg.role === 'user' ? 'user' : 'model';
      // Prevent consecutive identical roles which Gemini disallows
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
        formattedHistory[formattedHistory.length - 1].parts[0].text += `\n${msg.text}`;
      } else {
        formattedHistory.push({
          role,
          parts: [{ text: msg.text }],
        });
      }
    }

    // Ensure history starts with 'user' role if not empty
    if (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift();
    }

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    logger.error(`[Gemini AI Chat Error] ${error.message}`);
    return getFallbackCoachResponse(prompt);
  }
};

/**
 * Analyze daily check-in risk level
 */
const analyzeCheckInRisk = async (checkInData) => {
  const { mood, cravingLevel, sleepHours, triggers, notes } = checkInData;

  // Rule-based heuristic risk score baseline
  let baseRisk = 0;
  baseRisk += (6 - mood) * 12; // lower mood = higher risk (up to 60)
  baseRisk += cravingLevel * 4; // craving 1-10 = up to 40
  if (sleepHours < 6) baseRisk += 10;
  if (triggers && triggers.length > 0) baseRisk += triggers.length * 5;

  const calculatedRiskScore = Math.min(Math.max(Math.round(baseRisk), 5), 95);

  if (!genAI) {
    return {
      riskScore: calculatedRiskScore,
      aiFeedback: getFallbackCheckInFeedback(mood, cravingLevel, calculatedRiskScore),
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `Analyze this daily recovery check-in:
- Mood (1-5): ${mood}
- Craving Intensity (1-10): ${cravingLevel}
- Sleep Hours: ${sleepHours}
- Triggers Identified: ${triggers ? triggers.join(', ') : 'None'}
- Personal Journal Notes: "${notes || 'None'}"

Provide a warm, supportive 2-3 sentence AI feedback message. Reinforce positive steps, acknowledge any cravings with empathy, and give one gentle, practical coping suggestion for today. Do not mention scores directly in text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      riskScore: calculatedRiskScore,
      aiFeedback: text,
    };
  } catch (error) {
    logger.error(`[Gemini CheckIn Error] ${error.message}`);
    return {
      riskScore: calculatedRiskScore,
      aiFeedback: getFallbackCheckInFeedback(mood, cravingLevel, calculatedRiskScore),
    };
  }
};

/**
 * Emergency Crisis De-escalation & Grounding Response
 */
const generateEmergencyGrounding = async (triggers = []) => {
  const triggerText = triggers.length > 0 ? triggers.join(', ') : 'overwhelming distress';

  if (!genAI) {
    return getFallbackEmergencyGuidance(triggerText);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `A user has just activated EMERGENCY CRISIS MODE on their recovery platform due to ${triggerText}.
Provide an immediate, calm, reassuring response (under 120 words). 
1. Reassure them that they are safe right now and cravings/distress are temporary.
2. Direct them to begin the 5-4-3-2-1 grounding exercise and box breathing widget on screen.
3. Remind them that National Emergency 112, iCall Helpline (9152987821), and Vandrevala Foundation (1860-2662-345) are available 24/7.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    logger.error(`[Gemini Emergency Error] ${error.message}`);
    return getFallbackEmergencyGuidance(triggerText);
  }
};

/**
 * Educational Topic Explanation
 */
const explainEducationalTopic = async (title, content) => {
  if (!genAI) {
    return `### Key Takeaways: ${title}\n\n* **Mindful Awareness**: Notice thoughts and feelings without judging yourself.\n* **Small Steps**: Recovery is built on small, consistent choices made every single day.\n* **Connection**: Lean on your support network and caregiver when challenges arise. You do not have to carry everything alone.`;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `Below is an educational article on recovery titled "${title}":\n\n${content}\n\nPlease summarize this into 3 simple, encouraging markdown bullet points that an individual in recovery can easily digest and apply today.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    logger.error(`[Gemini Education Error] ${error.message}`);
    return `### Key Takeaways: ${title}\n\n* **Mindful Awareness**: Notice thoughts and feelings without judging yourself.\n* **Small Steps**: Recovery is built on small, consistent choices made every single day.\n* **Connection**: Lean on your support network and caregiver when challenges arise.`;
  }
};

// Conversational Fallback Logic Helpers
const getFallbackCoachResponse = (prompt) => {
  const p = prompt.toLowerCase();
  if (p.includes('craving') || p.includes('urge')) {
    return "I hear you, and it takes genuine courage to speak up when experiencing a craving. \n\n**Remember**: Cravings are like ocean waves—they rise to a peak and inevitably subside within 15-20 minutes.\n\n* **Action Step**: Take a deep, slow breath right now. Drink a cold glass of water and change your physical environment.\n* **Grounding**: Focus on 3 objects in front of you. You have navigated difficult moments before, and you can ride this wave out safely.";
  }
  if (p.includes('anxious') || p.includes('stress') || p.includes('overwhelmed')) {
    return "It sounds like stress or anxiety is feeling heavy right now. Let's pause together.\n\n* **Un-clench your jaw** and drop your shoulders away from your ears.\n* **Place a hand on your heart** and take 3 deep, slow breaths in through your nose and out through your mouth.\n\nYou don't have to fix everything today—just focus on this single moment. What is one small thing that can bring you comfort right now?";
  }
  return "Thank you for reaching out to your Recovery Coach. Recovery is a journey built one step, one hour, and one day at a time.\n\n* **Acknowledge Progress**: Every time you pause and reflect, you are building emotional resilience.\n* **Reflect**: What is one positive choice or self-care action you can take for yourself right now?";
};

const getFallbackCheckInFeedback = (mood, craving, risk) => {
  if (risk > 60) {
    return "Thank you for checking in honestly today. It looks like you're navigating elevated stress or cravings. Remember that reaching out is a mark of strength. Consider connecting with your caregiver or completing a 5-minute grounding exercise.";
  }
  if (mood >= 4) {
    return "Awesome work completing your daily check-in! Your positive mindset and steady commitment to tracking progress strengthen your recovery foundation every day. Keep up the momentum!";
  }
  return "Thank you for checking in today. Steady consistency is key to long-term resilience. Practice self-compassion, take things one step at a time, and stay connected with your support system.";
};

const getFallbackEmergencyGuidance = (triggerText) => {
  return `You are in a safe space. You activated Emergency Crisis Mode because you are experiencing **${triggerText}**, and taking this action proves your deep commitment to your safety and recovery.\n\n1. **Breathe**: Take a slow deep breath in for 4 seconds, hold for 4, exhale for 4.\n2. **Ground**: Focus your physical weight on your feet touching the ground.\n3. **Support**: Reaching out is strength. Call National Emergency **112**, iCall Helpline **9152987821**, or Vandrevala Foundation **1860-2662-345** anytime for 24/7 crisis support.`;
};

module.exports = {
  generateRecoveryCoachResponse,
  analyzeCheckInRisk,
  generateEmergencyGrounding,
  explainEducationalTopic,
};

