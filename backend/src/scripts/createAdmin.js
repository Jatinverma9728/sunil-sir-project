const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Create admin user
const createAdminUser = async () => {
    try {
        console.log('\n🔐 Creating Admin User...\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@demo.com' });

        if (existingAdmin) {
            // Update role to admin if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✓ Updated existing user to admin');
            } else {
                console.log('⊘ Admin user already exists');
            }
        } else {
            // Create new admin user
            await User.create({
                name: 'Demo Admin',
                email: 'admin@demo.com',
                password: 'Admin123!',
                role: 'admin',
                isEmailVerified: true
            });
            console.log('✓ Created new admin user');
        }

        console.log('\n📧 Admin Credentials:');
        console.log('   Email:    admin@demo.com');
        console.log('   Password: Admin123!');
        console.log('\n');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await createAdminUser();
    await mongoose.connection.close();
    console.log('👋 Done!');
    process.exit(0);
};

main();
