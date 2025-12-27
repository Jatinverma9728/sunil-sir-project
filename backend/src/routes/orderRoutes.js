const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.post('/:id/verify', verifyPayment);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
