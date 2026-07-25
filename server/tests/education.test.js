const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const env = require('../config/env');
const User = require('../models/User');
const EducationalResource = require('../models/EducationalResource');

describe('Educational Resources API Tests', () => {
  let token;
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeAll(() => {
    token = jwt.sign({ id: mockUserId }, env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/education - list resources', async () => {
    const mockArticles = [
      { _id: '1', title: 'Test Article', slug: 'test-article', category: 'Mindfulness', readTime: 3 },
    ];
    jest.spyOn(EducationalResource, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockArticles),
    });

    const res = await request(app).get('/api/education');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.articles)).toBe(true);
  });

  it('GET /api/education/:slug - fetch single article by slug', async () => {
    const mockArticle = { title: 'Test Article', slug: 'test-article-title' };
    jest.spyOn(EducationalResource, 'findOne').mockResolvedValue(mockArticle);

    const res = await request(app).get('/api/education/test-article-title');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.article.title).toBe('Test Article');
  });

  it('POST /api/education/:slug/explain - generate AI summary', async () => {
    const mockUser = { _id: mockUserId };
    const mockArticle = { title: 'Test Article', content: 'Detailed educational content.' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(EducationalResource, 'findOne').mockResolvedValue(mockArticle);

    const res = await request(app)
      .post('/api/education/test-article-title/explain')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.explanation).toBeDefined();
  });
});
