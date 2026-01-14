"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/api/auth";

interface OverviewData {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalCourses: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    pendingOrders: number;
    processingOrders: number;
}

interface RevenueData {
    period: string;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
    revenueData: { date: string; revenue: number }[];
}

interface UserData {
    period: string;
    totalUsers: number;
    verifiedUsers: number;
    newUsersCount: number;
    userGrowth: number;
    registrationData: { date: string; registrations: number }[];
}

interface ProductData {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    bestSellers: { title: string; quantity: number; revenue: number }[];
    categoryStats: { category: string; count: number; avgPrice: number }[];
}

interface CourseData {
    totalCourses: number;
    publishedCourses: number;
    freeCourses: number;
    paidCourses: number;
    totalEnrollments: number;
    courseRevenue: number;
    topCourses: { title: string; enrollments: number }[];
}

export default function AnalyticsDashboard() {
    const [period, setPeriod] = useState("30days");
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [revenue, setRevenue] = useState<RevenueData | null>(null);
    const [users, setUsers] = useState<UserData | null>(null);
    const [products, setProducts] = useState<ProductData | null>(null);
    const [courses, setCourses] = useState<CourseData | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        const token = getAuthToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            const [overviewRes, revenueRes, usersRes, productsRes, coursesRes] = await Promise.all([
                fetch(`${API_URL}/admin/analytics/overview`, { headers }),
                fetch(`${API_URL}/admin/analytics/revenue?period=${period}`, { headers }),
                fetch(`${API_URL}/admin/analytics/users?period=${period}`, { headers }),
                fetch(`${API_URL}/admin/analytics/products?period=${period}`, { headers }),
                fetch(`${API_URL}/admin/analytics/courses?period=${period}`, { headers }),
            ]);

            const [overviewData, revenueData, usersData, productsData, coursesData] = await Promise.all([
                overviewRes.json(),
                revenueRes.json(),
                usersRes.json(),
                productsRes.json(),
                coursesRes.json(),
            ]);

            if (overviewData.success) setOverview(overviewData.data);
            if (revenueData.success) setRevenue(revenueData.data);
            if (usersData.success) setUsers(usersData.data);
            if (productsData.success) setProducts(productsData.data);
            if (coursesData.success) setCourses(coursesData.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type: "orders" | "users") => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${API_URL}/admin/analytics/export/${type}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type}_export_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export error:", error);
        }
    };

    const handlePDFExport = async (type: "orders-pdf" | "report-pdf") => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${API_URL}/admin/analytics/export/${type}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = type === "orders-pdf" ? `orders_report_${Date.now()}.pdf` : `analytics_report_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF Export error:", error);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat("en-IN").format(num);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Monitor your business performance and insights</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-8">
                {/* Period Selector */}
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="1year">Last Year</option>
                </select>

                {/* CSV Export Buttons */}
                <button
                    onClick={() => handleExport("orders")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                    <span>📊</span> Export Orders CSV
                </button>
                <button
                    onClick={() => handleExport("users")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <span>👥</span> Export Users CSV
                </button>

                {/* PDF Export Buttons */}
                <button
                    onClick={() => handlePDFExport("orders-pdf")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                    <span>📄</span> Orders PDF
                </button>
                <button
                    onClick={() => handlePDFExport("report-pdf")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <span>📑</span> Full Report PDF
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
                {["overview", "revenue", "users", "products", "courses"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition ${activeTab === tab
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && overview && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(overview.totalRevenue)}
                            icon="💰"
                            color="green"
                        />
                        <MetricCard
                            title="Total Orders"
                            value={formatNumber(overview.totalOrders)}
                            icon="📦"
                            color="blue"
                        />
                        <MetricCard
                            title="Total Users"
                            value={formatNumber(overview.totalUsers)}
                            icon="👥"
                            color="purple"
                        />
                        <MetricCard
                            title="Total Products"
                            value={formatNumber(overview.totalProducts)}
                            icon="🛍️"
                            color="orange"
                        />
                    </div>

                    {/* Today's Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Orders</h3>
                            <p className="text-3xl font-bold text-gray-900">{overview.todayOrders}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Revenue</h3>
                            <p className="text-3xl font-bold text-green-600">{formatCurrency(overview.todayRevenue)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Orders</h3>
                            <p className="text-3xl font-bold text-orange-600">{overview.pendingOrders + overview.processingOrders}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Revenue Tab */}
            {activeTab === "revenue" && revenue && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(revenue.totalRevenue)}
                            icon="💰"
                            color="green"
                            subtitle={`${revenue.revenueGrowth > 0 ? "+" : ""}${revenue.revenueGrowth}% vs previous period`}
                        />
                        <MetricCard
                            title="Total Orders"
                            value={formatNumber(revenue.totalOrders)}
                            icon="📦"
                            color="blue"
                        />
                        <MetricCard
                            title="Avg Order Value"
                            value={formatCurrency(revenue.averageOrderValue)}
                            icon="📈"
                            color="purple"
                        />
                        <MetricCard
                            title="Growth"
                            value={`${revenue.revenueGrowth > 0 ? "+" : ""}${revenue.revenueGrowth}%`}
                            icon={revenue.revenueGrowth >= 0 ? "📈" : "📉"}
                            color={revenue.revenueGrowth >= 0 ? "green" : "red"}
                        />
                    </div>

                    {/* Revenue Chart Placeholder */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                        <div className="h-64 flex items-end gap-1">
                            {revenue.revenueData.slice(-30).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-indigo-500 rounded-t hover:bg-indigo-600 transition"
                                    style={{
                                        height: `${(item.revenue / Math.max(...revenue.revenueData.map(d => d.revenue))) * 100}%`,
                                        minHeight: item.revenue > 0 ? "4px" : "0",
                                    }}
                                    title={`${item.date}: ${formatCurrency(item.revenue)}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>{revenue.revenueData[0]?.date}</span>
                            <span>{revenue.revenueData[revenue.revenueData.length - 1]?.date}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && users && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Users"
                            value={formatNumber(users.totalUsers)}
                            icon="👥"
                            color="blue"
                        />
                        <MetricCard
                            title="Verified Users"
                            value={formatNumber(users.verifiedUsers)}
                            icon="✅"
                            color="green"
                        />
                        <MetricCard
                            title="New Users"
                            value={formatNumber(users.newUsersCount)}
                            icon="🆕"
                            color="purple"
                            subtitle={`${users.userGrowth > 0 ? "+" : ""}${users.userGrowth}% growth`}
                        />
                        <MetricCard
                            title="Growth"
                            value={`${users.userGrowth > 0 ? "+" : ""}${users.userGrowth}%`}
                            icon={users.userGrowth >= 0 ? "📈" : "📉"}
                            color={users.userGrowth >= 0 ? "green" : "red"}
                        />
                    </div>

                    {/* Registration Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registrations</h3>
                        <div className="h-48 flex items-end gap-1">
                            {users.registrationData.slice(-30).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition"
                                    style={{
                                        height: `${(item.registrations / Math.max(...users.registrationData.map(d => d.registrations), 1)) * 100}%`,
                                        minHeight: item.registrations > 0 ? "4px" : "0",
                                    }}
                                    title={`${item.date}: ${item.registrations} users`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && products && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Products"
                            value={formatNumber(products.totalProducts)}
                            icon="🛍️"
                            color="blue"
                        />
                        <MetricCard
                            title="Active"
                            value={formatNumber(products.activeProducts)}
                            icon="✅"
                            color="green"
                        />
                        <MetricCard
                            title="Out of Stock"
                            value={formatNumber(products.outOfStockProducts)}
                            icon="⚠️"
                            color="red"
                        />
                        <MetricCard
                            title="Low Stock"
                            value={formatNumber(products.lowStockProducts)}
                            icon="📉"
                            color="orange"
                        />
                    </div>

                    {/* Best Sellers */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Selling Products</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-500">Quantity</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-500">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.bestSellers.map((product, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3 px-4 font-medium text-gray-900">{product.title}</td>
                                            <td className="py-3 px-4 text-right text-gray-600">{product.quantity}</td>
                                            <td className="py-3 px-4 text-right font-medium text-green-600">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
                        <div className="space-y-3">
                            {products.categoryStats.map((cat, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                                            <span className="text-sm text-gray-500">{cat.count} products</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{
                                                    width: `${(cat.count / Math.max(...products.categoryStats.map(c => c.count))) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && courses && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Courses"
                            value={formatNumber(courses.totalCourses)}
                            icon="🎓"
                            color="purple"
                        />
                        <MetricCard
                            title="Published"
                            value={formatNumber(courses.publishedCourses)}
                            icon="✅"
                            color="green"
                        />
                        <MetricCard
                            title="Total Enrollments"
                            value={formatNumber(courses.totalEnrollments)}
                            icon="👤"
                            color="blue"
                        />
                        <MetricCard
                            title="Course Revenue"
                            value={formatCurrency(courses.courseRevenue)}
                            icon="💰"
                            color="green"
                        />
                    </div>

                    {/* Top Courses */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses by Enrollment</h3>
                        <div className="space-y-3">
                            {courses.topCourses.map((course, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{course.title}</p>
                                    </div>
                                    <span className="text-sm font-medium text-indigo-600">
                                        {course.enrollments} enrolled
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: string;
    color: "green" | "blue" | "purple" | "orange" | "red";
    subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
    const colorClasses = {
        green: "bg-green-50 border-green-200",
        blue: "bg-blue-50 border-blue-200",
        purple: "bg-purple-50 border-purple-200",
        orange: "bg-orange-50 border-orange-200",
        red: "bg-red-50 border-red-200",
    };

    return (
        <div className={`rounded-xl p-6 border ${colorClasses[color]} shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    );
}
