const express = require('express');
const {
  getPatients,
  getPatientOverview,
  getAlerts,
  acknowledgeAlert,
} = require('../controllers/caregiverController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('caregiver', 'admin'));

router.get('/patients', getPatients);
router.get('/patients/:patientId', getPatientOverview);
router.get('/alerts', getAlerts);
router.put('/alerts/:alertId/read', acknowledgeAlert);

module.exports = router;
