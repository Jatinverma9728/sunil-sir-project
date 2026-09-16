const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const { cacheMiddleware } = require('../middlewares/cacheMiddleware');

// Public routes
router.get('/', cacheMiddleware({ ttl: 120, tags: ['products'] }), getProducts);
router.get('/categories', cacheMiddleware({ ttl: 900, tags: ['categories', 'products'] }), getCategories);
router.get('/:id', cacheMiddleware({ ttl: 120, tags: ['products'] }), getProduct);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
