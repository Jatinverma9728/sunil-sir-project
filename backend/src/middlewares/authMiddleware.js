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

        // Admin Session Checks
        if (user.role === 'admin') {
            const AdminSession = require('../models/AdminSession');
            let session = await AdminSession.findOne({ user: user._id });

            // If no session exists, create one (lazy creation)
            if (!session) {
                session = await AdminSession.create({
                    user: user._id,
                    lastActivity: new Date(),
                    isLocked: false,
                    ipAddress: req.ip,
                    deviceInfo: req.headers['user-agent']
                });
            } else {
                // Check if session is locked
                if (session.isLocked) {
                    // Allow specific endpoints to bypass lock (unlock, logout, status)
                    // We can check req.path, but safer to let controller/router handle it?
                    // BUT: protect runs BEFORE router.
                    // SO: We must check URL here or use a separate middleware for 'strict lock'.
                    // Strategy: Mark request as locked, let `authorize` or route handler decide? 
                    // Better: If locked, return 423 immediately UNLESS it is an allowed path.
                    // The allowed paths are: /api/admin/auth/unlock, /api/admin/auth/logout, /api/admin/auth/status

                    const allowedPaths = ['/api/admin/auth/unlock', '/api/admin/auth/logout', '/api/admin/auth/status'];
                    // req.originalUrl includes the base path
                    const isAllowed = allowedPaths.some(path => req.originalUrl.includes(path));

                    if (!isAllowed) {
                        return res.status(423).json({
                            success: false,
                            message: 'Session locked due to inactivity',
                            code: 'SESSION_LOCKED'
                        });
                    }
                }

                // Update activity (unless locked)
                if (!session.isLocked) {
                    const now = new Date();
                    const timeDiff = now - session.lastActivity;

                    // Lock if inactive for > 15 minutes (15 * 60 * 1000 = 900000 ms)
                    // Make this configurable if possible, for now hardcoded 15m
                    if (timeDiff > 15 * 60 * 1000) {
                        session.isLocked = true;
                        session.save();

                        // Check if we should block NOW? Yes.
                        // Same allow-list check needed if we just locked it.
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
                        // Just update activity
                        session.lastActivity = now;
                        session.save();
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
