"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getActiveOffers, Offer } from "@/lib/api/promotions";
import { getProducts, Product } from "@/lib/api/products";

interface FlashSaleProduct {
    _id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    discount: number;
    rating: number;
    soldCount: number;
}

export default function FlashSale() {
    const [products, setProducts] = useState<FlashSaleProduct[]>([]);
    const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Calculate time remaining until offer ends
    const calculateTimeLeft = useCallback((endDate: string) => {
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    }, []);

    // Fetch flash sale offers and products
    useEffect(() => {
        const fetchFlashSale = async () => {
            setLoading(true);
            try {
                // Get active offers
                const offersRes = await getActiveOffers();

                if (offersRes.success && offersRes.data) {
                    // Find flash_sale type offers
                    const flashOffers = (offersRes.data as Offer[]).filter(
                        (offer: Offer) => offer.type === "flash_sale"
                    );

                    if (flashOffers.length > 0) {
                        // Use the highest priority flash sale
                        const offer = flashOffers.sort((a, b) => b.priority - a.priority)[0];
                        setActiveOffer(offer);
                        setTimeLeft(calculateTimeLeft(offer.endDate));

                        // Find products for this offer
                        if (offer.applicableProducts && offer.applicableProducts.length > 0) {
                            // Offer has specific products
                            const productsRes = await getProducts({ limit: 100 });
                            if (productsRes.success && productsRes.data) {
                                const offerProducts = productsRes.data
                                    .filter((p: Product) => offer.applicableProducts?.includes(p._id))
                                    .slice(0, 10)
                                    .map((p: Product) => mapProductWithDiscount(p, offer));
                                setProducts(offerProducts);
                            }
                        } else if (offer.applicableCategories && offer.applicableCategories.length > 0) {
                            // Offer applies to categories
                            const productsRes = await getProducts({ limit: 100 });
                            if (productsRes.success && productsRes.data) {
                                const categoryProducts = productsRes.data
                                    .filter((p: Product) => offer.applicableCategories?.includes(p.category))
                                    .filter((p: Product) => !offer.excludedProducts?.includes(p._id))
                                    .slice(0, 10)
                                    .map((p: Product) => mapProductWithDiscount(p, offer));
                                setProducts(categoryProducts);
                            }
                        } else {
                            // Offer applies to all products (except excluded)
                            const productsRes = await getProducts({ limit: 10 });
                            if (productsRes.success && productsRes.data) {
                                const allProducts = productsRes.data
                                    .filter((p: Product) => !offer.excludedProducts?.includes(p._id))
                                    .map((p: Product) => mapProductWithDiscount(p, offer));
                                setProducts(allProducts);
                            }
                        }
                    } else {
                        // No flash sale offers - show fallback products
                        loadFallbackProducts();
                    }
                } else {
                    loadFallbackProducts();
                }
            } catch (error) {
                console.error("Error fetching flash sale:", error);
                loadFallbackProducts();
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSale();
    }, [calculateTimeLeft]);

    // Map product with discount calculation
    const mapProductWithDiscount = (product: Product, offer: Offer): FlashSaleProduct => {
        const originalPrice = product.price;
        let discountedPrice = originalPrice;
        let discountPercent = 0;

        if (offer.discountType === "percentage") {
            discountPercent = offer.discountValue;
            discountedPrice = originalPrice * (1 - offer.discountValue / 100);
            // Apply max discount cap if set
            if (offer.maxDiscount && (originalPrice - discountedPrice) > offer.maxDiscount) {
                discountedPrice = originalPrice - offer.maxDiscount;
                discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
            }
        } else {
            // Fixed discount
            discountedPrice = Math.max(0, originalPrice - offer.discountValue);
            discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        }

        return {
            _id: product._id,
            title: product.title,
            price: Math.round(discountedPrice * 100) / 100,
            originalPrice: originalPrice,
            image: product.images?.[0]?.url || "",
            discount: discountPercent,
            rating: product.rating?.average || 4.5,
            soldCount: Math.floor(Math.random() * 500) + 50, // Simulated sold count
        };
    };

    // Load fallback products when no flash sale is active
    const loadFallbackProducts = async () => {
        try {
            const productsRes = await getProducts({ limit: 5 });
            if (productsRes.success && productsRes.data) {
                const fallbackProducts = productsRes.data.map((p: Product) => ({
                    _id: p._id,
                    title: p.title,
                    price: p.price,
                    originalPrice: p.price,
                    image: p.images?.[0]?.url || "",
                    discount: 0,
                    rating: p.rating?.average || 4.5,
                    soldCount: Math.floor(Math.random() * 300) + 50,
                }));
                setProducts(fallbackProducts);
            }
        } catch (error) {
            console.error("Error loading fallback products:", error);
        }
    };

    // Countdown timer
    useEffect(() => {
        if (!activeOffer) return;

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(activeOffer.endDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [activeOffer, calculateTimeLeft]);

    // Don't render if no products
    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <section className="bg-gradient-to-r from-rose-50 to-orange-50 py-12">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-2xl sm:text-3xl animate-pulse">⚡</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                {activeOffer?.name || "Flash Sale"}
                            </h2>
                        </div>

                        {/* Countdown Timer */}
                        {activeOffer && (
                            <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm border border-rose-100 w-fit">
                                <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Ends in:</span>
                                <div className="flex gap-0.5 sm:gap-1">
                                    {[
                                        { value: timeLeft.hours, label: "h" },
                                        { value: timeLeft.minutes, label: "m" },
                                        { value: timeLeft.seconds, label: "s" },
                                    ].map((time, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="bg-gradient-to-br from-rose-500 to-orange-500 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm">
                                                {String(time.value).padStart(2, "0")}
                                            </div>
                                            {index < 2 && <span className="text-gray-400 mx-0.5 sm:mx-1 font-bold text-xs sm:text-sm">:</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/products"
                        className="group flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors w-fit"
                    >
                        <span className="text-sm sm:text-base">See All</span>
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 animate-pulse h-[280px] sm:h-[300px]"></div>
                        ))}
                    </div>
                ) : (
                    /* Products Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                href={`/products/${product._id}`}
                                className="group bg-white border border-rose-100 rounded-2xl sm:rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.1)] transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square bg-rose-50/30 p-3 sm:p-4 md:p-6">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-contain p-2 sm:p-3 md:p-4 group-hover:scale-110 transition-transform duration-500 mixing-blend-multiply"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                                            📦
                                        </div>
                                    )}
                                    {product.discount > 0 && (
                                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-3 sm:p-4 md:p-5">
                                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-rose-600 transition-colors">
                                        {product.title}
                                    </h3>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                        <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                                            ₹{product.price.toFixed(0)}
                                        </span>
                                        {product.originalPrice > product.price && (
                                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                                ₹{product.originalPrice.toFixed(0)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating & Sold */}
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs pt-2 sm:pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="font-medium text-gray-700">{product.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-gray-400 font-medium truncate ml-1">{product.soldCount} claimed</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-2 sm:mt-3 w-full bg-gray-100 rounded-full h-1 sm:h-1.5 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-rose-500 to-orange-500 h-full rounded-full"
                                            style={{ width: `${Math.min(100, (product.soldCount / 600) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
