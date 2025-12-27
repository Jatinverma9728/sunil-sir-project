const crypto = require('crypto');

/**
 * Mock Razorpay Integration
 * In production, replace with actual Razorpay SDK
 */

/**
 * Create Razorpay Order (Mock)
 * @param {number} amount - Amount in rupees
 * @returns {object} Order details
 */
const createRazorpayOrder = async (amount) => {
    // Mock implementation
    // In production: use Razorpay.orders.create()

    return {
        id: `order_${generateMockId()}`,
        entity: 'order',
        amount: amount * 100, // Convert to paise
        amount_paid: 0,
        amount_due: amount * 100,
        currency: 'INR',
        status: 'created',
        created_at: Math.floor(Date.now() / 1000),
    };
};

/**
 * Verify Razorpay Payment Signature
 * @param {object} params - Payment verification params
 * @returns {boolean} Verification result
 */
const verifyRazorpaySignature = (params) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

    // Validate all required fields exist
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        console.error('Missing payment verification parameters');
        return false;
    }

    // Get Razorpay secret
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        console.error('RAZORPAY_KEY_SECRET not configured');
        return false;
    }

    // Generate expected signature using HMAC SHA256
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

    // Secure comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(razorpaySignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
};

/**
 * Generate Mock Razorpay ID
 * @returns {string} Mock ID
 */
const generateMockId = () => {
    return crypto.randomBytes(12).toString('hex');
};

/**
 * Mock Payment Success
 * @param {string} orderId - Order ID
 * @returns {object} Payment details
 */
const mockPaymentSuccess = (orderId) => {
    return {
        razorpay_order_id: orderId,
        razorpay_payment_id: `pay_${generateMockId()}`,
        razorpay_signature: crypto
            .createHmac('sha256', 'mock_secret')
            .update(`${orderId}|pay_${generateMockId()}`)
            .digest('hex'),
    };
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpaySignature,
    mockPaymentSuccess,
};
