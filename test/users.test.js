const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming your Express app is exported from this file
const User = require('../models/nosql/users');
require('dotenv').config();

describe('User API', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.DB_URI_TEST);
        }
    });

    afterAll(async () => {
        
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'John Doe',
                email: 'john2345@example.com',
                password: 'password123',
                age: 30,
                city: 'New York',
                interest: 'Retail',
                allowOffers: true
            });
        expect(res.statusCode).toEqual(201);
    });

    it('should login an existing user', async () => {
        // First, create a user to login
        await request(app)
            .post('/api/users/register')
            .send({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
                age: 28,
                city: 'Los Angeles',
                interest: 'Tech',
                allowOffers: true
            });

        // Then, attempt to login with the created user's credentials
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'jane@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.header['auth-token']).toBeDefined();
    });

    it('should update an existing user', async () => {
        // First, create a user to update
        const user = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Alice Doe',
                email: 'alice@example.com',
                password: 'password123',
                age: 25,
                city: 'San Francisco',
                interest: 'Finance',
                allowOffers: true
            });

        // Login to get the auth token
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'alice@example.com',
                password: 'password123'
            });

        const token = loginRes.header['auth-token'];

        // Then, update the created user's information
        const res = await request(app)
            .put(`/api/users/update/`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Alice Smith',
                age: 26,
                city: 'San Jose',
                interest: 'Healthcare',
                allowOffers: false
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Alice Smith');
        expect(res.body.age).toEqual(26);
        expect(res.body.city).toEqual('San Jose');
        expect(res.body.interest).toContain('Healthcare');
        expect(res.body.allowOffers).toEqual(false);
    });

    it('should get user details', async () => {
        // First, create a user to get details
        const user = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Bob Doe',
                email: 'bob@example.com',
                password: 'password123',
                age: 32,
                city: 'Chicago',
                interest: 'Sports',
                allowOffers: true
            });

        // Login to get the auth token
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'bob@example.com',
                password: 'password123'
            });

        const token = loginRes.header['auth-token'];

        // Then, get the created user's details
        const res = await request(app)
            .get(`/api/users/details`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Bob Doe');
        expect(res.body.email).toEqual('bob@example.com');
        expect(res.body.age).toEqual(32);
        expect(res.body.city).toEqual('Chicago');
        expect(res.body.interest).toContain('Sports');
        expect(res.body.allowOffers).toEqual(true);
    });

    it('should delete an existing user', async () => {
        // First, create a user to delete
        const user = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Charlie Doe',
                email: 'charlie@example.com',
                password: 'password123',
                age: 29,
                city: 'Seattle',
                interest: 'Music',
                allowOffers: true
            });

        // Login to get the auth token
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'charlie@example.com',
                password: 'password123'
            });

        const token = loginRes.header['auth-token'];

        // Then, delete the created user
        const res = await request(app)
            .delete(`/api/users/delete`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
    });
});