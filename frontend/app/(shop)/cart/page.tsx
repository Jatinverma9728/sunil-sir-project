"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { useOffers } from "@/lib/hooks/useOffers";
import CartItem from "@/components/cart/CartItem";
import { validateCoupon } from "@/lib/api/promotions";
import {
    ShoppingBag,
    Trash2,
    ShieldCheck,
    Truck,
    RotateCcw,
    ArrowRight,
    Tag,
    Sparkles
} from "lucide-react";

export default function CartPage() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
    } = useCart();

    const { getProductOffer } = useOffers();

    // Local state for input field only
    const [localCouponCode, setLocalCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    // Calculate offer-aware cart totals
    const cartTotals = useMemo(() => {
        let subtotal = 0;
        let originalSubtotal = 0;

        items.forEach((item) => {
            const offer = getProductOffer(item.product._id, item.product.category || '', item.product.price);
            const itemPrice = offer ? offer.discountedPrice : item.product.price;
            const originalPrice = offer ? offer.originalPrice : item.product.price;

            subtotal += itemPrice * item.quantity;
            originalSubtotal += originalPrice * item.quantity;
        });

        const couponDiscount = appliedCoupon?.discount || 0;
        const shipping = subtotal > 999 ? 0 : 99;
        const taxableAmount = Math.max(0, subtotal - couponDiscount);
        const tax = taxableAmount * 0.1; // 10% tax
        const total = taxableAmount + tax + shipping;
        const offerSavings = originalSubtotal - subtotal;

        return {
            subtotal,
            originalSubtotal,
            shipping,
            tax,
            discount: couponDiscount,
            total: Math.max(0, total),
            offerSavings,
        };
    }, [items, appliedCoupon, getProductOffer]);

    const { subtotal, originalSubtotal, shipping, tax, total, offerSavings } = cartTotals;

    const handleApplyCoupon = async () => {
        if (!localCouponCode.trim()) return;

        setCouponLoading(true);
        setCouponError("");

        try {
            const res = await validateCoupon(localCouponCode.toUpperCase(), cartTotals.subtotal);
            if (res.success && res.data) {
                applyCoupon(res.data);
                setLocalCouponCode("");
            } else {
                setCouponError(res.message || "Invalid coupon code");
            }
        } catch (error) {
            setCouponError("Failed to validate coupon");
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponError("");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Looks like you haven't added any items yet. Discover our latest products and deals.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                    >
                        <span>Browse Products</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* Header */}
            <div className="border-b border-slate-200/80 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 sm:py-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                                North Tech Hub
                            </p>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                                Shopping Cart
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                <span className="font-bold text-slate-900">{items.length}</span> {items.length === 1 ? "item" : "items"} in your order
                            </p>
                        </div>
                        <button
                            onClick={clearCart}
                            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors border border-slate-200 rounded-xl hover:border-rose-200 hover:bg-rose-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear Cart</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs sticky top-24">
                            <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-3.5 mb-6 pb-6 border-b border-slate-100 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <div className="text-right">
                                        {offerSavings > 0 && (
                                            <span className="text-xs text-slate-400 line-through mr-2">
                                                ₹{originalSubtotal.toFixed(2)}
                                            </span>
                                        )}
                                        <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Offer Savings */}
                                {offerSavings > 0 && (
                                    <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200/60 text-xs font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                            Offer savings
                                        </span>
                                        <span className="font-bold">-₹{offerSavings.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? (
                                            <span className="text-emerald-600">FREE</span>
                                        ) : (
                                            <span className="text-slate-900">₹{shipping.toFixed(2)}</span>
                                        )}
                                    </span>
                                </div>

                                {shipping > 0 && (
                                    <div className="text-xs text-slate-600 bg-blue-50/80 border border-blue-100 p-3 rounded-xl">
                                        <span className="font-bold text-blue-600">Free delivery threshold:</span>
                                        <span className="block mt-0.5 text-slate-500">Add ₹{(999 - subtotal).toFixed(2)} more to qualify for free delivery</span>
                                    </div>
                                )}

                                {/* Coupon Discount */}
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-emerald-700 text-xs font-semibold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200/60">
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                            Coupon ({appliedCoupon.code})
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-rose-600 hover:text-rose-700 underline text-[11px] ml-1"
                                            >
                                                Remove
                                            </button>
                                        </span>
                                        <span className="font-bold">-₹{cartTotals.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-bold text-slate-900">₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-6 pb-6 border-b border-slate-100">
                                {!appliedCoupon ? (
                                    <>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={localCouponCode}
                                                onChange={(e) => setLocalCouponCode(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                placeholder="Promo code"
                                                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-xs font-mono uppercase outline-none"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !localCouponCode.trim()}
                                                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {couponLoading ? "..." : "Apply"}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="mt-2 text-xs font-medium text-rose-600">{couponError}</p>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200/60">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-800">
                                                Coupon applied
                                            </p>
                                            <p className="text-[11px] text-emerald-600">
                                                {appliedCoupon.discountType === 'percentage'
                                                    ? `${appliedCoupon.discountValue}% off`
                                                    : `₹${appliedCoupon.discountValue} off`
                                                }
                                            </p>
                                        </div>
                                        <span className="font-mono font-bold text-xs text-emerald-800">{appliedCoupon.code}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-baseline text-base font-black text-slate-900 mb-6">
                                <span>Estimated Total</span>
                                <span className="text-xl font-black text-blue-600">₹{total.toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all mb-3"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* Continue Shopping */}
                            <Link
                                href="/products"
                                className="w-full block text-center px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: ShieldCheck, title: "Secure Checkout", desc: "256-bit SSL encrypted transactions" },
                        { icon: Truck, title: "Expedited Shipping", desc: "Free delivery on orders over ₹999" },
                        { icon: RotateCcw, title: "Verified Returns", desc: "Hassle-free 30-day replacement policy" },
                    ].map((badge, i) => {
                        const Icon = badge.icon;
                        return (
                            <div key={i} className="flex items-start gap-3.5 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{badge.title}</h3>
                                    <p className="text-xs text-slate-500">{badge.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
