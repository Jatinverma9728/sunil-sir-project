const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    syncCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// All cart routes are protected
router.use(protect);

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.route('/sync')
    .post(syncCart);

router.route('/:productId')
    .put(updateCartItem)
    .delete(removeCartItem);

module.exports = router;
