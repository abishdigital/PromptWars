const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    cravingLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    triggers: [
      {
        type: String,
        trim: true,
      },
    ],
    sleepHours: {
      type: Number,
      default: 7,
      min: 0,
      max: 24,
    },
    notes: {
      type: String,
      default: '',
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    aiFeedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index for user & date
CheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CheckIn', CheckInSchema);
