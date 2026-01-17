"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";
import { useOffers } from "@/lib/hooks/useOffers";
import type { Product } from "@/lib/api/products";

// Extend the shared Product type for UI specific fields if they might exist
interface ProductCardProps {
    product: Product & {
        inStock?: boolean;
        originalPrice?: number;
        isBestSeller?: boolean;
        isFeatured?: boolean;
        reviews?: number; // Some components pass flattened reviews
    };
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { getProductOffer } = useOffers();
    const [isHovered, setIsHovered] = useState(false);
    const isWishlisted = isInWishlist(product._id);

    // Calculate offer-based pricing
    const offerPrice = useMemo(() => {
        return getProductOffer(product._id, product.category, product.price);
    }, [product._id, product.category, product.price, getProductOffer]);

    // Determine final display price
    const displayPrice = offerPrice?.discountedPrice ?? product.price;
    const originalDisplayPrice = offerPrice ? product.price : product.originalPrice;
    const discountPercent = offerPrice?.discountPercent ??
        (product.originalPrice && product.originalPrice > product.price
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0);

    // Determine stock status
    const isInStock = product.stock !== undefined ? product.stock > 0 : product.inStock !== false;

    // Get product images (handle both array and single string legacy)
    const images = product.images?.map(img => img.url) || ((product as any).image ? [(product as any).image] : []);

    // Get rating values
    const ratingValue = typeof product.rating === 'object' ? product.rating?.average : (product.rating as number) || 4.5;
    const reviewCount = typeof product.rating === 'object' ? product.rating?.count : product.reviews || 0;

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Construct a safe object for context
        const wishlistProduct = {
            _id: product._id,
            title: product.title,
            price: displayPrice,
            originalPrice: originalDisplayPrice,
            category: product.category,
            image: images[0],
            images: product.images,
            inStock: isInStock,
        };

        toggleWishlist(wishlistProduct);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        } else {
            addToCart(product, 1);
        }
    };

    // Dynamic tag logic - prioritize offer tags
    const getProductTag = () => {
        const stockCount = product.stock ?? 0;

        // Show offer tag if there's an active offer
        if (offerPrice && offerPrice.discountPercent > 0) {
            return {
                text: `-${offerPrice.discountPercent}% OFF`,
                bgColor: "bg-rose-500",
                textColor: "text-white",
                isOffer: true
            };
        }

        if (stockCount > 0 && stockCount <= 5) {
            return { text: "Limited Stock", bgColor: "bg-orange-100", textColor: "text-orange-700", isOffer: false };
        }
        if (product.isFeatured) {
            return { text: "Featured", bgColor: "bg-indigo-100", textColor: "text-indigo-700", isOffer: false };
        }
        if (product.isBestSeller || (ratingValue >= 4.5 && reviewCount > 10)) {
            return { text: "Best Seller", bgColor: "bg-amber-100", textColor: "text-amber-700", isOffer: false };
        }
        if (product.originalPrice && product.originalPrice > product.price) {
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            return { text: `${discount}% Off`, bgColor: "bg-rose-100", textColor: "text-rose-700", isOffer: false };
        }
        return null;
    };
    const productTag = getProductTag();

    return (
        <div
            className={`
                bg-white rounded-[2rem] overflow-hidden group relative
                border border-gray-100
                transition-all duration-500
                w-full
                ${isHovered ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] -translate-y-2' : 'shadow-sm hover:shadow-lg'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image Area */}
            <div className="relative">
                {/* Product Tag Badge */}
                {productTag && (
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full ${productTag.bgColor} ${productTag.textColor} text-xs font-bold shadow-sm ${productTag.isOffer ? 'animate-pulse' : ''}`}>
                        {productTag.text}
                    </div>
                )}

                {/* Offer Name Badge - Show if there's an active offer */}
                {offerPrice && (
                    <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-gray-900/90 text-white text-[10px] font-bold backdrop-blur-sm">
                        ⚡ {offerPrice.offerName}
                    </div>
                )}

                {/* Wishlist Button - Always Visible */}
                <button
                    onClick={handleToggleWishlist}
                    className={`
                        absolute top-4 right-4 w-10 h-10 z-10
                        bg-white/90 backdrop-blur-sm rounded-full 
                        flex items-center justify-center 
                        shadow-sm border border-gray-100
                        transition-all duration-300
                        hover:scale-110 hover:shadow-md
                        ${isWishlisted ? 'bg-rose-50 border-rose-100' : ''}
                    `}
                >
                    <svg
                        className={`w-5 h-5 transition-colors ${isWishlisted ? "text-rose-500" : "text-gray-400"}`}
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={isWishlisted ? 0 : 1.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Product Image */}
                <Link href={`/products/${product._id}`} className="block">
                    <div className="relative aspect-square w-full flex items-center justify-center bg-gray-50/50 p-6 overflow-hidden">
                        {images.length > 0 ? (
                            <Image
                                src={images[0]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                unoptimized
                                className={`
                                    object-contain p-4
                                    transition-all duration-700 mix-blend-multiply
                                    ${isHovered ? 'scale-110' : 'scale-100'}
                                `}
                            />
                        ) : (
                            <span className="text-4xl md:text-6xl opacity-30">📦</span>
                        )}

                        {/* Quick View Button - Desktop Only */}
                        <div className={`
                            hidden md:block
                            absolute bottom-4 left-4 right-4
                            transition-all duration-300
                            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                        `}>
                            <div
                                className="block w-full py-3 bg-white/95 backdrop-blur-xl rounded-2xl text-sm font-bold text-gray-900 shadow-xl text-center hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
                            >
                                Quick View
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Product Info */}
            <div className="p-5 md:p-6">
                {/* Category */}
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">{product.category}</p>

                {/* Product Title */}
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug mb-3 min-h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-amber-700">{ratingValue?.toFixed(1) || "4.5"}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{reviewCount} reviews</span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className={`text-lg md:text-xl font-bold ${offerPrice ? 'text-rose-600' : 'text-gray-900'}`}>
                            ₹{displayPrice.toFixed(2)}
                        </span>
                        {originalDisplayPrice && originalDisplayPrice > displayPrice && (
                            <span className="text-xs text-gray-400 line-through font-medium">₹{originalDisplayPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button
                        onClick={handleBuyNow}
                        disabled={!isInStock}
                        className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                            transition-all duration-300 shadow-sm
                            ${isHovered
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                                : 'bg-gray-100 text-gray-900 hover:bg-indigo-600 hover:text-white'
                            }
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400
                        `}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

