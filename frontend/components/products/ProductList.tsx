"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/context/WishlistContext";
import type { Product } from "@/lib/api/products";
import { Heart, ShoppingBag, Star, Package, Search } from "lucide-react";

interface ProductListProps {
    products: Product[];
    onAddToCart: (productId: string) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-xs">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <Search className="h-10 w-10 stroke-[1.5]" />
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
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                    >
                        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                            <Link href={`/products/${product._id}`} className="mx-auto flex-shrink-0 md:mx-0">
                                <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-4 md:w-56">
                                    {images.length > 0 ? (
                                        <Image
                                            src={images[0]}
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 224px"
                                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                                            <Package className="h-10 w-10 stroke-[1.5]" />
                                        </div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                                            <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="flex flex-1 flex-col">
                                <div className="mb-4">
                                    <Link href={`/products/${product._id}`}>
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            {product.brand && (
                                                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                                                    {product.brand}
                                                </span>
                                            )}
                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">{product.category}</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 transition-colors hover:text-blue-600 md:text-2xl">
                                            {product.title}
                                        </h3>
                                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 md:text-base">
                                            {product.description || "No description available"}
                                        </p>
                                    </Link>
                                </div>

                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                        <span className="text-xs font-bold text-amber-900">{rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-400">
                                        {reviewCount} reviews
                                    </span>
                                </div>

                                <div className="mt-auto flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
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
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none ${wishlisted
                                                ? "border-rose-200 bg-rose-50 text-rose-600"
                                                : "border-slate-200 text-gray-600 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <Heart className={`h-4 w-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
                                            <span>{wishlisted ? "Saved" : "Wishlist"}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onAddToCart(product._id)}
                                            disabled={product.stock === 0}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none sm:flex-none"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
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
