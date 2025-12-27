"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { getAuthToken } from "@/lib/api/auth";
import AddressForm from "@/components/checkout/AddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethod from "@/components/checkout/PaymentMethod";

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

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const [step, setStep] = useState<"address" | "payment">("address");
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate totals
    const subtotal = getTotalPrice();
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const discount = 0;
    const total = subtotal - discount + tax + shipping;

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
    if (items.length === 0 && !isProcessing) {
        router.push("/cart");
        return null;
    }

    const handleAddressSubmit = (address: Address) => {
        setShippingAddress(address);
        setStep("payment");
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePayment = async (method: string) => {
        if (!shippingAddress) {
            alert("Please provide shipping address");
            return;
        }

        setIsProcessing(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Get auth token using the helper
            const token = getAuthToken();

            if (!token) {
                alert("Please log in to complete your order");
                router.push('/login?redirect=/checkout');
                setIsProcessing(false);
                return;
            }

            // Prepare order data
            const orderData = {
                orderItems: items.map(item => ({
                    product: item.product._id || item.product.id,
                    title: item.product.title || item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images?.[0]?.url || item.product.image
                })),
                shippingAddress: {
                    fullName: shippingAddress.fullName,
                    address: shippingAddress.streetAddress + (shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''),
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.zipCode,
                    country: shippingAddress.country,
                    phone: shippingAddress.phone
                },
                // Backend expects paymentMethod at top level
                paymentMethod: method,
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: shipping,
                totalPrice: total
            };

            console.log("Creating order:", orderData);

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to create order');
            }

            console.log("Order created:", result);

            // Store order in sessionStorage for the success page (result.data.order)
            const storedOrderData = result.data.order || result.data;
            sessionStorage.setItem('lastOrder', JSON.stringify(storedOrderData));

            // Clear cart and redirect to success page
            clearCart();
            router.push('/order-success');

        } catch (error: any) {
            console.error("Order creation error:", error);
            alert(error.message || "Failed to place order. Please try again.");
            setIsProcessing(false);
        }
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
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === "address" && (
                            <>
                                <AddressForm onSubmit={handleAddressSubmit} />

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
                                                        {shipping === 0 ? "FREE" : `$${shipping}`}
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
                                                    <span className="font-bold text-gray-900">$20</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Delivery in 1-2 business days
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
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
                                                onClick={() => setStep("address")}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                                <PaymentMethod totalAmount={total} onPayment={handlePayment} />
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
