"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getActiveOffers, Offer } from "@/lib/api/promotions";
import { getProducts, Product } from "@/lib/api/products";

interface OfferProduct {
    _id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    discount: number;
    rating: number;
    stock: number;
    category: string;
    brand?: string;
    offerName: string;
    offerType: string;
    offerEndDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function FlashSale() {
    const [products, setProducts] = useState<OfferProduct[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Calculate time remaining until offer ends
    const calculateTimeLeft = useCallback((endDate: string): TimeLeft => {
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }, []);

    // Get offer type display info - vibrant colors for light theme
    const getOfferTypeInfo = (type: string) => {
        const types: Record<string, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
            flash_sale: { label: "Flash Sale", bgColor: "bg-rose-50", textColor: "text-rose-600", borderColor: "border-rose-200" },
            category_sale: { label: "Category Sale", bgColor: "bg-violet-50", textColor: "text-violet-600", borderColor: "border-violet-200" },
            product_offer: { label: "Special Offer", bgColor: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200" },
            bundle_deal: { label: "Bundle Deal", bgColor: "bg-emerald-50", textColor: "text-emerald-600", borderColor: "border-emerald-200" },
            buy_x_get_y: { label: "Buy & Get", bgColor: "bg-amber-50", textColor: "text-amber-600", borderColor: "border-amber-200" },
            min_purchase: { label: "Min Purchase", bgColor: "bg-indigo-50", textColor: "text-indigo-600", borderColor: "border-indigo-200" },
        };
        return types[type] || { label: "Hot Deal", bgColor: "bg-rose-50", textColor: "text-rose-600", borderColor: "border-rose-200" };
    };

    // Fetch all active offers and their products
    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const offersRes = await getActiveOffers();

                if (offersRes.success && offersRes.data && (offersRes.data as Offer[]).length > 0) {
                    const now = Date.now();
                    const activeOffers = (offersRes.data as Offer[])
                        .filter((offer) => new Date(offer.endDate).getTime() > now)
                        .sort((a, b) => b.priority - a.priority);
                    setOffers(activeOffers);

                    // Set timer for first offer
                    if (activeOffers[0]) {
                        setTimeLeft(calculateTimeLeft(activeOffers[0].endDate));
                    }

                    // Fetch products for all offers
                    const productsRes = await getProducts({ limit: 20 });
                    if (productsRes.success && productsRes.data) {
                        const allProducts = productsRes.data;
                        const offerProducts: OfferProduct[] = [];

                        // Process each offer
                        activeOffers.forEach((offer) => {
                            let applicableProducts: Product[] = [];

                            if (offer.applicableProducts && offer.applicableProducts.length > 0) {
                                applicableProducts = allProducts.filter((p: Product) =>
                                    offer.applicableProducts?.includes(p._id)
                                );
                            } else if (offer.applicableCategories && offer.applicableCategories.length > 0) {
                                applicableProducts = allProducts.filter(
                                    (p: Product) =>
                                        offer.applicableCategories?.includes(p.category) &&
                                        !offer.excludedProducts?.includes(p._id)
                                );
                            } else {
                                applicableProducts = allProducts.filter(
                                    (p: Product) => !offer.excludedProducts?.includes(p._id)
                                );
                            }

                            applicableProducts.slice(0, 5).forEach((product) => {
                                const mapped = mapProductWithDiscount(product, offer);
                                if (!offerProducts.find((p) => p._id === mapped._id)) {
                                    offerProducts.push(mapped);
                                }
                            });
                        });

                        setProducts(offerProducts.slice(0, 10));
                    }
                } else {
                    setOffers([]);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
                setOffers([]);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [calculateTimeLeft]);

    // Map product with discount calculation
    const mapProductWithDiscount = (product: Product, offer: Offer): OfferProduct => {
        const originalPrice = product.price;
        let discountedPrice = originalPrice;
        let discountPercent = 0;

        if (offer.discountType === "percentage") {
            discountPercent = offer.discountValue;
            discountedPrice = originalPrice * (1 - offer.discountValue / 100);
            if (offer.maxDiscount && (originalPrice - discountedPrice) > offer.maxDiscount) {
                discountedPrice = originalPrice - offer.maxDiscount;
                discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
            }
        } else {
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
            stock: product.stock || 0,
            category: product.category,
            brand: product.brand,
            offerName: offer.name,
            offerType: offer.type,
            offerEndDate: offer.endDate,
        };
    };

    // Countdown timer
    useEffect(() => {
        if (offers.length === 0) return;

        const timer = setInterval(() => {
            const currentOffer = offers[activeOfferIndex];
            if (currentOffer) {
                const newTimeLeft = calculateTimeLeft(currentOffer.endDate);
                setTimeLeft(newTimeLeft);

                if (
                    newTimeLeft.days === 0 &&
                    newTimeLeft.hours === 0 &&
                    newTimeLeft.minutes === 0 &&
                    newTimeLeft.seconds === 0
                ) {
                    const expiredOfferId = currentOffer._id;
                    const now = Date.now();

                    const remainingOffers = offers.filter((offer) => offer._id !== expiredOfferId);
                    setOffers(remainingOffers);
                    setActiveOfferIndex((index) => Math.min(index, Math.max(remainingOffers.length - 1, 0)));
                    setProducts((prev) =>
                        prev.filter((product) => new Date(product.offerEndDate).getTime() > now)
                    );
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [offers, activeOfferIndex, calculateTimeLeft]);

    // Cycle through offers
    useEffect(() => {
        if (offers.length <= 1) return;

        const interval = setInterval(() => {
            setActiveOfferIndex((prev) => (prev + 1) % offers.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [offers.length]);

    if (!loading && offers.length === 0 && products.length === 0) {
        return null;
    }

    const currentOffer = offers[activeOfferIndex];
    const currentOfferInfo = currentOffer ? getOfferTypeInfo(currentOffer.type) : getOfferTypeInfo("flash_sale");

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 via-white to-orange-50/30 py-12 sm:py-16">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
                    <div className="space-y-4">
                        {/* Offer Type Tabs */}
                        {offers.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {offers.map((offer, index) => {
                                    const info = getOfferTypeInfo(offer.type);
                                    return (
                                        <button
                                            key={offer._id}
                                            onClick={() => setActiveOfferIndex(index)}
                                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 ${index === activeOfferIndex
                                                    ? `${info.bgColor} ${info.textColor} ${info.borderColor} shadow-sm`
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="hidden sm:inline">{offer.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Main Title */}
                        <div className="flex items-center gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 ${currentOfferInfo.bgColor} ${currentOfferInfo.borderColor}`}>
                                <svg className={`h-7 w-7 ${currentOfferInfo.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                                        {currentOffer?.name || "Hot Deals"}
                                    </h2>
                                    <span className="inline-flex items-center rounded-md bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
                                        LIVE
                                    </span>
                                </div>
                                {currentOffer?.description && (
                                    <p className="text-gray-500 text-sm mt-1">{currentOffer.description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Countdown Timer - Colorful & Minimal */}
                    {currentOffer && (
                        <div className="flex flex-col items-start lg:items-end gap-2">
                            <span className="text-gray-500 text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                Ends in
                            </span>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {[
                                    { value: timeLeft.days, label: "D" },
                                    { value: timeLeft.hours, label: "H" },
                                    { value: timeLeft.minutes, label: "M" },
                                    { value: timeLeft.seconds, label: "S" },
                                ].map((unit, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-100 bg-white shadow-sm sm:h-14 sm:w-14">
                                                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-rose-600 to-orange-500 bg-clip-text text-transparent">
                                                    {String(unit.value).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 text-[10px] mt-1 font-semibold uppercase">
                                                {unit.label}
                                            </span>
                                        </div>
                                        {index < 3 && (
                                            <span className="text-rose-400 text-xl font-bold mx-1 mb-4">:</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
                                <div className="mb-4 aspect-square rounded-lg bg-gray-100" />
                                <div className="h-4 bg-gray-100 rounded mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product, index) => {
                            const cardProduct: Product = {
                                _id: product._id,
                                title: product.title,
                                description: product.offerName,
                                category: product.category,
                                brand: product.brand,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                stock: product.stock,
                                images: product.image ? [{ url: product.image }] : [],
                                rating: { average: product.rating, count: 0 },
                                tags: [product.offerName],
                            };

                            return (
                                <ProductCard
                                    key={product._id}
                                    product={cardProduct}
                                    index={index}
                                    disableOfferPricing
                                />
                            );
                        })}
                    </div>
                )}

                {/* View All Link */}
                <div className="flex justify-center mt-10">
                    <Link
                        href="/products"
                        className="group flex items-center gap-3 rounded-lg bg-gray-900 px-8 py-3.5 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-electric)] hover:shadow-xl"
                    >
                        <span>View All Deals</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 transition-colors group-hover:bg-white/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Active Offers Count */}
                {offers.length > 0 && (
                    <div className="flex justify-center mt-5">
                        <span className="text-gray-400 text-sm flex items-center gap-2">
                            <span className="flex gap-1">
                                {offers.slice(0, 3).map((_, i) => (
                                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeOfferIndex ? 'bg-rose-500' : 'bg-gray-300'}`} />
                                ))}
                            </span>
                            {offers.length} active offer{offers.length !== 1 ? "s" : ""} now
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}
