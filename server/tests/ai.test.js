const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const env = require('../config/env');
const User = require('../models/User');
const AIChatSession = require('../models/AIChatSession');

describe('AI Recovery Coach & Gemini API Tests', () => {
  let token;
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeAll(() => {
    token = jwt.sign({ id: mockUserId }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/ai/chat - validate missing prompt', async () => {
    const mockUser = { _id: mockUserId, name: 'AI User' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/ai/chat - generate coach reply and update session', async () => {
    const mockUser = { _id: mockUserId, name: 'AI User' };
    const mockSession = {
      userId: mockUserId,
      sessionType: 'coach',
      messages: [],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(AIChatSession, 'findOne').mockResolvedValue(mockSession);

    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'I am experiencing a sudden craving.', sessionType: 'coach' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toBeDefined();
  });

  it('GET /api/ai/history - retrieve chat history', async () => {
    const mockUser = { _id: mockUserId, name: 'AI User' };
    const mockSession = {
      messages: [{ role: 'user', text: 'Hello' }, { role: 'model', text: 'Hi' }],
    };

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(AIChatSession, 'findOne').mockResolvedValue(mockSession);

    const res = await request(app)
      .get('/api/ai/history?sessionType=coach')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.messages.length).toBe(2);
  });

  it('DELETE /api/ai/history - clear chat history', async () => {
    const mockUser = { _id: mockUserId, name: 'AI User' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(AIChatSession, 'findOneAndDelete').mockResolvedValue(true);

    const res = await request(app)
      .delete('/api/ai/history?sessionType=coach')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
