const express = require('express');
const Joi = require('joi');
const {
  submitCheckIn,
  getHistory,
  getStats,
} = require('../controllers/checkInController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const checkInSchema = Joi.object({
  date: Joi.string().isoDate().optional(),
  mood: Joi.number().min(1).max(5).required(),
  cravingLevel: Joi.number().min(1).max(10).required(),
  triggers: Joi.array().items(Joi.string()).optional(),
  sleepHours: Joi.number().min(0).max(24).optional(),
  notes: Joi.string().allow('', null).optional(),
});

router.use(protect);

router.post('/', validate(checkInSchema), submitCheckIn);
router.get('/history', getHistory);
router.get('/stats', getStats);

module.exports = router;
