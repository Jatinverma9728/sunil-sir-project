/**
 * Test Setup - Runs before all tests
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

// Increase timeout for database operations
jest.setTimeout(30000);

// Connect to database before all tests
beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Test database connected');
    }
});

// Clean up after all tests
afterAll(async () => {
    await mongoose.connection.close();
    console.log('📦 Test database disconnected');
});

// Helper: Measure response time
global.measureResponseTime = async (fn) => {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
};

// Suppress console logs during tests (optional)
if (process.env.SUPPRESS_LOGS === 'true') {
    console.log = jest.fn();
    console.error = jest.fn();
}
