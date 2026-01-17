"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/context/WishlistContext";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    rating: { average: number; count: number };
    images: Array<{ url: string; alt?: string }>;
    stock: number;
    originalPrice?: number;
    brand?: string;
    isFeatured?: boolean;
}

export default function FeaturedSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { getProducts } = await import('@/lib/api/products');
            const response = await getProducts({ limit: 7, featured: true });

            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < products.length - 4) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-6 md:py-8 lg:py-12">
                <div className="w-full max-w-[1600px] mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 animate-pulse">
                        <div className="h-80 md:h-96 bg-gray-50 rounded-2xl" />
                        <div>
                            <div className="h-6 bg-gray-50 rounded mb-4 w-32" />
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-gray-50 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    const featuredProduct = products[0];
    const otherProducts = products.slice(1);
    const visibleProducts = otherProducts.slice(currentIndex, currentIndex + 3);

    return (
        <section className="bg-white py-6 md:py-8 lg:py-12">
            <div className="w-full max-w-[1600px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    {/* Left: Large Featured Product */}
                    <Link
                        href={`/products/${featuredProduct._id}`}
                        className="group relative rounded-2xl overflow-hidden bg-[#F8FAFC] border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col min-h-[400px] md:min-h-[450px] lg:min-h-[550px]"
                    >
                        <div className="relative flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
                            {/* Background Decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {featuredProduct.images?.[0]?.url && (
                                <div className="relative w-full h-full max-h-[200px] md:max-h-[250px] lg:max-h-[300px]">
                                    <Image
                                        src={featuredProduct.images[0].url}
                                        alt={featuredProduct.title}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 p-4 md:p-6 lg:p-8 bg-white/70 backdrop-blur-sm border-t border-gray-100">
                            <div className="space-y-2 md:space-y-3">
                                <div>
                                    <h3 className="text-lg md:text-xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight line-clamp-2">
                                        {featuredProduct.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-indigo-100 text-indigo-700 text-[9px] md:text-[10px] lg:text-xs font-bold rounded-full uppercase tracking-wider">
                                            {featuredProduct.brand || "Editor's Choice"}
                                        </span>
                                        <span className="text-gray-500 text-[10px] md:text-xs">Official Store</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-1.5 md:gap-2 min-w-0">
                                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-indigo-600 truncate">
                                            ₹{featuredProduct.price.toFixed(0)}
                                        </span>
                                        {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                                            <span className="text-xs md:text-sm lg:text-base text-gray-400 line-through truncate">
                                                ₹{featuredProduct.originalPrice.toFixed(0)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors flex-shrink-0 ml-2">
                                        <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Right: Best Selling Products */}
                    <div className="flex flex-col min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Best Sellers</h2>
                            <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-indigo-600 transition-all disabled:opacity-30"
                                >
                                    <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex >= otherProducts.length - 3}
                                    className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-indigo-600 transition-all disabled:opacity-30"
                                >
                                    <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Products List */}
                        <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-4">
                            {visibleProducts.map((product) => {
                                const isWishlisted = isInWishlist(product._id);
                                return (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        className="group flex items-center gap-2 md:gap-3 lg:gap-4 p-2 md:p-3 lg:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 relative min-w-0"
                                    >
                                        {/* Image */}
                                        <div className="relative w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0 bg-gray-50 rounded-lg md:rounded-xl overflow-hidden p-1.5 md:p-2">
                                            {product.images?.[0]?.url && (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.title}
                                                    fill
                                                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 pr-7 md:pr-10">
                                            <p className="text-[9px] md:text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                                                {product.category}
                                            </p>
                                            <h4 className="text-xs md:text-sm lg:text-base font-bold text-gray-900 mb-0.5 md:mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                                {product.title}
                                            </h4>
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <span className="text-sm md:text-base lg:text-lg font-bold text-gray-900">
                                                    ₹{product.price.toFixed(0)}
                                                </span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="text-[10px] md:text-xs lg:text-sm text-gray-400 line-through">
                                                        ₹{product.originalPrice.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="absolute right-2 md:right-3 lg:right-4 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
