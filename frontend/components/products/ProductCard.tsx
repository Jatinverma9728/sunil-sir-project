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
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98] // Smooth, premium spring-like easing
            }}
            className={`
                group relative flex flex-col w-full h-full
                bg-white/70 backdrop-blur-md rounded-[1.5rem] overflow-hidden
                border border-white/50
                transition-all duration-500 ease-out
                ${isHovered
                    ? 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] -translate-y-1'
                    : 'shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]'
                }
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Image Section (Edge-to-Edge) */}
            <div className="relative w-full aspect-square bg-gray-50/80 overflow-hidden">
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-2 relative">
                        {productTag && (
                            <div className={`
                                w-fit px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded-xl
                                backdrop-blur-md shadow-sm pointer-events-auto
                                transition-all duration-300
                                ${productTag?.isOffer
                                    ? 'bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 text-white shadow-violet-500/20'
                                    : productTag?.text === 'Limited'
                                        ? 'bg-orange-500/90 text-white shadow-orange-500/20'
                                        : 'bg-white/90 text-gray-900 shadow-black/5 border border-white/20'
                                }
                            `}>
                                {productTag?.text}
                            </div>
                        )}
                        {offerPrice && !productTag?.isOffer && (
                            <div className="w-fit px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white text-xs font-black uppercase tracking-wide rounded-xl shadow-sm backdrop-blur-md shadow-emerald-500/20 pointer-events-auto flex items-center gap-1 animate-pulse-subtle">
                                <span className="text-emerald-100">✦</span>
                                {offerPrice?.offerName}
                            </div>
                        )}
                    </div>

                    {/* Interactive Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className={`
                            pointer-events-auto w-10 h-10 flex flex-shrink-0 items-center justify-center 
                            rounded-full backdrop-blur-md
                            transition-all duration-300 ease-out
                            hover:scale-110 active:scale-90
                            ${isWishlisted
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner'
                                : 'bg-white/80 text-gray-400 border border-white/40 shadow-sm hover:text-gray-900 hover:bg-white'
                            }
                        `}
                    >
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? 'scale-110' : 'scale-100'}`}
                            fill={isWishlisted ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth={isWishlisted ? 0 : 1.5}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                {/* Primary Image */}
                <Link href={`/products/${product._id}`} className="block w-full h-full relative group-hover:opacity-100">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        {images.length > 0 ? (
                            <Image
                                src={images[0]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                unoptimized
                                className={`
                                    object-contain p-4 mix-blend-multiply
                                    transition-all duration-700 ease-[0.21,0.47,0.32,0.98]
                                    ${isHovered ? 'scale-105' : 'scale-100'}
                                `}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                                <span className="text-6xl opacity-20">📦</span>
                            </div>
                        )}
                    </div>
                    {/* Soft gradient overlay at bottom of image for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/20 to-transparent mix-blend-overlay"></div>
                </Link>

                {/* Quick View Floating Action (Desktop) */}
                <div className={`
                    hidden md:flex absolute inset-x-0 bottom-4 items-center justify-center
                    transition-all duration-500 ease-out pointer-events-none
                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}>
                    <Link href={`/products/${product._id}`} className="pointer-events-auto">
                        <div className="px-6 py-2.5 bg-gray-900/90 text-white backdrop-blur-md rounded-full text-sm font-semibold tracking-wide shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] hover:bg-black transition-colors">
                            Quick View
                        </div>
                    </Link>
                </div>
            </div>

            {/* Bottom Content Section */}
            <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50">
                {/* Meta row: Category & Rating */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100 shadow-sm">
                        <svg className="w-3 h-3 text-amber-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[11px]">{ratingValue?.toFixed(1) || "unrated"}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/products/${product._id}`} className="group-hover:text-primary-electric transition-colors duration-300">
                    <h3 className="font-heading text-base font-extrabold text-gray-900 leading-tight line-clamp-2 mb-3 h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                {/* Price & Action Pill Unified Container */}
                <div className="mt-auto flex items-center justify-between h-10 relative overflow-hidden bg-gray-50/80 rounded-xl p-1 border border-gray-100/50 group-hover:bg-white group-hover:border-gray-200 transition-colors duration-300">

                    {/* Price Block */}
                    <div className="flex flex-col justify-center px-2 z-10 transition-transform duration-300 group-hover:-translate-x-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-base font-black tracking-tight ${offerPrice ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary-electric' : 'text-gray-900'}`}>
                                ₹{displayPrice.toLocaleString('en-IN')}
                            </span>
                            {originalDisplayPrice !== undefined && originalDisplayPrice > displayPrice && (
                                <span className="text-[10px] text-gray-400 font-semibold line-through decoration-gray-300">
                                    {originalDisplayPrice.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Unified Interactive Action Pill */}
                    <div className="flex items-center absolute right-1 top-1 bottom-1">
                        {!isInStock ? (
                            <div className="h-full px-5 flex items-center justify-center bg-gray-200 rounded-xl text-xs font-bold text-gray-500 tracking-wider">
                                OUT OF STOCK
                            </div>
                        ) : (
                            <div className="flex items-center h-full">
                                {/* Add to Cart (Icon only initially, expanding on hover if desired, but keeping icon for aesthetic) */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    title="Add to Cart"
                                    className={`
                                        h-full aspect-square flex items-center justify-center rounded-xl bg-gray-900 text-white
                                        transition-all duration-300 z-20 hover:scale-105 hover:bg-primary-electric
                                        ${isAdding ? 'opacity-70 pointer-events-none' : ''}
                                    `}
                                >
                                    {isAdding ? (
                                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    )}
                                </button>

                                {/* Buy Now Slide-out Reveal (visible on card hover) */}
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isBuying}
                                    className={`
                                        h-full bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider
                                        flex items-center justify-center overflow-hidden whitespace-nowrap
                                        transition-all duration-300 ease-[0.21,0.47,0.32,0.98] origin-right ml-1
                                        ${isHovered ? 'w-24 px-3 opacity-100' : 'w-0 px-0 opacity-0'}
                                    `}
                                >
                                    {isBuying ? 'Wait...' : 'Buy Now'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
