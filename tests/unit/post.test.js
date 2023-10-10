const request = require('supertest');
const hash = require('../../src/hash');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
    test('error unauthenticated', async () => {
        const res = await request (app)
        .post ('/v1/fragments')
        .auth('user1@email.com','password1')
        .set('Content-Type', 'text/plain')
        .send('This is a fragment');
        expect(res.statusCode).toBe(201);
        console.log('res',res.body);
        expect(res.body.status).toBe('ok');
        expect(res.body.fragment.id).toBeDefined();
        expect(res.body.fragment.created).toBeDefined(); 
        expect(res.body.fragment.updated).toBeDefined();
        expect(res.body.fragment.size).toEqual(Buffer.byteLength('This is a fragment'));
        expect(res.body.fragment.type).toEqual('text/plain');
        expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    });    
})

   