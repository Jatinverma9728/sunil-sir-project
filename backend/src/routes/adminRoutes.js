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

// Promotions controllers
const {
    getAllOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
} = require('../controllers/admin/offerController');

const {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    generateCouponCode,
} = require('../controllers/admin/couponController');

const {
    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
} = require('../controllers/admin/bannerController');

const {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} = require('../controllers/admin/announcementController');

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
router.get('/orders/stats', getOrderStats);
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

// ============================================
// OFFER MANAGEMENT ROUTES
// ============================================
router.get('/offers', getAllOffers);
router.post('/offers', createOffer);
router.get('/offers/:id', getOfferById);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

// ============================================
// COUPON MANAGEMENT ROUTES
// ============================================
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.post('/coupons/generate-code', generateCouponCode);
router.get('/coupons/:id', getCouponById);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// ============================================
// BANNER MANAGEMENT ROUTES
// ============================================
router.get('/banners', getAllBanners);
router.post('/banners', createBanner);
router.get('/banners/:id', getBannerById);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// ============================================
// ANNOUNCEMENT MANAGEMENT ROUTES
// ============================================
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', createAnnouncement);
router.get('/announcements/:id', getAnnouncementById);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

module.exports = router;
