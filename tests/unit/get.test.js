// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('get tests /v1/fragments', () => {

  test('unauthenticated request', () => request(app)
  .get('/v1/fragments')
  .expect(401));

  test('credentials error', () =>
    request(app)
    .get('/v1/fragments')
    .auth('invalid@notemail.com', 'notpassword')
    .expect(401));

  test('test for get request', async () => {
    const res = await request(app)
    .get('/v1/fragments')
    .auth('user1@email.com', 'password1');
     
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated with expand', async () => {
    await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('content-type', 'text/plain')
    .send("This is a fragment");
    
    const res = await request(app)
    .get('/v1/fragments/?expand=1')
    .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok'); 
  });
});