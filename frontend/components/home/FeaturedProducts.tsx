"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/api/products";

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await getProducts({ limit: 8, featured: true });
            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching featured products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-white/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                            Trending Now
                        </h2>
                        <p className="text-gray-500 font-medium">Curated selection of our best sellers</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 h-[420px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-white/50">
            <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                            Trending Products
                        </h2>
                        <p className="text-gray-500 font-medium text-lg">
                            Most popular items right now
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
                    >
                        View All
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="md:hidden text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg w-full justify-center"
                    >
                        View All Products
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
