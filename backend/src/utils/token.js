const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} userId - User ID to embed in token
 * @param {string} expiresIn - Token expiry time (default: 7d)
 * @returns {string} JWT token
 */
const generateToken = (userId, expiresIn = '7d') => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: expiresIn || process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};

module.exports = {
    generateToken,
    verifyToken,
    extractToken,
};
