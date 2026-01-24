/**
 * Admin API Tests
 * Tests protected admin endpoints
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Admin API', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    describe('Protected Routes (No Auth)', () => {
        test('GET /api/admin/products should require auth', async () => {
            const response = await request(app)
                .get('/api/admin/products')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('GET /api/admin/orders should require auth', async () => {
            const response = await request(app)
                .get('/api/admin/orders')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('GET /api/admin/users should require auth', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('GET /api/admin/orders/stats should require auth', async () => {
            const response = await request(app)
                .get('/api/admin/orders/stats')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('Admin Auth Endpoints', () => {
        test('GET /api/admin/auth/status should require auth', async () => {
            const response = await request(app)
                .get('/api/admin/auth/status')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('POST /api/admin/auth/unlock should require auth', async () => {
            const response = await request(app)
                .post('/api/admin/auth/unlock')
                .send({ password: 'test' })
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });
    });
});
