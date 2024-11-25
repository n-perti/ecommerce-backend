const mongoose = require('mongoose');

require('dotenv').config();

describe('Database Connection', () => {
    beforeAll(async () => {
        const dbUri = process.env.DB_URI_TEST;
        await mongoose.connect(dbUri);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should connect to the database successfully', async () => {
        const state = mongoose.connection.readyState;
        expect(state).toBe(1); // 1 means connected
    });

    test('should have the correct database name', async () => {
        const dbName = mongoose.connection.name;
        expect(dbName).toBe(process.env.DB_NAME);
    });
});