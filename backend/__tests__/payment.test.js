const crypto = require('crypto');
const Razorpay = require('razorpay');
const {
    createRazorpayOrder,
    verifyRazorpaySignature,
    verifyWebhookSignature
} = require('../src/utils/payment');

// Mock Razorpay SDK
jest.mock('razorpay');

describe('Payment Gateway Integration (Razorpay)', () => {
    let originalEnv;

    beforeAll(() => {
        // Save original environment
        originalEnv = { ...process.env };
        process.env.RAZORPAY_KEY_ID = 'test_key_id';
        process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
        process.env.RAZORPAY_WEBHOOK_SECRET = 'test_webhook_secret';
    });

    afterAll(() => {
        // Restore environment
        process.env = originalEnv;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createRazorpayOrder', () => {
        it('should successfully create a Razorpay order with correct parameters', async () => {
            // Setup mock implementation for Razorpay SDK
            const mockCreate = jest.fn().mockResolvedValue({ id: 'order_mock123', amount: 50000 });
            Razorpay.mockImplementation(() => ({
                orders: { create: mockCreate }
            }));

            const amount = 500; // 500 INR
            const order = await createRazorpayOrder(amount, 'INR', { receipt: 'receipt_test' });

            // Expect amount to be converted to paise (amount * 100)
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
                amount: 50000,
                currency: 'INR',
                receipt: 'receipt_test'
            }));

            expect(order.id).toBe('order_mock123');
        });

        it('should throw an error if Razorpay creation fails', async () => {
            const mockCreate = jest.fn().mockRejectedValue(new Error('Razorpay API down'));
            Razorpay.mockImplementation(() => ({
                orders: { create: mockCreate }
            }));

            await expect(createRazorpayOrder(500)).rejects.toThrow('Failed to create Razorpay order');
        });
    });

    describe('verifyRazorpaySignature', () => {
        it('should return true for a valid signature', () => {
            const razorpayOrderId = 'order_123';
            const razorpayPaymentId = 'pay_123';
            
            // Manually generate a valid signature using the test secret
            const validSignature = crypto
                .createHmac('sha256', 'test_key_secret')
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex');

            const result = verifyRazorpaySignature({
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature: validSignature
            });

            expect(result).toBe(true);
        });

        it('should return false for an invalid signature', () => {
            const result = verifyRazorpaySignature({
                razorpayOrderId: 'order_123',
                razorpayPaymentId: 'pay_123',
                razorpaySignature: 'invalid_hacker_signature'
            });

            expect(result).toBe(false);
        });

        it('should return false if any parameter is missing', () => {
            const result = verifyRazorpaySignature({
                razorpayOrderId: 'order_123',
                razorpayPaymentId: 'pay_123'
                // Missing signature
            });

            expect(result).toBe(false);
        });
    });

    describe('verifyWebhookSignature', () => {
        it('should return true for a valid webhook signature', () => {
            const body = JSON.stringify({ event: 'payment.captured' });
            
            const validSignature = crypto
                .createHmac('sha256', 'test_webhook_secret')
                .update(body)
                .digest('hex');

            const result = verifyWebhookSignature(body, validSignature);

            expect(result).toBe(true);
        });

        it('should return false for an invalid webhook signature', () => {
            const body = JSON.stringify({ event: 'payment.captured' });
            const result = verifyWebhookSignature(body, 'invalid_signature');

            expect(result).toBe(false);
        });
    });
});
