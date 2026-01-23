const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        res.json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check duplicates
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        await wishlist.populate('products');

        res.json({
            success: true,
            message: 'Added to wishlist',
            data: wishlist
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (p) => p.toString() !== id
            );
            await wishlist.save();
            await wishlist.populate('products');
        }

        res.json({
            success: true,
            message: 'Removed from wishlist',
            data: wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Sync local wishlist with backend
exports.syncWishlist = async (req, res) => {
    try {
        const { items } = req.body; // Array of product IDs

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        // Merge items safely
        if (items && Array.isArray(items)) {
            items.forEach(productId => {
                // We assume items contains valid Product IDs or objects with _id
                const id = typeof productId === 'string' ? productId : productId._id || productId.id;

                if (id && !wishlist.products.includes(id)) {
                    wishlist.products.push(id);
                }
            });
        }

        await wishlist.save();
        await wishlist.populate('products');

        res.json({
            success: true,
            message: 'Wishlist synced',
            data: wishlist
        });
    } catch (error) {
        console.error('Sync wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
