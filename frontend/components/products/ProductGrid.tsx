"use client";

import { useState } from "react";
import Link from "next/link";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    rating: { average: number; count: number };
    images: Array<{ url: string; alt?: string }>;
    stock: number;
    brand?: string;
}

interface ProductGridProps {
    products: Product[];
    onAddToCart: (productId: string) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (products.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <Link href="/products" className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    View All Products
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {products.map((product) => {
                const isHovered = hoveredId === product._id;

                return (
                    <div
                        key={product._id}
                        onMouseEnter={() => setHoveredId(product._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`
                            bg-white rounded-3xl overflow-hidden group w-full min-w-0
                            border border-gray-100
                            transition-all duration-500
                            ${isHovered ? 'shadow-2xl shadow-gray-200/80 border-[#C1FF72] -translate-y-2' : 'shadow-sm hover:shadow-lg'}
                        `}
                    >
                        {/* Product Image */}
                        <Link href={`/products/${product._id}`}>
                            <div className="relative bg-gradient-to-b from-gray-50 to-white aspect-square flex items-center justify-center overflow-hidden p-4 md:p-6">
                                {product.images?.[0]?.url ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.images[0].alt || product.title}
                                        className={`w-full h-full object-contain transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                                    />
                                ) : (
                                    <span className="text-4xl md:text-6xl opacity-30">📦</span>
                                )}

                                {/* Stock Badges */}
                                {product.stock < 10 && product.stock > 0 && (
                                    <span className="absolute top-3 left-3 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full shadow-sm">
                                        Only {product.stock} left
                                    </span>
                                )}
                                {product.stock === 0 && (
                                    <span className="absolute top-3 left-3 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full shadow-sm">
                                        Out of Stock
                                    </span>
                                )}

                                {/* Quick View Button - Desktop Only */}
                                <div className={`
                                    hidden md:block
                                    absolute bottom-4 left-4 right-4
                                    transition-all duration-300
                                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                `}>
                                    <span className="block w-full py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-900 shadow-lg text-center">
                                        Quick View
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Product Info */}
                        <div className="px-4 md:px-5 pb-5 md:pb-6">
                            {product.brand && (
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                            )}
                            <Link href={`/products/${product._id}`}>
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base line-clamp-2 min-h-[2.5rem] hover:text-gray-600 transition-colors">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-400 mb-3 capitalize">{product.category}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{product.rating?.average?.toFixed(1) || "0"}</span>
                                </div>
                                <span className="text-gray-200">|</span>
                                <span className="text-sm text-gray-400 hidden sm:inline">{product.rating?.count || 0} reviews</span>
                                <span className="text-sm text-gray-400 sm:hidden">{product.rating?.count || 0}</span>
                            </div>

                            {/* Price & Add to Cart */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg md:text-xl font-semibold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onAddToCart(product._id);
                                    }}
                                    disabled={product.stock === 0}
                                    className={`
                                        w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center 
                                        transition-all duration-300
                                        ${isHovered
                                            ? 'bg-[#C1FF72] text-gray-900 scale-110 shadow-lg shadow-[#C1FF72]/20'
                                            : 'bg-gray-900 text-white hover:bg-[#C1FF72] hover:text-gray-900 hover:shadow-lg hover:shadow-[#C1FF72]/20'
                                        }
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                    `}
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
