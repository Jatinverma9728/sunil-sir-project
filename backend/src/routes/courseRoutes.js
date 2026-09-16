const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    purchaseCourse,
    verifyCoursePurchase,
    getMyCourses,
    getCategories,
    markLessonComplete,
    getEnrollmentProgress,
} = require('../controllers/courseController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

const { cacheMiddleware } = require('../middlewares/cacheMiddleware');

// Public routes
router.get('/', cacheMiddleware({ ttl: 120, tags: ['courses'] }), getCourses);
router.get('/categories', cacheMiddleware({ ttl: 900, tags: ['categories', 'courses'] }), getCategories);

// Protected routes - MUST come before /:id to avoid route catching
router.get('/my-courses', protect, getMyCourses);

// Progress and lesson completion routes
router.get('/:id/progress', protect, getEnrollmentProgress);
router.post('/:id/lessons/:lessonId/complete', protect, markLessonComplete);

// Purchase routes
router.post('/:id/purchase', protect, purchaseCourse);
router.post('/:id/verify-payment', protect, verifyCoursePurchase);

// Dynamic route - MUST be last
router.get('/:id', optionalAuth, getCourse);

module.exports = router;
