"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getActiveOffers, Offer } from "@/lib/api/promotions";
import { getProducts, Product } from "@/lib/api/products";
import { useCart } from "@/lib/context/CartContext";

interface OfferProduct {
    _id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    discount: number;
    rating: number;
    stock: number;
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
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const { addToCart } = useCart();

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

    // Get offer type display info - Vibrant colors for light theme
    const getOfferTypeInfo = (type: string) => {
        const types: Record<string, { icon: string; label: string; bgColor: string; textColor: string; borderColor: string }> = {
            flash_sale: { icon: "⚡", label: "Flash Sale", bgColor: "bg-rose-50", textColor: "text-rose-600", borderColor: "border-rose-200" },
            category_sale: { icon: "🏷️", label: "Category Sale", bgColor: "bg-violet-50", textColor: "text-violet-600", borderColor: "border-violet-200" },
            product_offer: { icon: "🎁", label: "Special Offer", bgColor: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200" },
            bundle_deal: { icon: "📦", label: "Bundle Deal", bgColor: "bg-emerald-50", textColor: "text-emerald-600", borderColor: "border-emerald-200" },
            buy_x_get_y: { icon: "🛒", label: "Buy & Get", bgColor: "bg-amber-50", textColor: "text-amber-600", borderColor: "border-amber-200" },
            min_purchase: { icon: "💰", label: "Min Purchase", bgColor: "bg-indigo-50", textColor: "text-indigo-600", borderColor: "border-indigo-200" },
        };
        return types[type] || { icon: "🔥", label: "Hot Deal", bgColor: "bg-rose-50", textColor: "text-rose-600", borderColor: "border-rose-200" };
    };

    // Fetch all active offers and their products
    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const offersRes = await getActiveOffers();

                if (offersRes.success && offersRes.data && (offersRes.data as Offer[]).length > 0) {
                    const activeOffers = (offersRes.data as Offer[]).sort((a, b) => b.priority - a.priority);
                    setOffers(activeOffers);

                    // Set timer for first offer
                    if (activeOffers[0]) {
                        setTimeLeft(calculateTimeLeft(activeOffers[0].endDate));
                    }

                    // Fetch products for all offers
                    const productsRes = await getProducts({ limit: 100 });
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

                if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 &&
                    newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
                    window.location.reload();
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

    // Handle add to cart
    const handleAddToCart = async (e: React.MouseEvent, product: OfferProduct) => {
        e.preventDefault();
        e.stopPropagation();

        if (addingToCart) return;

        setAddingToCart(product._id);
        try {
            const productForCart = {
                _id: product._id,
                title: product.title,
                price: product.price,
                originalPrice: product.originalPrice,
                images: product.image ? [{ url: product.image }] : [],
                stock: product.stock,
            };
            addToCart(productForCart, 1);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setTimeout(() => setAddingToCart(null), 500);
        }
    };

    if (!loading && offers.length === 0 && products.length === 0) {
        return null;
    }

    const currentOffer = offers[activeOfferIndex];
    const currentOfferInfo = currentOffer ? getOfferTypeInfo(currentOffer.type) : getOfferTypeInfo("flash_sale");

    return (
        <section className="relative py-12 sm:py-16 bg-gradient-to-b from-rose-50/50 via-white to-orange-50/30 overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400" />
            <div className="absolute top-20 right-0 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -z-10" />

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
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${index === activeOfferIndex
                                                    ? `${info.bgColor} ${info.textColor} ${info.borderColor} shadow-sm`
                                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span>{info.icon}</span>
                                            <span className="hidden sm:inline">{offer.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Main Title */}
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${currentOfferInfo.bgColor} ${currentOfferInfo.borderColor} border-2 flex items-center justify-center text-2xl`}>
                                {currentOfferInfo.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                                        {currentOffer?.name || "Hot Deals"}
                                    </h2>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white animate-pulse">
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
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center">
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
                            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100">
                                <div className="aspect-square bg-gray-100 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-100 rounded mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                        {products.map((product) => {
                            const isLowStock = product.stock > 0 && product.stock <= 10;
                            const isOutOfStock = product.stock === 0;
                            const productOfferInfo = getOfferTypeInfo(product.offerType);

                            return (
                                <Link
                                    key={product._id}
                                    href={`/products/${product._id}`}
                                    className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Discount Badge */}
                                    {product.discount > 0 && (
                                        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                            -{product.discount}%
                                        </div>
                                    )}

                                    {/* Low Stock Warning */}
                                    {isLowStock && (
                                        <div className="absolute top-3 right-3 z-10 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            Only {product.stock} left
                                        </div>
                                    )}

                                    {/* Product Image */}
                                    <div className="relative aspect-square p-4 bg-gray-50/50">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
                                                📦
                                            </div>
                                        )}

                                        {/* Quick Add Button */}
                                        {!isOutOfStock && (
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={addingToCart === product._id}
                                                className="absolute bottom-3 left-3 right-3 bg-gray-900 text-white py-2.5 rounded-xl font-medium text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {addingToCart === product._id ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Add to Cart
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 pt-3">
                                        {/* Offer tag */}
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 ${productOfferInfo.bgColor} ${productOfferInfo.textColor}`}>
                                            <span>{productOfferInfo.icon}</span>
                                            <span>{productOfferInfo.label}</span>
                                        </div>

                                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px] group-hover:text-rose-600 transition-colors">
                                            {product.title}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            {product.originalPrice > product.price && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₹{product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Rating & Stock Status */}
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-medium text-gray-600">{product.rating.toFixed(1)}</span>
                                            </div>
                                            {isOutOfStock ? (
                                                <span className="text-red-500 font-medium">Out of Stock</span>
                                            ) : isLowStock ? (
                                                <span className="text-amber-600 font-medium">Low Stock</span>
                                            ) : (
                                                <span className="text-emerald-600 font-medium">In Stock</span>
                                            )}
                                        </div>

                                        {/* Urgency Progress Bar */}
                                        {product.stock > 0 && product.stock <= 30 && (
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-rose-500 to-orange-500 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.max(15, 100 - (product.stock / 30) * 100)}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1 text-center">
                                                    🔥 Selling fast
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* View All Link */}
                <div className="flex justify-center mt-10">
                    <Link
                        href="/products"
                        className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <span>View All Deals</span>
                        <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
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
