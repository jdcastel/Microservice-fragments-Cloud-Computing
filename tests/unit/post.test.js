const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');

describe('post method /v1/fragments', () => {

    test('unauthenticated request', () => request(app)
    .post('/v1/fragments').expect(401));
    
    test('credentials error', () =>
    request(app).post('/v1/fragments')
    .auth('invalid@notemail.com', 'notpassword')
    .expect(401));

    test('Test for post request', async () => {
        const res = await request(app)
        .post ('/v1/fragments')
        .auth('user1@email.com','password1')
        .set({'Content-Type': 'text/plain'})
        .send('This is a fragment');
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('ok');
        expect(res.body.fragment.id).toBeDefined();
        expect(res.body.fragment.created).toBeDefined(); 
        expect(res.body.fragment.updated).toBeDefined();
        expect(res.body.fragment.size).toEqual(Buffer.byteLength('This is a fragment'));
        expect(res.body.fragment.type).toEqual('text/plain');
        expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    });    

    // test('unsupported type will fail', async () => {
    //     const res = await request(app)
    //     .post('/v1/fragments').auth('user1@email.com', 'password1')
    //     .set('content-type', 'image/png')
    //     .send({ 'object': 'object' });
    //     expect(res.statusCode).toBe(415);
    //   });
})
