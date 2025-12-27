const express = require('express');
const router = express.Router();
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    getMyReviews,
    canReview,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (require authentication)
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.get('/can-review/:productId', protect, canReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;
