/**
 * Products API Tests
 * Tests GET /api/products endpoint and database performance
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Products API', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    describe('GET /api/products', () => {
        test('should return status 200 and array of products', async () => {
            const response = await request(app)
                .get('/api/products')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test('should include pagination info', async () => {
            const response = await request(app)
                .get('/api/products?page=1&limit=10')
                .expect(200);

            expect(response.body).toHaveProperty('pagination');
            // Public API uses 'currentPage' not 'page'
            expect(response.body.pagination).toHaveProperty('currentPage');
            expect(response.body.pagination).toHaveProperty('totalPages');
        });

        test('should respond in under 2000ms (performance check)', async () => {
            const start = Date.now();

            await request(app)
                .get('/api/products')
                .expect(200);

            const duration = Date.now() - start;

            console.log(`⏱️ Products list response time: ${duration}ms`);
            // Allow up to 2 seconds for database query
            expect(duration).toBeLessThan(2000);
        });

        test('should filter by category', async () => {
            const response = await request(app)
                .get('/api/products?category=smartphones')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/products/:id', () => {
        test('should return 404 for non-existent product', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            const response = await request(app)
                .get(`/api/products/${fakeId}`)
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
        });
    });
});
