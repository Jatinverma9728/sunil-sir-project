// Test Cloudinary Configuration
require('dotenv').config();
const cloudinary = require('./src/config/cloudinary');

console.log('\n🔍 Testing Cloudinary Configuration...\n');

// Check if credentials are loaded
console.log('📋 Checking environment variables:');
console.log('✓ CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('✓ CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('✓ CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ Missing');

// Test Cloudinary connection
console.log('\n🔌 Testing Cloudinary connection...\n');

cloudinary.api.ping()
    .then(result => {
        console.log('✅ SUCCESS! Connected to Cloudinary');
        console.log('📊 Status:', result.status);
        console.log('\n✨ Cloudinary is ready to use!\n');

        // List folders to verify access
        return cloudinary.api.root_folders();
    })
    .then(folders => {
        console.log('📁 Your Cloudinary folders:');
        if (folders.folders && folders.folders.length > 0) {
            folders.folders.forEach(folder => {
                console.log(`   - ${folder.name}`);
            });
        } else {
            console.log('   (No folders yet - will be created on first upload)');
        }
        console.log('\n');
    })
    .catch(error => {
        console.error('\n❌ ERROR: Failed to connect to Cloudinary');
        console.error('Message:', error.message);

        if (error.message.includes('Must supply cloud_name')) {
            console.error('\n💡 Fix: Add CLOUDINARY_CLOUD_NAME to your .env file');
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.error('\n💡 Fix: Check your API Key and API Secret are correct');
        } else {
            console.error('\n💡 Check your .env file has all three Cloudinary credentials');
        }
        console.error('\n');
    });
