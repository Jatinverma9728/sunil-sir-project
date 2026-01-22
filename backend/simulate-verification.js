const mongoose = require('mongoose');
const User = require('./src/models/User');
const EmailVerification = require('./src/models/EmailVerification');
const { createApp } = require('./src/app');

require('dotenv').config();

const simulateFlow = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected');

        const testEmail = `test_${Date.now()}@example.com`;
        const testPassword = 'Password123!';

        // 1. REGISTER
        console.log(`\n1. Registering user: ${testEmail}`);
        // We ensure a fresh port
        const PORT = 5002;
        const app = createApp();
        const server = app.listen(PORT);

        const registerRes = await fetch(`http://localhost:${PORT}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: testEmail,
                password: testPassword
            })
        });

        const registerData = await registerRes.json();
        console.log('Register Response:', registerData.success ? 'Success' : registerData.message);

        if (!registerData.success) throw new Error('Registration failed');

        const userId = registerData.data.user.id;

        // 2. FIND TOKEN
        console.log('\n2. Finding verification token in DB...');
        const verificationRecord = await EmailVerification.findOne({ user: userId });

        if (!verificationRecord) {
            throw new Error('No verification record found!');
        }
        console.log('Token found:', verificationRecord.token);

        // 3. VERIFY
        console.log('\n3. Verifying email...');
        const verifyRes = await fetch(`http://localhost:${PORT}/api/verification/verify/${verificationRecord.token}`);
        const verifyData = await verifyRes.json();
        console.log('Verify Response:', verifyData);

        // 4. CHECK USER STATUS
        console.log('\n4. Checking user status...');
        const user = await User.findById(userId);
        console.log('User isEmailVerified:', user.isEmailVerified);

        if (user.isEmailVerified) {
            console.log('\n🎉 SUCCESS: Flow verified working.');
        } else {
            console.log('\n❌ FAILURE: User not verified.');
        }

        // Cleanup
        await User.findByIdAndDelete(userId);
        await EmailVerification.deleteMany({ user: userId });
        server.close();
        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error during simulation:', error);
        process.exit(1);
    }
};

simulateFlow();
