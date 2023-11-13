// tests/unit/getbyId.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('getbyid tests /v1/fragments/:id', () => {

  test('unauthenticated request', () => request(app)
  .get('/v1/fragments/noid')
  .expect(401));
  
  test('credentials error', () =>
  request(app).get('/v1/fragments/noid')
  .auth('invalid@notemail.com', 'notpassword')
  .expect(401));

  test('test for getbyId request', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({'Content-Type': 'text/plain'})
    .send("This is a fragment");
    const id = res.body.fragment.id;

    const res2 = await request(app)
    .get(`/v1/fragments/${id}`)
    .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.text).toBe("This is a fragment");
  });

  test('try invalid conversion', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('content-type', 'text/plain')
    .send("this is the value");

    const id = res.body.fragment.id;
    const res2 = await request(app)
    .get(`/v1/fragments/${id}.html`)
    .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(415);
  });

  test('convert the fragment to html', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({'Content-Type': 'text/markdown'})
    .send("Fragment md to html");

    const id = res.body.fragment.id;
    const res2 = await request(app)
    .get(`/v1/fragments/${id}.html`)
    .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res2.text).toEqual("<p>Fragment md to html</p>\n");
  });

});