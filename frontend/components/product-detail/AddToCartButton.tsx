"use client";

import { useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    title: string;
    price: number;
    [key: string]: any;
}

interface AddToCartButtonProps {
    product: Product;
    inStock?: boolean;
    stock?: number;
}

export default function AddToCartButton({ product, inStock = true, stock = 10 }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!inStock) return;
        setAdding(true);
        addToCart(product, quantity);
        await new Promise(resolve => setTimeout(resolve, 400));
        setAdding(false);
    };

    const handleBuyNow = async () => {
        if (!inStock) return;
        addToCart(product, quantity);
        router.push("/checkout");
    };

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={!inStock || quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        −
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                        disabled={!inStock || quantity >= stock}
                        className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock || adding}
                    className="flex-1 h-10 px-6 bg-[#2D5A27] text-white rounded-lg font-semibold text-sm hover:bg-[#234a1f] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {adding ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Adding...
                        </span>
                    ) : (
                        "Add To Cart"
                    )}
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="h-10 px-6 bg-[#C1FF72] text-black rounded-lg font-semibold text-sm hover:bg-[#b0ee61] transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>

                {/* Wishlist Button */}
                <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {!inStock && (
                <p className="text-red-600 text-sm font-medium">
                    This product is currently out of stock
                </p>
            )}
        </div>
    );
}
