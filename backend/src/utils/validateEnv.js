/**
 * Environment variables validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'FRONTEND_URL',
];

const optionalEnvVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
];

const validateEnv = () => {
    const missing = [];
    const warnings = [];

    // Check required variables
    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Check optional variables (warnings only)
    optionalEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    });

    // Log warnings for optional variables
    if (warnings.length > 0) {
        console.warn('⚠️  Warning: Optional environment variables not set:');
        warnings.forEach((varName) => {
            console.warn(`   - ${varName}`);
        });
    }

    // Throw error if required variables are missing
    if (missing.length > 0) {
        console.error('❌ Error: Required environment variables not set:');
        missing.forEach((varName) => {
            console.error(`   - ${varName}`);
        });
        throw new Error('Missing required environment variables. Please check your .env file.');
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters for security');
    }

    // Validate NODE_ENV
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(process.env.NODE_ENV)) {
        console.warn(`⚠️  Warning: NODE_ENV should be one of: ${validEnvs.join(', ')}`);
    }

    console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
