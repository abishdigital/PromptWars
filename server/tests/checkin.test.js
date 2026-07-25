const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const env = require('../config/env');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');

describe('Daily Check-In & Recovery Stats API Tests', () => {
  let token;
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeAll(() => {
    token = jwt.sign({ id: mockUserId }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/checkins - reject unauthorized request', async () => {
    const res = await request(app).post('/api/checkins').send({ mood: 4, cravingLevel: 2 });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/checkins - validate input range', async () => {
    const mockUser = { _id: mockUserId, name: 'CheckIn User' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${token}`)
      .send({ mood: 10, cravingLevel: 20 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/checkins - submit valid check-in', async () => {
    const mockUser = { _id: mockUserId, name: 'CheckIn User', streak: 5, save: jest.fn() };
    const mockCheckIn = {
      _id: 'checkin_123',
      userId: mockUserId,
      mood: 4,
      cravingLevel: 3,
      riskScore: 25,
      aiFeedback: 'Great job tracking today!',
    };

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(CheckIn, 'findOneAndUpdate').mockResolvedValue(mockCheckIn);

    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${token}`)
      .send({
        mood: 4,
        cravingLevel: 3,
        triggers: ['Emotional Stress'],
        sleepHours: 7,
        notes: 'Feeling optimistic today.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.checkIn.riskScore).toBeDefined();
  });

  it('GET /api/checkins/stats - compute accurate recovery metrics', async () => {
    const mockUser = { _id: mockUserId, name: 'CheckIn User' };
    const mockHistory = [
      { date: '2026-07-25', mood: 4, cravingLevel: 2, riskScore: 20 },
      { date: '2026-07-24', mood: 3, cravingLevel: 4, riskScore: 35 },
    ];

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(CheckIn, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockHistory),
      }),
    });

    const res = await request(app)
      .get('/api/checkins/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.totalCheckIns).toBe(2);
  });
});
