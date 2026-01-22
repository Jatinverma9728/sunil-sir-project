const express = require('express');
const router = express.Router();
const {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
  getVerificationStatus,
} = require('../controllers/emailVerificationController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * Email Verification Routes
 */

// Public route: Verify email with token
router.get('/verify/:token', verifyEmail);

// Protected routes (requires authentication)
router.post('/send-verification-email', protect, sendVerificationEmail);
router.post('/resend-verification-email', protect, resendVerificationEmail);
router.get('/status', protect, getVerificationStatus);

module.exports = router;
