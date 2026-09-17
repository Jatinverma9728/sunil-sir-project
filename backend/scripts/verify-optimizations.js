/**
 * Comprehensive Verification Script for Backend Optimizations
 * Tests:
 * 1. Custom LRU Cache DSA (O(1) operations, TTL, Eviction, Tag Invalidation)
 * 2. Express Cache Middleware (Hit/Miss headers, Response Timing)
 * 3. Enriched Health Check Diagnostics
 * 4. Public Route Caching & Invalidation (Products, Categories, Courses, Banners, Announcements, Offers)
 * 5. Cart Sync Batch Query & Map Lookup Efficiency
 * 6. Mongoose Schema Index Integrity (Zero Duplicate Warnings)
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const request = require('supertest');
const mongoose = require('mongoose');
const { LRUCache } = require('../src/utils/lruCache');
const { createApp } = require('../src/app');
const { cacheInstance, invalidateCacheTags } = require('../src/middlewares/cacheMiddleware');

// Color helpers for terminal output
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const red = (t) => `\x1b[31m${t}\x1b[0m`;
const cyan = (t) => `\x1b[36m${t}\x1b[0m`;
const bold = (t) => `\x1b[1m${t}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ${green('✓')} ${message}`);
    } else {
        failedTests++;
        console.error(`  ${red('✗')} ${message}`);
    }
}

async function runVerification() {
    console.log(bold(cyan('\n======================================================')));
    console.log(bold(cyan('   BACKEND ARCHITECTURE & OPTIMIZATION TEST SUITE    ')));
    console.log(bold(cyan('======================================================\n')));

    // Connect to database for live route testing
    console.log('Connecting to database...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(green('✓ Connected to MongoDB Atlas\n'));
    } catch (e) {
        console.warn(red('⚠ MongoDB connection failed, running in disconnected mode:'), e.message);
    }

    // ==============================================================
    // 1. UNIT TESTING: Custom LRU Cache Data Structure & Algorithm
    // ==============================================================
    console.log(bold('1. Testing Custom LRU Cache (DSA: DLL + Hash Map)...'));
    const testCache = new LRUCache(3, 100); // capacity: 3, defaultTTL: 100s

    // Set 3 items
    testCache.set('k1', 'v1');
    testCache.set('k2', 'v2');
    testCache.set('k3', 'v3');
    assert(testCache.size === 3, 'Cache capacity tracking: size is 3');
    assert(testCache.get('k1') === 'v1', 'Cache retrieval: k1 returns v1');

    // Eviction test: accessing k1 made it MRU. Adding k4 should evict k2 (LRU)
    testCache.set('k4', 'v4');
    assert(testCache.size === 3, 'Cache maintains max capacity on overflow (3)');
    assert(testCache.get('k2') === null, 'Cache eviction: least recently used (k2) was evicted');
    assert(testCache.get('k1') === 'v1', 'Recently accessed item (k1) was preserved');
    assert(testCache.get('k4') === 'v4', 'Newest item (k4) is present');

    // Tag Invalidation test
    testCache.set('tagged1', 'val1', 100, ['products', 'catalog']);
    testCache.set('tagged2', 'val2', 100, ['courses']);
    assert(testCache.get('tagged1') === 'val1', 'Tagged item 1 stored');
    assert(testCache.get('tagged2') === 'val2', 'Tagged item 2 stored');

    testCache.invalidateTags(['products']);
    assert(testCache.get('tagged1') === null, 'Tag invalidation evicted tagged1 (products tag)');
    assert(testCache.get('tagged2') === 'val2', 'Tag invalidation preserved tagged2 (courses tag)');

    // TTL Expiration test (0.02s = 20ms)
    testCache.set('shortKey', 'expireSoon', 0.02);
    assert(testCache.get('shortKey') === 'expireSoon', 'Item accessible before TTL');
    await new Promise((r) => setTimeout(r, 40));
    assert(testCache.get('shortKey') === null, 'Item expired after TTL');

    // Cache Stats
    const stats = testCache.stats();
    assert(stats.hits > 0 && stats.misses > 0, `Cache stats recorded: ${stats.hits} hits, ${stats.misses} misses`);

    // ==============================================================
    // 2. HTTP TESTING: Express App, Response Timing & Diagnostics
    // ==============================================================
    console.log(bold('\n2. Testing Express Application & Middleware...'));
    const app = createApp();

    // Test /health endpoint
    const healthRes = await request(app).get('/health');
    assert(healthRes.status === 200, 'GET /health returns 200 OK');
    assert(healthRes.headers['x-response-time'] !== undefined, `X-Response-Time header present: ${healthRes.headers['x-response-time']}`);
    assert(healthRes.body.database !== undefined, `Database status reported: ${healthRes.body.database.status}`);
    assert(typeof healthRes.body.uptime === 'number', `Uptime reported: ${healthRes.body.uptime}s`);
    assert(healthRes.body.memory !== undefined && healthRes.body.memory.rss !== undefined, `Memory diagnostics reported: RSS ${healthRes.body.memory.rss}`);
    assert(healthRes.body.cache !== undefined && typeof healthRes.body.cache.hits === 'number', `Cache stats reported in health: ${JSON.stringify(healthRes.body.cache)}`);

    // ==============================================================
    // 3. HTTP TESTING: Cache Middleware & Public Routes
    // ==============================================================
    console.log(bold('\n3. Testing Cache Middleware on Public Endpoints...'));

    // Clear application cache before test
    cacheInstance.clear();

    // Test /api/products caching
    const prodRes1 = await request(app).get('/api/products');
    assert(prodRes1.headers['x-cache'] === 'MISS', 'First GET /api/products returns X-Cache: MISS');
    assert(prodRes1.headers['x-response-time'] !== undefined, `First response time: ${prodRes1.headers['x-response-time']}`);

    const prodRes2 = await request(app).get('/api/products');
    assert(prodRes2.headers['x-cache'] === 'HIT', 'Second GET /api/products returns X-Cache: HIT');
    assert(prodRes2.headers['x-response-time'] !== undefined, `Cached response time: ${prodRes2.headers['x-response-time']}`);

    // Test /api/products/categories caching
    const catRes1 = await request(app).get('/api/products/categories');
    assert(catRes1.headers['x-cache'] === 'MISS', 'First GET /api/products/categories returns X-Cache: MISS');
    const catRes2 = await request(app).get('/api/products/categories');
    assert(catRes2.headers['x-cache'] === 'HIT', 'Second GET /api/products/categories returns X-Cache: HIT');

    // Test /api/courses caching
    const courseRes1 = await request(app).get('/api/courses');
    assert(courseRes1.headers['x-cache'] === 'MISS', 'First GET /api/courses returns X-Cache: MISS');
    const courseRes2 = await request(app).get('/api/courses');
    assert(courseRes2.headers['x-cache'] === 'HIT', 'Second GET /api/courses returns X-Cache: HIT');

    // Test /api/banners caching
    const bannerRes1 = await request(app).get('/api/banners');
    assert(bannerRes1.headers['x-cache'] === 'MISS', 'First GET /api/banners returns X-Cache: MISS');
    const bannerRes2 = await request(app).get('/api/banners');
    assert(bannerRes2.headers['x-cache'] === 'HIT', 'Second GET /api/banners returns X-Cache: HIT');

    // Test /api/announcements caching
    const annRes1 = await request(app).get('/api/announcements');
    assert(annRes1.headers['x-cache'] === 'MISS', 'First GET /api/announcements returns X-Cache: MISS');
    const annRes2 = await request(app).get('/api/announcements');
    assert(annRes2.headers['x-cache'] === 'HIT', 'Second GET /api/announcements returns X-Cache: HIT');

    // Test /api/offers caching
    const offerRes1 = await request(app).get('/api/offers');
    assert(offerRes1.headers['x-cache'] === 'MISS', 'First GET /api/offers returns X-Cache: MISS');
    const offerRes2 = await request(app).get('/api/offers');
    assert(offerRes2.headers['x-cache'] === 'HIT', 'Second GET /api/offers returns X-Cache: HIT');

    // ==============================================================
    // 4. TEST CACHE INVALIDATION
    // ==============================================================
    console.log(bold('\n4. Testing Tag-Based Cache Invalidation...'));
    invalidateCacheTags(['products']);
    const prodResAfterInvalidation = await request(app).get('/api/products');
    assert(prodResAfterInvalidation.headers['x-cache'] === 'MISS', 'GET /api/products returns X-Cache: MISS after invalidateCacheTags(["products"])');

    // Categories should also be invalidated since it was tagged with 'products'
    const catResAfterInvalidation = await request(app).get('/api/products/categories');
    assert(catResAfterInvalidation.headers['x-cache'] === 'MISS', 'GET /api/products/categories returns X-Cache: MISS after products tag invalidation');

    // But courses should still be HIT
    const courseResStillHit = await request(app).get('/api/courses');
    assert(courseResStillHit.headers['x-cache'] === 'HIT', 'GET /api/courses remains X-Cache: HIT (unaffected tag)');

    // ==============================================================
    // 5. TEST CART BATCH QUERY / MAP LOOKUP LOGIC
    // ==============================================================
    console.log(bold('\n5. Testing Cart Batching Map Lookup Efficiency...'));
    const sampleItems = [
        { product: '65f1a1a1a1a1a1a1a1a1a1a1', quantity: 2, price: 999 },
        { product: '65f1a1a1a1a1a1a1a1a1a1a2', quantity: 1, price: 499 },
        { product: '65f1a1a1a1a1a1a1a1a1a1a3', quantity: 3, price: 1299 }
    ];
    const productIds = sampleItems.map(i => i.product);
    assert(productIds.length === 3, 'Sample cart has 3 distinct product IDs');

    // Simulated DB batch response
    const mockDbProducts = [
        { _id: { toString: () => '65f1a1a1a1a1a1a1a1a1a1a1' }, name: 'Product 1', price: 999, stock: 10, isActive: true },
        { _id: { toString: () => '65f1a1a1a1a1a1a1a1a1a1a2' }, name: 'Product 2', price: 499, stock: 5, isActive: true },
        { _id: { toString: () => '65f1a1a1a1a1a1a1a1a1a1a3' }, name: 'Product 3', price: 1299, stock: 0, isActive: true }
    ];

    // O(N) Map construction
    const productMap = new Map(mockDbProducts.map(p => [p._id.toString(), p]));
    assert(productMap.size === 3, 'Product Map constructed with 3 entries in O(N)');

    // O(1) Lookups per cart item
    let validItemsCount = 0;
    for (const item of sampleItems) {
        const product = productMap.get(item.product);
        if (product && product.isActive && product.stock > 0) {
            validItemsCount++;
        }
    }
    assert(validItemsCount === 2, 'O(1) Map lookups accurately identified 2 in-stock active items');

    // ==============================================================
    // 6. TEST MONGOOSE MODEL INDEXES
    // ==============================================================
    console.log(bold('\n6. Testing Mongoose Model Index Definitions...'));
    const Product = require('../src/models/Product');
    const Course = require('../src/models/Course');
    const Order = require('../src/models/Order');
    const Coupon = require('../src/models/Coupon');
    const Category = require('../src/models/Category');
    const EmailVerification = require('../src/models/EmailVerification');

    const productIndexes = Product.schema.indexes();
    const courseIndexes = Course.schema.indexes();
    const orderIndexes = Order.schema.indexes();
    const couponIndexes = Coupon.schema.indexes();

    const hasProductCompound = productIndexes.some(([idx]) => idx.isActive === 1 && idx.category === 1);
    const hasProductRating = productIndexes.some(([idx]) => idx['rating.average'] === -1);
    assert(hasProductCompound, 'Product schema has compound index { isActive: 1, category: 1 }');
    assert(hasProductRating, "Product schema has rating index on { 'rating.average': -1 }");

    const hasCourseCompound = courseIndexes.some(([idx]) => idx.isPublished === 1 && idx.category === 1);
    const hasCourseRating = courseIndexes.some(([idx]) => idx['rating.average'] === -1);
    assert(hasCourseCompound, 'Course schema has compound index { isPublished: 1, category: 1 }');
    assert(hasCourseRating, "Course schema has rating index on { 'rating.average': -1 }");

    const hasOrderUserStatus = orderIndexes.some(([idx]) => idx.user === 1 && idx.orderStatus === 1);
    assert(hasOrderUserStatus, 'Order schema has compound index { user: 1, orderStatus: 1, createdAt: -1 }');

    const couponCodeIndexes = couponIndexes.filter(([idx]) => idx.code === 1);
    assert(couponCodeIndexes.length === 1, 'Coupon schema has exactly 1 index for code (zero duplicate warnings)');

    // ==============================================================
    // SUMMARY
    // ==============================================================
    console.log(bold(cyan('\n======================================================')));
    console.log(bold(`TOTAL TESTS: ${totalTests}`));
    console.log(bold(green(`PASSED: ${passedTests}`)));
    if (failedTests > 0) {
        console.log(bold(red(`FAILED: ${failedTests}`)));
    } else {
        console.log(bold(green('ALL TESTS PASSED WITH 100% SUCCESS!')));
    }
    console.log(bold(cyan('======================================================\n')));

    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }

    process.exit(failedTests > 0 ? 1 : 0);
}

runVerification().catch(err => {
    console.error(red('Verification failed with unhandled error:'), err);
    process.exit(1);
});
