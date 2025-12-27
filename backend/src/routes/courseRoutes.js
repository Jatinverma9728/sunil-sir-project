const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    purchaseCourse,
    getMyCourses,
    getCategories,
} = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/categories', getCategories);
router.get('/:id', getCourse);

// Protected routes
router.post('/:id/purchase', protect, purchaseCourse);
router.get('/my-courses', protect, getMyCourses);

module.exports = router;
