"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { getAuthToken } from "@/lib/api/auth";
import AddressForm from "@/components/checkout/AddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import { useToast } from "@/components/ui/Toast";
import { orderApi, Order } from "@/lib/api/orders";
import {
    Check,
    AlertCircle,
    ShieldCheck,
    Truck,
    RotateCcw,
    Headphones,
    Loader2
} from "lucide-react";

interface Address {
    fullName: string;
    phone: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface OrderData {
    order: Order;
    razorpayOrderId: string;
    razorpayKeyId: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getCartTotal, clearCart, appliedCoupon } = useCart();
    const { user, loading: authLoading } = useAuth();
    const toast = useToast();

    const [step, setStep] = useState<"address" | "payment">("address");
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Get centralized calculations
    const { subtotal, tax, shipping, total, discount } = getCartTotal();

    // Check authentication on mount
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/checkout");
        }
    }, [user, authLoading, router]);

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!user) {
        return null;
    }

    // Redirect if cart is empty
    if (items.length === 0 && !isProcessing && !orderData) {
        router.push("/cart");
        return null;
    }

    const handleAddressSubmit = async (address: Address) => {
        setShippingAddress(address);
        setError(null);
        setIsProcessing(true);

        try {
            const token = getAuthToken();

            if (!token) {
                toast.error("Please log in to complete your order");
                router.push('/login?redirect=/checkout');
                return;
            }

            // Create order and get Razorpay order ID
            const orderPayload = {
                orderItems: items.map(item => ({
                    product: item.product._id || item.product.id,
                    title: item.product.title || item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images?.[0]?.url || item.product.image
                })),
                shippingAddress: {
                    fullName: address.fullName,
                    address: address.streetAddress + (address.apartment ? `, ${address.apartment}` : ''),
                    city: address.city,
                    state: address.state,
                    postalCode: address.zipCode,
                    country: address.country,
                    phone: address.phone
                },
                paymentMethod: 'razorpay',
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: shipping,
                totalPrice: total,
                discountPrice: discount,
                couponCode: appliedCoupon?.code
            };

            const result = await orderApi.createOrder(orderPayload);

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to create order');
            }

            // Store order data for payment
            setOrderData({
                order: result.data.order,
                razorpayOrderId: result.data.razorpayOrderId,
                razorpayKeyId: result.data.razorpayKeyId,
            });

            setStep("payment");
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error: any) {
            console.error("Order creation error:", error);
            setError(error.message || "Failed to create order. Please try again.");
            toast.error(error.message || "Failed to create order");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => {
        if (!orderData) {
            toast.error("Order data not found");
            return;
        }

        setIsProcessing(true);

        try {
            // Verify payment on backend
            const verifyResult = await orderApi.verifyPayment(orderData.order._id, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
            });

            if (!verifyResult.success) {
                throw new Error(verifyResult.message || 'Payment verification failed');
            }

            // Store order for success page
            sessionStorage.setItem('lastOrder', JSON.stringify(verifyResult.data || orderData.order));

            // Clear cart and redirect
            await clearCart();
            toast.success("Payment successful! Your order has been placed.");
            router.push(`/order-success?orderId=${orderData.order._id}`);

        } catch (error: any) {
            console.error("Payment verification error:", error);
            setError(error.message || "Payment verification failed");
            toast.error(error.message || "Payment verification failed. Please contact support.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentError = (error: any) => {
        console.error("Payment error:", error);
        const errorMessage = error.description || error.message || "Payment failed";
        setError(errorMessage);
        toast.error(errorMessage);
    };

    const handleCODPayment = async () => {
        if (!orderData) {
            toast.error("Order data not found");
            return;
        }

        sessionStorage.setItem('lastOrder', JSON.stringify(orderData.order));
        clearCart();
        toast.success("Order placed successfully! Pay on delivery.");
        router.push(`/order-success?orderId=${orderData.order._id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* Header & Steps */}
            <div className="bg-white border-b border-slate-200/80">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                                North Tech Hub
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Secure Checkout
                            </h1>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-3 sm:gap-4 max-w-sm w-full">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === "address"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "bg-emerald-600 text-white"
                                        }`}
                                >
                                    {step === "address" ? "1" : <Check className="w-4 h-4 stroke-[3]" />}
                                </div>
                                <span className={`text-xs font-bold ${step === "address" ? "text-slate-900" : "text-slate-600"}`}>
                                    Shipping
                                </span>
                            </div>

                            <div className="flex-1 h-0.5 bg-slate-200">
                                <div
                                    className={`h-full transition-all duration-300 ${step === "payment" ? "bg-blue-600 w-full" : "bg-slate-200 w-0"
                                        }`}
                                ></div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === "payment"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "bg-slate-200 text-slate-500"
                                        }`}
                                >
                                    2
                                </div>
                                <span
                                    className={`text-xs font-bold ${step === "payment" ? "text-slate-900" : "text-slate-400"
                                        }`}
                                >
                                    Payment
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 sm:py-10">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs font-semibold text-rose-800">
                            <p className="font-bold mb-0.5">Payment Notice</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === "address" && (
                            <>
                                <AddressForm
                                    onSubmit={handleAddressSubmit}
                                    initialAddress={shippingAddress || undefined}
                                />

                                {/* Delivery Options */}
                                <div className="mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                                    <h3 className="text-base font-bold text-slate-900 mb-4">
                                        Delivery Speed
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-start gap-3.5 p-4 border-2 border-blue-600 bg-blue-50/40 rounded-2xl cursor-pointer">
                                            <input
                                                type="radio"
                                                name="delivery"
                                                defaultChecked
                                                className="mt-1 accent-blue-600"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-xs font-bold text-slate-900">
                                                        Standard Delivery
                                                    </h4>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500">
                                                    Estimated 3-5 business days with live tracking
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-start gap-3.5 p-4 border-2 border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer bg-white transition-all">
                                            <input type="radio" name="delivery" className="mt-1 accent-blue-600" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-xs font-bold text-slate-900">
                                                        Priority Express Delivery
                                                    </h4>
                                                    <span className="text-xs font-bold text-slate-900">₹99</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500">
                                                    Expedited 1-2 business days with priority dispatch
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Loading indicator */}
                                {isProcessing && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                        <span className="text-xs font-bold text-blue-800">Creating your secure order session...</span>
                                    </div>
                                )}
                            </>
                        )}

                        {step === "payment" && (
                            <>
                                {/* Shipping Address Review */}
                                {shippingAddress && (
                                    <div className="mb-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Shipping Address
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setStep("address");
                                                    setOrderData(null);
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                                                disabled={isProcessing}
                                            >
                                                Change
                                            </button>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-100">
                                            <p className="font-bold text-slate-900">
                                                {shippingAddress.fullName}
                                            </p>
                                            <p className="text-slate-500 mt-0.5">
                                                {shippingAddress.phone}
                                            </p>
                                            <p className="mt-0.5">
                                                {shippingAddress.streetAddress}
                                                {shippingAddress.apartment &&
                                                    `, ${shippingAddress.apartment}`}
                                            </p>
                                            <p>
                                                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}
                                            </p>
                                            <p>{shippingAddress.country}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Method */}
                                <PaymentMethod
                                    totalAmount={total}
                                    razorpayOrderId={orderData?.razorpayOrderId}
                                    razorpayKeyId={orderData?.razorpayKeyId}
                                    userEmail={user?.email}
                                    userName={user?.name}
                                    userPhone={shippingAddress?.phone}
                                    orderId={orderData?.order._id}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                    onCODPayment={handleCODPayment}
                                />

                                {/* Loading indicator */}
                                {isProcessing && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                        <span className="text-xs font-bold text-blue-800">Verifying transaction securely...</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            items={items}
                            subtotal={subtotal}
                            shipping={shipping}
                            tax={tax}
                            discount={discount}
                            total={total}
                            appliedCoupon={appliedCoupon}
                        />
                    </div>
                </div>

                {/* Security & Trust */}
                <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2.5">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                                Secure Checkout
                            </h4>
                            <p className="text-[11px] text-slate-500">
                                256-bit SSL encrypted
                            </p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2.5">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                                Rapid Shipping
                            </h4>
                            <p className="text-[11px] text-slate-500">Live dispatched tracking</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2.5">
                                <RotateCcw className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                                Easy Returns
                            </h4>
                            <p className="text-[11px] text-slate-500">30-day replacement policy</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-2.5">
                                <Headphones className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                                Dedicated Support
                            </h4>
                            <p className="text-[11px] text-slate-500">Always here to assist you</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
