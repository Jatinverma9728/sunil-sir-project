"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import OrderTracker from "@/components/orders/OrderTracker";
import OrderPrintTemplate from "@/components/admin/OrderPrintTemplate";
import { ChevronRight, FileText, MapPin, HelpCircle, Truck, RotateCcw, ExternalLink, Package } from "lucide-react";

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
    variant?: string;
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
    estimatedDelivery?: string;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate estimated delivery (7 days from order for demo)
    const getEstimatedDelivery = () => {
        if (order?.estimatedDelivery) return order.estimatedDelivery;
        if (order?.createdAt) {
            const date = new Date(order.createdAt);
            date.setDate(date.getDate() + 7);
            return date.toISOString();
        }
        return '';
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-500 mb-6">{error || "The order you are looking for does not exist."}</p>
                    <Link
                        href="/orders"
                        className="inline-block px-6 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 md:py-10">
            {/* Print Template */}
            <OrderPrintTemplate order={order as any} />

            <div className="max-w-6xl mx-auto px-4 print:hidden">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 pb-0">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                            <Link href="/" className="hover:text-gray-600">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/orders" className="hover:text-gray-600">Orders</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-600">ID {order._id.slice(-10)}</span>
                        </div>

                        {/* Order ID & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Order ID: {order._id.slice(-13).toUpperCase()}
                            </h1>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Invoice
                                </button>
                                {order.trackingDetails?.trackingUrl ? (
                                    <a
                                        href={order.trackingDetails.trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                                    >
                                        Track order
                                        <MapPin className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg">
                                        Track order
                                        <MapPin className="w-4 h-4" />
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Order & Delivery Dates */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                            <span className="text-gray-500">
                                Order date: <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-indigo-600">
                                <Truck className="w-4 h-4" />
                                Estimated delivery: <span className="font-medium">{formatDate(getEstimatedDelivery())}</span>
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-b border-gray-100">
                        <OrderTracker
                            currentStatus={order.orderStatus}
                            trackingHistory={order.trackingDetails?.history}
                            estimatedDelivery={getEstimatedDelivery()}
                        />
                    </div>

                    {/* Order Items */}
                    <div className="p-6 md:p-8 border-b border-gray-100">
                        <div className="space-y-5">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 md:gap-6">
                                    {/* Image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 text-base md:text-lg line-clamp-1">{item.title}</h3>
                                        {item.variant && (
                                            <p className="text-sm text-gray-400 mt-0.5">{item.variant}</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-gray-900 text-lg">₹{item.price.toLocaleString()}</p>
                                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment & Delivery Section */}
                    <div className="p-6 md:p-8 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Payment */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">Payment</h3>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span className="capitalize">{order.paymentInfo.method}</span>
                                    {order.paymentInfo.method.toLowerCase().includes('card') && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">VISA</span>
                                    )}
                                </div>
                            </div>

                            {/* Delivery */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">Delivery</h3>
                                <div className="text-sm text-gray-500">
                                    <p className="text-gray-400 text-xs mb-1">Address</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                    <p>{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help & Summary Section */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Need Help */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-4">Need Help</h3>
                                <div className="space-y-3">
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                        <HelpCircle className="w-4 h-4" />
                                        <span>Order Issues</span>
                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                    </a>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                        <Truck className="w-4 h-4" />
                                        <span>Delivery Info</span>
                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                    </a>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                        <RotateCcw className="w-4 h-4" />
                                        <span>Returns</span>
                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                    </a>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-4">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900">₹{order.itemsPrice.toLocaleString()}</span>
                                    </div>
                                    {order.discountPrice > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Discount</span>
                                            <span className="text-gray-900">- ₹{order.discountPrice.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Delivery</span>
                                        <span className="text-gray-900">₹{order.shippingPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tax</span>
                                        <span className="text-gray-900">+ ₹{order.taxPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-gray-900 text-xl">₹{order.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        }>
            <OrderDetailContent />
        </Suspense>
    );
}
