require('dotenv').config();
const { sendOTPEmail } = require('./src/utils/email');

async function testEmail() {
    console.log('Testing OTP Delivery...');
    try {
        await sendOTPEmail('somveerv20@gmail.com', '123456', 'Somveer');
        console.log('Sync wait complete');
    } catch (err) {
        console.error('Initial error:', err);
    }
}

testEmail();
