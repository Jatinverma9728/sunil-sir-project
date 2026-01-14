const Coupon = require('../../models/Coupon');
const Order = require('../../models/Order');

/**
 * @desc    Get all coupons
 * @route   GET /api/admin/coupons
 * @access  Private/Admin
 */
const getAllCoupons = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        const now = new Date();

        if (status === 'active') {
            query.isActive = true;
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
        } else if (status === 'expired') {
            query.endDate = { $lt: now };
        } else if (status === 'scheduled') {
            query.startDate = { $gt: now };
        }

        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Coupon.countDocuments(query);

        res.status(200).json({
            success: true,
            data: coupons,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get single coupon
 * @route   GET /api/admin/coupons/:id
 * @access  Private/Admin
 */
const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Create coupon
 * @route   POST /api/admin/coupons
 * @access  Private/Admin
 */
const createCoupon = async (req, res) => {
    try {
        // Generate random code if not provided
        if (!req.body.code) {
            req.body.code = Coupon.generateCode();
        }

        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update coupon
 * @route   PUT /api/admin/coupons/:id
 * @access  Private/Admin
 */
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/admin/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Validate and apply coupon
 * @route   POST /api/coupons/validate
 * @access  Private (logged in users)
 */
const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal, cartItems } = req.body;
        const userId = req.user._id;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        const now = new Date();

        // Check if active
        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
        }

        // Check dates
        if (now < coupon.startDate) {
            return res.status(400).json({ success: false, message: 'This coupon is not yet valid' });
        }

        if (now > coupon.endDate) {
            return res.status(400).json({ success: false, message: 'This coupon has expired' });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
        }

        // Check per user limit
        const userUsage = coupon.usedBy.find(u => u.user.toString() === userId.toString());
        if (userUsage && userUsage.count >= coupon.perUserLimit) {
            return res.status(400).json({ success: false, message: 'You have already used this coupon the maximum number of times' });
        }

        // Check first order only
        if (coupon.isFirstOrderOnly) {
            const existingOrders = await Order.countDocuments({ user: userId });
            if (existingOrders > 0) {
                return res.status(400).json({ success: false, message: 'This coupon is only valid for first-time orders' });
            }
        }

        // Check minimum purchase
        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase of ₹${coupon.minPurchase} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = Math.min(coupon.discountValue, cartTotal);
        }

        res.status(200).json({
            success: true,
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount: Math.round(discount * 100) / 100,
                message: `Coupon applied! You save ₹${discount.toFixed(2)}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Apply coupon (after order placed)
 * @route   POST /api/coupons/apply
 * @access  Private
 */
const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user._id;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        // Update usage
        coupon.usedCount += 1;

        const userUsageIndex = coupon.usedBy.findIndex(u => u.user.toString() === userId.toString());
        if (userUsageIndex > -1) {
            coupon.usedBy[userUsageIndex].count += 1;
            coupon.usedBy[userUsageIndex].usedAt = new Date();
        } else {
            coupon.usedBy.push({ user: userId, count: 1, usedAt: new Date() });
        }

        await coupon.save();

        res.status(200).json({ success: true, message: 'Coupon applied successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Generate random coupon code
 * @route   POST /api/admin/coupons/generate-code
 * @access  Private/Admin
 */
const generateCouponCode = async (req, res) => {
    try {
        const { length = 8 } = req.body;
        const code = Coupon.generateCode(length);

        // Check if code already exists
        const exists = await Coupon.findOne({ code });
        if (exists) {
            // Try again
            const newCode = Coupon.generateCode(length);
            return res.status(200).json({ success: true, code: newCode });
        }

        res.status(200).json({ success: true, code });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    applyCoupon,
    generateCouponCode
};
