const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getSessionStatus,
    unlockSession,
    logout,
    lockSession
} = require('../controllers/admin/adminAuthController');

// Apply protection globally to these routes
router.use(protect);
router.use(authorize('admin'));

router.get('/status', getSessionStatus);
router.post('/unlock', unlockSession);
router.post('/lock', lockSession);
router.post('/logout', logout);

module.exports = router;
