const mongoose = require('mongoose');
const Product = require('../models/Product');
const Course = require('../models/Course');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const refurbishedLaptops = [
    {
        title: 'Lenovo ThinkPad T480s Intel Core i5 8th Gen (16GB RAM / 512GB NVMe SSD / 14" FHD IPS)',
        description: 'Military-grade business ultrabook inspected across 32 checkpoints. Lightweight magnesium chassis, backlit keyboard, dual battery system with 8+ hours backup, and genuine Windows 11 Pro.',
        category: 'laptops',
        brand: 'Lenovo',
        price: 21999,
        originalPrice: 78000,
        stock: 18,
        images: [
            { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', alt: 'Lenovo ThinkPad T480s Refurbished' }
        ],
        specs: {
            processor: 'Intel Core i5-8350U (4 Cores, 8 Threads)',
            ram: '16GB DDR4 2400MHz',
            storage: '512GB PCIe NVMe M.2 SSD',
            display: '14-inch Full HD (1920x1080) Anti-Glare IPS',
            graphics: 'Intel UHD Graphics 620',
            os: 'Windows 11 Pro Genuine',
            condition: 'Grade A+ Certified Refurbished'
        },
        rating: { average: 4.9, count: 48 },
        tags: ['laptop', 'refurbished', 'thinkpad', 'lenovo', 'business', 't480s'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: 'Comprehensive 1-year warranty covering motherboard, display, and keyboard.'
        }
    },
    {
        title: 'Dell Latitude 7490 Ultrabook Intel Core i7 8th Gen (16GB RAM / 512GB SSD / 14" FHD)',
        description: 'Executive class enterprise laptop with carbon fiber reinforced chassis. Blazing fast Core i7 processor, crystal clear FHD display, Type-C Thunderbolt 3, and Grade A+ cosmetic condition.',
        category: 'laptops',
        brand: 'Dell',
        price: 24499,
        originalPrice: 85000,
        stock: 14,
        images: [
            { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', alt: 'Dell Latitude 7490 Refurbished' }
        ],
        specs: {
            processor: 'Intel Core i7-8650U (Up to 4.2GHz)',
            ram: '16GB DDR4 High-Speed RAM',
            storage: '512GB M.2 Solid State Drive',
            display: '14.0" FHD WVA (1920 x 1080) Anti-Glare',
            graphics: 'Intel UHD Graphics 620',
            os: 'Windows 11 Pro 64-Bit',
            condition: 'Grade A+ Certified'
        },
        rating: { average: 4.8, count: 36 },
        tags: ['laptop', 'refurbished', 'dell', 'latitude', 'i7', '7490'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '1-Year complete hardware repair or replacement guarantee.'
        }
    },
    {
        title: 'HP EliteBook 840 G5 Intel Core i5 8th Gen (16GB RAM / 256GB SSD / Bang & Olufsen Audio)',
        description: 'Ultra-slim aluminum unibody business laptop with enterprise security. Featuring Bang & Olufsen premium stereo audio, IR camera for facial login, and exceptional battery longevity.',
        category: 'laptops',
        brand: 'HP',
        price: 20999,
        originalPrice: 72000,
        stock: 22,
        images: [
            { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', alt: 'HP EliteBook 840 G5 Refurbished' }
        ],
        specs: {
            processor: 'Intel Core i5-8250U Quad Core',
            ram: '16GB DDR4 RAM',
            storage: '256GB NVMe M.2 SSD',
            display: '14-inch Diagonal FHD IPS eDP Anti-Glare LED',
            audio: 'Bang & Olufsen Dual Stereo Speakers',
            os: 'Windows 11 Pro',
            condition: 'Grade A+ Like New'
        },
        rating: { average: 4.7, count: 29 },
        tags: ['laptop', 'refurbished', 'hp', 'elitebook', '840g5'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '12 Months hardware warranty with North Tech Hub rapid support.'
        }
    },
    {
        title: 'Apple MacBook Air 13" Apple M1 Chip (8GB Unified RAM / 256GB SSD / Retina Display)',
        description: 'Certified pre-owned MacBook Air with revolutionary Apple Silicon M1 chip. Silent fanless design, up to 18 hours battery life, P3 wide color Retina display, and 100% battery health check.',
        category: 'laptops',
        brand: 'Apple',
        price: 49999,
        originalPrice: 99900,
        stock: 8,
        images: [
            { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80', alt: 'Apple MacBook Air M1 Refurbished' }
        ],
        specs: {
            processor: 'Apple M1 (8-core CPU with 4 performance cores)',
            ram: '8GB Unified Memory',
            storage: '256GB High-Speed SSD',
            display: '13.3-inch (diagonal) LED-backlit Retina display',
            battery: 'Certified ≥ 88% Original Apple Battery Health',
            os: 'macOS Sonoma Updated',
            condition: 'Grade A Premium'
        },
        rating: { average: 4.9, count: 64 },
        tags: ['laptop', 'apple', 'macbook', 'm1', 'retina', 'refurbished'],
        isFeatured: true,
        warranty: {
            duration: '6 Months',
            type: 'seller',
            details: '6-Month North Tech Hub warranty + 7-Day easy replacement.'
        }
    },
    {
        title: 'Lenovo ThinkPad X1 Carbon Gen 6 Intel Core i7 (16GB RAM / 512GB SSD / HDR Display)',
        description: 'Flagship featherlight executive laptop weighing just 1.13 kg. Carbon-fiber roll cage, rapid charging technology, Dolby Audio Premium, and precision glass trackpad.',
        category: 'laptops',
        brand: 'Lenovo',
        price: 29999,
        originalPrice: 125000,
        stock: 9,
        images: [
            { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', alt: 'ThinkPad X1 Carbon Gen 6' }
        ],
        specs: {
            processor: 'Intel Core i7-8550U (4.00GHz Max Boost)',
            ram: '16GB LPDDR3 Dual Channel',
            storage: '512GB NVMe TLC OPAL2.0 SSD',
            display: '14" FHD IPS Anti-Glare 300 nits',
            weight: '1.13 kg Ultra-Lightweight',
            os: 'Windows 11 Pro',
            condition: 'Grade A+ Pristine'
        },
        rating: { average: 5.0, count: 41 },
        tags: ['laptop', 'refurbished', 'thinkpad', 'x1carbon', 'ultrabook', 'i7'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: 'Full 1-year warranty on all electronic hardware components.'
        }
    },
    {
        title: 'Dell Precision 3530 Mobile Workstation Intel Core i7 8th Gen (32GB RAM / 1TB SSD / Nvidia Quadro)',
        description: 'Heavy-duty certified workstation for AutoCAD, SolidWorks, 3D rendering, and software compilation. Dedicated Nvidia Quadro P600 4GB graphics and 32GB high-speed memory.',
        category: 'laptops',
        brand: 'Dell',
        price: 34999,
        originalPrice: 140000,
        stock: 7,
        images: [
            { url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80', alt: 'Dell Precision Mobile Workstation' }
        ],
        specs: {
            processor: 'Intel Core i7-8750H 6-Core (12 Threads, 4.1GHz)',
            ram: '32GB DDR4 2666MHz RAM',
            storage: '1TB M.2 NVMe SSD',
            graphics: 'NVIDIA Quadro P600 4GB GDDR5 Dedicated',
            display: '15.6" Full HD (1920x1080) Anti-Glare',
            os: 'Windows 11 Pro for Workstations',
            condition: 'Grade A Certified'
        },
        rating: { average: 4.8, count: 22 },
        tags: ['laptop', 'workstation', 'dell', 'precision', 'cad', 'gpu', 'refurbished'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '1-Year comprehensive workstation support & hardware guarantee.'
        }
    }
];

const flagshipCourses = [
    {
        title: 'Full-Stack Web Development Bootcamp (React 19, Next.js & Node.js)',
        description: 'Zero to hero practical development course. Build 6 production-grade fullstack web applications with authentication, databases, payments, and deployment pipelines.',
        category: 'programming',
        price: 1499,
        level: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        rating: { average: 4.9, count: 184 },
        enrolledStudents: 620,
        isPublished: true,
        tags: ['web-dev', 'react', 'nextjs', 'fullstack', 'coding'],
        language: 'english',
        whatYouWillLearn: [
            'Modern JavaScript ES6+ & TypeScript mastery',
            'Fullstack applications with Next.js App Router',
            'MongoDB, PostgreSQL & Prisma ORM database design',
            'Authentication with JWT and NextAuth',
            'Payment gateway integration with Razorpay/Stripe',
            'Industry capstone project ready for resumes'
        ],
        requirements: ['Basic computer knowledge', 'No prior coding experience required'],
        lessons: [
            { title: 'Course Introduction & Modern Web Architecture', description: 'Overview of modern web standards', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 45, order: 1 },
            { title: 'TypeScript & React Fundamentals', description: 'Components, hooks, state and props', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 90, order: 2 },
            { title: 'Fullstack Next.js App Router & Server Actions', description: 'Server components and API endpoints', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, order: 3 },
            { title: 'Database Modeling & Authentication', description: 'Relational & document stores with secure auth', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 110, order: 4 }
        ]
    },
    {
        title: 'IoT & Embedded Robotics Masterclass (ESP32, Arduino & Raspberry Pi)',
        description: 'Hands-on hardware programming course using real microcontrollers. Build IoT smart home automation systems, sensor telemetry dashboards, and autonomous robot vehicles.',
        category: 'programming',
        price: 1999,
        level: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        rating: { average: 4.9, count: 96 },
        enrolledStudents: 340,
        isPublished: true,
        tags: ['iot', 'arduino', 'esp32', 'raspberry-pi', 'robotics', 'hardware'],
        language: 'english',
        whatYouWillLearn: [
            'C++ & MicroPython for ESP32 and Arduino microcontrollers',
            'MQTT, HTTP & WebSocket IoT protocols for cloud communication',
            'Interfacing ultrasonic sensors, OLED displays, relays and motors',
            'Cloud dashboards with ThingsBoard & Firebase',
            'Building a 4WD autonomous robot car with obstacle avoidance'
        ],
        requirements: ['Basic electrical familiarity', 'Arduino or ESP32 development board (optional)'],
        lessons: [
            { title: 'Introduction to Microcontrollers & GPIO Pins', description: 'Getting started with Arduino IDE and ESP32', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 60, order: 1 },
            { title: 'Analog vs Digital Sensors & Signal Processing', description: 'Reading ADC and PWM control', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 75, order: 2 },
            { title: 'WiFi Networking & Cloud Telemetry with MQTT', description: 'Transmitting sensor packets to cloud brokers', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 95, order: 3 }
        ]
    },
    {
        title: 'Python for AI, Data Science & Machine Learning Practical Track',
        description: 'Master practical Python programming with NumPy, Pandas, Scikit-Learn, and OpenAI APIs. Build intelligent automation agents, predictive data models, and computer vision apps.',
        category: 'programming',
        price: 1299,
        level: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        rating: { average: 4.8, count: 142 },
        enrolledStudents: 510,
        isPublished: true,
        tags: ['python', 'ai', 'machine-learning', 'data-science', 'automation'],
        language: 'English',
        whatYouWillLearn: [
            'Python syntax, object oriented programming and file I/O',
            'Data wrangling and exploratory analysis with Pandas & NumPy',
            'Predictive modeling algorithms with Scikit-Learn',
            'Computer vision basics with OpenCV',
            'Integrating Large Language Model APIs into automated apps'
        ],
        requirements: ['No prior programming background required'],
        lessons: [
            { title: 'Python Programming Foundations', description: 'Variables, loops, functions and modules', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 60, order: 1 },
            { title: 'Data Analysis with Pandas and Matplotlib', description: 'Cleaning real datasets and plotting insights', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 90, order: 2 }
        ]
    }
];

const seedStore = async () => {
    try {
        console.log('🚀 Seeding North Tech Hub certified laptops and courses...\n');

        // Find or create admin user for instructor attribution
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.findOne({});
        }

        if (!adminUser) {
            adminUser = await User.create({
                name: 'North Tech Hub Academy',
                email: 'instructor@northtechhub.in',
                password: 'Password123!',
                role: 'admin',
                isEmailVerified: true
            });
            console.log('✓ Created instructor account');
        }

        // Seed refurbished laptops
        console.log('💻 Seeding Certified Refurbished Laptops...');
        for (const laptop of refurbishedLaptops) {
            const existing = await Product.findOne({ title: laptop.title });
            if (!existing) {
                await Product.create(laptop);
                console.log(`  ✓ Added Laptop: ${laptop.title.substring(0, 50)}...`);
            } else {
                console.log(`  ⊘ Already exists: ${laptop.title.substring(0, 40)}...`);
            }
        }

        // Seed flagship courses
        console.log('\n🎓 Seeding Flagship Career Courses...');
        for (const courseData of flagshipCourses) {
            const existing = await Course.findOne({ title: courseData.title });
            if (!existing) {
                await Course.create({
                    ...courseData,
                    instructor: adminUser._id
                });
                console.log(`  ✓ Added Course: ${courseData.title.substring(0, 50)}...`);
            } else {
                console.log(`  ⊘ Already exists: ${courseData.title.substring(0, 40)}...`);
            }
        }

        console.log('\n🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during store seeding:', err);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    await seedStore();
};

run();
