const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');
const { sendShippingUpdateEmail } = require('../../utils/email');

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
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total
            },
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
 * @desc    Get single order by ID (Admin)
 * @route   GET /api/admin/orders/:id
 * @access  Private/Admin
 */
const getOrderById = async (req, res) => {
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

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details',
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

        // Send shipping email when status changes to shipped
        if (status === 'shipped') {
            order.shippedAt = Date.now();
            try {
                const user = await User.findById(order.user);
                if (user && user.email) {
                    await sendShippingUpdateEmail(user.email, order, user.name);
                    console.log(`📧 Shipping update email sent for order ${order._id}`);
                }
            } catch (emailError) {
                console.error('❌ Failed to send shipping email:', emailError);
            }
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
        // Basic counts
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
        const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

        // Calculate total revenue from all completed payments
        const paidOrders = await Order.find({
            'paymentInfo.status': 'completed',
        });
        const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

        // Today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
        const todayPaidOrders = await Order.find({
            createdAt: { $gte: today },
            'paymentInfo.status': 'completed',
        });
        const todayRevenue = todayPaidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // This week's stats
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weekOrders = await Order.find({
            createdAt: { $gte: weekStart },
            'paymentInfo.status': 'completed',
        });
        const weekRevenue = weekOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // This month's stats
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const monthOrders = await Order.find({
            createdAt: { $gte: monthStart },
            'paymentInfo.status': 'completed',
        });
        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Get daily revenue/orders for last 30 days (for charts)
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const recentOrders = await Order.find({
            createdAt: { $gte: last30Days },
        }).sort({ createdAt: 1 });

        // Group by date
        const dailyStats = {};
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dateStr = date.toISOString().split('T')[0];
            dailyStats[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
        }

        recentOrders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                dailyStats[dateStr].orders += 1;
                if (order.paymentInfo?.status === 'completed') {
                    dailyStats[dateStr].revenue += order.totalPrice;
                }
            }
        });

        const chartData = Object.values(dailyStats).map(d => ({
            ...d,
            revenue: parseFloat(d.revenue.toFixed(2)),
        }));

        // Calculate growth (compare last 15 days with previous 15 days)
        const mid = Math.floor(chartData.length / 2);
        const firstHalfRevenue = chartData.slice(0, mid).reduce((sum, d) => sum + d.revenue, 0);
        const secondHalfRevenue = chartData.slice(mid).reduce((sum, d) => sum + d.revenue, 0);
        const revenueGrowth = firstHalfRevenue > 0
            ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue * 100).toFixed(1)
            : secondHalfRevenue > 0 ? 100 : 0;

        // Order status distribution (for pie chart)
        const statusDistribution = [
            { name: 'Pending', value: pendingOrders, color: '#fbbf24' },
            { name: 'Processing', value: processingOrders, color: '#3b82f6' },
            { name: 'Shipped', value: shippedOrders, color: '#8b5cf6' },
            { name: 'Delivered', value: deliveredOrders, color: '#22c55e' },
            { name: 'Cancelled', value: cancelledOrders, color: '#ef4444' },
        ].filter(s => s.value > 0);

        // Payment method distribution
        const paymentMethodStats = await Order.aggregate([
            { $match: { 'paymentInfo.status': 'completed' } },
            { $group: { _id: '$paymentInfo.method', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                // Basic counts
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                // Revenue stats
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
                // Time-based stats
                todayOrders,
                todayRevenue: parseFloat(todayRevenue.toFixed(2)),
                weekRevenue: parseFloat(weekRevenue.toFixed(2)),
                weekOrders: weekOrders.length,
                monthRevenue: parseFloat(monthRevenue.toFixed(2)),
                monthOrders: monthOrders.length,
                // Growth
                revenueGrowth: parseFloat(revenueGrowth),
                // Chart data (daily for last 30 days)
                chartData,
                // Distributions
                statusDistribution,
                paymentMethodStats: paymentMethodStats.map(p => ({
                    method: p._id || 'unknown',
                    count: p.count,
                    revenue: parseFloat(p.revenue.toFixed(2)),
                })),
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
    getOrderById,
    updateOrderStatus,
    getOrderStats,
};
