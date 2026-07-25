const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const env = require('../config/env');
const User = require('../models/User');

describe('Caregiver Portal API Tests', () => {
  let caregiverToken;
  let patientToken;
  const caregiverId = '507f1f77bcf86cd799439011';
  const patientId = '507f1f77bcf86cd799439022';

  beforeAll(() => {
    caregiverToken = jwt.sign({ id: caregiverId }, env.JWT_SECRET, { expiresIn: '1h' });
    patientToken = jwt.sign({ id: patientId }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/caregiver/patients - deny access to patient role', async () => {
    const mockPatient = { _id: patientId, role: 'patient' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockPatient);

    const res = await request(app)
      .get('/api/caregiver/patients')
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('GET /api/caregiver/patients - allow access to caregiver role', async () => {
    const mockCaregiver = { _id: caregiverId, role: 'caregiver' };
    const mockPatients = [{ _id: patientId, name: 'Patient Unit', streak: 5 }];

    jest.spyOn(User, 'findById').mockResolvedValue(mockCaregiver);
    jest.spyOn(User, 'find').mockReturnValue({
      select: jest.fn().mockResolvedValue(mockPatients),
    });

    const res = await request(app)
      .get('/api/caregiver/patients')
      .set('Authorization', `Bearer ${caregiverToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.patients.length).toBe(1);
  });
});
