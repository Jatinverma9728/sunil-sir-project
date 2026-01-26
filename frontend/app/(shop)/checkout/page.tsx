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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
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

            console.log("Creating order:", orderPayload);

            const result = await orderApi.createOrder(orderPayload);

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to create order');
            }

            console.log("Order created:", result);

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
        console.log("Payment success callback received:", response);

        if (!orderData) {
            toast.error("Order data not found");
            console.error("Order data missing in payment success");
            return;
        }

        setIsProcessing(true);

        try {
            console.log("Verifying payment for order:", orderData.order._id);

            // Verify payment on backend
            const verifyResult = await orderApi.verifyPayment(orderData.order._id, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
            });

            console.log("Payment verification result:", verifyResult);

            if (!verifyResult.success) {
                console.error("Verification failed success check:", verifyResult);
                throw new Error(verifyResult.message || 'Payment verification failed');
            }

            console.log("Payment verified, redirecting...");

            // Store order for success page
            sessionStorage.setItem('lastOrder', JSON.stringify(verifyResult.data || orderData.order));

            // Clear cart and redirect
            await clearCart(); // Await clearCart in case it async fails
            toast.success("Payment successful! Your order has been placed.");
            router.push('/order-success');

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

        // For COD, the order is already created, just redirect to success
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData.order));
        clearCart();
        toast.success("Order placed successfully! Pay on delivery.");
        router.push('/order-success');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "address"
                                    ? "bg-[#C1FF72] text-black"
                                    : "bg-green-500 text-white"
                                    }`}
                            >
                                {step === "address" ? "1" : "✓"}
                            </div>
                            <span className="font-medium text-gray-900">Shipping</span>
                        </div>

                        <div className="flex-1 h-1 bg-gray-300">
                            <div
                                className={`h-full transition-all ${step === "payment" ? "bg-green-500 w-full" : "bg-gray-300 w-0"
                                    }`}
                            ></div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "payment"
                                    ? "bg-[#C1FF72] text-black"
                                    : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                2
                            </div>
                            <span
                                className={`font-medium ${step === "payment" ? "text-gray-900" : "text-gray-500"
                                    }`}
                            >
                                Payment
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-800 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
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
                                <div className="mt-6 bg-white rounded-2xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Delivery Options
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-start gap-4 p-4 border-2 border-[#C1FF72] bg-green-50 rounded-xl cursor-pointer">
                                            <input
                                                type="radio"
                                                name="delivery"
                                                defaultChecked
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        Standard Delivery
                                                    </h4>
                                                    <span className="font-bold text-gray-900">
                                                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Delivery in 3-5 business days
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
                                            <input type="radio" name="delivery" className="mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        Express Delivery
                                                    </h4>
                                                    <span className="font-bold text-gray-900">₹20</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Delivery in 1-2 business days
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Loading indicator */}
                                {isProcessing && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span className="text-blue-800">Creating your order...</span>
                                    </div>
                                )}
                            </>
                        )}

                        {step === "payment" && (
                            <>
                                {/* Shipping Address Review */}
                                {shippingAddress && (
                                    <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Shipping Address
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setStep("address");
                                                    setOrderData(null);
                                                }}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                disabled={isProcessing}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="font-semibold text-gray-900">
                                                {shippingAddress.fullName}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {shippingAddress.phone}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {shippingAddress.streetAddress}
                                                {shippingAddress.apartment &&
                                                    `, ${shippingAddress.apartment}`}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {shippingAddress.city}, {shippingAddress.state}{" "}
                                                {shippingAddress.zipCode}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {shippingAddress.country}
                                            </p>
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
                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span className="text-blue-800">Verifying payment...</span>
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
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                Secure Payment
                            </h4>
                            <p className="text-xs text-gray-600">
                                SSL encrypted transactions
                            </p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🚚</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                Fast Delivery
                            </h4>
                            <p className="text-xs text-gray-600">Track your order anytime</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">↩️</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                Easy Returns
                            </h4>
                            <p className="text-xs text-gray-600">30-day return policy</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                24/7 Support
                            </h4>
                            <p className="text-xs text-gray-600">Always here to help</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
