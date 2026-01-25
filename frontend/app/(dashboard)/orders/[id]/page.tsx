"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import OrderTracker from "@/components/orders/OrderTracker";
import OrderPrintTemplate from "@/components/admin/OrderPrintTemplate";

// Define a local Order interface that is compatible enough for now.
// Ideally we should export this from a shared type file.
interface OrderItem {
    product: {
        _id: string;
        title: string;
        images: { url: string }[];
    } | null;
    title: string;
    quantity: number;
    price: number;
    image?: string;
}

interface TrackingHistory {
    status: string;
    location: string;
    message: string;
    timestamp: string;
}

interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    orderItems: OrderItem[];
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentInfo: {
        status: string;
        method: string;
        razorpayOrderId?: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    discountPrice: number;
    totalPrice: number;
    orderStatus: string;
    createdAt: string;
    trackingDetails?: {
        carrier: string;
        trackingId: string;
        trackingUrl: string;
        history: TrackingHistory[];
    };
}

function OrderDetailContent() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push(`/login?redirect=/orders/${id}`);
            return;
        }
        fetchOrder();
    }, [id, user, authLoading, router]);

    const fetchOrder = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.message || "Failed to fetch order");
            }
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = () => {
        window.print();
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl font-light text-gray-900 mb-4">Order Not Found</h1>
                    <p className="text-gray-500 mb-8">{error || "The order you are looking for does not exist."}</p>
                    <Link
                        href="/orders"
                        className="px-6 py-3 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-12">

            {/* Render Print Template (Hidden by default, visible in print) */}
            {/* Coerce type as the admin interface might differ slightly in strictness but structure matches */}
            <OrderPrintTemplate order={order as any} />

            <div className="max-w-6xl mx-auto px-6 print:hidden">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/orders"
                        className="text-xs font-medium text-gray-400 hover:text-gray-900 uppercase tracking-wider mb-4 inline-flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                        Back to Orders
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900 mb-2">Order #{order._id.slice(-8).toUpperCase()}</h1>
                            <p className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {order.trackingDetails?.trackingUrl && (
                                <a
                                    href={order.trackingDetails.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    Track on Carrier Site
                                </a>
                            )}

                            {/* Download Invoice Button - Only if Delivered */}
                            {order.orderStatus === 'delivered' ? (
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="px-6 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Invoice
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="px-6 py-3 bg-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider rounded-full cursor-not-allowed flex items-center gap-2"
                                    title="Invoice available after delivery"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Invoice Locked
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Tracker */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Status</h2>
                            <OrderTracker
                                currentStatus={order.orderStatus}
                                trackingHistory={order.trackingDetails?.history}
                            />
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Items Ordered</h2>
                            <div className="space-y-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">📦</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Shipping Address</h3>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p className="font-medium text-gray-900 mb-1">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p className="mt-2 text-gray-500">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Payment Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-medium capitalize">{order.paymentInfo.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize 
                                        ${order.paymentInfo.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                        {order.paymentInfo.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm pb-4 border-b border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">₹{order.itemsPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-gray-900">₹{order.shippingPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="text-gray-900">₹{order.taxPrice.toLocaleString()}</span>
                                </div>
                                {order.discountPrice > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{order.discountPrice.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between pt-4">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-gray-900 text-lg">₹{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        }>
            <OrderDetailContent />
        </Suspense>
    );
}
