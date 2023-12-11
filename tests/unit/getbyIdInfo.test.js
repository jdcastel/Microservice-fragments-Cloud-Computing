// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('getby id info tests', () => {
  test('unauthenticated request', () => request(app).get('/v1/fragments/noid/info').expect(401));

  test('credentials error', () =>
    request(app)
      .get('/v1/fragments/noid/info')
      .auth('invalid@example.com', 'invalidpass')
      .expect(401));

  test('success getbyidInfo fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    const res2 = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(res2.body.fragment.id).toBe(id);
  });

  test('fragment does not found', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('This is a fragment');

    const res2 = await request(app)
      .get(`/v1/fragments/noId/info`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(404);
  });
});
