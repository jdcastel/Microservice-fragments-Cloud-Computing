const request = require('supertest');
const app = require('../../src/app');

describe('delete tests', () => {
  test('unauthenticated request', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    await request(app).delete(`/v1/fragments/${id}`).expect(401);
  });

  test('credentials error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('invalid@example.com', 'invalidpass')
      .expect(401);
  });

  test('post a fragment and then get succesfuly deleted', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.status).toBe('ok');

    const res2 = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(404);
  });
});
