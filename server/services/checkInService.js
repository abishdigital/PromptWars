const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const CaregiverAlert = require('../models/CaregiverAlert');
const { analyzeCheckInRisk } = require('./geminiService');

const submitDailyCheckIn = async (userId, checkInData) => {
  const today = new Date().toISOString().split('T')[0];
  const dateToUse = checkInData.date || today;

  // Run AI Risk Analysis
  const { riskScore, aiFeedback } = await analyzeCheckInRisk(checkInData);

  // Upsert check-in
  const checkIn = await CheckIn.findOneAndUpdate(
    { userId, date: dateToUse },
    {
      userId,
      date: dateToUse,
      mood: checkInData.mood,
      cravingLevel: checkInData.cravingLevel,
      triggers: checkInData.triggers || [],
      sleepHours: checkInData.sleepHours || 7,
      notes: checkInData.notes || '',
      riskScore,
      aiFeedback,
    },
    { new: true, upsert: true }
  );

  // Update User streak and last checkin
  const user = await User.findById(userId);
  if (user) {
    if (user.lastCheckInDate !== dateToUse) {
      user.streak += 1;
      user.lastCheckInDate = dateToUse;
      await user.save();
    }

    // Check if risk is high and caregiver is assigned
    if (riskScore >= 65 && user.caregiverId) {
      await CaregiverAlert.create({
        caregiverId: user.caregiverId,
        patientId: user._id,
        alertType: 'high_risk_checkin',
        severity: riskScore >= 80 ? 'critical' : 'high',
        message: `${user.name} logged a high-risk check-in (Risk Score: ${riskScore}/100, Craving Level: ${checkInData.cravingLevel}/10).`,
      });
    }
  }

  return { checkIn, updatedStreak: user ? user.streak : 0 };
};

const getCheckInHistory = async (userId, limit = 30) => {
  return await CheckIn.find({ userId })
    .sort({ date: -1 })
    .limit(limit);
};

const getCheckInStats = async (userId) => {
  const checkIns = await CheckIn.find({ userId })
    .sort({ date: -1 })
    .limit(30);

  if (checkIns.length === 0) {
    return {
      totalCheckIns: 0,
      averageMood: 0,
      averageCraving: 0,
      averageRiskScore: 0,
      recentTrends: [],
    };
  }

  const total = checkIns.length;
  const avgMood = (checkIns.reduce((acc, curr) => acc + curr.mood, 0) / total).toFixed(1);
  const avgCraving = (checkIns.reduce((acc, curr) => acc + curr.cravingLevel, 0) / total).toFixed(1);
  const avgRisk = Math.round(checkIns.reduce((acc, curr) => acc + curr.riskScore, 0) / total);

  const recentTrends = checkIns
    .slice(0, 14)
    .reverse()
    .map((c) => ({
      date: c.date,
      mood: c.mood,
      craving: c.cravingLevel,
      riskScore: c.riskScore,
    }));

  return {
    totalCheckIns: total,
    averageMood: Number(avgMood),
    averageCraving: Number(avgCraving),
    averageRiskScore: avgRisk,
    recentTrends,
  };
};

module.exports = {
  submitDailyCheckIn,
  getCheckInHistory,
  getCheckInStats,
};
