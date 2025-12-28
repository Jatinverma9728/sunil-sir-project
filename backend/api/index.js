require('dotenv').config();

const connectDB = require('../src/config/db');
const { createApp } = require('../src/app');

// Track database connection state
let isConnected = false;
let app = null;

// Initialize app and database connection
const initialize = async () => {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
            console.log('✅ MongoDB connected for serverless');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error.message);
            throw error;
        }
    }

    if (!app) {
        app = createApp();
    }

    return app;
};

// Serverless handler
module.exports = async (req, res) => {
    // Add CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Initialize app and database
        const expressApp = await initialize();

        // Handle the request with Express
        return expressApp(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({
            success: false,
            message: 'Server initialization error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
