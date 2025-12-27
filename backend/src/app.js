const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
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

    // CORS Configuration
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body Parser Middleware
    app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
    app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

    // Compression Middleware
    app.use(compression());

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
    const productRoutes = require('./routes/productRoutes');
    const orderRoutes = require('./routes/orderRoutes');
    const courseRoutes = require('./routes/courseRoutes');
    const adminRoutes = require('./routes/adminRoutes');
    const uploadRoutes = require('./routes/uploadRoutes');
    const reviewRoutes = require('./routes/reviewRoutes');
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
    app.use('/api/products', apiLimiter, productRoutes);
    app.use('/api/orders', paymentLimiter, orderRoutes); // Payment limiter for orders
    app.use('/api/courses', apiLimiter, courseRoutes);
    app.use('/api/admin', adminLimiter, adminRoutes); // Admin limiter
    app.use('/api/upload', apiLimiter, uploadRoutes); // Upload routes
    app.use('/api/reviews', apiLimiter, reviewRoutes); // Review routes
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
