const request = require('supertest');
const app = require('../app');

describe('Auth & Health API Tests', () => {
  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('healthy');
  });

  it('POST /api/auth/register should fail on missing email or password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBeFalsy();
  });
});
