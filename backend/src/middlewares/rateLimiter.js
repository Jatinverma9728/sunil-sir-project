const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Limits requests to prevent abuse
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased from 100 to 500 - homepage makes many concurrent API calls
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks while being user-friendly
 */
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes (reduced from 15)
    max: 20, // 20 attempts per window (increased from 5)
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 5 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Payment route limiter
 * Extra protection for payment endpoints
 */
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 payment requests per hour
    message: {
        success: false,
        message: 'Too many payment attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Admin route limiter
 * Protect admin operations
 */
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for admin operations
    message: {
        success: false,
        message: 'Too many admin requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    paymentLimiter,
    adminLimiter,
};
