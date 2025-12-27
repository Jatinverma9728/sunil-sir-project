"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderData {
    _id: string;
    orderItems: Array<{
        title: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    totalPrice: number;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentInfo: {
        method: string;
        status: string;
    };
    orderStatus: string;
    createdAt: string;
}

export default function OrderSuccessPage() {
    const router = useRouter();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to get order from sessionStorage
        const storedOrder = sessionStorage.getItem('lastOrder');
        if (storedOrder) {
            try {
                const parsedOrder = JSON.parse(storedOrder);
                setOrder(parsedOrder);
                // Clear it after reading
                sessionStorage.removeItem('lastOrder');
            } catch (e) {
                console.error("Failed to parse order:", e);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Success Animation */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                        </p>

                        {order && (
                            <>
                                {/* Order Details Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-left mb-6 border border-gray-200">
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                                            <p className="font-mono text-sm font-semibold text-gray-900">{order._id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                                                    ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : new Date().toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Status */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-600">Status</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold capitalize">
                                            {order.orderStatus || 'Pending'}
                                        </span>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-600">Payment Method</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {(() => {
                                                const method = order.paymentInfo?.method?.toLowerCase();
                                                if (method === 'cod') return '💵 Cash on Delivery';
                                                if (method === 'razorpay') return '💳 Razorpay';
                                                if (method === 'card') return '💳 Card Payment';
                                                if (method === 'upi') return '📱 UPI';
                                                return order.paymentInfo?.method || 'Cash on Delivery';
                                            })()}
                                        </span>
                                    </div>

                                    {/* Shipping Address */}
                                    {order.shippingAddress && (
                                        <div className="mb-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Shipping To</p>
                                            <p className="text-sm font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                            <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                            </p>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    {order.orderItems && order.orderItems.length > 0 && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                                            <div className="space-y-2">
                                                {order.orderItems.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-700">
                                                            {item.title} × {item.quantity}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Total */}
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-gray-300">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            ${order.totalPrice?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* What's Next */}
                                <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>✓ You'll receive an order confirmation email</li>
                                        <li>✓ We'll notify you when your order ships</li>
                                        <li>✓ Track your order in your account</li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {!order && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <p className="text-gray-600">
                                    Your order has been placed successfully! Check your email for confirmation details.
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="px-8 py-3 bg-[#C1FF72] text-black font-bold rounded-xl hover:bg-[#b3f064] transition-colors shadow-md hover:shadow-lg"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/orders"
                                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                View All Orders
                            </Link>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="text-center text-sm text-gray-500">
                        <p>
                            Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact our support team</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
