/**
 * Environment variables validation
 * Ensures all required environment variables are set and properly configured
 * Called during server startup
 */

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
];

const recommendedEnvVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
];

const validateEnv = () => {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 VALIDATING ENVIRONMENT CONFIGURATION');
    console.log('='.repeat(60));

    const missing = [];
    const warnings = [];
    const issues = [];

    // Check required variables
    console.log('\n✓ Checking REQUIRED environment variables...');
    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            missing.push(varName);
            console.log(`  ❌ ${varName} - MISSING (REQUIRED)`);
        } else {
            console.log(`  ✅ ${varName} - Set`);
        }
    });

    // Check recommended variables (warnings only)
    console.log('\n⚠️  Checking RECOMMENDED environment variables...');
    recommendedEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            warnings.push(varName);
            console.log(`  ⚠️  ${varName} - Not set (will reduce functionality)`);
        } else {
            console.log(`  ✅ ${varName} - Set`);
        }
    });

    // Validate JWT_SECRET strength
    console.log('\n🔒 Checking SECURITY REQUIREMENTS...');
    if (process.env.JWT_SECRET) {
        if (process.env.JWT_SECRET.length < 32) {
            issues.push('JWT_SECRET is too short (minimum 32 characters)');
            console.log(`  ⚠️  JWT_SECRET: ${process.env.JWT_SECRET.length} chars (minimum 32)`);
        } else if (process.env.JWT_SECRET.length < 64) {
            console.log(`  ⚠️  JWT_SECRET: ${process.env.JWT_SECRET.length} chars (recommended 64+)`);
        } else {
            console.log(`  ✅ JWT_SECRET: ${process.env.JWT_SECRET.length} chars (strong)`);
        }
    }

    // Validate NODE_ENV
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(process.env.NODE_ENV)) {
        console.log(`  ⚠️  NODE_ENV: ${process.env.NODE_ENV || 'not set'} (should be one of: ${validEnvs.join(', ')})`);
    } else {
        console.log(`  ✅ NODE_ENV: ${process.env.NODE_ENV}`);
    }

    // Check for exposed credentials in NODE_ENV
    if (process.env.NODE_ENV !== 'production') {
        console.log('\n📌 DEVELOPMENT MODE: Using development configuration');
    } else {
        console.log('\n🚀 PRODUCTION MODE: Using production configuration');
        console.log('   ⚠️  Ensure all credentials are properly secured in deployment platform');
    }

    // Log summary and errors
    console.log('\n' + '='.repeat(60));

    if (missing.length > 0) {
        console.error('\n❌ ERROR: Required environment variables not set:');
        missing.forEach((varName) => {
            console.error(`   - ${varName}`);
        });
        console.error('\n🔧 FIX: Create a .env file or set these variables in your deployment platform');
        console.error('   See .env.example for the template\n');
        throw new Error('Missing required environment variables. Please check your .env file.');
    }

    if (warnings.length > 0) {
        console.warn('\n⚠️  WARNING: Recommended environment variables not set:');
        warnings.forEach((varName) => {
            console.warn(`   - ${varName}`);
        });
        console.warn('\nℹ️  These features will be disabled without these variables');
    }

    if (issues.length > 0) {
        console.warn('\n🔒 SECURITY WARNINGS:');
        issues.forEach((issue) => {
            console.warn(`   - ${issue}`);
        });
    }

    console.log('\n✅ Environment validation complete!\n');
    console.log('='.repeat(60) + '\n');
};

module.exports = validateEnv;
