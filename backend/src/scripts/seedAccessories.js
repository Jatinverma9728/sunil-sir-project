const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Product = require('../models/Product');

const accessories = [
    {
        title: 'Keychron K2 V2 Wireless Mechanical Keyboard (RGB Backlit, Hot-Swappable Gateron Red)',
        description: '75% layout compact Bluetooth mechanical keyboard engineered for Mac and Windows productivity. Features hot-swappable switches, sound dampening foam, 4000mAh battery, and durable double-shot keycaps.',
        category: 'computer-accessories',
        brand: 'Keychron',
        price: 6999,
        originalPrice: 9499,
        stock: 15,
        images: [
            { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', alt: 'Keychron Wireless Mechanical Keyboard' }
        ],
        specs: {
            layout: '75% Compact (84 Keys)',
            connectivity: 'Bluetooth 5.1 & Type-C Wired',
            switches: 'Gateron G Pro Red (Linear)',
            battery: '4000mAh (Up to 240 hours)',
            compatibility: 'macOS, Windows, iOS, Android',
            backlight: '18 Dynamic RGB Presets'
        },
        rating: { average: 4.9, count: 52 },
        tags: ['keyboard', 'mechanical', 'wireless', 'bluetooth', 'accessories', 'keychron'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'manufacturer',
            details: '1-Year comprehensive replacement warranty.'
        }
    },
    {
        title: 'Logitech MX Master 3S Style Ergonomic Wireless Precision Mouse (8K DPI Quiet Clicks)',
        description: 'Ultra-fast MagSpeed electromagnetic scrolling mouse with ergonomic hand cradle. Features 8,000 DPI track-on-glass sensor, dual Bluetooth and Logi Bolt connectivity, and 70-day battery backup on single charge.',
        category: 'computer-accessories',
        brand: 'Logitech',
        price: 3499,
        originalPrice: 4999,
        stock: 20,
        images: [
            { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', alt: 'Ergonomic Precision Wireless Mouse' }
        ],
        specs: {
            sensor: 'Darkfield High Precision 8000 DPI',
            connectivity: 'Bluetooth Low Energy & 2.4GHz USB Dongle',
            buttons: '7 Custom Programmable Buttons',
            scrollWheel: 'MagSpeed SmartShift Electromagnetic',
            battery: 'USB-C Rechargeable 500mAh',
            clicks: 'Quiet Click 90% Noise Reduction'
        },
        rating: { average: 4.8, count: 74 },
        tags: ['mouse', 'wireless', 'ergonomic', 'bluetooth', 'logitech', 'accessories'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '1-Year direct repair and replacement support.'
        }
    },
    {
        title: 'UGREEN 7-in-1 USB-C Multiport Docking Station (4K@60Hz HDMI, 100W Power Delivery, SD/TF)',
        description: 'Premium space-gray aluminum unibody hub for laptops and ultrabooks. Converts single Type-C port into 4K HDMI, 100W PD pass-through charging, 2x USB 3.0 5Gbps ports, and dual SD/TF card readers.',
        category: 'computer-accessories',
        brand: 'UGREEN',
        price: 2499,
        originalPrice: 3999,
        stock: 25,
        images: [
            { url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80', alt: '7-in-1 USB-C Multiport Hub' }
        ],
        specs: {
            ports: '1x HDMI 4K@60Hz, 1x 100W PD, 2x USB-A 3.0, 1x USB-C Data, SD/MicroSD',
            dataTransfer: 'Up to 5Gbps SuperSpeed',
            material: 'Anodized Aluminum Heat-Dissipation Casing',
            compatibility: 'MacBook Pro/Air, ThinkPad, Dell XPS, iPad Pro',
            cableLength: '15cm Reinforced Braided Cable'
        },
        rating: { average: 4.7, count: 39 },
        tags: ['usb-c hub', 'docking station', 'hdmi', 'adapter', 'ugreen', 'accessories'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '12-Month replacement warranty for electronic faults.'
        }
    },
    {
        title: 'Anker PowerPort III 65W GaN Dual USB-C Fast Charger with Power Delivery 3.0',
        description: 'Next-gen Gallium Nitride (GaN) fast charger ultra-compact enough for travel. Delivers 65W full-speed charging for laptops, ultrabooks, tablets, and smartphones with advanced ActiveShield thermal protection.',
        category: 'computer-accessories',
        brand: 'Anker',
        price: 2199,
        originalPrice: 3499,
        stock: 18,
        images: [
            { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80', alt: '65W GaN Fast Wall Charger' }
        ],
        specs: {
            totalOutput: '65W Max USB Power Delivery 3.0',
            ports: '1x USB-C (65W) + 1x USB-A (18W)',
            technology: 'GaN II (Gallium Nitride) Semiconductor',
            protections: 'Overvoltage, Overheating, Short-Circuit',
            weight: '112 grams Ultra-Compact'
        },
        rating: { average: 4.9, count: 61 },
        tags: ['charger', 'gan', 'fast charging', 'usb-c', 'power delivery', 'anker'],
        isFeatured: true,
        warranty: {
            duration: '18 Months',
            type: 'manufacturer',
            details: '18-Month hassle-free manufacturer warranty.'
        }
    },
    {
        title: 'Orico Tool-Free M.2 NVMe PCIe SSD External Enclosure Case (10Gbps USB 3.2 Gen2)',
        description: 'Solid aluminum enclosure to turn internal NVMe SSDs into blazing fast portable drives. Tool-free slide installation, supports M.2 2280/2260/2242 sizes up to 4TB, with thermal silicone cooling pad included.',
        category: 'computer-accessories',
        brand: 'Orico',
        price: 1599,
        originalPrice: 2499,
        stock: 30,
        images: [
            { url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80', alt: 'M.2 NVMe SSD External Enclosure' }
        ],
        specs: {
            interface: 'USB 3.2 Gen2 Type-C (10Gbps, ~1000MB/s)',
            driveSupport: 'M.2 M-Key & B+M Key NVMe PCIe (2230 to 2280)',
            cablesIncluded: 'USB-C to C + USB-C to A Cables',
            cooling: 'Thermal Pad + Aluminum Fin Housing',
            chipset: 'Realtek RTL9210 High-Stability Controller'
        },
        rating: { average: 4.6, count: 48 },
        tags: ['nvme enclosure', 'ssd case', 'storage', 'usb 3.2', 'orico', 'accessories'],
        isFeatured: false,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '1-Year replacement guarantee against controller defect.'
        }
    },
    {
        title: 'Portronics Ergonomic Heavy Aluminium Foldable Laptop Riser Stand with Anti-Slip Pads',
        description: 'Heavy-duty CNC machined aluminum alloy laptop riser. Adjustable 6-level ergonomic elevation angles to eliminate neck and back strain, with open ventilated design for optimal laptop heat dissipation.',
        category: 'computer-accessories',
        brand: 'Portronics',
        price: 899,
        originalPrice: 1999,
        stock: 35,
        images: [
            { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', alt: 'Ergonomic Aluminium Laptop Stand' }
        ],
        specs: {
            material: 'Aircraft-Grade Sandblasted Aluminium Alloy',
            adjustment: '6 Ergonomic Height Settings (55mm to 155mm)',
            compatibility: '10 to 17.3 inch Laptops and Tablets',
            loadCapacity: 'Supports up to 10 kg',
            portability: 'Foldable with Velvet Carrying Pouch'
        },
        rating: { average: 4.8, count: 85 },
        tags: ['laptop stand', 'ergonomic', 'aluminum', 'portronics', 'accessories'],
        isFeatured: true,
        warranty: {
            duration: '1 Year',
            type: 'seller',
            details: '1-Year build and joint durability warranty.'
        }
    },
    {
        title: 'North Tech Braided 100W USB-C to USB-C E-Marker Fast Charging & Data Cable (2 Meter)',
        description: 'Ultra-durable nylon braided cable with integrated E-Marker smart chip. Supports up to 20V/5A 100W ultra-fast charging for high-performance laptops and phones, tested to endure 25,000+ bends.',
        category: 'computer-accessories',
        brand: 'North Tech Hub',
        price: 449,
        originalPrice: 999,
        stock: 50,
        images: [
            { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80', alt: '100W Braided USB-C Cable' }
        ],
        specs: {
            power: '100W (20V/5A) Power Delivery Support',
            length: '2.0 Meters (6.6 Feet)',
            dataRate: 'USB 2.0 480Mbps',
            connector: 'Zinc Alloy Shell with Gold-Plated Pins',
            durability: '25,000+ Bend Tested Military-Grade Nylon'
        },
        rating: { average: 4.9, count: 110 },
        tags: ['cable', 'type-c', '100w', 'fast charging', 'accessories'],
        isFeatured: false,
        warranty: {
            duration: '6 Months',
            type: 'seller',
            details: '6 Months instant replacement warranty.'
        }
    },
    {
        title: 'Ant Esports Extended Waterproof Non-Slip Gaming & Office Desk Mat (900x400x3mm)',
        description: 'Full-desk hybrid fabric mousepad and desk blotter. Micro-textured smooth glide surface for precision optical tracking, reinforced stitched edges to prevent fraying, and anti-slip rubberized textured base.',
        category: 'computer-accessories',
        brand: 'Ant Esports',
        price: 699,
        originalPrice: 1299,
        stock: 40,
        images: [
            { url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=80', alt: 'Large Extended Office & Gaming Desk Mat' }
        ],
        specs: {
            dimensions: '900mm x 400mm x 3mm (Extra Large)',
            surface: 'Spill-Resistant Micro-Weave Fabric',
            base: 'Natural Textured Eco-Rubber Non-Slip Base',
            edge: 'Anti-Fray Precision Stitched Border',
            cleaning: 'Waterproof Easy Wipe-Clean Surface'
        },
        rating: { average: 4.7, count: 68 },
        tags: ['desk mat', 'mousepad', 'gaming', 'workspace', 'accessories'],
        isFeatured: false,
        warranty: {
            duration: '6 Months',
            type: 'seller',
            details: '6-Month stitch & material integrity warranty.'
        }
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        for (const item of accessories) {
            const existing = await Product.findOne({ title: item.title });
            if (existing) {
                await Product.updateOne({ _id: existing._id }, { $set: item });
                console.log(`Updated: ${item.title}`);
            } else {
                await Product.create(item);
                console.log(`Created: ${item.title}`);
            }
        }

        console.log('All accessories seeded successfully!');
    } catch (err) {
        console.error('Error seeding accessories:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
