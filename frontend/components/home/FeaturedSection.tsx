"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, Product } from "@/lib/api/products";

export default function FeaturedSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            try {
                let res = await getProducts({ limit: 8, featured: true });
                if (!res.success || !res.data || res.data.length === 0) {
                    res = await getProducts({ limit: 8 });
                }
                if (res.success && res.data) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("Error fetching featured section products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const handleNext = () => {
        if (currentIndex < products.length - 4) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-12 border-b border-slate-200/80">
                <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                        <div className="h-96 rounded-2xl bg-slate-100" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-28 rounded-2xl bg-slate-100" />
                            ))}
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
        <section className="bg-white py-12 md:py-16 border-b border-slate-200/80">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {/* Left: Large Flagship Featured Product */}
                    <Link
                        href={`/products/${featuredProduct._id}`}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#028eff] border border-blue-200 px-3 py-1 rounded-full">
                                Flagship Spotlight
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                                32-Point Inspected
                            </span>
                        </div>

                        {/* Image Showcase */}
                        <div className="relative aspect-[16/10] my-4 flex items-center justify-center">
                            {featuredProduct.images?.[0]?.url ? (
                                <Image
                                    src={featuredProduct.images[0].url}
                                    alt={featuredProduct.title}
                                    fill
                                    className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-slate-300">
                                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Text & Price Bottom */}
                        <div className="pt-4 border-t border-slate-200/70">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#028eff] block mb-1">
                                {featuredProduct.category}
                            </span>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-[#028eff] transition-colors line-clamp-2">
                                {featuredProduct.title}
                            </h3>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[#028eff]">
                                        ₹{featuredProduct.price.toLocaleString("en-IN")}
                                    </span>
                                    {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                                        <span className="text-sm font-semibold text-slate-400 line-through">
                                            ₹{featuredProduct.originalPrice.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#202020] group-hover:bg-[#028eff] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs">
                                    <span>Specifications</span>
                                    <span>→</span>
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Right: Best Sellers List */}
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                    Customer Favorites
                                </span>
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                    Top Rated Hardware
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    aria-label="Previous items"
                                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex >= otherProducts.length - 3}
                                    aria-label="Next items"
                                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                                >
                                    ›
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex flex-col gap-3">
                            {visibleProducts.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/products/${product._id}`}
                                    className="group flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 bg-slate-50 rounded-xl overflow-hidden p-2 border border-slate-100">
                                        {product.images?.[0]?.url && (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.title}
                                                fill
                                                className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                            {product.category}
                                        </span>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                                            {product.title}
                                        </h4>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-sm sm:text-base font-black text-slate-950">
                                                ₹{product.price.toLocaleString("en-IN")}
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-xs font-semibold text-slate-400 line-through">
                                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                        →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
