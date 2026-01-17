"use client";

import { useState, useEffect, useRef } from "react";
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
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
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

    const scrollToNext = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.scrollWidth / products.length;
            container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    };

    const scrollToPrev = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.scrollWidth / products.length;
            container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
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
            <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-100 rounded-xl w-56 mb-10"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-50 rounded-[2rem]"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-20">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                        {subtitle || "Discover"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{title}</h2>
                </div>
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={scrollToPrev}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-indigo-600 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={scrollToNext}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-indigo-600 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* Product Slider - Touch Scrollable with Snap */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 -my-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {products.map((product) => {
                    const isWishlisted = isInWishlist(product._id);
                    const images = product.images?.map(img => img.url) || [];
                    const isHovered = hoveredId === product._id;

                    return (
                        <div
                            key={product._id}
                            className="flex-shrink-0 w-[280px] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start"
                            onMouseEnter={() => setHoveredId(product._id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className={`
                                bg-white rounded-[2rem] overflow-hidden group 
                                border border-gray-100
                                transition-all duration-300
                                ${isHovered ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] -translate-y-1' : ''}
                            `}>
                                {/* Product Image */}
                                <Link href={`/products/${product._id}`} className="block relative">
                                    <div className="relative h-64 flex items-center justify-center bg-gray-50/50 m-2 rounded-[1.5rem] overflow-hidden">
                                        {images.length > 0 ? (
                                            <img
                                                src={images[0]}
                                                alt={product.title}
                                                className={`
                                                    w-full h-full object-contain p-6
                                                    transition-transform duration-500
                                                    ${isHovered ? 'scale-110' : 'scale-100'}
                                                `}
                                            />
                                        ) : (
                                            <span className="text-4xl opacity-20">📦</span>
                                        )}

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={(e) => handleAddToWishlist(e, product)}
                                            className={`
                                                absolute top-3 right-3 w-9 h-9 
                                                bg-white rounded-full 
                                                flex items-center justify-center 
                                                shadow-sm border border-gray-100
                                                transition-all duration-300
                                                hover:scale-110 hover:shadow-md
                                                ${isWishlisted ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"}
                                            `}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill={isWishlisted ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth={isWishlisted ? 0 : 1.5}
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </Link>

                                {/* Product Info */}
                                <div className="px-5 pb-5 pt-2">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                                                {product.category}
                                            </p>
                                            <Link href={`/products/${product._id}`}>
                                                <h3 className="text-base font-bold text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                                                    {product.title}
                                                </h3>
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                                            <span className="text-xs font-bold text-yellow-700">{product.rating?.average?.toFixed(1)}</span>
                                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(0)}</span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toFixed(0)}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => handleBuyNow(e, product)}
                                            disabled={product.stock === 0}
                                            className={`
                                                h-9 px-4 rounded-full text-sm font-medium
                                                transition-all duration-300
                                                ${isHovered
                                                    ? 'bg-gray-900 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                }
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                            `}
                                        >
                                            {product.stock === 0 ? 'OOS' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add scrollbar hide styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
