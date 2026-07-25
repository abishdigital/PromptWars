const express = require('express');
const {
  chatWithCoach,
  getSessionHistory,
  clearHistory,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);
router.use(apiLimiter);

router.post('/chat', chatWithCoach);
router.get('/history', getSessionHistory);
router.delete('/history', clearHistory);

module.exports = router;
