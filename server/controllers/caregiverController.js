const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const EmergencyLog = require('../models/EmergencyLog');
const CaregiverAlert = require('../models/CaregiverAlert');

// @desc Get linked patients for caregiver
// @route GET /api/caregiver/patients
const getPatients = async (req, res, next) => {
  try {
    const caregiverId = req.user.id;
    const patients = await User.find({ caregiverId }).select('name email streak recoveryGoal lastCheckInDate createdAt');

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get detailed overview for a patient
// @route GET /api/caregiver/patients/:patientId
const getPatientOverview = async (req, res, next) => {
  try {
    const caregiverId = req.user.id;
    const { patientId } = req.params;

    const patient = await User.findOne({ _id: patientId, caregiverId }).select('-password');
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found or not assigned to you' });
    }

    const checkIns = await CheckIn.find({ userId: patientId }).sort({ date: -1 }).limit(14);
    const emergencyLogs = await EmergencyLog.find({ userId: patientId }).sort({ createdAt: -1 }).limit(5);

    const avgRisk = checkIns.length
      ? Math.round(checkIns.reduce((sum, c) => sum + c.riskScore, 0) / checkIns.length)
      : 0;

    res.status(200).json({
      success: true,
      patient,
      checkIns,
      emergencyLogs,
      summaryStats: {
        averageRiskScore: avgRisk,
        streakDays: patient.streak,
        recentCheckInCount: checkIns.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get alerts for caregiver
// @route GET /api/caregiver/alerts
const getAlerts = async (req, res, next) => {
  try {
    const caregiverId = req.user.id;
    const alerts = await CaregiverAlert.find({ caregiverId })
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Acknowledge / Read alert
// @route PUT /api/caregiver/alerts/:alertId/read
const acknowledgeAlert = async (req, res, next) => {
  try {
    const caregiverId = req.user.id;
    const alert = await CaregiverAlert.findOneAndUpdate(
      { _id: req.params.alertId, caregiverId },
      { read: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientOverview,
  getAlerts,
  acknowledgeAlert,
};
