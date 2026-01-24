/**
 * Database Performance Tests
 * Measures query execution times and validates optimization
 */
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

describe('Database Performance', () => {

    describe('Product Queries', () => {
        test('getAllProducts should execute in under 1000ms', async () => {
            const start = Date.now();

            // Simulate the actual query used in the controller
            const products = await Product.find({ isActive: true })
                .sort({ createdAt: -1 })
                .skip(0)
                .limit(12)
                .select('-__v')
                .lean(); // Using .lean() for performance

            const duration = Date.now() - start;

            console.log(`⏱️ Products query time: ${duration}ms`);
            console.log(`📦 Products fetched: ${products.length}`);

            expect(duration).toBeLessThan(1000);
            expect(Array.isArray(products)).toBe(true);
        });

        test('countDocuments should be fast', async () => {
            const start = Date.now();

            const count = await Product.countDocuments({ isActive: true });

            const duration = Date.now() - start;

            console.log(`⏱️ Count query time: ${duration}ms`);
            console.log(`📦 Total active products: ${count}`);

            expect(duration).toBeLessThan(500);
            expect(typeof count).toBe('number');
        });

        test('Product aggregation should work', async () => {
            const start = Date.now();

            const stats = await Product.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        avgPrice: { $avg: '$price' }
                    }
                }
            ]);

            const duration = Date.now() - start;

            console.log(`⏱️ Aggregation time: ${duration}ms`);
            console.log(`📊 Categories found: ${stats.length}`);

            expect(duration).toBeLessThan(2000);
            expect(Array.isArray(stats)).toBe(true);
        });
    });

    describe('Index Verification', () => {
        test('Product collection should have indexes', async () => {
            const indexes = await Product.collection.getIndexes();

            console.log('📇 Product indexes:', Object.keys(indexes));

            // Should have at least the _id index
            expect(Object.keys(indexes).length).toBeGreaterThan(0);
            expect(indexes).toHaveProperty('_id_');
        });
    });
});
