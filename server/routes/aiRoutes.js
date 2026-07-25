const express = require('express');
const Joi = require('joi');
const {
  chatWithCoach,
  getSessionHistory,
  clearHistory,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const chatSchema = Joi.object({
  prompt: Joi.string().required().trim().min(1).max(2000),
  sessionType: Joi.string().valid('coach', 'emergency', 'checkin').default('coach'),
});

router.use(protect);
router.use(apiLimiter);

router.post('/chat', validate(chatSchema), chatWithCoach);
router.get('/history', getSessionHistory);
router.delete('/history', clearHistory);

module.exports = router;

