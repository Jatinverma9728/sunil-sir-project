const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

// Import controllers
const { getActiveBanners, trackBannerClick } = require('../controllers/admin/bannerController');
const { getActiveAnnouncements, dismissAnnouncement } = require('../controllers/admin/announcementController');
const { validateCoupon, applyCoupon } = require('../controllers/admin/couponController');
const { getActiveOffers } = require('../controllers/admin/offerController');

// ============================================
// BANNER ROUTES (Public)
// ============================================
router.get('/banners', getActiveBanners);
router.post('/banners/:id/click', trackBannerClick);

// ============================================
// ANNOUNCEMENT ROUTES (Public)
// ============================================
router.get('/announcements', getActiveAnnouncements);
router.post('/announcements/:id/dismiss', optionalAuth, dismissAnnouncement);

// ============================================
// OFFER ROUTES (Public)
// ============================================
router.get('/offers', getActiveOffers);

// ============================================
// COUPON ROUTES (Authenticated)
// ============================================
router.post('/coupons/validate', protect, validateCoupon);
router.post('/coupons/apply', protect, applyCoupon);

module.exports = router;
