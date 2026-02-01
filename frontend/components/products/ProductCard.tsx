"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";
import { useOffers } from "@/lib/hooks/useOffers";
import { fadeInUp } from "@/lib/animations/scroll-animations";
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
    index?: number; // For stagger animation
}

export default function ProductCard({ product, onAddToCart, index = 0 }: ProductCardProps) {
    const router = useRouter();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { getProductOffer } = useOffers();
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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

    // Get product images
    const images = product.images?.map(img => img.url) || ((product as any).image ? [(product as any).image] : []);

    // Get rating values
    const ratingValue = typeof product.rating === 'object' ? product.rating?.average : (product.rating as number) || 4.5;
    const reviewCount = typeof product.rating === 'object' ? product.rating?.count : product.reviews || 0;

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);

        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 400));

        if (onAddToCart) {
            onAddToCart(product);
        } else {
            addToCart(product, 1);
        }

        setIsAdding(false);
        setShowSuccess(true);

        // Hide success after animation
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsBuying(true);

        // Add to cart first
        addToCart(product, 1);

        // Small delay for visual feedback then redirect to checkout
        await new Promise(resolve => setTimeout(resolve, 300));
        router.push('/checkout');
    };

    // Dynamic tag logic with new badge system
    const getProductTag = () => {
        const stockCount = product.stock ?? 0;

        if (offerPrice && offerPrice.discountPercent > 0) {
            return {
                text: `-${offerPrice.discountPercent}%`,
                className: "badge badge-action",
                isOffer: true
            };
        }

        if (stockCount > 0 && stockCount <= 5) {
            return { text: "Limited", className: "badge bg-orange-100 text-orange-700", isOffer: false };
        }
        if (product.isFeatured) {
            return { text: "Featured", className: "badge badge-primary", isOffer: false };
        }
        if (product.isBestSeller || (ratingValue >= 4.5 && reviewCount > 10)) {
            return { text: "Best Seller", className: "badge badge-secondary", isOffer: false };
        }
        if (product.originalPrice && product.originalPrice > product.price) {
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            return { text: `${discount}% Off`, className: "badge bg-rose-100 text-rose-700", isOffer: false };
        }
        return null;
    };
    const productTag = getProductTag();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1] // Professional easing
            }}
            className={`
                bg-white rounded-[1.25rem] overflow-hidden group relative
                border border-gray-100
                transition-all duration-300 ease-out
                w-full
                ${isHovered
                    ? 'shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12)] -translate-y-1 border-gray-200'
                    : 'shadow-sm'
                }
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image Area */}
            <div className="relative">
                {/* Product Tag Badge - NEW DESIGN */}
                {productTag && (
                    <div className={`absolute top-3 left-3 z-10 ${productTag.className} ${productTag.isOffer ? 'animate-pulse' : ''}`}>
                        {productTag.text}
                    </div>
                )}

                {/* Offer Name Badge - Energetic Design */}
                {offerPrice && (
                    <div
                        className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary-electric to-primary-deep text-white text-[10px] font-bold backdrop-blur-sm"
                    >
                        ⚡ {offerPrice.offerName}
                    </div>
                )}

                {/* Wishlist Button - Subtle Interaction */}
                <button
                    onClick={handleToggleWishlist}
                    className={`
                        absolute top-3 right-3 w-9 h-9 sm:w-10 sm:h-10 z-10 touch-target
                        bg-white/90 backdrop-blur-sm rounded-full 
                        flex items-center justify-center 
                        shadow-sm border
                        transition-all duration-200 ease-out
                        hover:scale-105 active:scale-95
                        ${isWishlisted
                            ? 'bg-rose-50 border-rose-200'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                    `}
                >
                    <svg
                        className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? "text-rose-500" : "text-gray-400"}`}
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={isWishlisted ? 0 : 1.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Product Image - Subtle Gradient Background */}
                <Link href={`/products/${product._id}`} className="block">
                    <div className="relative aspect-square w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 sm:p-6 overflow-hidden">
                        {images.length > 0 ? (
                            <Image
                                src={images[0]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                unoptimized
                                className={`
                                    object-contain p-2 sm:p-4
                                transition-all duration-500 ease-out mix-blend-multiply
                                ${isHovered ? 'scale-105' : 'scale-100'}
                                `}
                            />
                        ) : (
                            <span className="text-4xl md:text-6xl opacity-30">📦</span>
                        )}

                        {/* Quick View Button - Subtle Fade */}
                        <div className={`
                            hidden md:block absolute bottom-4 left-4 right-4
                            transition-all duration-300 ease-out
                            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                        `}>
                            <div className="w-full py-2.5 bg-white/95 backdrop-blur-xl rounded-xl text-sm font-semibold text-gray-900 shadow-sm text-center hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer">
                                Quick View
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Product Info - Mobile-First Padding */}
            <div className="p-4 sm:p-5">
                {/* Category - New Energetic Style */}
                <span className="inline-block px-2.5 py-1 bg-primary-electric/10 text-primary-electric text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                    {product.category}
                </span>

                {/* Product Title - Outfit Font */}
                <Link href={`/products/${product._id}`}>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 line-clamp-2 hover:text-primary-electric transition-colors leading-snug mb-3 min-h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating - Enhanced Design */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-amber-700">{ratingValue?.toFixed(1) || "4.5"}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">({reviewCount})</span>
                </div>

                {/* Price & Add to Cart - Clean Layout */}
                <div className="flex items-center justify-between gap-3 mt-auto">
                    <div className="flex flex-col">
                        <span className={`text-xl sm:text-2xl font-bold ${offerPrice ? 'text-primary-electric' : 'text-gray-900'} transition-colors duration-200`}>
                            ₹{displayPrice.toFixed(2)}
                        </span>
                        {originalDisplayPrice && originalDisplayPrice > displayPrice && (
                            <span className="text-xs text-gray-400 line-through font-medium">₹{originalDisplayPrice.toFixed(2)}</span>
                        )}
                    </div>

                    {/* Action Buttons - Add to Cart & Buy Now */}
                    <div className="flex items-center gap-2">
                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!isInStock || isAdding}
                            title="Add to Cart"
                            className={`
                                w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px]
                                rounded-full flex items-center justify-center 
                                transition-all duration-200 ease-out relative overflow-hidden
                                hover:scale-105 active:scale-95
                                ${!isInStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : isAdding
                                        ? 'bg-primary-electric text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-primary-electric hover:text-white hover:shadow-md'
                                }
                            `}
                        >
                            <div className={`transition-opacity duration-200 ${isAdding ? 'opacity-60' : 'opacity-100'}`}>
                                {isAdding ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : showSuccess ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : isInStock ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                        </button>

                        {/* Buy Now Button */}
                        <button
                            onClick={handleBuyNow}
                            disabled={!isInStock || isBuying}
                            className={`
                                px-4 py-2 h-10 sm:h-11
                                rounded-full flex items-center justify-center gap-1.5
                                text-sm font-semibold
                                transition-all duration-200 ease-out
                                hover:scale-105 active:scale-95
                                ${!isInStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : isBuying
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md'
                                }
                            `}
                        >
                            {isBuying ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Buy Now</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
