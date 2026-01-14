const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import admin controllers
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
} = require('../controllers/admin/productAdminController');

const {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseStats,
} = require('../controllers/admin/courseAdminController');

const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStats,
} = require('../controllers/admin/orderAdminController');

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
} = require('../controllers/admin/userAdminController');

const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
} = require('../controllers/admin/categoryAdminController');

const {
    getRevenueAnalytics,
    getUserAnalytics,
    getProductAnalytics,
    getCourseAnalytics,
    getDashboardOverview,
    exportOrdersCSV,
    exportUsersCSV,
    exportOrdersPDF,
    exportAnalyticsReportPDF,
} = require('../controllers/admin/analyticsController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// ============================================
// ANALYTICS ROUTES
// ============================================
router.get('/analytics/overview', getDashboardOverview);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/products', getProductAnalytics);
router.get('/analytics/courses', getCourseAnalytics);
router.get('/analytics/export/orders', exportOrdersCSV);
router.get('/analytics/export/users', exportUsersCSV);
router.get('/analytics/export/orders-pdf', exportOrdersPDF);
router.get('/analytics/export/report-pdf', exportAnalyticsReportPDF);

// ============================================
// PRODUCT MANAGEMENT ROUTES
// ============================================
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ============================================
// COURSE MANAGEMENT ROUTES
// ============================================
router.get('/courses', getAllCourses);
router.get('/courses/stats', getCourseStats);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================
router.get('/orders/stats', getOrderStats);  // Must be before /:id
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// ============================================
// CATEGORY MANAGEMENT ROUTES
// ============================================
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
