const express = require('express');
const Joi = require('joi');
const {
  triggerEmergency,
  resolveEmergency,
  getLogs,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const emergencyTriggerSchema = Joi.object({
  triggers: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().allow('', null).optional(),
});

router.use(protect);

router.post('/trigger', validate(emergencyTriggerSchema), triggerEmergency);
router.put('/:id/resolve', resolveEmergency);
router.get('/logs', getLogs);

module.exports = router;
