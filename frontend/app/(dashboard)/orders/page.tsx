"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <div className="h-8 w-48 bg-white rounded-lg animate-pulse mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                <div className="h-6 bg-gray-100 rounded w-1/4 mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
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
            <div className="min-h-screen bg-[#FAFAFA] py-16">
                <div className="max-w-2xl mx-auto px-6">
                    <div className="bg-white rounded-3xl p-10 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">Order Placed Successfully!</h1>
                        <p className="text-gray-500 mb-8">Thank you for your purchase. Your order has been confirmed.</p>

                        {latestOrder && (
                            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Order ID</span>
                                    <span className="font-mono text-sm text-gray-900">{latestOrder._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(latestOrder.orderStatus)}`}>
                                        {latestOrder.orderStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Payment</span>
                                    <span className="text-sm text-gray-900 capitalize">{latestOrder.paymentInfo?.method || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">Total</span>
                                    <span className="text-2xl font-light text-gray-900">
                                        ${latestOrder.totalPrice?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 transition-all"
                            >
                                Continue Shopping
                            </Link>
                            <button
                                onClick={() => router.replace("/orders")}
                                className="px-8 py-4 border border-gray-200 text-gray-700 text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-50 transition-all"
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Orders listing view
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">Account</p>
                        <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">My Orders</h1>
                    </div>
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Profile
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-sm text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <p className="text-2xl font-light text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">{order.orderItems?.length} items</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                        {order.orderItems?.slice(0, 4).map((item, idx) => (
                                            <div key={idx} className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <span className="text-2xl opacity-40">📦</span>
                                                )}
                                            </div>
                                        ))}
                                        {order.orderItems?.length > 4 && (
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-sm text-gray-500">
                                                +{order.orderItems.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
