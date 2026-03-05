/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error Details:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        message = `Invalid input data. ${errors.join('. ')}`;
        statusCode = 400;
    }

    // Handle Mongoose duplicate key
    if (err.code === 11000) {
        const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'value';
        message = `Duplicate field value: ${value}. Please use another value!`;
        statusCode = 400;
    }

    // Handle Mongoose CastError
    if (err.name === 'CastError') {
        message = `Invalid ${err.path}: ${err.value}.`;
        statusCode = 400;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again!';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Your token has expired! Please log in again.';
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Include stack trace and details only in development
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details || err
        })
    });
};

module.exports = errorHandler;
