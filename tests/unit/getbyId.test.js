// tests/unit/getbyId.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('get /v1/fragments/:id', () => {
  test('unauthenticated request', () => request(app)
  .get('/v1/fragments/noid')
  .expect(401));

  // test('credentials error', () =>
  //   request(app).get('/v1/fragments/noid')
  //   .auth('invalid@notemail.com', 'notpassword')
  //   .expect(401));

  // test('authenticated users get a fragment', async () => {
  //     const res = await request(app)
  //     .post ('/v1/fragments')
  //     .auth('user1@email.com','password1')
  //     .set({'Content-Type': 'text/plain'})
  //     .send('This is a fragment');

  //   const id = res.body.fragment.id;
  //   console.log(id);

  //   const res2 = await request(app)
  //   .get(`/v1/fragments/${id}`)
  //   .auth('user1@email.com', 'password1');

  //   console.log('res',res2.statusCode);
  //   expect(res2.statusCode).toBe(200);
  // });
});