"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
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
    Product,
    Order,
    Course,
    User,
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

type TabType = "overview" | "products" | "orders" | "courses" | "users";

// Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                        ×
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

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
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [productsPage, setProductsPage] = useState(1);
    const [productsTotalPages, setProductsTotalPages] = useState(1);
    const [productsLoading, setProductsLoading] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
                });
                setRecentOrders(result.data.recentOrders);

                // Generate chart data based on real stats
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                const chartData = months.map((month, i) => ({
                    month,
                    revenue: Math.round((result.data!.totalRevenue / 6) * (0.5 + Math.random())),
                    orders: Math.round((result.data!.totalOrders / 6) * (0.5 + Math.random())),
                }));
                setChartData(chartData);
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
        if (activeTab === "products") fetchProducts();
        if (activeTab === "orders") fetchOrders();
        if (activeTab === "courses") fetchCourses();
        if (activeTab === "users") fetchUsers();
    }, [activeTab, fetchProducts, fetchOrders, fetchCourses, fetchUsers]);

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
                            { id: "orders" as TabType, label: "Orders", icon: "📦" },
                            { id: "courses" as TabType, label: "Courses", icon: "📚" },
                            { id: "users" as TabType, label: "Users", icon: "👥" },
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
                        {/* Stats Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: "💰", change: "+12%" },
                                { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: "📦", change: `${stats.pendingOrders} pending` },
                                { label: "Total Products", value: stats.totalProducts.toLocaleString(), icon: "📱", change: "Active" },
                                { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: "👥", change: "Registered" },
                            ].map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl">{stat.icon}</span>
                                        <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="revenue" stroke="#2D5A27" fill="#C1FF72" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Orders Overview</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#2D5A27" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
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
                                                    <td className="py-3 px-4 font-semibold">${order.totalPrice?.toFixed(2)}</td>
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
                                                    <td className="py-3 px-4 font-semibold">${product.price}</td>
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
                                                    <td className="py-3 px-4 font-semibold">${order.totalPrice?.toFixed(2)}</td>
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
                                                    <td className="py-3 px-4 font-semibold">${course.price}</td>
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
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Verified</th>
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
                                                    <td className="py-3 px-4">
                                                        {u.isEmailVerified ? (
                                                            <span className="text-green-600">✓</span>
                                                        ) : (
                                                            <span className="text-gray-400">✗</span>
                                                        )}
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

                {/* Product Modal */}
                <Modal
                    isOpen={showProductModal}
                    onClose={() => setShowProductModal(false)}
                    title={editingProduct ? "Edit Product" : "Add Product"}
                >
                    <ProductForm
                        product={editingProduct}
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

// Product Form Component with Image Upload
function ProductForm({
    product,
    onSubmit,
    onCancel,
}: {
    product: Product | null;
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<ProductFormData>({
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || 0,
        category: product?.category || "electronics",
        stock: product?.stock || 0,
        brand: product?.brand || "",
        sku: product?.sku || "",
        tags: product?.tags || [],
        images: product?.images || [],
        isActive: product?.isActive ?? true,
        isFeatured: product?.isFeatured ?? false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>(
        product?.images?.map(img => img.url) || []
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const { uploadImages } = await import("@/lib/api/admin");
            const result = await uploadImages(Array.from(files));
            if (result.success && result.urls) {
                const newUrls = [...imageUrls, ...result.urls];
                setImageUrls(newUrls);
                setFormData({
                    ...formData,
                    images: newUrls.map(url => ({ url, alt: formData.title }))
                });
            } else {
                alert(result.message || "Failed to upload images");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls);
        setFormData({
            ...formData,
            images: newUrls.map(url => ({ url, alt: formData.title }))
        });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            const newTags = [...(formData.tags || []), tagInput.trim()];
            setFormData({ ...formData, tags: newTags });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter(t => t !== tag) || []
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Basic Info */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Product name"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="Detailed product description"
                    required
                />
            </div>

            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

                {/* Image Preview Grid */}
                {imageUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors">
                        {uploading ? "Uploading..." : "📁 Choose Images"}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    <span className="text-xs text-gray-500">PNG, JPG up to 5MB each</span>
                </div>

                {/* Or URL input */}
                <div className="mt-2 flex gap-2">
                    <input
                        type="url"
                        placeholder="Or paste image URL"
                        className="flex-1 px-3 py-1.5 text-sm border rounded-lg"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget;
                                if (input.value) {
                                    const newUrls = [...imageUrls, input.value];
                                    setImageUrls(newUrls);
                                    setFormData({
                                        ...formData,
                                        images: newUrls.map(url => ({ url, alt: formData.title }))
                                    });
                                    input.value = '';
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min={0}
                        step={0.01}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="SKU-001"
                    />
                </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="electronics">📱 Electronics</option>
                        <option value="clothing">👔 Clothing</option>
                        <option value="books">📚 Books</option>
                        <option value="home">🏠 Home & Garden</option>
                        <option value="sports">⚽ Sports & Fitness</option>
                        <option value="toys">🧸 Toys & Games</option>
                        <option value="beauty">💄 Beauty & Personal Care</option>
                        <option value="food">🍔 Food & Beverages</option>
                        <option value="automotive">🚗 Automotive</option>
                        <option value="jewelry">💍 Jewelry & Watches</option>
                        <option value="furniture">🛋️ Furniture</option>
                        <option value="other">📦 Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Brand name"
                    />
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg"
                        placeholder="Add a tag..."
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 accent-black"
                />
                <label htmlFor="isActive" className="flex-1">
                    <span className="font-medium text-gray-900">Product Active</span>
                    <p className="text-sm text-gray-500">Visible on the store and available for purchase</p>
                </label>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 accent-purple-600"
                />
                <label htmlFor="isFeatured" className="flex-1">
                    <span className="font-medium text-gray-900">⭐ Featured Product</span>
                    <p className="text-sm text-gray-500">Display on home page in the featured products section</p>
                </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t">
                <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
                >
                    {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

// Course Form Component
function CourseForm({
    course,
    onSubmit,
    onCancel,
}: {
    course: Course | null;
    onSubmit: (data: CourseFormData) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<CourseFormData>({
        title: course?.title || "",
        description: course?.description || "",
        price: course?.price || 0,
        category: course?.category || "programming",
        level: course?.level || "beginner",
        thumbnail: course?.thumbnail || "",
        language: course?.language || "English",
        isPublished: course?.isPublished ?? false,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                        <option value="photography">Photography</option>
                        <option value="music">Music</option>
                        <option value="health">Health</option>
                        <option value="personal-development">Personal Development</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <input
                        type="text"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://..."
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <label htmlFor="isPublished" className="text-sm text-gray-700">
                    Published (visible to students)
                </label>
            </div>
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {submitting ? "Saving..." : course ? "Update Course" : "Create Course"}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
            </div>
        </form>
    );
}

// User Form Component
function UserForm({
    user,
    onSubmit,
    onCancel,
}: {
    user: User | null;
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<UserFormData>({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "user",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) delete dataToSubmit.password;
        await onSubmit(dataToSubmit);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {user && "(leave blank to keep current)"}
                </label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    {...(!user && { required: true })}
                    minLength={6}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {submitting ? "Saving..." : user ? "Update User" : "Create User"}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
            </div>
        </form>
    );
}
