const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
} = require('../controllers/authController');
const {
    forgotPassword,
    resetPassword,
} = require('../controllers/passwordController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); // Changed from /:token to accept OTP in body

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
