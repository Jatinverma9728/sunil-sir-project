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
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/categories', getCategories);

// Protected routes - MUST come before /:id to avoid route catching
router.get('/my-courses', protect, getMyCourses);

// Progress and lesson completion routes
router.get('/:id/progress', protect, getEnrollmentProgress);
router.post('/:id/lessons/:lessonId/complete', protect, markLessonComplete);

// Purchase routes
router.post('/:id/purchase', protect, purchaseCourse);
router.post('/:id/verify-payment', protect, verifyCoursePurchase);

// Dynamic route - MUST be last
router.get('/:id', getCourse);

module.exports = router;
