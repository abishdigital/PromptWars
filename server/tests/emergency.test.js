const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const env = require('../config/env');
const User = require('../models/User');
const EmergencyLog = require('../models/EmergencyLog');

describe('Emergency Crisis API Tests', () => {
  let token;
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeAll(() => {
    token = jwt.sign({ id: mockUserId }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/emergency/trigger - activate crisis protocol', async () => {
    const mockUser = { _id: mockUserId, name: 'Emergency User', emergencyContacts: [] };
    const mockLog = {
      _id: 'log_123',
      userId: mockUserId,
      status: 'active',
      triggers: ['Severe Craving'],
    };

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(EmergencyLog, 'create').mockResolvedValue(mockLog);

    const res = await request(app)
      .post('/api/emergency/trigger')
      .set('Authorization', `Bearer ${token}`)
      .send({ triggers: ['Severe Craving'], notes: 'Triggered in unit test' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.aiGuidance).toBeDefined();
    expect(res.body.data.emergencyLog.status).toBe('active');
  });

  it('GET /api/emergency/logs - fetch user crisis history', async () => {
    const mockUser = { _id: mockUserId, name: 'Emergency User' };
    const mockLogs = [{ _id: 'log_123', status: 'resolved' }];

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(EmergencyLog, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockLogs),
    });

    const res = await request(app)
      .get('/api/emergency/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logs.length).toBe(1);
  });
});
