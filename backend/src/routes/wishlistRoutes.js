const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    syncWishlist
} = require('../controllers/wishlistController');

router.use(protect); // All routes protected

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/:id', removeFromWishlist);
router.post('/sync', syncWishlist);

module.exports = router;
