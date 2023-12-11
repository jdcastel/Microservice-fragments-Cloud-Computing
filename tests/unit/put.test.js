const request = require('supertest');
const app = require('../../src/app');

describe('put tests', () => {
  test('unauthenticated request', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    await request(app).put(`/v1/fragments/${id}`).expect(401);
  });

  test('credentials error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('invalid@example.com', 'invalidpass')
      .expect(401);
  });

  test('error updating will invalid id', async () => {
    await request(app)
      .put('/v1/fragments/non_exist_id')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment')
      .expect(404);
  });

  test('error unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    const response = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/octet-stream')
      .expect(415);

    expect(response.body.error).toBe('Buffer is not supported');
  });

  test('successfully updated', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment');
    const id = res.body.fragment.id;

    const response = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment updated');

    expect(response.statusCode).toBe(200);
  });
});
