const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const { apiLimiter, authLimiter, paymentLimiter, adminLimiter } = require('./middlewares/rateLimiter');

/**
 * Initialize Express Application
 * @returns {object} Express app instance
 */
const createApp = () => {
    const app = express();

    // ============================================
    // MIDDLEWARE SETUP
    // ============================================

    // Security Headers with enhanced configuration
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:", "http:"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        // Allow cross-origin resource loading for uploaded images
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));

    // Data Sanitization against NoSQL Injection
    app.use(mongoSanitize());

    // Data Sanitization against XSS
    app.use(xss());

    // Cookie Parser (Required for CSRF)
    app.use(cookieParser());

    // CORS Configuration - Support multiple origins for production
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'https://www.northtechhub.in',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://10.107.169.226:3000'
    ].filter(Boolean);

    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
                return callback(null, true);
            }

            // In development, allow all origins
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }

            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
    }));

    // ============================================
    // WEBHOOK ROUTES (must be before body parsers for signature verification)
    // ============================================
    const webhookRoutes = require('./routes/webhookRoutes');

    // Webhook needs raw body for signature verification
    app.use('/api/webhooks', express.raw({ type: 'application/json' }), (req, res, next) => {
        // Store raw body for signature verification, then parse JSON
        if (req.body && Buffer.isBuffer(req.body)) {
            req.rawBody = req.body.toString();
            try {
                req.body = JSON.parse(req.rawBody);
            } catch (e) {
                req.body = {};
            }
        }
        next();
    }, webhookRoutes);

    // Body Parser Middleware
    app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
    app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

    // Compression Middleware
    app.use(compression());

    // CSRF Protection
    // Must be added AFTER body parser (if using body for token) and AFTER webhooks (to exclude them)
    // We use cookie: true so the secret is stored in a cookie.
    // The client needs to read the token from the /api/csrf-token endpoint and send it in headers.
    const csrfProtection = csrf({ cookie: true });

    // Apply CSRF protection globally (webhooks are already handled above before this)
    app.use(csrfProtection);

    // Expose CSRF Token Endpoint
    app.get('/api/csrf-token', (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
    });

    // Passport Middleware (for OAuth)
    const passport = require('passport');
    app.use(passport.initialize());


    // Logging Middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    // ============================================
    // ROUTES
    // ============================================

    // Health Check Route
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    });

    // API Base Route
    app.get('/api', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'E-Commerce + Course Platform API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                api: '/api',
                auth: {
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    profile: 'GET /api/auth/profile (Protected)',
                    updateProfile: 'PUT /api/auth/profile (Protected)',
                },
                products: {
                    list: 'GET /api/products',
                    single: 'GET /api/products/:id',
                    categories: 'GET /api/products/categories',
                    create: 'POST /api/products (Admin)',
                    update: 'PUT /api/products/:id (Admin)',
                    delete: 'DELETE /api/products/:id (Admin)',
                },
                orders: {
                    create: 'POST /api/orders (Protected)',
                    verify: 'POST /api/orders/:id/verify (Protected)',
                    myOrders: 'GET /api/orders/my-orders (Protected)',
                    single: 'GET /api/orders/:id (Protected)',
                    all: 'GET /api/orders (Admin)',
                    updateStatus: 'PUT /api/orders/:id/status (Admin)',
                },
                courses: {
                    list: 'GET /api/courses',
                    single: 'GET /api/courses/:id',
                    categories: 'GET /api/courses/categories',
                    purchase: 'POST /api/courses/:id/purchase (Protected)',
                    myCourses: 'GET /api/courses/my-courses (Protected)',
                },
                admin: {
                    products: 'GET/POST/PUT/DELETE /api/admin/products (Admin)',
                    courses: 'GET/POST/PUT/DELETE /api/admin/courses (Admin)',
                    orders: 'GET/PUT /api/admin/orders (Admin)',
                    stats: 'GET /api/admin/{products|courses|orders}/stats (Admin)',
                }
                // TODO: Add more endpoints as they are implemented
            }
        });
    });



    // ============================================
    // API ROUTES
    // ============================================

    // Import route modules
    const authRoutes = require('./routes/authRoutes');
    const verificationRoutes = require('./routes/verificationRoutes');
    const productRoutes = require('./routes/productRoutes');
    const orderRoutes = require('./routes/orderRoutes');
    const courseRoutes = require('./routes/courseRoutes');
    const adminRoutes = require('./routes/adminRoutes');
    const uploadRoutes = require('./routes/uploadRoutes');
    const reviewRoutes = require('./routes/reviewRoutes');
    const promotionsRoutes = require('./routes/promotionsRoutes');
    // const userRoutes = require('./routes/userRoutes');

    // Serve static files for uploads with CORS headers
    const path = require('path');
    app.use('/uploads', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    }, express.static(path.join(__dirname, '../uploads')));

    // Mount routes with rate limiting
    app.use('/api/auth', authLimiter, authRoutes); // Strict limiter for auth
    app.use('/api/verification', apiLimiter, verificationRoutes); // Email verification routes
    app.use('/api/products', apiLimiter, productRoutes);
    app.use('/api/orders', paymentLimiter, orderRoutes); // Payment limiter for orders
    app.use('/api/courses', apiLimiter, courseRoutes);
    app.use('/api/admin', adminLimiter, adminRoutes); // Admin limiter
    app.use('/api/upload', apiLimiter, uploadRoutes); // Upload routes
    app.use('/api/reviews', apiLimiter, reviewRoutes); // Review routes
    app.use('/api', apiLimiter, promotionsRoutes); // Public promotions routes (banners, announcements, coupons)
    // app.use('/api/users', userRoutes);


    // ============================================
    // ERROR HANDLING
    // ============================================

    // 404 Handler - Route not found
    app.use((req, res, next) => {
        res.status(404).json({
            success: false,
            message: 'Route not found',
            path: req.originalUrl
        });
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
        console.error('Error:', err);

        // Handle CSRF Validation Errors
        if (err.code === 'EBADCSRFTOKEN') {
            return res.status(403).json({
                success: false,
                message: 'Invalid or missing CSRF token. Please refresh the page and try again.'
            });
        }

        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';

        res.status(statusCode).json({
            success: false,
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });

    return app;
};

module.exports = { createApp };
