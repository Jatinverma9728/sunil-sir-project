const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

// Initial categories to seed
const initialCategories = [
    { name: 'Electronics', icon: '📱', description: 'Mobile phones, laptops, tablets, and electronic gadgets' },
    { name: 'Clothing', icon: '👔', description: 'Fashion apparel for men, women, and children' },
    { name: 'Books', icon: '📚', description: 'Books, magazines, and publications' },
    { name: 'Home & Garden', icon: '🏠', description: 'Home décor, furniture, and gardening tools' },
    { name: 'Sports & Fitness', icon: '⚽', description: 'Sports equipment and fitness gear' },
    { name: 'Toys & Games', icon: '🧸', description: 'Toys, games, and entertainment for kids' },
    { name: 'Beauty & Personal Care', icon: '💄', description: 'Cosmetics, skincare, and grooming products' },
    { name: 'Food & Beverages', icon: '🍔', description: 'Food items, snacks, and drinks' },
    { name: 'Automotive', icon: '🚗', description: 'Car accessories and automotive products' },
    { name: 'Jewelry & Watches', icon: '💍', description: 'Jewelry, watches, and accessories' },
    { name: 'Furniture', icon: '🛋️', description: 'Home and office furniture' },
    { name: 'Gaming', icon: '🎮', description: 'Video games, consoles, and gaming accessories' },
    { name: 'Office', icon: '🖊️', description: 'Office supplies and equipment' },
    { name: 'Kitchen', icon: '🍳', description: 'Kitchen appliances and cookware' },
    { name: 'Cameras', icon: '📷', description: 'Cameras and photography equipment' },
    { name: 'Computers', icon: '💻', description: 'Computers, laptops, and accessories' },
    { name: 'Televisions', icon: '📺', description: 'TVs and home entertainment systems' },
    { name: 'Audio', icon: '🎧', description: 'Headphones, speakers, and audio equipment' },
];

const seedCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Insert initial categories
        const categories = await Category.insertMany(initialCategories);
        console.log(`Successfully seeded ${categories.length} categories`);

        // Display created categories
        categories.forEach(cat => {
            console.log(`  ${cat.icon} ${cat.name} (${cat.slug})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

// Run the seed function
seedCategories();
