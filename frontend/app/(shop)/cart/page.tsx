"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import CartItem from "@/components/cart/CartItem";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

    // Memoize calculations to prevent recalculation on every render
    const calculations = useMemo(() => {
        const subtotal = getTotalPrice();
        const discount = 0;
        const tax = subtotal * 0.1;
        const shipping = subtotal > 50 ? 0 : 10;
        const total = subtotal - discount + tax + shipping;

        return { subtotal, discount, tax, shipping, total };
    }, [getTotalPrice]);

    const { subtotal, discount, tax, shipping, total } = calculations;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-medium text-gray-900 mb-3">Your cart is empty</h1>
                    <p className="text-gray-500 mb-8">
                        Add some products to get started shopping!
                    </p>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">
                                Shopping
                            </p>
                            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
                                Your Cart
                            </h1>
                            <p className="text-gray-500 mt-2">
                                <span className="font-semibold text-gray-900">{items.length}</span> {items.length === 1 ? "item" : "items"}
                            </p>
                        </div>
                        <button
                            onClick={clearCart}
                            className="px-5 py-2.5 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors border border-gray-200 rounded-full hover:border-red-200 hover:bg-red-50"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <CartItem
                                key={item.product._id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-3xl p-8 sticky top-24">
                            <h2 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            <span className="text-gray-900">${shipping.toFixed(2)}</span>
                                        )}
                                    </span>
                                </div>

                                {shipping > 0 && (
                                    <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-2xl">
                                        <span className="font-medium text-blue-600">💡 Almost there!</span>
                                        <br />Add ${(50 - subtotal).toFixed(2)} more for free shipping
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all text-sm"
                                    />
                                    <button className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-lg font-semibold text-gray-900 mb-6">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className="w-full block text-center px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg mb-3"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* Continue Shopping */}
                            <Link
                                href="/products"
                                className="w-full block text-center px-8 py-3 border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {[
                        { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Secure Payment", desc: "256-bit SSL encryption" },
                        { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", title: "Free Shipping", desc: "On orders over $50" },
                        { icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6", title: "Easy Returns", desc: "30-day return policy" },
                    ].map((badge, i) => (
                        <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1">{badge.title}</h3>
                                <p className="text-sm text-gray-500">{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
