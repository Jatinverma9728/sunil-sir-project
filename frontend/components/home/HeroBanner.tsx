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

function displayTitle(title: string, maxLength = 82) {
    if (title.length <= maxLength) return title;
    return `${title.slice(0, maxLength - 3).trimEnd()}...`;
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
            const response = await getProducts({ limit: 10 });

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

            // 2. TRENDING - Most reviews
            const productsWithReviews = allProducts.filter(p => p.rating && p.rating.count > 0);
            const sortedByReviewCount = [...productsWithReviews].sort((a, b) => {
                return (b.rating?.count || 0) - (a.rating?.count || 0);
            });
            const mostReviewed = sortedByReviewCount[0] || null;
            setTrendingProduct(mostReviewed);

            // 3. BEST SELLER - Highest rating
            const sortedByRating = [...productsWithReviews]
                .filter(p => {
                    if (mostReviewed && p._id === mostReviewed._id) return false;
                    return p.rating && p.rating.average >= 3.5 && p.rating.count > 0;
                })
                .sort((a, b) => {
                    const ratingDiff = (b.rating?.average || 0) - (a.rating?.average || 0);
                    if (Math.abs(ratingDiff) > 0.1) return ratingDiff;
                    return (b.rating?.count || 0) - (a.rating?.count || 0);
                });
            const highestRated = sortedByRating[0] || null;
            setBestSeller(highestRated);

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
                    <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 h-auto md:h-[500px] lg:h-[600px] animate-shimmer">
                        <div className="lg:col-span-2 h-[400px] rounded-lg bg-gray-100 sm:h-[450px] md:h-full" />
                        <div className="hidden md:flex flex-col gap-3 sm:gap-4 md:gap-6">
                            <div className="flex-1 rounded-lg bg-gray-100" />
                            <div className="flex-1 rounded-lg bg-gray-100" />
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
                    <div className="relative h-[400px] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md sm:h-[450px] md:h-full lg:col-span-2">
                        {newArrivals.map((product, index) => (
                            <div
                                key={product._id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
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
                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col md:flex-row items-center">
                                    <div className="flex-1 p-5 sm:p-6 md:p-10 lg:p-16 flex flex-col justify-center z-10">
                                        <span className="mb-3 inline-block w-fit rounded-md bg-[var(--primary-electric)] px-3 py-1.5 text-xs font-bold text-white shadow-md sm:mb-4 sm:px-4 sm:text-sm md:mb-6">
                                            New Arrival
                                        </span>
                                        <h2 className="font-heading mb-2 line-clamp-2 text-2xl font-bold leading-tight text-white sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                            {displayTitle(product.title)}
                                        </h2>
                                        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-1 sm:mb-2 font-medium">
                                            {product.category}
                                        </p>
                                        <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                                {"\u20B9"}{product.price.toLocaleString("en-IN")}
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-base sm:text-lg md:text-xl text-white/60 line-through">
                                                    {"\u20B9"}{product.originalPrice.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/products/${product._id}`}
                                            className="touch-target inline-flex w-fit items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-gray-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--primary-electric)] hover:text-white hover:shadow-[var(--glow-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 active:translate-y-0 sm:px-8 sm:py-3 sm:text-base md:py-3.5"
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
                                        className="flex h-11 w-11 items-center justify-center rounded-lg"
                                        aria-label={`Go to slide ${index + 1}`}
                                    >
                                        <span
                                            className={`h-2 rounded-full transition-all duration-200 ease-out ${index === currentSlide
                                                ? "w-8 bg-white"
                                                : "w-2 bg-white/40"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side Column - Stacked Banners */}
                    <div className="hidden lg:flex flex-col gap-6 h-full">
                        {/* Top Card - Trending Product */}
                        {trendingProduct && (
                            <div className="flex-1">
                                <Link
                                    href={`/products/${trendingProduct._id}`}
                                    className="group relative block h-full overflow-hidden rounded-lg border border-gray-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        {trendingProduct.images?.[0]?.url && (
                                            <Image
                                                src={trendingProduct.images[0].url}
                                                alt={trendingProduct.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 z-10">
                                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                            <span className="inline-block rounded-md bg-[var(--secondary-pop)] px-2 py-0.5 text-[10px] font-bold text-white sm:px-3 sm:py-1 sm:text-xs">
                                                Trending
                                            </span>
                                            {trendingProduct.rating && (
                                                <span className="text-white/90 text-xs sm:text-sm font-medium">
                                                    {trendingProduct.rating.count} reviews
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-heading text-base sm:text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
                                            {displayTitle(trendingProduct.title, 64)}
                                        </h3>
                                        <p className="text-white/90 font-semibold text-sm sm:text-base md:text-lg">
                                            From {"\u20B9"}{trendingProduct.price.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Bottom Card - Best Seller */}
                        {bestSeller && (
                            <div className="flex-1">
                                <Link
                                    href={`/products/${bestSeller._id}`}
                                    className="group relative block h-full overflow-hidden rounded-lg border border-gray-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        {bestSeller.images?.[0]?.url && (
                                            <Image
                                                src={bestSeller.images[0].url}
                                                alt={bestSeller.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 z-10">
                                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                            <span className="inline-block rounded-md bg-[var(--success)] px-2 py-0.5 text-[10px] font-bold text-white sm:px-3 sm:py-1 sm:text-xs">
                                                Best Seller
                                            </span>
                                            {bestSeller.rating && (
                                                <span className="text-white/90 text-xs sm:text-sm font-medium">
                                                    {bestSeller.rating.average.toFixed(1)} rating
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-heading text-base sm:text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
                                            {displayTitle(bestSeller.title, 64)}
                                        </h3>
                                        <p className="text-white/90 font-semibold text-sm sm:text-base md:text-lg">
                                            {"\u20B9"}{bestSeller.price.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
