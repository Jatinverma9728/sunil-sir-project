"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/lib/api/products";

interface ProductGridProps {
    products: Product[];
    onAddToCart: (productId: string) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    if (!products || products.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-100/50 shadow-sm text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find exactly what you're looking for. Try adjusting your filters or search terms.</p>
                <Link href="/products" className="px-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Clear Filters
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={(p) => onAddToCart(p._id)}
                />
            ))}
        </div>
    );
}
