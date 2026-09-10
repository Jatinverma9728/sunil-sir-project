"use client";

import Link from "next/link";
import { useState } from "react";
import { useOffers } from "@/lib/hooks/useOffers";
import { Minus, Plus, Trash2, Package } from "lucide-react";

interface CartItemProps {
    item: {
        product: {
            _id: string;
            title: string;
            price: number;
            category?: string;
            image?: string;
            images?: Array<{ url: string; alt?: string }>;
        };
        quantity: number;
    };
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const { product, quantity } = item;
    const { getProductOffer } = useOffers();

    // Check for active offer on this product
    const activeOffer = getProductOffer(product._id, product.category || '', product.price);

    // Use offer price if available, otherwise use product price
    const displayPrice = activeOffer ? activeOffer.discountedPrice : product.price;
    const originalPrice = activeOffer ? activeOffer.originalPrice : product.price;
    const hasDiscount = activeOffer && activeOffer.discountedPrice < activeOffer.originalPrice;

    const itemTotal = displayPrice * quantity;
    const productImage = product.images?.[0]?.url || product.image;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
                bg-white rounded-2xl p-4 sm:p-5 
                flex flex-col sm:flex-row gap-4 sm:gap-6 
                border border-slate-200/80 shadow-xs
                transition-all duration-300
                ${isHovered ? 'shadow-md border-slate-300' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <Link
                href={`/products/${product._id}`}
                className="group relative flex h-32 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100 sm:h-28 sm:w-28"
            >
                {productImage ? (
                    <img
                        src={productImage}
                        alt={product.title}
                        className={`w-full h-full object-contain p-2 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    />
                ) : (
                    <Package className="w-10 h-10 text-slate-300" />
                )}
                {/* Offer Badge */}
                {hasDiscount && (
                    <span className="absolute left-2 top-2 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {activeOffer.discountPercent}% OFF
                    </span>
                )}
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                {product.category && (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">{product.category}</p>
                )}
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
                        {product.title}
                    </h3>
                </Link>

                {/* Offer Name Badge */}
                {hasDiscount && (
                    <span className="inline-block text-xs font-semibold text-rose-600 mb-2">
                        {activeOffer.offerName}
                    </span>
                )}

                {/* Quantity Controls and Price on Mobile */}
                <div className="flex items-center justify-between sm:justify-start gap-4 mt-2">
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <button
                            type="button"
                            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-slate-900">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Price on Mobile */}
                    <div className="sm:hidden text-right">
                        <p className="text-base font-black text-slate-900">
                            ₹{itemTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {hasDiscount && (
                            <p className="text-xs text-slate-400 line-through">
                                ₹{(originalPrice * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={() => onRemove(product._id)}
                        aria-label="Remove item"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-auto sm:ml-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Price Info - Desktop only */}
            <div className="hidden sm:flex text-right flex-col justify-center shrink-0">
                <p className="text-lg font-black text-slate-900">
                    ₹{itemTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {hasDiscount && (
                    <p className="text-xs text-slate-400 line-through">
                        ₹{(originalPrice * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                )}
            </div>
        </div>
    );
}
