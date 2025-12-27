"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";

export default function WishlistPage() {
    const { items, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const getProductImage = (item: any) => {
        return item.images?.[0]?.url || item.image || null;
    };

    const handleMoveToCart = (item: any) => {
        addToCart(item, 1);
        removeFromWishlist(item._id);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                            <span className="text-5xl">❤️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Save items you love by clicking the heart icon on any product.
                            They'll appear here for easy access later.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Explore Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                            <p className="text-gray-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
                        </div>
                        <button
                            onClick={clearWishlist}
                            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Wishlist
                        </button>
                    </div>
                </div>
            </div>

            {/* Wishlist Items */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const image = getProductImage(item);
                        const discount = item.originalPrice
                            ? Math.round((1 - item.price / item.originalPrice) * 100)
                            : 0;

                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-lg transition-shadow"
                            >
                                {/* Image */}
                                <Link href={`/products/${item._id}`} className="block relative aspect-square bg-gray-50">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={item.title}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                                            📦
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            -{discount}%
                                        </span>
                                    )}
                                </Link>

                                {/* Content */}
                                <div className="p-4">
                                    <Link href={`/products/${item._id}`}>
                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-gray-700 transition-colors">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    {item.category && (
                                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                    )}
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item._id)}
                                            className="w-10 h-10 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                                            title="Remove from wishlist"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Shopping */}
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
