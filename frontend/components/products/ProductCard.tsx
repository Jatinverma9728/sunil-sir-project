"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    };
    onAddToCart?: (product: Product) => void;
    index?: number;
    disableOfferPricing?: boolean;
    badgeLabel?: string;
}

const formatPrice = (price: number) => `${"\u20B9"}${price.toLocaleString("en-IN")}`;

export default function ProductCard({
    product,
    onAddToCart,
    index = 0,
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
    const isInStock = product.stock !== undefined ? product.stock > 0 : product.inStock !== false;
    const isWishlisted = isInWishlist(product._id);

    const images = product.images?.map((img) => img.url) || ((product as any).image ? [(product as any).image] : []);
    const primaryImage = images[0];
    const ratingValue = typeof product.rating === "object" ? product.rating?.average : (product.rating as number) || 0;
    const reviewCount = typeof product.rating === "object" ? product.rating?.count : product.reviews || 0;

    const statusBadge = (() => {
        if (badgeLabel) return badgeLabel;
        if (discountPercent > 0) return `${discountPercent}% off`;
        if ((product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5) return "Limited";
        if (product.isFeatured) return "Featured";
        if (product.isBestSeller || (ratingValue >= 4.5 && reviewCount > 10)) return "Best Seller";
        return null;
    })();

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
        await new Promise((resolve) => setTimeout(resolve, 250));

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
        await new Promise((resolve) => setTimeout(resolve, 200));
        router.push("/checkout");
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, delay: index * 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary-electric)]/30 hover:shadow-xl"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                <Link href={`/products/${product._id}`} className="absolute inset-0 flex items-center justify-center">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                            unoptimized
                            className="object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <svg className="h-14 w-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7.5l-8-4.5-8 4.5m16 0v9l-8 4.5m8-13.5l-8 4.5m0 9v-9m0 9l-8-4.5v-9m8 4.5l-8-4.5" />
                            </svg>
                        </div>
                    )}
                </Link>

                {statusBadge && (
                    <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold uppercase shadow-sm ${discountPercent > 0
                        ? "bg-rose-600 text-white"
                        : "border border-gray-200 bg-white/95 text-gray-800"
                        }`}>
                        {statusBadge}
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm backdrop-blur transition-all hover:scale-105 ${isWishlisted
                        ? "border-rose-200 bg-rose-50 text-rose-500"
                        : "border-gray-200 bg-white/95 text-gray-500 hover:text-gray-900"
                        }`}
                >
                    <svg className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isWishlisted ? 0 : 1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {!isInStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                        <span className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-bold uppercase text-white">Sold out</span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-[11px] font-bold uppercase text-gray-500">
                        {product.category}
                    </span>
                    <div className="flex shrink-0 items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
                        <svg className="h-3 w-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {ratingValue ? ratingValue.toFixed(1) : "New"}
                    </div>
                </div>

                <Link href={`/products/${product._id}`} className="block">
                    <h3 className="mb-3 h-11 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[var(--primary-electric)]">
                        {product.title}
                    </h3>
                </Link>

                <div className={`mt-auto rounded-lg border p-3 ${hasDiscount ? "border-rose-100 bg-rose-50/70" : "border-gray-200 bg-gray-50"}`}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase text-gray-500">
                            {hasDiscount ? "Sale price" : "Price"}
                        </span>
                        {hasDiscount && (
                            <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-rose-600">
                                Save {discountPercent}%
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                        <span className={`text-2xl font-black leading-none ${hasDiscount ? "text-rose-600" : "text-gray-900"}`}>
                            {formatPrice(displayPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm font-semibold text-gray-400 line-through">
                                {formatPrice(originalDisplayPrice)}
                            </span>
                        )}
                    </div>
                    {offerPrice?.offerName && (
                        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-emerald-700">{offerPrice.offerName}</p>
                    )}
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!isInStock || isAdding}
                        className="flex h-10 items-center justify-center rounded-md bg-gray-900 px-3 text-sm font-bold text-white transition-colors hover:bg-[var(--primary-electric)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        {isAdding ? "Adding..." : "Add to cart"}
                    </button>
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={!isInStock || isBuying}
                        className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        {isBuying ? "Wait" : "Buy"}
                    </button>
                </div>
            </div>
        </motion.article>
    );
}
