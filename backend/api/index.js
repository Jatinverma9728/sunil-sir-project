// Log startup
console.log('🚀 api/index.js loading...');

try {
    require('dotenv').config();
    console.log('✅ dotenv loaded');
} catch (e) {
    console.error('❌ dotenv error:', e.message);
}

// Check environment variables
console.log('📋 Environment check:');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? 'SET (' + process.env.MONGODB_URI.substring(0, 30) + '...)' : 'NOT SET');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');

let connectDB, createApp;

try {
    connectDB = require('../src/config/db');
    console.log('✅ db.js loaded');
} catch (e) {
    console.error('❌ Failed to load db.js:', e.message);
}

try {
    const appModule = require('../src/app');
    createApp = appModule.createApp;
    console.log('✅ app.js loaded');
} catch (e) {
    console.error('❌ Failed to load app.js:', e.message);
}

// Track database connection state
let isConnected = false;
let app = null;

// Serverless handler
module.exports = async (req, res) => {
    console.log(`📥 Request: ${req.method} ${req.url}`);

    // Add CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('✅ OPTIONS preflight handled');
        res.status(200).end();
        return;
    }

    try {
        // Check if required modules loaded
        if (!connectDB || !createApp) {
            throw new Error('Required modules failed to load');
        }

        // Connect to database if not connected
        if (!isConnected) {
            console.log('🔌 Connecting to MongoDB...');
            await connectDB();
            isConnected = true;
            console.log('✅ MongoDB connected');
        }

        // Create app if not created
        if (!app) {
            console.log('🏗️ Creating Express app...');
            app = createApp();
            console.log('✅ Express app created');
        }

        // Handle the request with Express
        return app(req, res);

    } catch (error) {
        console.error('❌ Server error:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            message: 'Server initialization error',
            error: error.message,
            env: {
                mongoUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
                jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
                nodeEnv: process.env.NODE_ENV || 'not set'
            }
        });
    }
};
