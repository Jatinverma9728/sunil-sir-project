// Quick script to check product image URLs in database
require('dotenv').config();
const mongoose = require('mongoose');

async function checkProductImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get Product model
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        // Find all products
        const products = await Product.find().limit(5);

        console.log(`📦 Checking ${products.length} products:\n`);

        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title}`);
            console.log(`   Images:`, product.images);
            console.log('');
        });

        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkProductImages();
