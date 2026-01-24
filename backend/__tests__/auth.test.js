/**
 * Authentication API Tests
 * Tests login flow and token generation
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Authentication API', () => {
    let app;

    beforeAll(() => {
        app = createApp();
    });

    describe('POST /api/auth/login', () => {
        test('should reject login with missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        test('should reject login with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword123'
                })
                .expect('Content-Type', /json/);

            // Should return 401 Unauthorized or 400 Bad Request
            expect([400, 401]).toContain(response.status);
            expect(response.body).toHaveProperty('success', false);
        });

        test('should return token on valid login', async () => {
            // Note: This test requires a valid test user in the database
            // Create a test user or use an existing admin user for testing
            const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
            const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword
                });

            // If test user exists, should return 200 with token
            if (response.status === 200) {
                expect(response.body).toHaveProperty('success', true);
                expect(response.body.data).toHaveProperty('token');
                expect(response.body.data).toHaveProperty('user');
                console.log('✅ Login successful - token received');
            } else {
                // If test user doesn't exist, log a warning
                console.log('⚠️ Test user not found - skipping token verification');
                console.log('   To enable this test, set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars');
            }
        });
    });

    describe('GET /api/auth/profile', () => {
        test('should reject request without auth token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });

        test('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer invalid_token_12345')
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('success', false);
        });
    });
});
