/**
 * Orders API Tests
 * Tests order creation and management
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Orders API', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    describe('Protected Order Routes', () => {
        test('GET /api/orders should require auth', async () => {
            const response = await request(app)
                .get('/api/orders')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('POST /api/orders should require auth', async () => {
            const response = await request(app)
                .post('/api/orders')
                .send({
                    shippingAddress: {},
                    paymentMethod: 'online'
                })
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('GET /api/orders/:id should require auth', async () => {
            const response = await request(app)
                .get('/api/orders/507f1f77bcf86cd799439011')
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('Payment Endpoints', () => {
        test('POST /api/orders/verify-payment should require auth', async () => {
            const response = await request(app)
                .post('/api/orders/verify-payment')
                .send({
                    razorpay_order_id: 'test',
                    razorpay_payment_id: 'test',
                    razorpay_signature: 'test'
                })
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });
    });
});
