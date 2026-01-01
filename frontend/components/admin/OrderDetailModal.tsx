import { useEffect, useState } from "react";
import { getAdminOrderById, Order } from "@/lib/api/admin";
import OrderPrintTemplate from "./OrderPrintTemplate";

interface OrderDetailModalProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        const response = await getAdminOrderById(orderId);
        if (response.success && response.data) {
            setOrder(response.data);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        const colors = {
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            processing: "bg-blue-50 text-blue-700 border-blue-200",
            shipped: "bg-purple-50 text-purple-700 border-purple-200",
            delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
            cancelled: "bg-rose-50 text-rose-700 border-rose-200",
        };
        return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const getPaymentStatusColor = (status: string) => {
        const colors = {
            paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
            completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            failed: "bg-rose-50 text-rose-700 border-rose-200",
        };
        return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
            {/* Premium Backdrop */}
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Elegant Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Order Details
                                </h2>
                                {order && (
                                    <p className="text-sm text-gray-500 mt-1.5 font-medium">
                                        Order ID: <span className="font-mono text-gray-700">#{order._id.slice(-8).toUpperCase()}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 group"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] bg-gray-50/30">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                                </div>
                                <p className="mt-4 text-gray-500 font-medium">Loading order details...</p>
                            </div>
                        ) : order ? (
                            <div className="space-y-6">
                                {/* Status Cards - Premium Design */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Order Status
                                        </p>
                                        <span
                                            className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold capitalize border ${getStatusColor(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Payment Status
                                        </p>
                                        <span
                                            className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold capitalize border ${getPaymentStatusColor(
                                                order.paymentInfo.status
                                            )}`}
                                        >
                                            {order.paymentInfo.status}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Order Date
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Information - Premium Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Customer Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Name</p>
                                            <p className="text-sm font-semibold text-gray-900">{order.user.name}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</p>
                                            <p className="text-sm font-semibold text-gray-900">{order.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address - Premium Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-2">
                                        <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                                        <p className="text-sm text-gray-700">{order.shippingAddress.address}</p>
                                        <p className="text-sm text-gray-700">
                                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                            {order.shippingAddress.postalCode}
                                        </p>
                                        <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                                        <p className="text-sm font-semibold text-gray-900 pt-2 border-t border-gray-200">
                                            📞 {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Information - Premium Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Method</p>
                                            <p className="text-sm font-semibold text-gray-900 capitalize">{order.paymentInfo.method}</p>
                                        </div>
                                        {order.paymentInfo.razorpayOrderId && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Razorpay Order ID</p>
                                                <p className="text-sm font-mono text-gray-900">{order.paymentInfo.razorpayOrderId}</p>
                                            </div>
                                        )}
                                        {order.paymentInfo.razorpayPaymentId && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment ID</p>
                                                <p className="text-sm font-mono text-gray-900">{order.paymentInfo.razorpayPaymentId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items - Premium Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
                                            {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {order.orderItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow"
                                            >
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 truncate">{item.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Qty: <span className="font-semibold">{item.quantity}</span> × ₹{item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                        ₹{(item.quantity * item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Summary - Premium Card */}
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg text-white">
                                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                                        <span className="text-2xl">💰</span>
                                        Price Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm pb-3 border-b border-gray-700">
                                            <span className="text-gray-300">Items Subtotal</span>
                                            <span className="font-semibold text-white">₹{order.itemsPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pb-3 border-b border-gray-700">
                                            <span className="text-gray-300">Tax</span>
                                            <span className="font-semibold text-white">₹{order.taxPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pb-4 border-b border-gray-700">
                                            <span className="text-gray-300">Shipping</span>
                                            <span className="font-semibold text-white">₹{order.shippingPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-xl font-bold text-white">Total Amount</span>
                                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                                ₹{order.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">Order not found</p>
                            </div>
                        )}
                    </div>

                    {/* Premium Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-5">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => window.print()}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Order
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>

                {/* Print Template - Hidden on screen, shown when printing */}
                {order && <OrderPrintTemplate order={order} />}
            </div>
        </div>
    );
}
