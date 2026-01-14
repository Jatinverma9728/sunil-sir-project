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

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        // Validate required fields
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided',
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required',
            });
        }

        // Verify product availability and calculate prices server-side
        let calculatedItemsPrice = 0;
        const verifiedOrderItems = [];

        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.title} is not available`,
                });
            }

            if (product.stock < item.quantity) {
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

        // Calculate prices server-side
        const calculatedTaxPrice = Math.round(calculatedItemsPrice * 0.18 * 100) / 100; // 18% GST
        const calculatedShippingPrice = calculatedItemsPrice > 500 ? 0 : 50; // Free shipping over 500
        const calculatedTotalPrice = calculatedItemsPrice + calculatedTaxPrice + calculatedShippingPrice;

        // Create Razorpay order with verified total
        let razorpayOrder = null;
        if (paymentMethod === 'razorpay') {
            razorpayOrder = await createRazorpayOrder(calculatedTotalPrice);
        }

        // Create order with server-calculated prices
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
        });

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
        console.error('Create order error:', error);
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
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Verify user owns this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order',
            });
        }

        // Verify signature (mock)
        const isValid = verifyRazorpaySignature({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });

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

        // Reduce product stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        await order.save();

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
