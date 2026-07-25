const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication & User API Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/health - return healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/auth/register - success patient registration', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockResolvedValue({
      _id: 'mock_user_123',
      name: 'Test Patient',
      email: 'testpatient@example.com',
      role: 'patient',
      streak: 0,
      recoveryGoal: 'Building resilience',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Patient',
      email: 'testpatient@example.com',
      password: 'Password123!',
      role: 'patient',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('testpatient@example.com');
  });

  it('POST /api/auth/register - reject duplicate email', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'existing_123', email: 'testpatient@example.com' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Patient Duplicate',
      email: 'testpatient@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already exists');
  });

  it('POST /api/auth/login - valid credentials', async () => {
    const mockUser = {
      _id: 'mock_user_123',
      email: 'testpatient@example.com',
      matchPassword: jest.fn().mockResolvedValue(true),
    };
    jest.spyOn(User, 'findOne').mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'testpatient@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login - invalid credentials', async () => {
    const mockUser = {
      email: 'testpatient@example.com',
      matchPassword: jest.fn().mockResolvedValue(false),
    };
    jest.spyOn(User, 'findOne').mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'testpatient@example.com',
      password: 'WrongPassword!',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me - unauthorized without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
