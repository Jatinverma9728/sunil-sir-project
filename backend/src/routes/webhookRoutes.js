const express = require('express');
const router = express.Router();
const { handleRazorpayWebhook } = require('../controllers/webhookController');

/**
 * Razorpay Webhook Route
 * Note: Webhook routes should NOT have authentication middleware
 * The signature verification in the controller handles security
 */

// Razorpay webhook endpoint
router.post('/razorpay', handleRazorpayWebhook);

module.exports = router;
