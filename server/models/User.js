const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['patient', 'caregiver', 'admin'],
      default: 'patient',
    },
    caregiverCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recoveryGoal: {
      type: String,
      default: 'Building daily resilience and emotional stability',
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCheckInDate: {
      type: String,
      default: null,
    },
    emergencyContacts: [
      {
        name: { type: String, required: true },
        relationship: { type: String, default: 'Supporter' },
        phone: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password instance method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
