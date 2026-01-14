const Order = require('../models/Order');
const User = require('../models/User');
const { verifyWebhookSignature } = require('../utils/payment');
const { sendOrderConfirmationEmail } = require('../utils/email');

/**
 * Razorpay Webhook Controller
 * Handles payment events from Razorpay
 */

/**
 * @desc    Handle Razorpay webhooks
 * @route   POST /api/webhooks/razorpay
 * @access  Public (webhook endpoint)
 */
const handleRazorpayWebhook = async (req, res) => {
    try {
        // Get the webhook signature from headers
        const signature = req.headers['x-razorpay-signature'];

        if (!signature) {
            console.warn('⚠️ Webhook received without signature');
            return res.status(400).json({ error: 'No signature provided' });
        }

        // Verify webhook signature
        const rawBody = req.rawBody || JSON.stringify(req.body);
        const isValid = verifyWebhookSignature(rawBody, signature);

        if (!isValid) {
            console.error('❌ Webhook signature verification failed');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Parse the event
        const event = req.body;
        const eventType = event.event;
        const payload = event.payload;

        console.log(`📨 Razorpay webhook received: ${eventType}`);

        // Handle different event types
        switch (eventType) {
            case 'payment.authorized':
                await handlePaymentAuthorized(payload);
                break;

            case 'payment.captured':
                await handlePaymentCaptured(payload);
                break;

            case 'payment.failed':
                await handlePaymentFailed(payload);
                break;

            case 'order.paid':
                await handleOrderPaid(payload);
                break;

            case 'refund.created':
                await handleRefundCreated(payload);
                break;

            default:
                console.log(`ℹ️ Unhandled webhook event: ${eventType}`);
        }

        // Always respond with 200 to acknowledge receipt
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Webhook handling error:', error);
        // Still return 200 to prevent Razorpay from retrying
        res.status(200).json({ received: true, error: error.message });
    }
};

/**
 * Handle payment.authorized event
 * Payment is authorized but not captured yet
 */
const handlePaymentAuthorized = async (payload) => {
    try {
        const payment = payload.payment.entity;
        const orderId = payment.order_id;

        console.log(`💳 Payment authorized: ${payment.id} for order: ${orderId}`);

        const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': orderId });

        if (!order) {
            console.warn(`⚠️ Order not found for razorpay order: ${orderId}`);
            return;
        }

        // Update order with payment authorization
        order.paymentInfo.razorpayPaymentId = payment.id;
        order.paymentInfo.status = 'authorized';
        await order.save();

        console.log(`✅ Order ${order._id} payment authorized`);
    } catch (error) {
        console.error('❌ Error handling payment.authorized:', error);
    }
};

/**
 * Handle payment.captured event
 * Payment is successfully captured
 */
const handlePaymentCaptured = async (payload) => {
    try {
        const payment = payload.payment.entity;
        const orderId = payment.order_id;

        console.log(`💰 Payment captured: ${payment.id} for order: ${orderId}`);

        const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': orderId });

        if (!order) {
            console.warn(`⚠️ Order not found for razorpay order: ${orderId}`);
            return;
        }

        // Update order status
        order.paymentInfo.razorpayPaymentId = payment.id;
        order.paymentInfo.status = 'completed';
        order.orderStatus = 'processing';
        order.paidAt = new Date();
        await order.save();

        console.log(`✅ Order ${order._id} payment captured and order status updated to processing`);

        // Send order confirmation email
        try {
            const user = await User.findById(order.user);
            if (user && user.email) {
                await sendOrderConfirmationEmail(user.email, order, user.name);
                console.log(`📧 Order confirmation email sent for order ${order._id}`);
            }
        } catch (emailError) {
            console.error('❌ Failed to send order confirmation email:', emailError);
            // Don't throw - email failure shouldn't affect order processing
        }
    } catch (error) {
        console.error('❌ Error handling payment.captured:', error);
    }
};

/**
 * Handle payment.failed event
 * Payment failed
 */
const handlePaymentFailed = async (payload) => {
    try {
        const payment = payload.payment.entity;
        const orderId = payment.order_id;

        console.log(`❌ Payment failed: ${payment.id} for order: ${orderId}`);
        console.log(`   Reason: ${payment.error_description || 'Unknown'}`);

        const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': orderId });

        if (!order) {
            console.warn(`⚠️ Order not found for razorpay order: ${orderId}`);
            return;
        }

        // Update order with failure info
        order.paymentInfo.status = 'failed';
        order.paymentInfo.failureReason = payment.error_description || 'Payment failed';
        await order.save();

        console.log(`⚠️ Order ${order._id} marked as payment failed`);
    } catch (error) {
        console.error('❌ Error handling payment.failed:', error);
    }
};

/**
 * Handle order.paid event
 * Alternative event when order is fully paid
 */
const handleOrderPaid = async (payload) => {
    try {
        const razorpayOrder = payload.order.entity;

        console.log(`✅ Order paid: ${razorpayOrder.id}`);

        const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': razorpayOrder.id });

        if (!order) {
            console.warn(`⚠️ Order not found for razorpay order: ${razorpayOrder.id}`);
            return;
        }

        // Ensure status is updated
        if (order.paymentInfo.status !== 'completed') {
            order.paymentInfo.status = 'completed';
            order.orderStatus = 'processing';
            order.paidAt = new Date();
            await order.save();
            console.log(`✅ Order ${order._id} status updated via order.paid event`);
        }
    } catch (error) {
        console.error('❌ Error handling order.paid:', error);
    }
};

/**
 * Handle refund.created event
 */
const handleRefundCreated = async (payload) => {
    try {
        const refund = payload.refund.entity;
        const paymentId = refund.payment_id;

        console.log(`💸 Refund created: ${refund.id} for payment: ${paymentId}`);

        const order = await Order.findOne({ 'paymentInfo.razorpayPaymentId': paymentId });

        if (!order) {
            console.warn(`⚠️ Order not found for payment: ${paymentId}`);
            return;
        }

        // Update order with refund info
        order.paymentInfo.refundId = refund.id;
        order.paymentInfo.refundAmount = refund.amount / 100; // Convert from paise
        order.paymentInfo.refundStatus = refund.status;

        if (refund.status === 'processed') {
            order.orderStatus = 'refunded';
        }

        await order.save();

        console.log(`✅ Order ${order._id} refund recorded`);
    } catch (error) {
        console.error('❌ Error handling refund.created:', error);
    }
};

module.exports = {
    handleRazorpayWebhook,
};
