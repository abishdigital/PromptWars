const mongoose = require('mongoose');

const CaregiverAlertSchema = new mongoose.Schema(
  {
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alertType: {
      type: String,
      enum: ['emergency_trigger', 'high_risk_checkin', 'missed_checkin'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CaregiverAlertSchema.index({ caregiverId: 1, createdAt: -1 });

module.exports = mongoose.model('CaregiverAlert', CaregiverAlertSchema);
