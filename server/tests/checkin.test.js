const request = require('supertest');
const app = require('../app');

describe('CheckIn Validation Tests', () => {
  it('POST /api/checkins should return 401 without auth token', async () => {
    const res = await request(app).post('/api/checkins').send({
      mood: 4,
      cravingLevel: 2,
    });
    expect(res.statusCode).toEqual(401);
  });
});
