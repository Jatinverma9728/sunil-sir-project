const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const {
    createRazorpayOrder,
    verifyRazorpaySignature,
    mockPaymentSuccess,
    getRazorpayKeyId,
} = require('../utils/payment');
const { sendOrderConfirmationEmail } = require('../utils/email');

// ... existing imports ...

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
    console.log('--- Create Order Request Started ---');
    try {
        console.log('User:', req.user ? req.user._id : 'No User');
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice, // These are ignored in favor of server calculation
            couponCode
        } = req.body;

        // Validate required fields
        if (!orderItems || orderItems.length === 0) {
            console.log('Error: No order items');
            return res.status(400).json({
                success: false,
                message: 'No order items provided',
            });
        }

        if (!shippingAddress) {
            console.log('Error: No shipping address');
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required',
            });
        }

        // Verify product availability and calculate prices server-side
        console.log('Verifying products...');
        let calculatedItemsPrice = 0;
        const verifiedOrderItems = [];

        for (const item of orderItems) {
            console.log(`Checking product: ${item.product}`);
            const product = await Product.findById(item.product);

            if (!product) {
                console.log(`Product not found: ${item.product}`);
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            if (!product.isActive) {
                console.log(`Product inactive: ${product.title}`);
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.title} is not available`,
                });
            }

            if (product.stock < item.quantity) {
                console.log(`Insufficient stock for ${product.title}`);
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}. Available: ${product.stock}`,
                });
            }

            // Use server-side price (not client-provided)
            const itemTotal = product.price * item.quantity;
            calculatedItemsPrice += itemTotal;

            verifiedOrderItems.push({
                product: item.product,
                title: product.title,
                quantity: item.quantity,
                price: product.price, // Server-side price
                image: product.images?.[0]?.url || item.image,
            });

            // Decrement stock atomically
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }

        console.log('Products verified. Calculated Items Price:', calculatedItemsPrice);

        // Calculate prices server-side
        let calculatedDiscount = 0;
        let appliedCoupon = null;

        // Apply Coupon if provided
        if (couponCode) {
            console.log(`Verifying coupon: ${couponCode}`);
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() }
            });

            if (coupon) {
                console.log('Coupon found:', coupon.code);
                // Check usage limits
                if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
                    console.log(`Coupon ${couponCode} exhausted`);
                } else {
                    // Check per-user limit
                    const userUsage = coupon.usedBy.filter(u => u.user.toString() === req.user._id.toString()).length;
                    if (coupon.perUserLimit && userUsage >= coupon.perUserLimit) {
                        console.log(`Coupon ${couponCode} limit reached for user`);
                    } else {
                        // Check min purchase
                        if (calculatedItemsPrice >= coupon.minPurchase) {
                            if (coupon.discountType === 'percentage') {
                                calculatedDiscount = (calculatedItemsPrice * coupon.discountValue) / 100;
                                if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
                                    calculatedDiscount = coupon.maxDiscount;
                                }
                            } else {
                                calculatedDiscount = coupon.discountValue;
                            }
                            appliedCoupon = coupon._id;
                            console.log('Coupon applied. Discount:', calculatedDiscount);
                        } else {
                            console.log('Coupon min purchase not met');
                        }
                    }
                }
            } else {
                console.log('Coupon invalid or expired');
            }
        }

        const taxableAmount = Math.max(0, calculatedItemsPrice - calculatedDiscount);
        const calculatedTaxPrice = Math.round(taxableAmount * 0.10 * 100) / 100; // 10% GST
        const calculatedShippingPrice = calculatedItemsPrice > 999 ? 0 : 99; // Free shipping over 999
        const calculatedTotalPrice = Math.round((taxableAmount + calculatedTaxPrice + calculatedShippingPrice) * 100) / 100;

        console.log('Final Totals:', {
            items: calculatedItemsPrice,
            discount: calculatedDiscount,
            tax: calculatedTaxPrice,
            shipping: calculatedShippingPrice,
            total: calculatedTotalPrice
        });

        // Create Razorpay order with verified total
        let razorpayOrder = null;
        if (paymentMethod === 'razorpay') {
            console.log('Creating Razorpay order...');
            try {
                razorpayOrder = await createRazorpayOrder(calculatedTotalPrice);
                console.log('Razorpay order created:', razorpayOrder.id);
            } catch (rpError) {
                console.error('Razorpay Error:', rpError);
                throw new Error('Payment gateway initialization failed');
            }
        }

        // Create order with server-calculated prices
        console.log('Saving order to DB...');
        const order = await Order.create({
            user: req.user._id,
            orderItems: verifiedOrderItems,
            shippingAddress,
            paymentInfo: {
                method: paymentMethod || 'razorpay',
                razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
                status: paymentMethod === 'cod' ? 'pending' : 'pending',
            },
            itemsPrice: calculatedItemsPrice,
            taxPrice: calculatedTaxPrice,
            shippingPrice: calculatedShippingPrice,
            totalPrice: calculatedTotalPrice,
            discountPrice: calculatedDiscount,
            coupon: appliedCoupon
        });

        console.log('Order saved successfully:', order._id);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order,
                razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
                razorpayKeyId: getRazorpayKeyId(),
            },
        });
    } catch (error) {
        console.error('Create order error stack:', error.stack);
        console.error('Create order error message:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message,
        });
    }
};

/**
 * @desc    Verify payment and update order
 * @route   POST /api/orders/:id/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
    console.log('--- Verify Payment Started ---');
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        console.log('Params:', { razorpayOrderId, razorpayPaymentId, signatureLength: razorpaySignature?.length });

        const order = await Order.findById(req.params.id);
        console.log('Order found:', order ? order._id : 'null');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Verify user owns this order
        console.log('Verifying user ownership:', order.user, req.user._id);
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order',
            });
        }

        // Verify signature (mock)
        console.log('Calling verifyRazorpaySignature...');
        const isValid = verifyRazorpaySignature({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });
        console.log('Signature valid:', isValid);

        if (!isValid) {
            order.paymentInfo.status = 'failed';
            await order.save();

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Update order with payment details
        order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
        order.paymentInfo.razorpaySignature = razorpaySignature;
        order.paymentInfo.status = 'completed';
        order.orderStatus = 'processing';

        // Stock update removed - handled in createOrder atomically
        console.log('Stock already deducted in createOrder');

        console.log('Updating coupon...');
        // Update usage count for coupon
        if (order.coupon) {
            await Coupon.findByIdAndUpdate(order.coupon, {
                $inc: { usedCount: 1 },
                $push: {
                    usedBy: {
                        user: req.user._id,
                        count: 1 // simplified, tracking individual uses
                    }
                }
            });
        }

        await order.save();
        console.log('Order saved.');

        // Send order confirmation email
        try {
            const user = await User.findById(req.user._id);
            if (user && user.email) {
                console.log('📧 Sending order confirmation email to:', user.email);
                await sendOrderConfirmationEmail(user.email, order, user.name);
                console.log('✅ Order confirmation email sent successfully');
            }
        } catch (emailError) {
            console.error('❌ Failed to send order confirmation email:', emailError.message);
            // Don't throw - email failure shouldn't affect order processing
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: order,
        });
    } catch (error) {
        console.error('Create order error stack:', error.stack);
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message,
        });
    }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('orderItems.product', 'title images');

        const total = await Order.countDocuments({ user: req.user._id });

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: orders,
        });
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'title images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if user owns this order or is admin
        if (
            order.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order',
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message,
        });
    }
};

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status',
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.orderStatus = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        if (status === 'cancelled') {
            order.cancelledAt = Date.now();
            order.cancellationReason = req.body.reason || 'Cancelled by admin';
        }

        // Add to tracking history
        const { location, message, carrier, trackingId, trackingUrl } = req.body;

        if (carrier) order.trackingDetails.carrier = carrier;
        if (trackingId) order.trackingDetails.trackingId = trackingId;
        if (trackingUrl) order.trackingDetails.trackingUrl = trackingUrl;

        order.trackingDetails.history.push({
            status: status === 'shipped' ? 'shipped' :
                status === 'delivered' ? 'delivered' :
                    status === 'processing' ? 'processing' :
                        status === 'cancelled' ? 'cancelled' : 'pending', // Map to enum or use status directly if it matches
            location: location || 'Warehouse',
            message: message || `Order status updated to ${status}`,
            timestamp: Date.now()
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order,
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};

        // Filter by status
        if (req.query.status) {
            query.orderStatus = req.query.status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email')
            .populate('orderItems.product', 'title');

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: orders,
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    getAllOrders,
};
