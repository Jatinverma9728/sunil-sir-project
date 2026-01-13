const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Razorpay Payment Integration
 * Handles order creation, payment verification, and webhook signature validation
 */

// Initialize Razorpay instance
const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        console.warn('⚠️ Razorpay credentials not configured. Using test mode.');
        // Return null to indicate SDK not available
        return null;
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

/**
 * Create Razorpay Order
 * @param {number} amount - Amount in rupees
 * @param {string} currency - Currency code (default: INR)
 * @param {object} options - Additional options (receipt, notes)
 * @returns {Promise<object>} Order details
 */
const createRazorpayOrder = async (amount, currency = 'INR', options = {}) => {
    const razorpay = getRazorpayInstance();

    // If Razorpay is not configured, return mock order for development
    if (!razorpay) {
        console.log('📦 Creating mock Razorpay order (SDK not configured)');
        return {
            id: `order_mock_${generateMockId()}`,
            entity: 'order',
            amount: Math.round(amount * 100), // Convert to paise
            amount_paid: 0,
            amount_due: Math.round(amount * 100),
            currency: currency,
            status: 'created',
            created_at: Math.floor(Date.now() / 1000),
            notes: options.notes || {},
            _isMock: true,
        };
    }

    try {
        const orderOptions = {
            amount: Math.round(amount * 100), // Convert rupees to paise
            currency: currency,
            receipt: options.receipt || `receipt_${Date.now()}`,
            notes: options.notes || {},
        };

        const order = await razorpay.orders.create(orderOptions);
        console.log(`✅ Razorpay order created: ${order.id}`);
        return order;
    } catch (error) {
        console.error('❌ Razorpay order creation failed:', error.message);
        throw new Error(`Payment order creation failed: ${error.message}`);
    }
};

/**
 * Verify Razorpay Payment Signature
 * @param {object} params - Payment verification params
 * @param {string} params.razorpayOrderId - Razorpay order ID
 * @param {string} params.razorpayPaymentId - Razorpay payment ID
 * @param {string} params.razorpaySignature - Razorpay signature
 * @returns {boolean} Verification result
 */
const verifyRazorpaySignature = (params) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

    // Validate all required fields exist
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        console.error('❌ Missing payment verification parameters');
        return false;
    }

    // Check for mock orders (development mode)
    if (razorpayOrderId.startsWith('order_mock_')) {
        console.log('✅ Mock order signature verified (development mode)');
        return true;
    }

    // Get Razorpay secret
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        console.error('❌ RAZORPAY_KEY_SECRET not configured');
        return false;
    }

    try {
        // Generate expected signature using HMAC SHA256
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // Secure comparison to prevent timing attacks
        const isValid = crypto.timingSafeEqual(
            Buffer.from(razorpaySignature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );

        if (isValid) {
            console.log(`✅ Payment signature verified for order: ${razorpayOrderId}`);
        } else {
            console.error(`❌ Invalid payment signature for order: ${razorpayOrderId}`);
        }

        return isValid;
    } catch (error) {
        console.error('❌ Signature verification error:', error.message);
        return false;
    }
};

/**
 * Verify Razorpay Webhook Signature
 * @param {string} body - Raw request body
 * @param {string} signature - Razorpay webhook signature from header
 * @returns {boolean} Verification result
 */
const verifyWebhookSignature = (body, signature) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured');
        return false;
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        return isValid;
    } catch (error) {
        console.error('❌ Webhook signature verification error:', error.message);
        return false;
    }
};

/**
 * Fetch Payment Details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<object|null>} Payment details or null
 */
const fetchPaymentDetails = async (paymentId) => {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
        console.warn('⚠️ Cannot fetch payment details: Razorpay not configured');
        return null;
    }

    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        console.error('❌ Failed to fetch payment details:', error.message);
        return null;
    }
};

/**
 * Capture Payment (for authorized payments)
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to capture in paise
 * @returns {Promise<object|null>} Captured payment or null
 */
const capturePayment = async (paymentId, amount) => {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
        console.warn('⚠️ Cannot capture payment: Razorpay not configured');
        return null;
    }

    try {
        const payment = await razorpay.payments.capture(paymentId, amount, 'INR');
        console.log(`✅ Payment captured: ${paymentId}`);
        return payment;
    } catch (error) {
        console.error('❌ Payment capture failed:', error.message);
        return null;
    }
};

/**
 * Generate Mock ID for development
 * @returns {string} Mock ID
 */
const generateMockId = () => {
    return crypto.randomBytes(12).toString('hex');
};

/**
 * Mock Payment Success (for development/testing without Razorpay keys)
 * @param {string} orderId - Order ID
 * @returns {object} Mock payment details
 */
const mockPaymentSuccess = (orderId) => {
    const paymentId = `pay_mock_${generateMockId()}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';

    return {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: crypto
            .createHmac('sha256', secret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex'),
    };
};

/**
 * Get Razorpay Key ID for frontend
 * @returns {string} Razorpay Key ID
 */
const getRazorpayKeyId = () => {
    return process.env.RAZORPAY_KEY_ID || '';
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpaySignature,
    verifyWebhookSignature,
    fetchPaymentDetails,
    capturePayment,
    mockPaymentSuccess,
    getRazorpayKeyId,
    getRazorpayInstance,
};
