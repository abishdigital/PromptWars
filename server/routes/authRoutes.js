const express = require('express');
const Joi = require('joi');
const {
  register,
  login,
  getMe,
  updateProfile,
  linkCaregiver,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('patient', 'caregiver', 'admin').default('patient'),
  recoveryGoal: Joi.string().allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required(),
});

const linkCaregiverSchema = Joi.object({
  caregiverCode: Joi.string().required().trim(),
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/link-caregiver', protect, validate(linkCaregiverSchema), linkCaregiver);

module.exports = router;
