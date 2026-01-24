// Script to unlock all admin sessions
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

async function unlockSessions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await mongoose.connection.db.collection('adminsessions').updateMany(
            {},
            { $set: { isLocked: false, lastActivity: new Date() } }
        );

        console.log('Unlocked sessions:', result.modifiedCount);
        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

unlockSessions();
