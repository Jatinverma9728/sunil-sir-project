const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function checkCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');
        
        const Category = mongoose.model('Category', new mongoose.Schema({
            name: String,
            slug: String,
            image: String
        }, { collection: 'categories' }));

        const categories = await Category.find({});
        console.log('Categories found in DB:', JSON.stringify(categories, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkCategories();
