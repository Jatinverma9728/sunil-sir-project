"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import { Package, CheckCircle, ArrowRight, ShoppingBag, ChevronLeft, Truck, Clock, XCircle, ChevronRight } from "lucide-react";

interface Order {
    _id: string;
    orderItems: Array<{
        title: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    totalPrice: number;
    orderStatus: string;
    paymentInfo: {
        status: string;
        method: string;
    };
    createdAt: string;
}

function OrdersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [latestOrder, setLatestOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push("/login?redirect=/orders");
            return;
        }

        fetchOrders();
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/orders/my-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success && data.data) {
                setOrders(data.data);
                if (success === "true" && orderId) {
                    const order = data.data.find((o: Order) => o._id === orderId);
                    if (order) {
                        setLatestOrder(order);
                    }
                } else if (success === "true" && data.data.length > 0) {
                    setLatestOrder(data.data[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    icon: CheckCircle,
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600'
                };
            case 'cancelled':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-700',
                    border: 'border-red-200',
                    icon: XCircle,
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600'
                };
            case 'shipped':
            case 'out_for_delivery':
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700',
                    border: 'border-blue-200',
                    icon: Truck,
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600'
                };
            case 'processing':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-200',
                    icon: Clock,
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    icon: Package,
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600'
                };
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <div className="h-8 w-48 bg-white rounded-xl animate-pulse mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                <div className="h-6 bg-gray-100 rounded-lg w-1/4 mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded-lg w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Success view
    if (success === "true") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg mx-auto px-4 sm:px-6"
                >
                    <div className="bg-white rounded-3xl p-8 md:p-10 text-center shadow-xl shadow-gray-100/50 border border-gray-100">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200"
                        >
                            <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
                        <p className="text-gray-500 mb-8">Thank you for your purchase. Your order has been received.</p>

                        {latestOrder && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 text-left mb-8 border border-gray-100"
                            >
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-sm text-gray-500">Order ID</span>
                                    <span className="font-mono text-sm font-bold text-gray-900">#{latestOrder._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusConfig(latestOrder.orderStatus).bg} ${getStatusConfig(latestOrder.orderStatus).text}`}>
                                        {latestOrder.orderStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-sm text-gray-500">Payment</span>
                                    <span className="text-sm font-medium text-gray-900 capitalize">{latestOrder.paymentInfo?.method || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{latestOrder.totalPrice?.toLocaleString()}
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/products"
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                            <button
                                onClick={() => router.replace("/orders")}
                                className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
                            >
                                View All Orders
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Orders listing view
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Account</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                    </div>
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </Link>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-12 md:p-16 text-center shadow-sm border border-gray-100"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">When you place an order, it will appear here. Start shopping to see your orders!</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02]"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {orders.map((order, index) => {
                                const statusConfig = getStatusConfig(order.orderStatus);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link href={`/orders/${order._id}`} className="block group">
                                            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                                                {/* Mobile-first layout */}
                                                <div className="flex items-start gap-4 mb-4">
                                                    {/* Status Icon */}
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${statusConfig.iconBg}`}>
                                                        <StatusIcon className={`w-6 h-6 ${statusConfig.iconColor}`} />
                                                    </div>

                                                    {/* Order Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm font-bold text-gray-900">
                                                                #{order._id.slice(-8).toUpperCase()}
                                                            </span>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${statusConfig.bg} ${statusConfig.text}`}>
                                                                {order.orderStatus.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>

                                                    {/* Price - visible on all sizes */}
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                            ₹{order.totalPrice?.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Product Images Row */}
                                                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                                                        {order.orderItems?.slice(0, 4).map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-100"
                                                            >
                                                                {item.image ? (
                                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Package className="w-5 h-5 text-gray-300" />
                                                                )}
                                                            </div>
                                                        ))}
                                                        {order.orderItems?.length > 4 && (
                                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-500">
                                                                +{order.orderItems.length - 4}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* View Details CTA - visible on all sizes */}
                                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors flex-shrink-0">
                                                        <span className="hidden sm:inline">View Details</span>
                                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">Loading orders...</p>
                </div>
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
