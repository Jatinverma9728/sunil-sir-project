const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    register,
    login,
    getProfile,
    updateProfile,
    googleCallback,
} = require('../controllers/authController');
const {
    forgotPassword,
    resetPassword,
} = require('../controllers/passwordController');
const { protect } = require('../middlewares/authMiddleware');

// Initialize Passport configuration
require('../config/passport');

// ============================================
// TRADITIONAL AUTH ROUTES
// ============================================

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); // Changed from /:token to accept OTP in body

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

/**
 * Initiate Google OAuth flow
 * Redirects user to Google sign-in page
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false, // We use JWT, not sessions
    })
);

/**
 * Google OAuth callback
 * Google redirects here after user authentication
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    }),
    googleCallback
);

module.exports = router;
