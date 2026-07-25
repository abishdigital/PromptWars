const emergencyService = require('../services/emergencyService');

// @desc Trigger emergency crisis protocol
// @route POST /api/emergency/trigger
const triggerEmergency = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { triggers, notes } = req.body;
    const result = await emergencyService.triggerEmergency(userId, triggers, notes);
    res.status(201).json({
      success: true,
      message: 'Emergency protocol activated. Assistance guidelines generated.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Resolve emergency log
// @route PUT /api/emergency/:id/resolve
const resolveEmergency = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const updatedLog = await emergencyService.resolveEmergency(req.params.id, notes);
    res.status(200).json({
      success: true,
      emergencyLog: updatedLog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get emergency log history
// @route GET /api/emergency/logs
const getLogs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logs = await emergencyService.getEmergencyLogs(userId);
    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerEmergency,
  resolveEmergency,
  getLogs,
};
