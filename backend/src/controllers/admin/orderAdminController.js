const Order = require('../../models/Order');
const Product = require('../../models/Product');

/**
 * @desc    Get all orders with filters (Admin)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};

        if (req.query.status) {
            query.orderStatus = req.query.status;
        }

        if (req.query.paymentStatus) {
            query['paymentInfo.status'] = req.query.paymentStatus;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('orderItems.product', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

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

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { status, reason } = req.body;

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
            order.cancellationReason = reason || 'Cancelled by admin';

            // Restore product stock
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
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
 * @desc    Get order statistics (Admin)
 * @route   GET /api/admin/orders/stats
 * @access  Private/Admin
 */
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
        const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

        // Calculate total revenue
        const completedOrders = await Order.find({
            orderStatus: { $in: ['delivered'] },
            'paymentInfo.status': 'completed',
        });

        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue,
            },
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics',
            error: error.message,
        });
    }
};

module.exports = {
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
};
