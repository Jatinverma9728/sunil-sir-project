const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const laptopImages = [
    {
        titleMatch: 'ThinkPad T480s',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    },
    {
        titleMatch: 'Latitude 7490',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
    },
    {
        titleMatch: 'EliteBook 840',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'
    },
    {
        titleMatch: 'MacBook Air',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    },
    {
        titleMatch: 'X1 Carbon',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    },
    {
        titleMatch: 'Precision 3530',
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80'
    }
];

async function update() {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const item of laptopImages) {
        const res = await Product.updateMany(
            { title: { $regex: item.titleMatch, $options: 'i' } },
            { $set: { 'images.0.url': item.image } }
        );
        console.log(`Updated ${item.titleMatch}: matched ${res.matchedCount}`);
    }
    await mongoose.connection.close();
    console.log('✅ Real laptop photos assigned successfully!');
    process.exit(0);
}

update().catch(err => {
    console.error(err);
    process.exit(1);
});
