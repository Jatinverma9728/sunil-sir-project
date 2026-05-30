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
                bg-white rounded-lg p-4 sm:p-6 
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
                className="group relative flex h-32 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-28 sm:w-28"
            >
                {productImage ? (
                    <img
                        src={productImage}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    />
                ) : (
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7.5 12 3 4 7.5m16 0v9L12 21m8-13.5-8 4.5m0 9v-9m0 0L4 7.5m8 4.5-8-4.5m0 0v9L12 21" />
                        </svg>
                )}
                {/* Offer Badge */}
                {hasDiscount && (
                    <span className="absolute left-2 top-2 rounded-md bg-gradient-to-r from-rose-500 to-orange-500 px-2 py-1 text-xs font-bold text-white">
                        {activeOffer.discountPercent}% OFF
                    </span>
                )}
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                {product.category && (
                    <p className="mb-1 text-xs uppercase text-gray-400">{product.category}</p>
                )}
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                        {product.title}
                    </h3>
                </Link>

                {/* Offer Name Badge */}
                {hasDiscount && (
                    <span className="inline-block text-xs text-rose-600 font-medium mb-2">
                                            {activeOffer.offerName}
                    </span>
                )}

                {/* Quantity Controls and Price on Mobile */}
                <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                        <button
                            type="button"
                            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
                            aria-label="Increase quantity"
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
                            {"\u20B9"}{itemTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through">
                                {"\u20B9"}{(originalPrice * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={() => onRemove(product._id)}
                        aria-label="Remove item"
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
                    {"\u20B9"}{itemTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {hasDiscount ? (
                    <>
                        <p className="text-sm text-gray-400 line-through">
                            {"\u20B9"}{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                            {"\u20B9"}{displayPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-gray-400">
                        {"\u20B9"}{displayPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                    </p>
                )}
            </div>
        </div>
    );
}
