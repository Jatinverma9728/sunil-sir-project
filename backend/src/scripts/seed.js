const mongoose = require('mongoose');
const Product = require('../models/Product');
const Course = require('../models/Course');
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

// Dummy Products Data (matching Product schema)
const products = [
    {
        title: 'MacBook Pro 16" M3 Max',
        description: 'Powerhouse laptop with M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life. Perfect for developers and creative professionals.',
        category: 'electronics',
        brand: 'Apple',
        price: 2499,
        stock: 25,
        images: [
            { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', alt: 'MacBook Pro M3 Max' }
        ],
        specs: {
            processor: 'Apple M3 Max',
            ram: '32GB Unified Memory',
            storage: '1TB SSD',
            display: '16.2-inch Liquid Retina XDR'
        },
        rating: { average: 4.9, count: 234 },
        tags: ['laptop', 'macbook', 'apple', 'm3', 'premium']
    },
    {
        title: 'Dell XPS 15 Ultra',
        description: 'Premium Windows laptop with InfinityEdge display, powerful Intel processor, and sleek aluminum design.',
        category: 'electronics',
        brand: 'Dell',
        price: 1899,
        stock: 40,
        images: [
            { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45', alt: 'Dell XPS 15' }
        ],
        specs: {
            processor: 'Intel Core i9-13900H',
            ram: '32GB DDR5',
            storage: '1TB NVMe SSD',
            display: '15.6-inch 4K OLED'
        },
        rating: { average: 4.7, count: 187 },
        tags: ['laptop', 'dell', 'xps', 'windows']
    },
    {
        title: 'iPhone 15 Pro Max',
        description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
        category: 'electronics',
        brand: 'Apple',
        price: 1199,
        stock: 50,
        images: [
            { url: 'https://images.unsplash.com/photo-1592286927505-2ff6ec95c1c4', alt: 'iPhone 15 Pro Max' }
        ],
        specs: {
            processor: 'A17 Pro',
            storage: '256GB',
            display: '6.7-inch Super Retina XDR',
            camera: '48MP Triple Camera System'
        },
        rating: { average: 4.8, count: 543 },
        tags: ['smartphone', 'iphone', 'apple', '5g']
    },
    {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with Premium Sound Quality and ultra-comfortable design.',
        category: 'electronics',
        brand: 'Sony',
        price: 349,
        stock: 75,
        images: [
            { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b', alt: 'Sony WH-1000XM5' }
        ],
        specs: {
            type: 'Over-ear',
            connectivity: 'Bluetooth 5.2',
            battery: '30 hours',
            weight: '250g'
        },
        rating: { average: 4.9, count: 892 },
        tags: ['headphones', 'wireless', 'noise-canceling', 'sony']
    },
    {
        title: 'Philips Hue Smart Bulb Starter Kit',
        description: 'Smart LED bulbs with 16 million colors, voice control, and automation features.',
        category: 'home',
        brand: 'Philips',
        price: 129,
        stock: 100,
        images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', alt: 'Philips Hue' }
        ],
        specs: {
            lumens: '800',
            colors: '16 million',
            connectivity: 'Zigbee',
            lifespan: '25,000 hours'
        },
        rating: { average: 4.6, count: 654 },
        tags: ['smart-home', 'iot', 'lighting', 'philips']
    },
    {
        title: 'Catan Board Game',
        description: 'Award-winning strategy game for 3-4 players. Build settlements, trade resources, and conquer the island!',
        category: 'toys',
        brand: 'Catan Studio',
        price: 49,
        stock: 80,
        images: [
            { url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09', alt: 'Catan Board Game' }
        ],
        specs: {
            players: '3-4',
            playTime: '60-120 minutes',
            age: '10+',
            type: 'Strategy'
        },
        rating: { average: 4.8, count: 423 },
        tags: ['board-game', 'strategy', 'family', 'catan']
    },
    {
        title: 'Traxxas Slash 4X4 RC Truck',
        description: 'High-performance 4WD short course truck with waterproof electronics and extreme durability.',
        category: 'toys',
        brand: 'Traxxas',
        price: 399,
        stock: 35,
        images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', alt: 'RC Truck' }
        ],
        specs: {
            scale: '1/10',
            speed: '60+ mph',
            motor: 'Brushless',
            battery: '3S LiPo'
        },
        rating: { average: 4.7, count: 234 },
        tags: ['rc-car', 'remote-control', 'truck', 'hobby']
    },
    {
        title: 'Ring Video Doorbell Pro 2',
        description: '1080p HD video doorbell with 3D motion detection and two-way talk.',
        category: 'electronics',
        brand: 'Ring',
        price: 249,
        stock: 60,
        images: [
            { url: 'https://images.unsplash.com/photo-1558002038-1055907df827', alt: 'Ring Doorbell' }
        ],
        specs: {
            resolution: '1080p HD',
            fieldOfView: '150° horizontal',
            connectivity: 'Wi-Fi',
            storage: 'Cloud'
        },
        rating: { average: 4.5, count: 567 },
        tags: ['security', 'doorbell', 'camera', 'smart-home']
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Check and seed Products
        console.log('📦 Seeding Products...');
        for (const productData of products) {
            const exists = await Product.findOne({ title: productData.title });
            if (!exists) {
                await Product.create(productData);
                console.log(`  ✓ Created: ${productData.title}`);
            } else {
                console.log(`  ⊘ Skipped (exists): ${productData.title}`);
            }
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   Products: ${await Product.countDocuments()} total`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
};

main();
