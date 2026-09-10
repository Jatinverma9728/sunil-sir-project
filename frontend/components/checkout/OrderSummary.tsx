"use client";

import { Package, ShieldCheck, Truck, Tag } from "lucide-react";

interface OrderItem {
    product: {
        _id: string;
        title: string;
        price: number;
        image?: string;
        images?: Array<{ url: string; alt?: string }>;
    };
    quantity: number;
}

interface OrderSummaryProps {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount?: number;
    total: number;
    appliedCoupon?: {
        code: string;
        discountType: string;
        discountValue: number;
        discount: number;
    } | null;
}

export default function OrderSummary({
    items,
    subtotal,
    shipping,
    tax,
    discount = 0,
    total,
    appliedCoupon,
}: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-3.5 mb-6 pb-6 border-b border-slate-100 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3.5 items-center">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
                            {(item.product.images?.[0]?.url || item.product.image) ? (
                                <img
                                    src={item.product.images?.[0]?.url || item.product.image}
                                    alt={item.product.title}
                                    className="w-full h-full object-contain p-1"
                                />
                            ) : (
                                <Package className="w-6 h-6 text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-xs line-clamp-2 leading-snug">
                                {item.product.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-slate-900 text-xs shrink-0">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>

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

                <div className="flex justify-between text-slate-600">
                    <span>Tax (GST 10%)</span>
                    <span className="font-bold text-slate-900">₹{tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 font-semibold">
                        <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-emerald-600" />
                            Discount
                        </span>
                        <span>-₹{discount.toFixed(2)}</span>
                    </div>
                )}

                {appliedCoupon && (
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200/60">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-emerald-800">Coupon</span>
                                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                                    {appliedCoupon.code}
                                </span>
                            </div>
                            <span className="font-bold text-emerald-700">
                                -₹{appliedCoupon.discount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline text-base font-black text-slate-900 mb-5">
                <span>Total Amount</span>
                <span className="text-xl font-black text-blue-600">₹{total.toFixed(2)}</span>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 mb-4 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-blue-900">
                        Estimated Delivery
                    </p>
                    <p className="text-[11px] text-blue-700">Dispatched in 24 hours (3-5 business days)</p>
                </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Bank-grade 256-bit encryption</span>
            </div>
        </div>
    );
}
