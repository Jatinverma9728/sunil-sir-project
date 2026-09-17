const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.product',
            select: 'title price image stock images category' // Select needed fields
        });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.status(200).json({
            success: true,
            count: cart.items.length,
            data: cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Add item to cart or update quantity
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        // check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity: qty }]
            });
        } else {
            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity = qty; // Strategy: Set to new qty or increment? Usually set.
                // If we want increment logic, we'd do += qty. 
                // Let's assume the frontend sends the "desired final quantity" or we can handle logic.
                // Standard add-to-cart button usually implies "add this many". 
                // But cart page input implies "set to this".
                // Allow a mode param? For now, let's treat it as "Add/Update" to this quantity if explicitly sent logic is tricky.
                // Actually, often safer to allow "increment" flag or just overwrite.
                // Let's do overwrite for simplicity handling inputs, assuming frontend manages currentVal + 1.
                // ERROR CORRECTION: If user clicks "Add to Cart" on product page twice, they expect 2 items.
                // If they change input in cart, they expect overwrite.

                // Let's assume `quantity` is the DESIRED TOTAL quantity if passed from cart update,
                // OR added quantity if passed from product page? 
                // Standard API design: POST /cart usually adds. PUT /cart/:id updates. 
                // Let's implement PUT for update later. For POST, let's assume ADD.

                // Re-reading standard patterns: 
                // Often POST is "add item". If exists, increment.
                // PUT or PATCH is "update item".

                // Let's implement Logic: If POST, increment.
                cart.items[itemIndex].quantity += qty;
            } else {
                cart.items.push({ product: productId, quantity: qty });
            }
        }

        await cart.save();

        // Populate for return
        await cart.populate({
            path: 'items.product',
            select: 'title price image stock images category'
        });

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:productId
 * @access  Private
 */
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.productId;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // If quantity 0, remove item
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();

            await cart.populate({
                path: 'items.product',
                select: 'title price image stock images category'
            });

            res.status(200).json({
                success: true,
                message: 'Cart updated',
                data: cart
            });
        } else {
            res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
const removeCartItem = async (req, res) => {
    try {
        const productId = req.params.productId;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Filter out the item
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();

        await cart.populate({
            path: 'items.product',
            select: 'title price image stock images category'
        });

        res.status(200).json({
            success: true,
            message: 'Item removed',
            data: cart
        });

    } catch (error) {
        console.error('Remove cart item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: { items: [] }
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Sync local cart with backend
 * @route   POST /api/cart/sync
 * @access  Private
 */
const syncCart = async (req, res) => {
    try {
        const { items } = req.body; // Array of { product, quantity }
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Invalid items array' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Batch fetch all products in a single O(1) query instead of O(N) sequential round-trips
        const productIds = items
            .map(item => item.product?._id || item.product)
            .filter(Boolean);

        const products = await Product.find({ _id: { $in: productIds } })
            .select('_id title price image stock images category isActive')
            .lean();

        // Create O(1) lookup Map for valid products
        const productMap = new Map();
        products.forEach(p => productMap.set(p._id.toString(), p));

        // Create O(1) lookup Map for existing cart items: productId -> index
        const cartItemMap = new Map();
        cart.items.forEach((item, index) => {
            cartItemMap.set(item.product.toString(), index);
        });

        // Merge logic in a single O(N) in-memory pass
        for (const localItem of items) {
            const rawId = (localItem.product?._id || localItem.product)?.toString();
            if (!rawId || !productMap.has(rawId)) continue;

            const existingIndex = cartItemMap.get(rawId);
            if (existingIndex !== undefined) {
                cart.items[existingIndex].quantity = Math.max(
                    cart.items[existingIndex].quantity,
                    localItem.quantity
                );
            } else {
                cart.items.push({
                    product: rawId,
                    quantity: localItem.quantity
                });
                cartItemMap.set(rawId, cart.items.length - 1);
            }
        }

        await cart.save();

        await cart.populate({
            path: 'items.product',
            select: 'title price image stock images category'
        });

        res.status(200).json({
            success: true,
            message: 'Cart synced',
            data: cart
        });

    } catch (error) {
        console.error('Sync cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    syncCart
};
