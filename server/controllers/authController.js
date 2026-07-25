const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const env = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, recoveryGoal } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    // Generate caregiver code if user is a caregiver
    let caregiverCode;
    if (role === 'caregiver') {
      caregiverCode = 'CG-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      recoveryGoal: recoveryGoal || 'Building daily resilience and emotional stability',
      caregiverCode,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        caregiverCode: user.caregiverCode,
        streak: user.streak,
        recoveryGoal: user.recoveryGoal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        caregiverCode: user.caregiverCode,
        caregiverId: user.caregiverId,
        streak: user.streak,
        recoveryGoal: user.recoveryGoal,
        emergencyContacts: user.emergencyContacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('caregiverId', 'name email');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update Profile & Emergency Contacts
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, recoveryGoal, emergencyContacts } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (recoveryGoal) user.recoveryGoal = recoveryGoal;
    if (emergencyContacts) user.emergencyContacts = emergencyContacts;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Link patient to caregiver via caregiverCode
// @route POST /api/auth/link-caregiver
const linkCaregiver = async (req, res, next) => {
  try {
    const { caregiverCode } = req.body;
    const caregiver = await User.findOne({ caregiverCode, role: 'caregiver' });

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        error: 'Caregiver code not found. Please check the code provided by your caregiver.',
      });
    }

    const user = await User.findById(req.user.id);
    user.caregiverId = caregiver._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully linked to caregiver ${caregiver.name}`,
      caregiver: {
        id: caregiver._id,
        name: caregiver.name,
        email: caregiver.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  linkCaregiver,
};
