const User = require('../models/User');
const { verifyToken, extractToken } = require('../utils/token');

/**
 * Protect routes - Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const protect = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided',
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Find user by ID from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Attach user to request object
        req.user = user;

        // Admin Session Lock Feature
        // ---------------------------
        // Locks admin session after 15 minutes of inactivity.
        // IMPORTANT: Only applies to /api/admin/* routes, NOT to regular auth routes
        // Frontend LockScreen component handles unlock flow via password.

        // Only apply session lock to admin panel routes
        const isAdminRoute = req.originalUrl.startsWith('/api/admin');

        if (user.role === 'admin' && isAdminRoute) {
            const AdminSession = require('../models/AdminSession');
            let session = await AdminSession.findOne({ user: user._id });

            // Create session if doesn't exist
            if (!session) {
                session = await AdminSession.create({
                    user: user._id,
                    lastActivity: new Date(),
                    isLocked: false,
                    ipAddress: req.ip,
                    deviceInfo: req.headers['user-agent']
                });
            } else {
                // Check if session is already locked
                if (session.isLocked) {
                    // Allow unlock, logout, and status endpoints even when locked
                    const allowedPaths = ['/api/admin/auth/unlock', '/api/admin/auth/logout', '/api/admin/auth/status'];
                    const isAllowed = allowedPaths.some(path => req.originalUrl.includes(path));

                    if (!isAllowed) {
                        return res.status(423).json({
                            success: false,
                            message: 'Session locked due to inactivity',
                            code: 'SESSION_LOCKED'
                        });
                    }
                } else {
                    // Check inactivity timeout (15 minutes)
                    const now = new Date();
                    const timeDiff = now - session.lastActivity;
                    const LOCK_TIMEOUT = 15 * 60 * 1000; // 15 minutes

                    if (timeDiff > LOCK_TIMEOUT) {
                        // Lock the session
                        session.isLocked = true;
                        await session.save();

                        // Check if current request is to an allowed path
                        const allowedPaths = ['/api/admin/auth/unlock', '/api/admin/auth/logout', '/api/admin/auth/status'];
                        const isAllowed = allowedPaths.some(path => req.originalUrl.includes(path));

                        if (!isAllowed) {
                            return res.status(423).json({
                                success: false,
                                message: 'Session locked due to inactivity',
                                code: 'SESSION_LOCKED'
                            });
                        }
                    } else {
                        // Update last activity time
                        session.lastActivity = now;
                        await session.save();
                    }
                }
            }
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, invalid token',
            error: error.message,
        });
    }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        if (!roles.includes(req.user.role)) {
            console.warn(`⛔ Authorization Failed: User ${req.user._id} (Role: ${req.user.role}) attempted to access protected route. Required: ${roles.join(', ')}`);
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }

        next();
    };
};

/**
 * Optional Auth - Attaches user if token exists but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = extractToken(req.headers.authorization);

        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Token invalid or expired - just continue without user
        next();
    }
};

module.exports = {
    protect,
    authorize,
    optionalAuth,
};
