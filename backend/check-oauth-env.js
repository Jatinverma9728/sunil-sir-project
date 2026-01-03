/**
 * Environment Variable Diagnostic Tool
 * Run this to check if Google OAuth variables are loaded correctly
 */

require('dotenv').config();

console.log('\n🔍 === GOOGLE OAUTH ENVIRONMENT VARIABLES CHECK ===\n');

const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'FRONTEND_URL'
];

let hasErrors = false;

requiredVars.forEach(varName => {
    const value = process.env[varName];

    if (!value) {
        console.log(`❌ ${varName}: NOT SET`);
        hasErrors = true;
    } else {
        // Mask sensitive values
        let displayValue = value;
        if (varName.includes('SECRET')) {
            displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 4);
        } else if (varName.includes('CLIENT_ID')) {
            displayValue = value.substring(0, 20) + '...';
        }
        console.log(`✅ ${varName}: ${displayValue}`);
    }
});

// Specific checks
console.log('\n🔍 === DETAILED CALLBACK URL CHECK ===\n');

const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

if (callbackUrl) {
    console.log(`Full URL: ${callbackUrl}`);
    console.log(`Length: ${callbackUrl.length} characters`);

    // Check for common issues
    if (callbackUrl.includes('onrender.com') && callbackUrl.includes('localhost')) {
        console.log('⚠️  WARNING: URL contains BOTH localhost and onrender.com - this is wrong!');
        console.log('   Expected for localhost: http://localhost:5000/api/auth/google/callback');
        hasErrors = true;
    }

    if (callbackUrl.endsWith('/')) {
        console.log('⚠️  WARNING: URL ends with trailing slash - remove it!');
        hasErrors = true;
    }

    if (callbackUrl.includes('https://localhost')) {
        console.log('⚠️  WARNING: Using HTTPS with localhost - should be HTTP');
        hasErrors = true;
    }

    // Correct URLs for reference
    const expectedDev = 'http://localhost:5000/api/auth/google/callback';
    const expectedProd = 'https://backend-ur3o.onrender.com/api/auth/google/callback';

    if (callbackUrl === expectedDev) {
        console.log('✅ CORRECT: Matches expected development URL');
    } else if (callbackUrl === expectedProd) {
        console.log('✅ CORRECT: Matches expected production URL');
    } else {
        console.log('❌ ERROR: URL does not match expected format');
        console.log(`   Expected (dev):  ${expectedDev}`);
        console.log(`   Expected (prod): ${expectedProd}`);
        console.log(`   Actual:          ${callbackUrl}`);
        hasErrors = true;
    }
} else {
    console.log('❌ GOOGLE_CALLBACK_URL is not set!');
    hasErrors = true;
}

console.log('\n' + '='.repeat(60) + '\n');

if (hasErrors) {
    console.log('❌ ERRORS FOUND - Fix your .env file and restart the server\n');
    process.exit(1);
} else {
    console.log('✅ ALL CHECKS PASSED - OAuth should work!\n');
    process.exit(0);
}
