"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/context/WishlistContext";
import type { Product } from "@/lib/api/products";

interface ProductListProps {
    products: Product[];
    onAddToCart: (productId: string) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-20 text-center shadow-sm">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-lg bg-gray-50">
                    <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.2-5.2m1.7-5.3a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {products.map((product) => {
                const images = product.images?.map(img => img.url) || ((product as any).image ? [(product as any).image] : []);
                const rating = typeof product.rating === "object" ? product.rating.average : (product.rating || 0);
                const reviewCount = typeof product.rating === "object" ? product.rating.count : ((product as any).reviews || 0);
                const inStock = product.stock !== 0;
                const wishlisted = isInWishlist(product._id);

                const handleWishlist = () => {
                    toggleWishlist({
                        _id: product._id,
                        title: product.title,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        category: product.category,
                        image: images[0],
                        images: product.images,
                        inStock,
                    });
                };

                return (
                    <div
                        key={product._id}
                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg sm:p-6"
                    >
                        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                            <Link href={`/products/${product._id}`} className="mx-auto flex-shrink-0 md:mx-0">
                                <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-4 md:w-56">
                                    {images.length > 0 ? (
                                        <Image
                                            src={images[0]}
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 224px"
                                            className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
                                            <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7.5l-8-4.5-8 4.5m16 0v9l-8 4.5m8-13.5l-8 4.5m0 9v-9m0 9l-8-4.5v-9m8 4.5l-8-4.5" />
                                            </svg>
                                        </div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                                            <span className="rounded-md bg-gray-900 px-3 py-1 text-xs font-bold text-white">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="flex flex-1 flex-col">
                                <div className="mb-4">
                                    <Link href={`/products/${product._id}`}>
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            {product.brand && (
                                                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold uppercase text-blue-700">
                                                    {product.brand}
                                                </span>
                                            )}
                                            <span className="text-xs font-bold uppercase text-gray-400">{product.category}</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 transition-colors hover:text-[var(--primary-electric)] md:text-2xl">
                                            {product.title}
                                        </h3>
                                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 md:text-base">
                                            {product.description || "No description available"}
                                        </p>
                                    </Link>
                                </div>

                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2.5 py-1">
                                        <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-bold text-amber-900">{rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-400">
                                        {reviewCount} reviews
                                    </span>
                                </div>

                                <div className="mt-auto flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {"\u20B9"}{product.price.toLocaleString("en-IN")}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm font-medium text-gray-400 line-through">
                                                {"\u20B9"}{product.originalPrice.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex w-full gap-3 sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={handleWishlist}
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-6 py-3 font-semibold transition-all sm:flex-none ${wishlisted
                                                ? "border-rose-200 bg-rose-50 text-rose-600"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <svg className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={wishlisted ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {wishlisted ? "Saved" : "Wishlist"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onAddToCart(product._id)}
                                            disabled={product.stock === 0}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gray-900 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-[var(--primary-electric)] hover:shadow-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none sm:flex-none"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
