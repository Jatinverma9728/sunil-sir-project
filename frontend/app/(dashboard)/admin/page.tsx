"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import CategoryManagement from "@/components/admin/CategoryManagement";
import Modal from "@/components/admin/Modal";
import ProductForm from "@/components/admin/ProductForm";
import CourseForm from "@/components/admin/CourseForm";
import UserForm from "@/components/admin/UserForm";
import PromotionsTab from "@/components/admin/PromotionsTab";
import {
    getAdminDashboardStats,
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    getAdminOrders,
    updateAdminOrderStatus,
    getAdminCourses,
    createAdminCourse,
    updateAdminCourse,
    deleteAdminCourse,
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    getAllCategories,
    Product,
    Order,
    Course,
    User,
    Category,
    ProductFormData,
    CourseFormData,
    UserFormData,
} from "@/lib/api/admin";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type TabType = "overview" | "products" | "categories" | "orders" | "courses" | "users" | "promotions";

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [loading, setLoading] = useState(true);

    // Dashboard stats
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalCourses: 0,
        pendingOrders: 0,
        todayOrders: 0,
        todayRevenue: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        weekRevenue: 0,
        monthRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [productsPage, setProductsPage] = useState(1);
    const [productsTotalPages, setProductsTotalPages] = useState(1);
    const [productsLoading, setProductsLoading] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Categories state
    const [categories, setCategories] = useState<Category[]>([]);

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersTotalPages, setOrdersTotalPages] = useState(1);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [orderStatusFilter, setOrderStatusFilter] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Courses state
    const [courses, setCourses] = useState<Course[]>([]);
    const [coursesPage, setCoursesPage] = useState(1);
    const [coursesTotalPages, setCoursesTotalPages] = useState(1);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Users state
    const [users, setUsers] = useState<User[]>([]);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersSearch, setUsersSearch] = useState("");
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Chart data
    const [chartData, setChartData] = useState<any[]>([]);
    const [statusDistribution, setStatusDistribution] = useState<any[]>([]);

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) {
            return;
        }

        // Debug log
        console.log("Admin page auth check:", { user, role: user?.role });

        if (!user) {
            router.push("/login?redirect=/admin");
            return;
        }
        if (user?.role !== "admin") {
            console.log("User is not admin, redirecting. Role:", user?.role);
            router.push("/");
            return;
        }
        fetchDashboardData();
    }, [user, router, authLoading]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const result = await getAdminDashboardStats();
            if (result.success && result.data) {
                setStats({
                    totalRevenue: result.data.totalRevenue,
                    totalOrders: result.data.totalOrders,
                    totalProducts: result.data.totalProducts,
                    totalUsers: result.data.totalUsers,
                    totalCourses: result.data.totalCourses,
                    pendingOrders: result.data.pendingOrders,
                    todayOrders: result.data.todayOrders || 0,
                    todayRevenue: result.data.todayRevenue || 0,
                    averageOrderValue: result.data.averageOrderValue || 0,
                    revenueGrowth: result.data.revenueGrowth || 0,
                    weekRevenue: result.data.weekRevenue || 0,
                    monthRevenue: result.data.monthRevenue || 0,
                });
                setRecentOrders(result.data.recentOrders);

                // Use real chart data from API or generate sample data
                if (result.data.chartData && result.data.chartData.length > 0) {
                    const formattedChartData = result.data.chartData.map((d: any) => ({
                        date: new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                        revenue: d.revenue,
                        orders: d.orders,
                    }));
                    setChartData(formattedChartData);
                } else {
                    // Generate sample data for last 30 days based on total stats
                    const sampleData = [];
                    for (let i = 29; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        const baseRevenue = result.data.totalRevenue / 30;
                        const baseOrders = result.data.totalOrders / 30;
                        sampleData.push({
                            date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                            revenue: Math.round(baseRevenue * (0.5 + Math.random())),
                            orders: Math.max(0, Math.round(baseOrders * (0.5 + Math.random()))),
                        });
                    }
                    setChartData(sampleData);
                }

                // Set status distribution
                if (result.data.statusDistribution && result.data.statusDistribution.length > 0) {
                    setStatusDistribution(result.data.statusDistribution);
                } else {
                    // Generate from stats
                    const statusData = [
                        { name: 'Pending', value: result.data.pendingOrders || 0, color: '#fbbf24' },
                        { name: 'Delivered', value: Math.floor((result.data.totalOrders || 0) * 0.6), color: '#22c55e' },
                        { name: 'Processing', value: Math.floor((result.data.totalOrders || 0) * 0.2), color: '#3b82f6' },
                        { name: 'Shipped', value: Math.floor((result.data.totalOrders || 0) * 0.1), color: '#8b5cf6' },
                    ].filter(s => s.value > 0);
                    setStatusDistribution(statusData);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    // Products functions
    const fetchProducts = useCallback(async () => {
        setProductsLoading(true);
        try {
            const result = await getAdminProducts(productsPage, 10);
            if (result.success) {
                setProducts(result.data || []);
                setProductsTotalPages(result.pages || 1);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setProductsLoading(false);
        }
    }, [productsPage]);

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        const result = await deleteAdminProduct(id);
        if (result.success) {
            fetchProducts();
        } else {
            alert(result.message || "Failed to delete product");
        }
    };

    // Categories functions
    const fetchCategories = useCallback(async () => {
        try {
            const result = await getAllCategories();
            if (result.success && result.data) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    // Orders functions
    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        try {
            const filters = orderStatusFilter ? { status: orderStatusFilter } : undefined;
            const result = await getAdminOrders(ordersPage, 10, filters);
            if (result.success) {
                setOrders(result.data || []);
                setOrdersTotalPages(result.pages || 1);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setOrdersLoading(false);
        }
    }, [ordersPage, orderStatusFilter]);

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        const result = await updateAdminOrderStatus(orderId, status);
        if (result.success) {
            fetchOrders();
        } else {
            alert(result.message || "Failed to update order status");
        }
    };

    // Courses functions
    const fetchCourses = useCallback(async () => {
        setCoursesLoading(true);
        try {
            const result = await getAdminCourses(coursesPage, 10);
            if (result.success) {
                setCourses(result.data || []);
                setCoursesTotalPages(result.pages || 1);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setCoursesLoading(false);
        }
    }, [coursesPage]);

    const handleDeleteCourse = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        const result = await deleteAdminCourse(id);
        if (result.success) {
            fetchCourses();
        } else {
            alert(result.message || "Failed to delete course");
        }
    };

    // Users functions
    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const result = await getAdminUsers(usersPage, 10, usersSearch);
            if (result.success) {
                setUsers(result.data || []);
                setUsersTotalPages(result.pages || 1);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setUsersLoading(false);
        }
    }, [usersPage, usersSearch]);

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        const result = await deleteAdminUser(id);
        if (result.success) {
            fetchUsers();
        } else {
            alert(result.message || "Failed to delete user");
        }
    };

    // Load data when tab changes
    useEffect(() => {
        fetchCategories(); // Load categories for product form
        if (activeTab === "products") fetchProducts();
        if (activeTab === "orders") fetchOrders();
        if (activeTab === "courses") fetchCourses();
        if (activeTab === "users") fetchUsers();
    }, [activeTab, fetchProducts, fetchOrders, fetchCourses, fetchUsers, fetchCategories]);

    const COLORS = ["#C1FF72", "#2D5A27", "#4CAF50", "#81C784", "#A5D6A7"];

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {[
                            { id: "overview" as TabType, label: "Overview", icon: "📊" },
                            { id: "products" as TabType, label: "Products", icon: "📱" },
                            { id: "categories" as TabType, label: "Categories", icon: "📦" },
                            { id: "orders" as TabType, label: "Orders", icon: "🛒" },
                            { id: "courses" as TabType, label: "Courses", icon: "📚" },
                            { id: "users" as TabType, label: "Users", icon: "👥" },
                            { id: "promotions" as TabType, label: "Promotions", icon: "🎁" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? "text-black border-b-2 border-[#C1FF72] bg-green-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div>
                        {/* Main Stats Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "💰", change: stats.revenueGrowth > 0 ? `+${stats.revenueGrowth}%` : `${stats.revenueGrowth}%`, positive: stats.revenueGrowth >= 0 },
                                { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: "📦", change: `${stats.pendingOrders} pending`, positive: true },
                                { label: "Total Products", value: stats.totalProducts.toLocaleString(), icon: "📱", change: "Active", positive: true },
                                { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: "👥", change: "Registered", positive: true },
                            ].map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl">{stat.icon}</span>
                                        <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Secondary Stats - Today, Week, Month */}
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                                <p className="text-blue-100 text-sm mb-1">Today's Orders</p>
                                <p className="text-2xl font-bold">{stats.todayOrders}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                                <p className="text-green-100 text-sm mb-1">Today's Revenue</p>
                                <p className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                                <p className="text-purple-100 text-sm mb-1">This Month</p>
                                <p className="text-2xl font-bold">₹{stats.monthRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
                                <p className="text-orange-100 text-sm mb-1">Avg Order Value</p>
                                <p className="text-2xl font-bold">₹{stats.averageOrderValue.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                                        <Area type="monotone" dataKey="revenue" stroke="#2D5A27" fill="#C1FF72" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Orders Overview (Last 30 Days)</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#2D5A27" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Additional Charts Row */}
                        <div className="grid lg:grid-cols-3 gap-6 mb-8">
                            {/* Order Status Pie Chart */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h2>
                                {statusDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {statusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                                        No order data available
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                    {statusDistribution.map((status, i) => (
                                        <div key={i} className="flex items-center gap-1 text-xs">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                                            <span>{status.name}: {status.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Revenue vs Orders Combined Chart */}
                            <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue vs Orders Trend</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                                        <YAxis yAxisId="left" orientation="left" stroke="#2D5A27" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                                        <Tooltip />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2D5A27" strokeWidth={2} name="Revenue (₹)" dot={false} />
                                        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Quick Stats Summary */}
                        <div className="grid md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-400">
                                <p className="text-xs text-gray-500 mb-1">Pending</p>
                                <p className="text-xl font-bold">{stats.pendingOrders}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-400">
                                <p className="text-xs text-gray-500 mb-1">This Week</p>
                                <p className="text-xl font-bold">₹{stats.weekRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-400">
                                <p className="text-xs text-gray-500 mb-1">Total Courses</p>
                                <p className="text-xl font-bold">{stats.totalCourses}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-400">
                                <p className="text-xs text-gray-500 mb-1">Growth</p>
                                <p className={`text-xl font-bold ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}%
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-400">
                                <p className="text-xs text-gray-500 mb-1">Conversion</p>
                                <p className="text-xl font-bold">
                                    {stats.totalOrders > 0 && stats.totalUsers > 0
                                        ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) + '%'
                                        : '0%'}
                                </p>
                            </div>
                        </div>
                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    View All →
                                </button>
                            </div>
                            {recentOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                                                    <td className="py-3 px-4">{order.user?.name || "N/A"}</td>
                                                    <td className="py-3 px-4 font-semibold">₹{order.totalPrice?.toFixed(2)}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${order.orderStatus === "delivered"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.orderStatus === "processing"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : order.orderStatus === "shipped"
                                                                        ? "bg-purple-100 text-purple-700"
                                                                        : order.orderStatus === "cancelled"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center py-8 text-gray-500">No recent orders</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setShowProductModal(true);
                                }}
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                + Add Product
                            </button>
                        </div>
                        {productsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">{product.title}</td>
                                                    <td className="py-3 px-4 font-semibold">₹{product.price}</td>
                                                    <td className="py-3 px-4">{product.stock}</td>
                                                    <td className="py-3 px-4 capitalize">{product.category}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {product.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingProduct(product);
                                                                    setShowProductModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-gray-600">
                                        Page {productsPage} of {productsTotalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                                            disabled={productsPage === 1}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setProductsPage((p) => Math.min(productsTotalPages, p + 1))}
                                            disabled={productsPage === productsTotalPages}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center py-12 text-gray-500">No products found</p>
                        )}
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === "categories" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <CategoryManagement />
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
                            <select
                                value={orderStatusFilter}
                                onChange={(e) => {
                                    setOrderStatusFilter(e.target.value);
                                    setOrdersPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        {ordersLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                                                    <td className="py-3 px-4">{order.user?.name || "N/A"}</td>
                                                    <td className="py-3 px-4 font-semibold">₹{order.totalPrice?.toFixed(2)}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentInfo?.status === "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {order.paymentInfo?.status || "pending"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <select
                                                            value={order.orderStatus}
                                                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${order.orderStatus === "delivered"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.orderStatus === "processing"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : order.orderStatus === "shipped"
                                                                        ? "bg-purple-100 text-purple-700"
                                                                        : order.orderStatus === "cancelled"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrderId(order._id);
                                                                setIsOrderModalOpen(true);
                                                            }}
                                                            className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-gray-600">
                                        Page {ordersPage} of {ordersTotalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                                            disabled={ordersPage === 1}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
                                            disabled={ordersPage === ordersTotalPages}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center py-12 text-gray-500">No orders found</p>
                        )}

                        {/* Order Detail Modal */}
                        {selectedOrderId && (
                            <OrderDetailModal
                                orderId={selectedOrderId}
                                isOpen={isOrderModalOpen}
                                onClose={() => {
                                    setIsOrderModalOpen(false);
                                    setSelectedOrderId(null);
                                }}
                            />
                        )}
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === "courses" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
                            <button
                                onClick={() => {
                                    setEditingCourse(null);
                                    setShowCourseModal(true);
                                }}
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                + Add Course
                            </button>
                        </div>
                        {coursesLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                        ) : courses.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Students</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course) => (
                                                <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">{course.title}</td>
                                                    <td className="py-3 px-4 font-semibold">₹{course.price}</td>
                                                    <td className="py-3 px-4">{course.enrolledStudents}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${course.isPublished
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {course.isPublished ? "Published" : "Draft"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCourse(course);
                                                                    setShowCourseModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCourse(course._id)}
                                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-gray-600">
                                        Page {coursesPage} of {coursesTotalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCoursesPage((p) => Math.max(1, p - 1))}
                                            disabled={coursesPage === 1}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCoursesPage((p) => Math.min(coursesTotalPages, p + 1))}
                                            disabled={coursesPage === coursesTotalPages}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center py-12 text-gray-500">No courses found</p>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={usersSearch}
                                    onChange={(e) => setUsersSearch(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setShowUserModal(true);
                                    }}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    + Add User
                                </button>
                            </div>
                        </div>
                        {usersLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                        ) : users.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-[#C1FF72] rounded-full flex items-center justify-center font-bold">
                                                                {u.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-gray-100 text-gray-700"
                                                                }`}
                                                        >
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser(u);
                                                                    setShowUserModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            {u._id !== user?.id && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u._id)}
                                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-gray-600">
                                        Page {usersPage} of {usersTotalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                                            disabled={usersPage === 1}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                                            disabled={usersPage === usersTotalPages}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center py-12 text-gray-500">No users found</p>
                        )}
                    </div>
                )}

                {/* Promotions Tab */}
                {activeTab === "promotions" && <PromotionsTab />}

                {/* Product Modal */}
                <Modal
                    isOpen={showProductModal}
                    onClose={() => setShowProductModal(false)}
                    title={editingProduct ? "Edit Product" : "Add Product"}
                >
                    <ProductForm
                        product={editingProduct}
                        categories={categories}
                        onSubmit={async (data) => {
                            let result;
                            if (editingProduct) {
                                result = await updateAdminProduct(editingProduct._id, data);
                            } else {
                                result = await createAdminProduct(data);
                            }
                            if (result.success) {
                                setShowProductModal(false);
                                setEditingProduct(null);
                                fetchProducts();
                            } else {
                                alert(result.message || "Operation failed. Please try again.");
                            }
                        }}
                        onCancel={() => setShowProductModal(false)}
                    />
                </Modal>

                {/* Course Modal */}
                <Modal
                    isOpen={showCourseModal}
                    onClose={() => setShowCourseModal(false)}
                    title={editingCourse ? "Edit Course" : "Add Course"}
                >
                    <CourseForm
                        course={editingCourse}
                        onSubmit={async (data) => {
                            let result;
                            if (editingCourse) {
                                result = await updateAdminCourse(editingCourse._id, data);
                            } else {
                                result = await createAdminCourse(data);
                            }
                            if (result.success) {
                                setShowCourseModal(false);
                                setEditingCourse(null);
                                fetchCourses();
                            } else {
                                alert(result.message || "Operation failed. Please try again.");
                            }
                        }}
                        onCancel={() => setShowCourseModal(false)}
                    />
                </Modal>

                {/* User Modal */}
                <Modal
                    isOpen={showUserModal}
                    onClose={() => setShowUserModal(false)}
                    title={editingUser ? "Edit User" : "Add User"}
                >
                    <UserForm
                        user={editingUser}
                        onSubmit={async (data) => {
                            let result;
                            if (editingUser) {
                                result = await updateAdminUser(editingUser._id, data);
                            } else {
                                result = await createAdminUser(data);
                            }
                            if (result.success) {
                                setShowUserModal(false);
                                setEditingUser(null);
                                fetchUsers();
                            } else {
                                alert(result.message || "Operation failed. Please try again.");
                            }
                        }}
                        onCancel={() => setShowUserModal(false)}
                    />
                </Modal>
            </div>
        </div>
    );
}
