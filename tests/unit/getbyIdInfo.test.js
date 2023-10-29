// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {

  test('unauthenticated requests are denied', () => request(app)
  .get('/v1/fragments/noid/info').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/anyid/info')
    .auth('invalid@notemail.com', 'notpassword')
    .expect(401));

  test('authenticated users get a fragment', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('content-type', 'text/plain')
    .send("this is the value");
    const id = res.body.fragment.id;

    const res2 = await request(app)
    .get(`/v1/fragments/${id}/info`)
    .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(res2.body.fragment.id).toBe(id);
    expect(res.body.fragment.type).toBe("text/plain");
  });

});