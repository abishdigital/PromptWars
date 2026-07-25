const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'model', 'system'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const AIChatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionType: {
      type: String,
      enum: ['coach', 'emergency', 'education', 'checkin'],
      default: 'coach',
    },
    messages: [MessageSchema],
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'low',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIChatSession', AIChatSessionSchema);
