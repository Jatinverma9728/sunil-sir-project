require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Course = require('../models/Course');

/**
 * Script to fix image URLs in database
 * Replaces localhost URLs with production Render URLs
 */

const OLD_BASE_URL = 'http://localhost:5000';
const NEW_BASE_URL = process.env.BACKEND_URL || 'https://backend-ur3o.onrender.com';

async function fixImageUrls() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        console.log(`📝 Replacing URLs:`);
        console.log(`   FROM: ${OLD_BASE_URL}`);
        console.log(`   TO:   ${NEW_BASE_URL}\n`);

        // Fix Product images
        console.log('🔄 Updating Product images...');
        const productsResult = await Product.updateMany(
            { 'images.url': { $regex: new RegExp('^' + OLD_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) } },
            [
                {
                    $set: {
                        images: {
                            $map: {
                                input: '$images',
                                as: 'img',
                                in: {
                                    url: {
                                        $replaceOne: {
                                            input: '$$img.url',
                                            find: OLD_BASE_URL,
                                            replacement: NEW_BASE_URL
                                        }
                                    },
                                    alt: '$$img.alt'
                                }
                            }
                        }
                    }
                }
            ]
        );
        console.log(`✅ Updated ${productsResult.modifiedCount} products\n`);

        // Fix Course images (if course model exists)
        try {
            console.log('🔄 Updating Course images...');
            const coursesResult = await Course.updateMany(
                { 'images.url': { $regex: new RegExp('^' + OLD_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) } },
                [
                    {
                        $set: {
                            images: {
                                $map: {
                                    input: '$images',
                                    as: 'img',
                                    in: {
                                        url: {
                                            $replaceOne: {
                                                input: '$$img.url',
                                                find: OLD_BASE_URL,
                                                replacement: NEW_BASE_URL
                                            }
                                        },
                                        alt: '$$img.alt'
                                    }
                                }
                            }
                        }
                    }
                ]
            );
            console.log(`✅ Updated ${coursesResult.modifiedCount} courses\n`);
        } catch (error) {
            console.log('⚠️  Course model not found or has different schema, skipping...\n');
        }

        // Display some sample updated products
        console.log('📋 Sample updated products:');
        const sampleProducts = await Product.find({}).limit(3).select('title images');
        sampleProducts.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.title}`);
            product.images.forEach((img, imgIndex) => {
                console.log(`   Image ${imgIndex + 1}: ${img.url.substring(0, 80)}...`);
            });
        });

        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the migration
fixImageUrls();
