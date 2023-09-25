// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('404 Error Handler', () => {
  it('should respond with a 404 error JSON response', async () => {
    const response = await request(app).get('/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});