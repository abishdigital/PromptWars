const checkInService = require('../services/checkInService');

// @desc Submit daily check-in
// @route POST /api/checkins
const submitCheckIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { checkIn, updatedStreak } = await checkInService.submitDailyCheckIn(userId, req.body);
    res.status(201).json({
      success: true,
      checkIn,
      streak: updatedStreak,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get check-in history
// @route GET /api/checkins/history
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const checkIns = await checkInService.getCheckInHistory(userId);
    res.status(200).json({
      success: true,
      count: checkIns.length,
      checkIns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get check-in analytics and mood trends
// @route GET /api/checkins/stats
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await checkInService.getCheckInStats(userId);
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitCheckIn,
  getHistory,
  getStats,
};
