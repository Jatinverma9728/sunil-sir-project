const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Course = require('../../models/Course');
const PDFDocument = require('pdfkit');

/**
 * Analytics Controller
 * Provides comprehensive analytics data for admin dashboard
 */

/**
 * @desc    Get revenue analytics
 * @route   GET /api/admin/analytics/revenue
 * @access  Private/Admin
 */
const getRevenueAnalytics = async (req, res) => {
    try {
        const { period = '30days' } = req.query;

        // Calculate date range
        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        // Get orders within date range
        const orders = await Order.find({
            createdAt: { $gte: startDate },
            'paymentInfo.status': 'completed',
        }).sort({ createdAt: 1 });

        // Calculate daily revenue
        const dailyRevenue = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalPrice;
        });

        // Convert to array format for charts
        const revenueData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
            date,
            revenue: parseFloat(revenue.toFixed(2)),
        }));

        // Calculate totals
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate previous period for comparison
        const previousStartDate = new Date(startDate);
        const periodDays = Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24));
        previousStartDate.setDate(previousStartDate.getDate() - periodDays);

        const previousOrders = await Order.find({
            createdAt: { $gte: previousStartDate, $lt: startDate },
            'paymentInfo.status': 'completed',
        });

        const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const revenueGrowth = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
            : 100;

        res.status(200).json({
            success: true,
            data: {
                period,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                totalOrders,
                averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
                revenueGrowth: parseFloat(revenueGrowth),
                revenueData,
            },
        });
    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue analytics',
            error: error.message,
        });
    }
};

/**
 * @desc    Get user analytics
 * @route   GET /api/admin/analytics/users
 * @access  Private/Admin
 */
const getUserAnalytics = async (req, res) => {
    try {
        const { period = '30days' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        // Total users
        const totalUsers = await User.countDocuments();

        // New users in period
        const newUsers = await User.find({
            createdAt: { $gte: startDate }
        });

        // Daily user registrations
        const dailyRegistrations = {};
        newUsers.forEach(user => {
            const date = user.createdAt.toISOString().split('T')[0];
            dailyRegistrations[date] = (dailyRegistrations[date] || 0) + 1;
        });

        const registrationData = Object.entries(dailyRegistrations).map(([date, count]) => ({
            date,
            registrations: count,
        }));

        // Users by role
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = totalUsers - adminUsers;

        // Calculate previous period
        const periodDays = Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24));
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - periodDays);

        const previousNewUsers = await User.countDocuments({
            createdAt: { $gte: previousStartDate, $lt: startDate }
        });

        const userGrowth = previousNewUsers > 0
            ? ((newUsers.length - previousNewUsers) / previousNewUsers * 100).toFixed(1)
            : 100;

        res.status(200).json({
            success: true,
            data: {
                period,
                totalUsers,
                verifiedUsers,
                newUsersCount: newUsers.length,
                userGrowth: parseFloat(userGrowth),
                adminUsers,
                regularUsers,
                registrationData,
            },
        });
    } catch (error) {
        console.error('User analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user analytics',
            error: error.message,
        });
    }
};

/**
 * @desc    Get product analytics
 * @route   GET /api/admin/analytics/products
 * @access  Private/Admin
 */
const getProductAnalytics = async (req, res) => {
    try {
        const { period = '30days' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        // Total products
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ isActive: true });
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });
        const lowStockProducts = await Product.countDocuments({
            stock: { $gt: 0, $lte: 10 }
        });

        // Orders in period
        const orders = await Order.find({
            createdAt: { $gte: startDate },
            'paymentInfo.status': 'completed',
        });

        // Calculate best sellers
        const productSales = {};
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const productId = item.product?.toString() || item.title;
                if (!productSales[productId]) {
                    productSales[productId] = {
                        productId,
                        title: item.title,
                        quantity: 0,
                        revenue: 0,
                    };
                }
                productSales[productId].quantity += item.quantity;
                productSales[productId].revenue += item.price * item.quantity;
            });
        });

        const bestSellers = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map(p => ({
                ...p,
                revenue: parseFloat(p.revenue.toFixed(2)),
            }));

        // Products by category
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                }
            },
            { $sort: { count: -1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                period,
                totalProducts,
                activeProducts,
                outOfStockProducts,
                lowStockProducts,
                bestSellers,
                categoryStats: categoryStats.map(c => ({
                    category: c._id || 'Uncategorized',
                    count: c.count,
                    avgPrice: parseFloat((c.avgPrice || 0).toFixed(2)),
                })),
            },
        });
    } catch (error) {
        console.error('Product analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product analytics',
            error: error.message,
        });
    }
};

/**
 * @desc    Get course analytics
 * @route   GET /api/admin/analytics/courses
 * @access  Private/Admin
 */
const getCourseAnalytics = async (req, res) => {
    try {
        const { period = '30days' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        // Total courses
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const freeCourses = await Course.countDocuments({ price: 0 });
        const paidCourses = await Course.countDocuments({ price: { $gt: 0 } });

        // Get courses with enrollment data
        const courses = await Course.find().select('title price enrolledStudents createdAt');

        const totalEnrollments = courses.reduce((sum, course) =>
            sum + (course.enrolledStudents?.length || 0), 0);

        // Top courses by enrollment
        const topCourses = courses
            .map(course => ({
                title: course.title,
                price: course.price,
                enrollments: course.enrolledStudents?.length || 0,
            }))
            .sort((a, b) => b.enrollments - a.enrollments)
            .slice(0, 10);

        // Calculate revenue from courses
        const courseRevenue = courses.reduce((sum, course) => {
            const enrollments = course.enrolledStudents?.length || 0;
            return sum + (course.price * enrollments);
        }, 0);

        res.status(200).json({
            success: true,
            data: {
                period,
                totalCourses,
                publishedCourses,
                freeCourses,
                paidCourses,
                totalEnrollments,
                courseRevenue: parseFloat(courseRevenue.toFixed(2)),
                topCourses,
            },
        });
    } catch (error) {
        console.error('Course analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching course analytics',
            error: error.message,
        });
    }
};

/**
 * @desc    Get dashboard overview
 * @route   GET /api/admin/analytics/overview
 * @access  Private/Admin
 */
const getDashboardOverview = async (req, res) => {
    try {
        // Quick stats for dashboard
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalCourses,
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Course.countDocuments(),
        ]);

        // Revenue from completed orders
        const completedOrders = await Order.find({
            'paymentInfo.status': 'completed',
        });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today },
        });
        const todayRevenue = await Order.find({
            createdAt: { $gte: today },
            'paymentInfo.status': 'completed',
        });
        const todayRevenueTotal = todayRevenue.reduce((sum, order) => sum + order.totalPrice, 0);

        // Pending orders
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalCourses,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                todayOrders,
                todayRevenue: parseFloat(todayRevenueTotal.toFixed(2)),
                pendingOrders,
                processingOrders,
            },
        });
    } catch (error) {
        console.error('Dashboard overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard overview',
            error: error.message,
        });
    }
};

/**
 * @desc    Export orders to CSV
 * @route   GET /api/admin/analytics/export/orders
 * @access  Private/Admin
 */
const exportOrdersCSV = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Generate CSV
        const csvHeaders = [
            'Order ID',
            'Date',
            'Customer Name',
            'Customer Email',
            'Items',
            'Subtotal',
            'Shipping',
            'Tax',
            'Total',
            'Payment Status',
            'Order Status',
        ].join(',');

        const csvRows = orders.map(order => [
            order._id,
            order.createdAt.toISOString(),
            order.user?.name || 'N/A',
            order.user?.email || 'N/A',
            order.orderItems.length,
            order.itemsPrice,
            order.shippingPrice,
            order.taxPrice,
            order.totalPrice,
            order.paymentInfo?.status || 'N/A',
            order.orderStatus,
        ].join(','));

        const csvContent = [csvHeaders, ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orders_export_${Date.now()}.csv`);
        res.send(csvContent);
    } catch (error) {
        console.error('Export orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting orders',
            error: error.message,
        });
    }
};

/**
 * @desc    Export users to CSV
 * @route   GET /api/admin/analytics/export/users
 * @access  Private/Admin
 */
const exportUsersCSV = async (req, res) => {
    try {
        const users = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 });

        // Generate CSV
        const csvHeaders = [
            'User ID',
            'Name',
            'Email',
            'Role',
            'Registered Date',
        ].join(',');

        const csvRows = users.map(user => [
            user._id,
            `"${user.name}"`,
            user.email,
            user.role,
            user.createdAt.toISOString(),
        ].join(','));

        const csvContent = [csvHeaders, ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=users_export_${Date.now()}.csv`);
        res.send(csvContent);
    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting users',
            error: error.message,
        });
    }
};

/**
 * @desc    Export orders to PDF
 * @route   GET /api/admin/analytics/export/orders-pdf
 * @access  Private/Admin
 */
const exportOrdersPDF = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=orders_report_${Date.now()}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('Orders Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Summary
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        doc.fontSize(14).font('Helvetica-Bold').text('Summary');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Orders: ${orders.length}`);
        doc.text(`Total Revenue: Rs. ${totalRevenue.toFixed(2)}`);
        doc.moveDown(2);

        // Orders table header
        doc.fontSize(12).font('Helvetica-Bold').text('Order Details');
        doc.moveDown();

        // Table headers
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Order ID', 50, tableTop);
        doc.text('Customer', 150, tableTop);
        doc.text('Date', 280, tableTop);
        doc.text('Status', 360, tableTop);
        doc.text('Total', 450, tableTop);

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table rows
        let yPosition = tableTop + 25;
        doc.font('Helvetica').fontSize(8);

        orders.forEach((order, index) => {
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }

            doc.text(order._id.toString().slice(-8), 50, yPosition);
            doc.text(order.user?.name || 'N/A', 150, yPosition);
            doc.text(order.createdAt.toLocaleDateString(), 280, yPosition);
            doc.text(order.orderStatus, 360, yPosition);
            doc.text(`Rs. ${order.totalPrice.toFixed(2)}`, 450, yPosition);

            yPosition += 18;
        });

        doc.end();
    } catch (error) {
        console.error('Export orders PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting orders PDF',
            error: error.message,
        });
    }
};

/**
 * @desc    Export analytics report to PDF
 * @route   GET /api/admin/analytics/export/report-pdf
 * @access  Private/Admin
 */
const exportAnalyticsReportPDF = async (req, res) => {
    try {
        // Gather all analytics data
        const [
            totalUsers,
            verifiedUsers,
            totalProducts,
            activeProducts,
            outOfStockProducts,
            totalOrders,
            totalCourses,
            publishedCourses,
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Product.countDocuments({ isActive: true }),
            Product.countDocuments({ stock: 0 }),
            Order.countDocuments(),
            Course.countDocuments(),
            Course.countDocuments({ isPublished: true }),
        ]);

        // Revenue data
        const completedOrders = await Order.find({ 'paymentInfo.status': 'completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

        // Today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

        // Best sellers
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const recentOrders = await Order.find({
            createdAt: { $gte: last30Days },
            'paymentInfo.status': 'completed',
        });

        const productSales = {};
        recentOrders.forEach(order => {
            order.orderItems.forEach(item => {
                const title = item.title;
                if (!productSales[title]) {
                    productSales[title] = { title, quantity: 0, revenue: 0 };
                }
                productSales[title].quantity += item.quantity;
                productSales[title].revenue += item.price * item.quantity;
            });
        });

        const bestSellers = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=analytics_report_${Date.now()}.pdf`);

        doc.pipe(res);

        // Title
        doc.fontSize(28).font('Helvetica-Bold').text('Analytics Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').fillColor('#666666')
            .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.fillColor('#000000');
        doc.moveDown(2);

        // Revenue Section
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#2563eb').text('Revenue Overview');
        doc.fillColor('#000000');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#2563eb');
        doc.moveDown();

        doc.fontSize(11).font('Helvetica');
        doc.text(`Total Revenue: Rs. ${totalRevenue.toFixed(2)}`);
        doc.text(`Total Orders: ${totalOrders}`);
        doc.text(`Completed Orders: ${completedOrders.length}`);
        doc.text(`Average Order Value: Rs. ${avgOrderValue.toFixed(2)}`);
        doc.text(`Today's Orders: ${todayOrders}`);
        doc.moveDown(2);

        // Users Section
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#7c3aed').text('User Statistics');
        doc.fillColor('#000000');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#7c3aed');
        doc.moveDown();

        doc.fontSize(11).font('Helvetica');
        doc.text(`Total Users: ${totalUsers}`);
        doc.text(`Verified Users: ${verifiedUsers}`);
        doc.text(`Verification Rate: ${totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0}%`);
        doc.moveDown(2);

        // Products Section
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#059669').text('Product Statistics');
        doc.fillColor('#000000');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#059669');
        doc.moveDown();

        doc.fontSize(11).font('Helvetica');
        doc.text(`Total Products: ${totalProducts}`);
        doc.text(`Active Products: ${activeProducts}`);
        doc.text(`Out of Stock: ${outOfStockProducts}`);
        doc.moveDown(2);

        // Best Sellers Section
        if (bestSellers.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('Top 5 Best Sellers (Last 30 Days)');
            doc.moveDown(0.5);

            bestSellers.forEach((product, index) => {
                doc.fontSize(10).font('Helvetica');
                doc.text(`${index + 1}. ${product.title} - ${product.quantity} sold - Rs. ${product.revenue.toFixed(2)}`);
            });
            doc.moveDown(2);
        }

        // Courses Section
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#dc2626').text('Course Statistics');
        doc.fillColor('#000000');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#dc2626');
        doc.moveDown();

        doc.fontSize(11).font('Helvetica');
        doc.text(`Total Courses: ${totalCourses}`);
        doc.text(`Published Courses: ${publishedCourses}`);
        doc.moveDown(2);

        // Footer
        doc.fontSize(8).fillColor('#999999').text('--- End of Report ---', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Export analytics report PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting analytics report PDF',
            error: error.message,
        });
    }
};

module.exports = {
    getRevenueAnalytics,
    getUserAnalytics,
    getProductAnalytics,
    getCourseAnalytics,
    getDashboardOverview,
    exportOrdersCSV,
    exportUsersCSV,
    exportOrdersPDF,
    exportAnalyticsReportPDF,
};
