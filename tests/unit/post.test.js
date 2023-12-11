const request = require('supertest');
const app = require('../../src/app');
const API_URL = process.env.API_URL;

describe('post tests /v1/fragments', () => {

    test('unauthenticated request', () => request(app)
    .post('/v1/fragments').expect(401));
    
    test('credentials error', () =>
    request(app).post('/v1/fragments')
    .auth('invalid@notemail.com', 'notpassword')
    .expect(401));

    test('Extension failed error', async () => {
        const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set({'Content-Type': 'application/octet-stream'});
        expect(res.statusCode).toBe(415);
        });
        
    test('test for post request', async () => {
        const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set({'Content-Type': 'text/plain'})
        .send('This is a fragment');

        expect(res.statusCode).toBe(201);
        expect(res.headers['location']).toBe(`${API_URL}/v1/fragments/${res.body.fragment.id}`)
      });
})
