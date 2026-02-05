"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { getProducts, Product } from "@/lib/api/products";
import { apiClient } from "@/lib/api/client";

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
        phone: string;
    };
    paymentInfo: {
        method: string;
        status: string;
        razorpayPaymentId?: string;
    };
    orderStatus: string;
    createdAt: string;
    shippingPrice: number;
    taxPrice: number;
    discountPrice?: number;
}

function OrderSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Product[]>([]);

    useEffect(() => {
        const loadOrder = async () => {
            let orderData: OrderData | null = null;
            let orderId: string | null = null;

            // Try to get order from sessionStorage first
            const storedOrder = sessionStorage.getItem('lastOrder');
            if (storedOrder) {
                try {
                    orderData = JSON.parse(storedOrder);
                    orderId = orderData?._id || null;
                    console.log("Loaded order from sessionStorage:", orderId);
                } catch (e) {
                    console.error("Failed to parse stored order:", e);
                }
            }

            // Fallback: try to get orderId from URL params
            if (!orderId) {
                orderId = searchParams.get('orderId');
                console.log("Got orderId from URL params:", orderId);
            }

            // If we have an orderId, fetch fresh data from server
            if (orderId) {
                try {
                    const response = await apiClient.get<OrderData>(`/orders/${orderId}`, true);
                    if (response.success && response.data) {
                        console.log("Fetched fresh order data:", response.data);
                        orderData = response.data;
                    }
                } catch (err) {
                    console.error("Failed to fetch order from server:", err);
                    // Keep using sessionStorage data if fetch fails
                }
            }

            // Set the order data
            if (orderData) {
                setOrder(orderData);
                // Only clear sessionStorage after successfully loading order
                sessionStorage.removeItem('lastOrder');

                // Trigger confetti
                const end = Date.now() + 3 * 1000;
                const colors = ['#C1FF72', '#000000', '#ffffff'];

                (function frame() {
                    confetti({
                        particleCount: 3,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors
                    });
                    confetti({
                        particleCount: 3,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }

            setLoading(false);
        };

        loadOrder();

        // Fetch Recommendations
        const fetchRecommendations = async () => {
            try {
                const response = await getProducts({ limit: 4 });
                if (response.success) {
                    setRecommendations(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
            }
        };
        fetchRecommendations();
    }, [searchParams]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">No order details found</h1>
                <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
            </div>
        );
    }

    // Calculate Estimated Delivery (5-7 days from now)
    const orderDate = new Date(order.createdAt);
    const deliveryDateMin = new Date(orderDate);
    deliveryDateMin.setDate(orderDate.getDate() + 5);
    const deliveryDateMax = new Date(orderDate);
    deliveryDateMax.setDate(orderDate.getDate() + 7);

    const deliveryDateString = `${deliveryDateMin.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${deliveryDateMax.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

    return (
        <div className="min-h-screen bg-gray-50 py-12 print:bg-white print:py-0">
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white; }
                    .shadow-sm { box-shadow: none !important; border: 1px solid #eee; }
                }
            `}</style>

            <div className="container mx-auto px-4 max-w-4xl">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 print:mb-6"
                >
                    <div className="w-24 h-24 bg-[#C1FF72] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100 no-print">
                        <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg">Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-black">{order._id.slice(-8).toUpperCase()}</span></p>
                </motion.div>

                <div className="flex justify-end mb-4 no-print">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Receipt
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 print:block print:space-y-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 no-print"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>
                            <div className="relative flex justify-between">
                                {/* Connector Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                <div className="absolute top-1/2 left-0 w-[33%] h-1 bg-[#C1FF72] -translate-y-1/2 z-0"></div>

                                {/* Steps */}
                                {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-[#C1FF72] text-black ring-4 ring-[#C1FF72]/20' :
                                            index === 1 ? 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300' :
                                                'bg-gray-100 text-gray-400'
                                            }`}>
                                            {index === 0 ? '✓' : index + 1}
                                        </div>
                                        <span className={`text-xs font-medium ${index === 0 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                <span className="text-2xl">🚚</span>
                                <div>
                                    <p className="text-xs text-green-800 font-bold uppercase tracking-wide">Estimated Delivery</p>
                                    <p className="font-semibold text-gray-900">{deliveryDateString}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900">Items Ordered</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Payment Details (Detailed) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Payment Method</p>
                                    <p className="font-medium font-mono text-gray-900 bg-gray-100 inline-block px-2 py-1 rounded capitalize">
                                        {order.paymentInfo.method === 'razorpay' ? 'Prepaid (Razorpay)' : order.paymentInfo.method}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Payment Status</p>
                                    <p className={`font-medium ${order.paymentInfo.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.paymentInfo.status.toUpperCase()}
                                    </p>
                                </div>
                                {order.paymentInfo.razorpayPaymentId && (
                                    <div className="col-span-2 pt-2 border-t border-gray-100 mt-2">
                                        <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Transaction ID</p>
                                        <p className="font-mono text-gray-900 break-all">{order.paymentInfo.razorpayPaymentId}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>

                    {/* Sidebar Details */}
                    <div className="lg:col-span-1 space-y-6 mb-8 print:mb-0">

                        {/* Summary Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Date</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="h-px bg-gray-100 my-2"></div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalPrice - order.taxPrice - order.shippingPrice + (order.discountPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{order.shippingPrice === 0 ? <span className="text-green-600">Free</span> : `₹${order.shippingPrice}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10% GST)</span>
                                    <span>₹{order.taxPrice}</span>
                                </div>
                                {order.discountPrice ? (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>-₹{order.discountPrice}</span>
                                    </div>
                                ) : null}

                                <div className="h-px bg-gray-100 my-2"></div>

                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-900">Total</span>
                                    <span className="font-bold text-xl text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Shipping Address */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping To</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-bold text-gray-900 text-base">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                {order.shippingAddress.city && <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>}
                                <p>{order.shippingAddress.country}</p>
                                <p className="pt-2 text-gray-500">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="space-y-3 no-print"
                        >
                            <Link href="/products" className="block w-full py-4 px-6 bg-[#C1FF72] text-black font-bold rounded-xl text-center hover:bg-[#b5fc5e] transition-colors shadow-lg shadow-green-100 hover:shadow-xl">
                                Continue Shopping
                            </Link>
                            <Link href={`/orders/${order._id}`} className="block w-full py-4 px-6 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-center hover:bg-gray-50 transition-colors">
                                Track Order
                            </Link>
                        </motion.div>

                    </div>
                </div>

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 pt-12 border-t border-gray-200 no-print"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recommendations.map((product) => (
                                <Link key={product._id} href={`/product/${product._id}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        {product.images?.[0]?.url && (
                                            <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors">{product.title}</h3>
                                        <p className="mt-1 font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

// Wrapper with Suspense for useSearchParams
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
