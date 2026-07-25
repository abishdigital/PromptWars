const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const logger = require('../utils/logger');

let genAI = null;
if (env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (err) {
    logger.warn('Failed to initialize GoogleGenerativeAI instance:', err.message);
  }
}

const SYSTEM_INSTRUCTION = `You are an empathetic, judgment-free AI Recovery Coach on the Recovery & Prevention Platform. 
Your goal is to support users in addiction recovery, emotional wellness, craving management, and relapse prevention.
Always speak with warmth, active listening, and calm encouragement.
IMPORTANT: You are an AI Recovery Coach, not a medical doctor or therapist. Do not diagnose conditions or prescribe medications.
If a user expresses severe distress, self-harm thoughts, or overwhelming crisis, immediately remind them of 988 Suicide & Crisis Lifeline (call/text 988) or SAMHSA Helpline (1-800-662-4357).`;

/**
 * Generate Recovery Coach chat response
 */
const generateRecoveryCoachResponse = async (history = [], prompt = '') => {
  if (!genAI) {
    return getFallbackCoachResponse(prompt);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format conversation history for Gemini
    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System Instruction: ${SYSTEM_INSTRUCTION}` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am your empathetic Recovery Coach, here to support your recovery journey safely and without judgment.' }],
        },
        ...formattedHistory,
      ],
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    logger.error(`[Gemini AI Error] ${error.message}`);
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `A user has just activated EMERGENCY CRISIS MODE on their recovery platform due to ${triggerText}.
Provide an immediate, calm, reassuring response (under 120 words). 
1. Reassure them that they are safe right now and cravings/distress are temporary.
2. Direct them to begin the 5-4-3-2-1 grounding exercise and box breathing widget on screen.
3. Remind them that 988 Suicide & Crisis Lifeline (call/text 988) is available 24/7.`;

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
    return `### Key Takeaway on ${title}\n\n${content.slice(0, 300)}...\n\n*Focus on one day at a time. Small, consistent steps build strong neuro-pathways for long-term recovery.*`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Below is an educational article on recovery titled "${title}":\n\n${content}\n\nPlease summarize this into 3 simple, encouraging bullet points that an individual in recovery can easily digest and apply today.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    logger.error(`[Gemini Education Error] ${error.message}`);
    return `### Key Takeaway on ${title}\n\n${content.slice(0, 300)}...`;
  }
};

// Fallback logic helpers
const getFallbackCoachResponse = (prompt) => {
  const p = prompt.toLowerCase();
  if (p.includes('craving') || p.includes('urge')) {
    return "I hear you, and it takes courage to speak up when experiencing a craving. Remember: cravings are like waves—they rise, peak, and inevitably fall. Take a deep breath with me, drink a glass of cold water, and try changing your immediate environment. You have handled tough moments before, and you can handle this one too.";
  }
  if (p.includes('anxious') || p.includes('stress') || p.includes('overwhelmed')) {
    return "It sounds like things feel heavy right now. Take a moment to un-clench your jaw and drop your shoulders. Try placing one hand over your heart and taking three slow, deep breaths. You don't have to solve everything today—just focus on this current moment.";
  }
  return "Thank you for reaching out. Recovery is a day-by-day, step-by-step journey. Every moment you pause and reflect is a victory. What is one small, nourishing action you can take for yourself right now?";
};

const getFallbackCheckInFeedback = (mood, craving, risk) => {
  if (risk > 60) {
    return "Thank you for checking in honestly today. It looks like you're navigating elevated stress or cravings. Remember that asking for support is a sign of strength. Consider reaching out to your caregiver or trying a 5-minute breathing session.";
  }
  if (mood >= 4) {
    return "Wonderful job completing your check-in! Your positive mood and commitment to tracking your progress are strengthening your recovery foundation today. Keep up the great work!";
  }
  return "Thank you for checking in today. Steady consistency is key to long-term recovery. Take things one step at a time, practice self-compassion, and stay connected with your support system.";
};

const getFallbackEmergencyGuidance = (triggerText) => {
  return `You are safe right now. You hit the emergency button because you are experiencing ${triggerText}, and taking this action proves your commitment to yourself. Take a deep breath. Focus on your feet touching the ground. Use the breathing tool and grounding exercise on screen. If you feel in immediate danger, call or text 988 anytime for free, confidential crisis support.`;
};

module.exports = {
  generateRecoveryCoachResponse,
  analyzeCheckInRisk,
  generateEmergencyGrounding,
  explainEducationalTopic,
};
