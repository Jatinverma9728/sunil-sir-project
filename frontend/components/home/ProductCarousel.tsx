"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    rating: { average: number; count: number };
    images: Array<{ url: string; alt?: string }>;
    stock: number;
    originalPrice?: number;
    brand?: string;
    isFeatured?: boolean;
}

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    category?: string;
    limit?: number;
    featuredOnly?: boolean;
}

export default function ProductCarousel({
    title,
    subtitle,
    category,
    limit = 8,
    featuredOnly = false,
}: ProductCarouselProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, [category, featuredOnly]);

    const fetchProducts = async () => {
        try {
            const { getProducts } = await import('@/lib/api/products');
            const response = await getProducts({ category, limit, featured: featuredOnly });

            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const itemsToShow = 4;
    const maxIndex = Math.max(0, products.length - itemsToShow);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({
            _id: product._id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            images: product.images,
            inStock: product.stock > 0,
        });
    };

    const handleBuyNow = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    if (loading) {
        return (
            <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-100 rounded-xl w-56 mb-10"></div>
                    <div className="grid grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-[420px] bg-gradient-to-b from-gray-100 to-gray-50 rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-20 lg:py-24">
            {/* Premium Header */}
            <div className="flex items-end justify-between mb-12">
                <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">
                        {subtitle || "Discover"}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">{title}</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-900"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === maxIndex}
                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-900"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="overflow-x-clip overflow-y-visible py-4 -my-4">
                <div
                    className="flex gap-6 transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow + 1.5)}%)` }}
                >
                    {products.map((product) => {
                        const isWishlisted = isInWishlist(product._id);
                        const images = product.images?.map(img => img.url) || [];
                        const isHovered = hoveredId === product._id;

                        return (
                            <div
                                key={product._id}
                                className="flex-shrink-0 w-[calc(25%-18px)] min-w-[280px]"
                                onMouseEnter={() => setHoveredId(product._id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className={`
                                    bg-white rounded-3xl overflow-hidden group 
                                    border border-gray-100
                                    transition-all duration-500
                                    ${isHovered ? 'shadow-2xl shadow-gray-200/80 border-gray-200 -translate-y-2' : 'shadow-sm'}
                                `}>
                                    {/* Product Image */}
                                    <Link href={`/products/${product._id}`} className="block relative">
                                        <div className="relative h-64 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white m-4 rounded-2xl overflow-hidden">
                                            {images.length > 0 ? (
                                                <img
                                                    src={images[0]}
                                                    alt={product.title}
                                                    className={`
                                                        w-full h-full object-cover 
                                                        transition-all duration-700
                                                        ${isHovered ? 'scale-110' : 'scale-100'}
                                                    `}
                                                />
                                            ) : (
                                                <span className="text-6xl opacity-30">📦</span>
                                            )}

                                            {/* Wishlist Button */}
                                            <button
                                                onClick={(e) => handleAddToWishlist(e, product)}
                                                className={`
                                                    absolute top-4 right-4 w-10 h-10 
                                                    bg-white/95 backdrop-blur-sm rounded-full 
                                                    flex items-center justify-center 
                                                    shadow-lg
                                                    transition-all duration-300
                                                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                                                    hover:scale-110
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

                                            {/* Quick view button */}
                                            <div className={`
                                                absolute bottom-4 left-4 right-4
                                                transition-all duration-300
                                                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                            `}>
                                                <button className="w-full py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-lg">
                                                    Quick View
                                                </button>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="px-6 pb-6">
                                        {/* Category */}
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{product.category}</p>

                                        {/* Title */}
                                        <Link href={`/products/${product._id}`}>
                                            <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-3 hover:text-gray-600 transition-colors leading-snug">
                                                {product.title}
                                            </h3>
                                        </Link>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">{product.rating?.average?.toFixed(1) || "4.5"}</span>
                                            </div>
                                            <span className="text-gray-200">|</span>
                                            <span className="text-sm text-gray-400">{product.rating?.count || 0} reviews</span>
                                        </div>

                                        {/* Price & Add to Cart */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => handleBuyNow(e, product)}
                                                disabled={product.stock === 0}
                                                className={`
                                                    w-11 h-11 rounded-full flex items-center justify-center 
                                                    transition-all duration-300
                                                    ${isHovered
                                                        ? 'bg-gray-900 text-white scale-110'
                                                        : 'border border-gray-200 text-gray-400 hover:bg-gray-900 hover:border-gray-900 hover:text-white'
                                                    }
                                                    disabled:opacity-40 disabled:cursor-not-allowed
                                                `}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
