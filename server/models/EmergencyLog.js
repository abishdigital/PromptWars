const mongoose = require('mongoose');

const EmergencyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    triggers: [
      {
        type: String,
      },
    ],
    severity: {
      type: String,
      enum: ['moderate', 'high', 'critical'],
      default: 'high',
    },
    aiSessionSummary: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'escalated'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

EmergencyLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyLog', EmergencyLogSchema);
