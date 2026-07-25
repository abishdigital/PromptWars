const EmergencyLog = require('../models/EmergencyLog');
const User = require('../models/User');
const CaregiverAlert = require('../models/CaregiverAlert');
const { generateEmergencyGrounding } = require('./geminiService');

const triggerEmergency = async (userId, triggers = [], notes = '') => {
  const user = await User.findById(userId);

  // Generate AI Crisis Grounding Response
  const aiGuidance = await generateEmergencyGrounding(triggers);

  // Create Emergency Log
  const emergencyLog = await EmergencyLog.create({
    userId,
    triggers,
    severity: 'high',
    aiSessionSummary: aiGuidance,
    status: 'active',
    notes,
  });

  // Notify linked caregiver if available
  if (user && user.caregiverId) {
    await CaregiverAlert.create({
      caregiverId: user.caregiverId,
      patientId: user._id,
      alertType: 'emergency_trigger',
      severity: 'critical',
      message: `CRITICAL ALERT: ${user.name} has activated Emergency Crisis Mode. Immediate check-in recommended.`,
    });
  }

  return {
    emergencyLog,
    aiGuidance,
    emergencyContacts: user ? user.emergencyContacts : [],
  };
};

const resolveEmergency = async (logId, notes = '') => {
  return await EmergencyLog.findByIdAndUpdate(
    logId,
    { status: 'resolved', notes },
    { new: true }
  );
};

const getEmergencyLogs = async (userId) => {
  return await EmergencyLog.find({ userId }).sort({ createdAt: -1 });
};

module.exports = {
  triggerEmergency,
  resolveEmergency,
  getEmergencyLogs,
};
