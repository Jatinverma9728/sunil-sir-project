"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api/products";

interface Product {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    category: string;
    images: Array<{ url: string; alt?: string }>;
    rating?: { average: number; count: number };
    createdAt?: string;
    updatedAt?: string;
}

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [trendingProduct, setTrendingProduct] = useState<Product | null>(null);
    const [bestSeller, setBestSeller] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroProducts();
    }, []);

    const fetchHeroProducts = async () => {
        try {
            // Fetch a larger set of products to have enough data for filtering
            const response = await getProducts({ limit: 50 });

            if (!response.success || !response.data || response.data.length === 0) {
                setLoading(false);
                return;
            }

            const allProducts = response.data;

            // 1. NEW ARRIVALS - Sort by creation date (newest first)
            const sortedByDate = [...allProducts].sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });
            setNewArrivals(sortedByDate.slice(0, 3));

            // 2. TRENDING (Most Bought) - Product with HIGHEST review count
            // More reviews typically means more sales
            const productsWithReviews = allProducts.filter(p => p.rating && p.rating.count > 0);

            const sortedByReviewCount = [...productsWithReviews].sort((a, b) => {
                return (b.rating?.count || 0) - (a.rating?.count || 0);
            });

            const mostReviewed = sortedByReviewCount[0] || null;
            setTrendingProduct(mostReviewed);

            // 3. BEST SELLER - Product with HIGHEST rating average (must be different from trending)
            const sortedByRating = [...productsWithReviews]
                .filter(p => {
                    // Must be different from trending product
                    if (mostReviewed && p._id === mostReviewed._id) return false;
                    // Must have good rating
                    return p.rating && p.rating.average >= 3.5 && p.rating.count > 0;
                })
                .sort((a, b) => {
                    // Primary: Sort by rating average
                    const ratingDiff = (b.rating?.average || 0) - (a.rating?.average || 0);
                    if (Math.abs(ratingDiff) > 0.1) return ratingDiff;
                    // Tiebreaker: More reviews wins
                    return (b.rating?.count || 0) - (a.rating?.count || 0);
                });

            const highestRated = sortedByRating[0] || null;
            setBestSeller(highestRated);

            console.log('Hero Products Selection:', {
                trending: {
                    id: mostReviewed?._id,
                    title: mostReviewed?.title,
                    reviewCount: mostReviewed?.rating?.count,
                    rating: mostReviewed?.rating?.average
                },
                bestSeller: {
                    id: highestRated?._id,
                    title: highestRated?.title,
                    reviewCount: highestRated?.rating?.count,
                    rating: highestRated?.rating?.average
                }
            });

        } catch (error) {
            console.error("Error fetching hero products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-rotate slides
    useEffect(() => {
        if (newArrivals.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % newArrivals.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [newArrivals.length]);

    if (loading) {
        return (
            <section className="py-4 sm:py-6 md:py-8">
                <div className="max-w-[1600px] mx-auto px-3 sm:px-4">
                    <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 h-auto md:h-[500px] lg:h-[600px] animate-pulse">
                        <div className="lg:col-span-2 bg-gray-100 rounded-2xl sm:rounded-[2rem] h-[400px] sm:h-[450px] md:h-full" />
                        <div className="hidden md:flex flex-col gap-3 sm:gap-4 md:gap-6">
                            <div className="flex-1 bg-gray-100 rounded-2xl sm:rounded-[2rem]" />
                            <div className="flex-1 bg-gray-100 rounded-2xl sm:rounded-[2rem]" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (newArrivals.length === 0) {
        return null;
    }

    return (
        <section className="py-4 sm:py-6 md:py-8">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4">
                <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 h-auto md:h-[500px] lg:h-[600px]">
                    {/* Main Slideshow - New Arrivals */}
                    <div className="lg:col-span-2 relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-white h-[400px] sm:h-[450px] md:h-full">
                        {newArrivals.map((product, index) => (
                            <div
                                key={product._id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0">
                                    {product.images?.[0]?.url && (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    )}
                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col md:flex-row items-center">
                                    <div className="flex-1 p-5 sm:p-6 md:p-10 lg:p-16 flex flex-col justify-center z-10">
                                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs sm:text-sm font-bold text-indigo-600 mb-3 sm:mb-4 md:mb-6 w-fit">
                                            New Arrival
                                        </span>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight tracking-tight line-clamp-2">
                                            {product.title}
                                        </h2>
                                        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                                            {product.category}
                                        </p>
                                        <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                                ₹{product.price.toFixed(0)}
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-base sm:text-lg md:text-xl text-white/60 line-through">
                                                    ₹{product.originalPrice.toFixed(0)}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/products/${product._id}`}
                                            className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-fit"
                                        >
                                            Shop Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Slide Indicators */}
                        {newArrivals.length > 1 && (
                            <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 md:bottom-8 md:left-10 lg:left-16 flex gap-1.5 sm:gap-2 z-20">
                                {newArrivals.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? "w-6 sm:w-8 bg-white"
                                                : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side Column - Stacked Banners */}
                    <div className="hidden lg:flex flex-col gap-6 h-full">
                        {/* Top Card - Trending Product (Most Reviews = Most Bought) */}
                        {trendingProduct && (
                            <Link
                                href={`/products/${trendingProduct._id}`}
                                className="flex-1 relative rounded-[2rem] overflow-hidden border border-gray-100 group hover:shadow-lg transition-all duration-300"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    {trendingProduct.images?.[0]?.url && (
                                        <Image
                                            src={trendingProduct.images[0].url}
                                            alt={trendingProduct.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 z-10">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                        <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-orange-500/90 text-white text-[10px] sm:text-xs font-bold">
                                            🔥 Trending
                                        </span>
                                        {trendingProduct.rating && (
                                            <span className="text-white/90 text-xs sm:text-sm font-medium">
                                                {trendingProduct.rating.count} reviews
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
                                        {trendingProduct.title}
                                    </h3>
                                    <p className="text-white/90 font-semibold text-sm sm:text-base md:text-lg">
                                        From ₹{trendingProduct.price.toFixed(0)}
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* Bottom Card - Best Seller (Highest Rated) */}
                        {bestSeller && (
                            <Link
                                href={`/products/${bestSeller._id}`}
                                className="flex-1 relative rounded-[2rem] overflow-hidden border border-gray-100 group hover:shadow-lg transition-all duration-300"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    {bestSeller.images?.[0]?.url && (
                                        <Image
                                            src={bestSeller.images[0].url}
                                            alt={bestSeller.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 z-10">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                        <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500/90 text-white text-[10px] sm:text-xs font-bold">
                                            ⭐ Best Seller
                                        </span>
                                        {bestSeller.rating && (
                                            <span className="text-white/90 text-xs sm:text-sm font-medium">
                                                {bestSeller.rating.average.toFixed(1)} ★
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
                                        {bestSeller.title}
                                    </h3>
                                    <p className="text-white/90 font-semibold text-sm sm:text-base md:text-lg">
                                        ₹{bestSeller.price.toFixed(0)}
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
