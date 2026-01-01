"use client";

import Link from "next/link";
import { useState } from "react";

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
    const itemTotal = product.price * quantity;
    const productImage = product.images?.[0]?.url || product.image;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
                bg-white rounded-3xl p-6 flex gap-6 
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
                className="w-28 h-28 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden group"
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
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                {product.category && (
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                )}
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 mb-3">
                        {product.title}
                    </h3>
                </Link>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
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

            {/* Price Info */}
            <div className="text-right flex flex-col justify-center">
                <p className="text-xl font-semibold text-gray-900">
                    ₹{itemTotal.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                    ₹{product.price.toFixed(2)} each
                </p>
            </div>
        </div>
    );
}
