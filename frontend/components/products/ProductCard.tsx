"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useOffers } from "@/lib/hooks/useOffers";
import type { Product } from "@/lib/api/products";

interface ProductCardProps {
    product: Product & {
        inStock?: boolean;
        originalPrice?: number;
        isBestSeller?: boolean;
        isFeatured?: boolean;
        reviews?: number;
        condition?: string;
        specs?: { [key: string]: string };
    };
    onAddToCart?: (product: Product) => void;
    index?: number;
    disableOfferPricing?: boolean;
    badgeLabel?: string;
}

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

function extractHardwareSpecs(title: string) {
    const specs: string[] = [];

    // RAM detection
    const ramMatch = title.match(/(\b\d{1,2}\s?GB\s?(?:RAM|DDR\d)?\b)/i);
    if (ramMatch) specs.push(ramMatch[0].trim());

    // Storage detection
    const ssdMatch = title.match(/(\b\d{3,4}\s?GB\s?(?:SSD|NVMe|HDD)?\b|\b\d\s?TB\s?(?:SSD|NVMe)?\b)/i);
    if (ssdMatch) specs.push(ssdMatch[0].trim());

    // Processor detection
    if (/i[3579]-?\d{4,5}[A-Z]?/i.test(title)) {
        const cpuMatch = title.match(/i[3579]-?\d{4,5}[A-Z]?/i);
        if (cpuMatch) specs.push(`Core ${cpuMatch[0].toUpperCase()}`);
    } else if (/ryzen\s?[3579]/i.test(title)) {
        specs.push("AMD Ryzen");
    } else if (/core\s?i[3579]/i.test(title)) {
        const match = title.match(/core\s?i[3579]/i);
        if (match) specs.push(match[0].toUpperCase());
    }

    return specs.slice(0, 3);
}

export default function ProductCard({
    product,
    onAddToCart,
    disableOfferPricing = false,
    badgeLabel,
}: ProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { getProductOffer } = useOffers();
    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const offerPrice = useMemo(() => {
        if (disableOfferPricing) return null;
        return getProductOffer(product._id, product.category, product.price);
    }, [disableOfferPricing, getProductOffer, product._id, product.category, product.price]);

    const displayPrice = offerPrice?.discountedPrice ?? product.price;
    const originalDisplayPrice = offerPrice ? product.price : product.originalPrice;
    const hasDiscount = originalDisplayPrice !== undefined && originalDisplayPrice > displayPrice;
    const discountPercent = hasDiscount ? Math.round((1 - displayPrice / originalDisplayPrice) * 100) : 0;
    const savingsAmount = hasDiscount ? originalDisplayPrice - displayPrice : 0;
    const isInStock = product.stock !== undefined ? product.stock > 0 : product.inStock !== false;
    const isWishlisted = isInWishlist(product._id);

    const images = product.images?.map((img) => img.url) || ((product as any).image ? [(product as any).image] : []);
    const primaryImage = images[0];
    const ratingValue = typeof product.rating === "object" ? product.rating?.average : (product.rating as number) || 0;
    const reviewCount = typeof product.rating === "object" ? product.rating?.count : product.reviews || 0;

    const isRefurbished = product.category?.toLowerCase().includes("laptop") ||
        product.category?.toLowerCase().includes("refurbished") ||
        product.title?.toLowerCase().includes("refurbished") ||
        product.title?.toLowerCase().includes("thinkpad") ||
        product.title?.toLowerCase().includes("latitude");

    const hardwareSpecs = useMemo(() => {
        return extractHardwareSpecs(product.title);
    }, [product.title]);

    const handleToggleWishlist = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        toggleWishlist({
            _id: product._id,
            title: product.title,
            price: displayPrice,
            originalPrice: originalDisplayPrice,
            category: product.category,
            image: primaryImage,
            images: product.images,
            inStock: isInStock,
        });
    };

    const handleAddToCart = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isInStock || isAdding) return;

        setIsAdding(true);
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (onAddToCart) {
            onAddToCart(product);
        } else {
            addToCart({ ...product, price: displayPrice }, 1);
        }

        setIsAdding(false);
    };

    const handleBuyNow = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isInStock || isBuying) return;

        setIsBuying(true);
        addToCart({ ...product, price: displayPrice }, 1);
        await new Promise((resolve) => setTimeout(resolve, 150));
        router.push("/checkout");
    };

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-slate-300">
            {/* Image Container - Balanced 4:3 Aspect Ratio for Perfect Grid Alignment */}
            <div className={`relative aspect-[4/3] w-full overflow-hidden border-b border-slate-100 flex items-center justify-center ${isRefurbished ? 'bg-slate-900' : 'bg-white p-3'}`}>
                <Link href={`/products/${product._id}`} className="relative block h-full w-full">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                            className={`transition-transform duration-500 group-hover:scale-105 ${isRefurbished ? 'object-cover' : 'object-contain mix-blend-multiply'}`}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </Link>

                {/* Badges on Top Left */}
                <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10">
                    {discountPercent > 0 && (
                        <span className="inline-flex items-center rounded bg-[#e95144] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                            -{discountPercent}%
                        </span>
                    )}
                    {isRefurbished && (
                        <span className="inline-flex items-center gap-1 rounded bg-[#10b981] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-xs">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Grade A+
                        </span>
                    )}
                    {badgeLabel && (
                        <span className="inline-flex items-center rounded bg-[#028eff] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-xs">
                            {badgeLabel}
                        </span>
                    )}
                </div>

                {/* Top Right Wishlist Button */}
                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition-all active:scale-90 ${isWishlisted
                        ? "border-rose-200 bg-rose-50 text-rose-500"
                        : "border-slate-200 bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
                        }`}
                >
                    <svg className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Out of stock overlay */}
                {!isInStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px] z-20">
                        <span className="rounded bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Body Details */}
            <div className="flex flex-1 flex-col p-4">
                {/* Brand / Category Line & Rating */}
                <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                        {product.category || "North Tech"}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-amber-500 text-[11px]">
                        <span>★</span>
                        <span className="text-slate-700">{ratingValue ? ratingValue.toFixed(1) : "4.8"}</span>
                        {reviewCount > 0 && <span className="text-slate-400 font-normal">({reviewCount})</span>}
                    </div>
                </div>

                {/* Title with Fixed 2-Line Height for Alignment */}
                <Link href={`/products/${product._id}`} className="block mb-2">
                    <h3 className="line-clamp-2 h-10 text-sm font-bold leading-snug text-slate-900 hover:text-[#028eff] transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* Hardware Specs Micro-Pills */}
                {hardwareSpecs.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-1">
                        {hardwareSpecs.map((spec, i) => (
                            <span
                                key={i}
                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200/60"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>
                )}

                {/* Warranty Tag */}
                {isRefurbished && (
                    <div className="mb-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>6-12M Warranty • 7-Day Easy Return</span>
                    </div>
                )}

                {/* Robocraze Pricing Display */}
                <div className="mt-auto pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-[#028eff]">
                            {formatPrice(displayPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">
                                {formatPrice(originalDisplayPrice)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!isInStock || isAdding}
                        className="flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#028eff] hover:text-[#028eff] hover:bg-blue-50/50 transition-colors disabled:opacity-50 active:scale-95"
                    >
                        {isAdding ? "Adding..." : "Add to Cart"}
                    </button>
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={!isInStock || isBuying}
                        className="flex h-9 items-center justify-center rounded-lg bg-[#202020] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#028eff] transition-colors shadow-xs disabled:opacity-50 active:scale-95"
                    >
                        {isBuying ? "..." : "Buy Now"}
                    </button>
                </div>
            </div>
        </article>
    );
}
