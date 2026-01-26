const express = require('express');
const router = express.Router();
const passport = require('passport');

const { register, login, getProfile, updateProfile, googleCallback, addAddress, updateAddress, deleteAddress } = require('../controllers/authController');
const { forgotPassword, verifyResetOTP, resetPassword } = require('../controllers/passwordController');
const { protect } = require('../middlewares/authMiddleware');

// Initialize Passport configuration
require('../config/passport');

// ============================================
// TRADITIONAL AUTH ROUTES
// ============================================

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// ============================================
// PASSWORD RESET ROUTES
// ============================================

router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP); // NEW: Verify OTP
router.post('/reset-password', resetPassword);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

/**
 * Initiate Google OAuth flow
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

/**
 * Google OAuth callback
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    }),
    googleCallback
);

// Address Management Routes
router.post('/profile/address', protect, addAddress);
router.put('/profile/address/:id', protect, updateAddress);
router.delete('/profile/address/:id', protect, deleteAddress);

module.exports = router;
