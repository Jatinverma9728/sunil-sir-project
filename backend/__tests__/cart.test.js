/**
 * Cart API Tests
 * Tests shopping cart functionality
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Cart API', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    describe('Protected Cart Routes', () => {
        test('GET /api/cart should require auth', async () => {
            const response = await request(app)
                .get('/api/cart')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('POST /api/cart should require auth', async () => {
            const response = await request(app)
                .post('/api/cart')
                .send({ productId: '507f1f77bcf86cd799439011', quantity: 1 })
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('DELETE /api/cart/:id should require auth', async () => {
            const response = await request(app)
                .delete('/api/cart/507f1f77bcf86cd799439011')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('POST /api/cart/sync should require auth', async () => {
            const response = await request(app)
                .post('/api/cart/sync')
                .send({ items: [] })
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });
    });
});
