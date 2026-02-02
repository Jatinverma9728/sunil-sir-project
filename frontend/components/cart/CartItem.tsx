"use client";

import Link from "next/link";
import { useState } from "react";
import { useOffers } from "@/lib/hooks/useOffers";

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

    // Debug logging
    console.log('[CartItem] Product:', product._id, 'Category:', product.category, 'Price:', product.price);
    console.log('[CartItem] Active Offer:', activeOffer);

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
                bg-white rounded-3xl p-4 sm:p-6 
                flex flex-col sm:flex-row gap-4 sm:gap-6 
                border border-gray-100
                transition-all duration-300
                ${isHovered ? 'shadow-lg border-gray-200' : 'shadow-sm'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <Link
                href={`/products/${product._id}`}
                className="w-full sm:w-28 h-32 sm:h-28 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden group relative"
            >
                {productImage ? (
                    <img
                        src={productImage}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    />
                ) : (
                    <span className="text-4xl opacity-30">📦</span>
                )}
                {/* Offer Badge */}
                {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {activeOffer.discountPercent}% OFF
                    </span>
                )}
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                {product.category && (
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                )}
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                        {product.title}
                    </h3>
                </Link>

                {/* Offer Name Badge */}
                {hasDiscount && (
                    <span className="inline-block text-xs text-rose-600 font-medium mb-2">
                        🔥 {activeOffer.offerName}
                    </span>
                )}

                {/* Quantity Controls and Price on Mobile */}
                <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {/* Price on Mobile */}
                    <div className="sm:hidden text-right">
                        <p className="text-lg font-semibold text-gray-900">
                            ₹{itemTotal.toFixed(2)}
                        </p>
                        {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through">
                                ₹{(originalPrice * quantity).toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(product._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Price Info - Desktop only */}
            <div className="hidden sm:flex text-right flex-col justify-center">
                <p className="text-xl font-semibold text-gray-900">
                    ₹{itemTotal.toFixed(2)}
                </p>
                {hasDiscount ? (
                    <>
                        <p className="text-sm text-gray-400 line-through">
                            ₹{originalPrice.toFixed(2)} each
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                            ₹{displayPrice.toFixed(2)} each
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-gray-400">
                        ₹{displayPrice.toFixed(2)} each
                    </p>
                )}
            </div>
        </div>
    );
}
