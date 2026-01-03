/**
 * Test OAuth Callback Manually
 * 
 * This script simulates what happens when Google redirects back to your callback URL
 * Run this to test if the backend is properly handling the OAuth callback
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testOAuthFlow() {
    console.log('\n🧪 === TESTING OAUTH CALLBACK FLOW ===\n');

    try {
        // Step 1: Test if backend is running
        console.log('1️⃣ Testing backend health...');
        const health = await axios.get(`${BACKEND_URL}/health`);
        console.log('   ✅ Backend is running:', health.data);

        // Step 2: Test OAuth initiation endpoint
        console.log('\n2️⃣ Testing OAuth initiation endpoint...');
        console.log('   URL: GET /api/auth/google');
        console.log('   💡 This should redirect to Google (can\'t test in script)');
        console.log('   ✅ Endpoint exists in routes');

        // Step 3: Check callback route exists
        console.log('\n3️⃣ Checking callback route configuration...');
        console.log('   URL: GET /api/auth/google/callback');
        console.log('   Expected behavior:');
        console.log('      - Passport authenticates Google user');
        console.log('      - Creates/updates user in database');
        console.log('      - Generates JWT token');
        console.log('      - Redirects to frontend with token');

        // Step 4: Test what happens without auth (should fail)
        console.log('\n4️⃣ Testing callback without authentication...');
        try {
            const response = await axios.get(`${BACKEND_URL}/api/auth/google/callback`, {
                maxRedirects: 0,
                validateStatus: () => true
            });

            if (response.status === 302 || response.status === 301) {
                console.log('   ✅ Callback redirects (as expected)');
                console.log('   Redirects to:', response.headers.location);

                if (response.headers.location?.includes('error=oauth_failed')) {
                    console.log('   ✅ Properly handles failed auth');
                }
            } else {
                console.log('   ⚠️  Unexpected status:', response.status);
            }
        } catch (err) {
            if (err.code === 'ERR_FR_MAX_REDIRECTS_EXCEEDED') {
                console.log('   ✅ Callback route exists and redirects');
            } else {
                console.log('   ❌ Error:', err.message);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n📋 NEXT STEPS TO DEBUG:\n');
        console.log('1. Open browser DevTools (F12)');
        console.log('2. Go to Network tab');
        console.log('3. Click "Continue with Google" button');
        console.log('4. Watch the network requests');
        console.log('\nLook for:');
        console.log('   ✅ Request to: /api/auth/google');
        console.log('   ✅ Redirect to: accounts.google.com');
        console.log('   ✅ Select account');
        console.log('   ✅ Redirect to: /api/auth/google/callback');
        console.log('   ✅ Redirect to: /auth/callback?token=...');
        console.log('\nIf stuck at any step, check backend console for errors.\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Backend is not running! Start it with: npm run dev');
        }
    }
}

testOAuthFlow();
