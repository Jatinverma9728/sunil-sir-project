require('dotenv').config();

const connectDB = require('../src/config/db');
const { createApp } = require('../src/app');

// Connect to MongoDB (will reuse connection in serverless)
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await connectDB();
        isConnected = true;
        console.log('✅ MongoDB connected for serverless');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
};

// Create Express app
const app = createApp();

// Serverless handler
module.exports = async (req, res) => {
    // Ensure database is connected
    await connectToDatabase();

    // Handle the request with Express
    return app(req, res);
};
