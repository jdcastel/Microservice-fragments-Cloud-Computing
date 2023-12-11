const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const API_URL = process.env.API_URL;

describe('post tests', () => {
  test('unauthenticated request', () => request(app).post('/v1/fragments').expect(401));

  test('credentials error', () =>
    request(app).post('/v1/fragments').auth('invalid@example.com', 'invalidpass').expect(401));

  test('Extension failed error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'application/octet-stream' });
    expect(res.statusCode).toBe(415);
  });

  test('test for post request txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('This is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.headers['location']).toBe(`${API_URL}/v1/fragments/${res.body.fragment.id}`);
  });

  test('test for post request jpg', async () => {
    const imagePath = 'tests/images/cat.jpg';
    const imageBuffer = fs.readFileSync(imagePath);

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'image/jpeg' })
      .send(imageBuffer);

    expect(res.statusCode).toBe(201);
  });
  test('test for post request png', async () => {
    const imagePath = 'tests/images/bird.png';
    const imageBuffer = fs.readFileSync(imagePath);

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'image/png' })
      .send(imageBuffer);

    expect(res.statusCode).toBe(201);
    expect(res.headers['location']).toBe(`${API_URL}/v1/fragments/${res.body.fragment.id}`);
  });

  test('test for post request webp', async () => {
    const imagePath = 'tests/images/lion.webp';
    const imageBuffer = fs.readFileSync(imagePath);

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'image/webp' })
      .send(imageBuffer);

    expect(res.statusCode).toBe(201);
    expect(res.headers['location']).toBe(`${API_URL}/v1/fragments/${res.body.fragment.id}`);
  });

  test('test for post request gif', async () => {
    const imagePath = 'tests/images/walkingcat.gif';
    const imageBuffer = fs.readFileSync(imagePath);

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'image/gif' })
      .send(imageBuffer);

    expect(res.statusCode).toBe(201);
    expect(res.headers['location']).toBe(`${API_URL}/v1/fragments/${res.body.fragment.id}`);
  });
});