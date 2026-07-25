const AIChatSession = require('../models/AIChatSession');
const geminiService = require('../services/geminiService');

// @desc Chat with AI Recovery Coach
// @route POST /api/ai/chat
const chatWithCoach = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { prompt, sessionType = 'coach' } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    // Retrieve or create chat session
    let chatSession = await AIChatSession.findOne({ userId, sessionType });
    if (!chatSession) {
      chatSession = new AIChatSession({
        userId,
        sessionType,
        messages: [],
      });
    }

    // Append user message
    chatSession.messages.push({
      role: 'user',
      text: prompt,
      timestamp: new Date(),
    });

    // Generate AI response via Gemini
    const aiResponseText = await geminiService.generateRecoveryCoachResponse(
      chatSession.messages.slice(-10),
      prompt
    );

    // Append AI response
    chatSession.messages.push({
      role: 'model',
      text: aiResponseText,
      timestamp: new Date(),
    });

    await chatSession.save();

    res.status(200).json({
      success: true,
      reply: aiResponseText,
      session: chatSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get AI chat history
// @route GET /api/ai/history
const getSessionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionType = 'coach' } = req.query;

    const chatSession = await AIChatSession.findOne({ userId, sessionType });
    res.status(200).json({
      success: true,
      messages: chatSession ? chatSession.messages : [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc Clear AI chat history
// @route DELETE /api/ai/history
const clearHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionType = 'coach' } = req.query;

    await AIChatSession.findOneAndDelete({ userId, sessionType });
    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithCoach,
  getSessionHistory,
  clearHistory,
};
