const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * For serverless environments, we reuse existing connections
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('✅ MongoDB already connected');
        return;
    }

    // Check if connecting
    if (mongoose.connection.readyState === 2) {
        console.log('⏳ MongoDB connection in progress...');
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Don't exit process in serverless - throw error instead
        throw error;
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err}`);
});

module.exports = connectDB;
