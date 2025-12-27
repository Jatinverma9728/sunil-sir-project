require('dotenv').config();

const validateEnv = require('./utils/validateEnv');
const connectDB = require('./config/db');
const { createApp } = require('./app');

// Validate environment variables before starting
validateEnv();

// ============================================
// CONFIGURATION
// ============================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// SERVER INITIALIZATION
// ============================================

/**
 * Start the Express server
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        console.log('🔄 Connecting to MongoDB...');
        await connectDB();

        // Create Express app
        const app = createApp();

        // Start listening
        const server = app.listen(PORT, () => {
            console.log('');
            console.log('='.repeat(50));
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Environment: ${NODE_ENV}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`💚 Health Check: http://localhost:${PORT}/health`);
            console.log(`📡 API Base: http://localhost:${PORT}/api`);
            console.log('='.repeat(50));
            console.log('');
        });

        // ============================================
        // GRACEFUL SHUTDOWN
        // ============================================

        // Handle SIGTERM signal (e.g., from Ctrl+C)
        process.on('SIGTERM', () => {
            console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
        });

        // Handle SIGINT signal (e.g., from Ctrl+C)
        process.on('SIGINT', () => {
            console.log('\n⚠️  SIGINT signal received: closing HTTP server');
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('❌ UNHANDLED REJECTION! Shutting down...');
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();
