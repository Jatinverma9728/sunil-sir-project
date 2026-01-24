/**
 * Health Endpoint Sanity Check
 * Tests /health endpoint for availability and performance
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Health Endpoint', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    test('GET /health should return 200 OK', async () => {
        const response = await request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Server is running');
        expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /health should respond in under 500ms', async () => {
        const start = Date.now();

        await request(app)
            .get('/health')
            .expect(200);

        const duration = Date.now() - start;

        console.log(`⏱️ Health endpoint response time: ${duration}ms`);
        expect(duration).toBeLessThan(500);
    });

    test('GET /api should return API info', async () => {
        const response = await request(app)
            .get('/api')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('version');
    });
});
