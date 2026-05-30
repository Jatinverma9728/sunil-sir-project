"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
                        <div className="h-80 rounded-lg bg-gray-50 md:h-96" />
                        <div>
                            <div className="h-6 bg-gray-50 rounded mb-4 w-32" />
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 rounded-lg bg-gray-50" />
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
                        className="group relative flex min-h-[400px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-[#F8FAFC] transition-all duration-500 hover:shadow-xl md:min-h-[450px] lg:min-h-[550px]"
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
                                        <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-700 md:px-3 md:py-1 md:text-[10px] lg:text-xs">
                                            {featuredProduct.brand || "Editor's Choice"}
                                        </span>
                                        <span className="text-gray-500 text-[10px] md:text-xs">Official Store</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-1.5 md:gap-2 min-w-0">
                                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-indigo-600 truncate">
                                            {"\u20B9"}{featuredProduct.price.toLocaleString("en-IN")}
                                        </span>
                                        {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                                            <span className="text-xs md:text-sm lg:text-base text-gray-400 line-through truncate">
                                                {"\u20B9"}{featuredProduct.originalPrice.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                    <span className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors group-hover:bg-[var(--primary-electric)] md:h-10 md:w-10 lg:h-12 lg:w-12">
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
                                    aria-label="Previous best sellers"
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-100 hover:text-[var(--primary-electric)] disabled:opacity-30 md:h-8 md:w-8 lg:h-10 lg:w-10"
                                >
                                    <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex >= otherProducts.length - 3}
                                    aria-label="Next best sellers"
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-100 hover:text-[var(--primary-electric)] disabled:opacity-30 md:h-8 md:w-8 lg:h-10 lg:w-10"
                                >
                                    <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Products List */}
                        <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-4">
                            {visibleProducts.map((product) => {
                                return (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        className="group relative flex min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 transition-all duration-300 hover:border-blue-100 hover:shadow-md md:gap-3 md:p-3 lg:gap-4 lg:p-4"
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
                                            <p className="mb-0.5 text-[9px] font-semibold uppercase text-gray-500 md:text-[10px] lg:text-xs">
                                                {product.category}
                                            </p>
                                            <h4 className="mb-0.5 truncate text-xs font-bold text-gray-900 transition-colors group-hover:text-[var(--primary-electric)] md:mb-1 md:text-sm lg:text-base">
                                                {product.title}
                                            </h4>
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <span className="text-sm md:text-base lg:text-lg font-bold text-gray-900">
                                                    {"\u20B9"}{product.price.toLocaleString("en-IN")}
                                                </span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="text-[10px] md:text-xs lg:text-sm text-gray-400 line-through">
                                                        {"\u20B9"}{product.originalPrice.toLocaleString("en-IN")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="absolute right-2 top-1/2 flex h-6 w-6 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-all duration-300 group-hover:bg-[var(--primary-electric)] group-hover:text-white md:right-3 md:h-8 md:w-8 lg:right-4 lg:h-10 lg:w-10">
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
