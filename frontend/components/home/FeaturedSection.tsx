"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/context/WishlistContext";

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

export default function FeaturedSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { getProducts } = await import('@/lib/api/products');
            const response = await getProducts({ limit: 7, featured: true });

            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
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

    const handleNext = () => {
        if (currentIndex < products.length - 4) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-8">
                <div className="max-w-[1600px] mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-6 animate-pulse">
                        <div className="h-96 bg-gray-100 rounded-3xl" />
                        <div>
                            <div className="h-8 bg-gray-100 rounded mb-6 w-48" />
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-72 bg-gray-100 rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    const featuredProduct = products[0];
    const otherProducts = products.slice(1);
    const visibleProducts = otherProducts.slice(currentIndex, currentIndex + 3);

    return (
        <section className="bg-gray-50 py-8">
            <div className="max-w-[1600px] mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Large Featured Product with Image Background */}
                    <Link
                        href={`/products/${featuredProduct._id}`}
                        className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 h-[500px]"
                    >
                        {/* Full Background Image */}
                        <div className="absolute inset-0">
                            {featuredProduct.images?.[0]?.url && (
                                <Image
                                    src={featuredProduct.images[0].url}
                                    alt={featuredProduct.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            )}
                            {/* Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full mb-4 w-fit">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                                    {featuredProduct.brand || "Editor's Choice"}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                                {featuredProduct.title}
                            </h3>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-sm text-white/80 uppercase tracking-wider">Starting at</span>
                                <span className="text-3xl font-bold text-[#C1FF72] drop-shadow-lg">
                                    ₹{featuredProduct.price.toFixed(2)}
                                </span>
                                {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                                    <span className="text-lg text-white/60 line-through">
                                        ₹{featuredProduct.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* CTA Button */}
                            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-[#C1FF72] transition-all duration-300 group-hover:shadow-xl w-fit">
                                <span>View Details</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </Link>

                    {/* Right: Best Selling Products */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Best Selling Products</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-900"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex >= otherProducts.length - 3}
                                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-900"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Products Grid with Slide Animation */}
                        <div className="overflow-hidden">
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500"
                            >
                                {visibleProducts.map((product, index) => {
                                    const isWishlisted = isInWishlist(product._id);
                                    const discount = product.originalPrice && product.originalPrice > product.price
                                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                        : 0;

                                    return (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product._id}`}
                                            className="group bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 relative"
                                        >
                                            {/* Discount Badge */}
                                            {discount > 0 && (
                                                <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full z-10">
                                                    -{discount}%
                                                </span>
                                            )}

                                            {/* Best Choice Badge for middle item */}
                                            {index === 1 && (
                                                <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg z-10">
                                                    ⭐ Best Choice
                                                </span>
                                            )}

                                            {/* Wishlist Button */}
                                            <button
                                                onClick={(e) => handleAddToWishlist(e, product)}
                                                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 hover:scale-110 transition-all duration-300 z-10 border border-gray-100"
                                            >
                                                <svg
                                                    className={`w-4 h-4 transition-colors ${isWishlisted ? "text-red-500" : "text-gray-400"}`}
                                                    fill={isWishlisted ? "currentColor" : "none"}
                                                    stroke="currentColor"
                                                    strokeWidth={isWishlisted ? 0 : 2}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>

                                            {/* Product Image */}
                                            <div className="relative h-40 mb-4 bg-gray-50 rounded-xl overflow-hidden">
                                                {product.images?.[0]?.url ? (
                                                    <Image
                                                        src={product.images[0].url}
                                                        alt={product.title}
                                                        fill
                                                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                                                {product.title}
                                            </h4>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${i < Math.floor(product.rating?.average || 4.5)
                                                                ? "text-amber-400"
                                                                : "text-gray-200"
                                                                }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    ({product.rating?.count || 0})
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{product.price.toFixed(2)}
                                                </span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            {product.stock > 0 ? (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                                    <span className="font-medium">In Stock</span>
                                                </div>
                                            ) : (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                                                    <span className="font-medium">Out of Stock</span>
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        {otherProducts.length > 3 && (
                            <div className="flex justify-center gap-2 pt-2">
                                {Array.from({ length: Math.ceil(otherProducts.length / 3) }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i * 3)}
                                        className={`h-2 rounded-full transition-all duration-300 ${Math.floor(currentIndex / 3) === i
                                            ? "w-8 bg-gray-900"
                                            : "w-2 bg-gray-300 hover:bg-gray-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
