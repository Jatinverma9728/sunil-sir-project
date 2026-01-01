"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    description?: string;
    rating?: number;
    reviews?: number;
    image?: string;
    images?: Array<{ url: string; alt?: string }>;
    stock?: number;
    inStock?: boolean;
    originalPrice?: number;
    brand?: string;
    isBestSeller?: boolean;
    isFeatured?: boolean;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const isWishlisted = isInWishlist(product._id);

    // Determine stock status
    const isInStock = product.stock !== undefined ? product.stock > 0 : product.inStock !== false;

    // Get product images
    const images = product.images?.map(img => img.url) || (product.image ? [product.image] : []);

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({
            _id: product._id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            image: product.image,
            images: product.images,
            inStock: isInStock,
        });
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

    // Dynamic tag logic
    const getProductTag = () => {
        const stockCount = product.stock ?? 0;
        if (stockCount > 0 && stockCount <= 5) {
            return { text: "Limited Stock", bgColor: "bg-orange-50", textColor: "text-orange-600" };
        }
        if (product.isFeatured) {
            return { text: "Featured", bgColor: "bg-[#C1FF72]/20", textColor: "text-gray-900" };
        }
        if (product.isBestSeller || (product.rating && product.rating >= 4.5)) {
            return { text: "Best Seller", bgColor: "bg-[#C1FF72]/20", textColor: "text-gray-900" };
        }
        if (product.originalPrice && product.originalPrice > product.price) {
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            return { text: `${discount}% Off`, bgColor: "bg-red-50", textColor: "text-red-600" };
        }
        return null;
    };
    const productTag = getProductTag();

    return (
        <div
            className={`
                bg-white rounded-3xl overflow-hidden group relative
                border border-gray-100
                transition-all duration-500
                w-full
                ${isHovered ? 'shadow-2xl shadow-gray-200/80 border-[#C1FF72] -translate-y-2' : 'shadow-sm hover:shadow-lg'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image Area */}
            <div className="relative">
                {/* Product Tag Badge */}
                {productTag && (
                    <div className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full ${productTag.bgColor} ${productTag.textColor} text-xs font-semibold shadow-sm`}>
                        {productTag.text}
                    </div>
                )}

                {/* Wishlist Button - Always Visible */}
                <button
                    onClick={handleToggleWishlist}
                    className={`
                        absolute top-3 right-3 w-10 h-10 z-10
                        bg-white/95 backdrop-blur-sm rounded-full 
                        flex items-center justify-center 
                        shadow-md
                        transition-all duration-300
                        hover:scale-110
                        ${isWishlisted ? 'bg-red-50' : ''}
                    `}
                >
                    <svg
                        className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500" : "text-gray-400"}`}
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
                    <div className="relative aspect-square w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 overflow-hidden">
                        {images.length > 0 ? (
                            <Image
                                src={images[0]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                unoptimized
                                className={`
                                    object-contain p-4
                                    transition-all duration-700
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
                            <Link
                                href={`/products/${product._id}`}
                                className="block w-full py-2.5 bg-[#C1FF72] backdrop-blur-sm rounded-xl text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-lg text-center"
                            >
                                Quick View
                            </Link>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Product Info */}
            <div className="px-4 md:px-5 pb-5 md:pb-6">
                {/* Category */}
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{product.category}</p>

                {/* Product Title */}
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors leading-snug mb-3 min-h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{product.rating?.toFixed(1) || "4.5"}</span>
                    </div>
                    <span className="text-gray-200">|</span>
                    <span className="text-sm text-gray-400 hidden sm:inline">{product.reviews || 0} reviews</span>
                    <span className="text-sm text-gray-400 sm:hidden">{product.reviews || 0}</span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs md:text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button
                        onClick={handleBuyNow}
                        disabled={!isInStock}
                        className={`
                            w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center 
                            transition-all duration-300
                            ${isHovered
                                ? 'bg-[#C1FF72] text-gray-900 scale-110 shadow-lg shadow-[#C1FF72]/20'
                                : 'bg-gray-900 text-white hover:bg-[#C1FF72] hover:text-gray-900 hover:shadow-lg hover:shadow-[#C1FF72]/20'
                            }
                            disabled:opacity-40 disabled:cursor-not-allowed
                        `}
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
