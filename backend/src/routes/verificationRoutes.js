const express = require('express');
const router = express.Router();
const {
  sendVerificationEmail,
  verifyOTP,
  resendVerificationEmail,
  getVerificationStatus,
} = require('../controllers/emailVerificationController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * Email Verification Routes
 */

// Public route: Verify email with OTP
router.post('/verify-otp', verifyOTP);
router.post('/resend-verification-email', resendVerificationEmail);

// Protected routes (requires authentication)
router.post('/send-verification-email', protect, sendVerificationEmail);
router.get('/status', protect, getVerificationStatus);

module.exports = router;
