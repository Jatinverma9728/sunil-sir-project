"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/api/products";
import type { Category } from "@/lib/api/products";

// Color options for categories
const colorOptions = [
    "bg-purple-50", "bg-blue-50", "bg-orange-50", "bg-teal-50",
    "bg-indigo-50", "bg-gray-50", "bg-pink-50", "bg-cyan-50",
    "bg-yellow-50", "bg-green-50"
];

export default function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-12">
                <div className="max-w-[1600px] mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
                        <div className="grid grid-cols-5 lg:grid-cols-10 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="py-8 md:py-12">
            <div className="max-w-[1600px] mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
                    <Link
                        href="/products"
                        className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-5 lg:grid-cols-10 md:gap-6 md:mx-0 md:px-0 md:pb-0">
                    {categories.map((category, index) => (
                        <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="flex-shrink-0 flex flex-col items-center group mr-6 md:mr-0"
                        >
                            {/* Circle Icon */}
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${colorOptions[index % colorOptions.length]} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden border border-white`}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black" />
                                {/* Display emoji icon from database */}
                                <span className="text-4xl">{category.icon}</span>
                            </div>

                            {/* Category Name */}
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors text-center whitespace-nowrap">
                                {category.name}
                            </span>

                            {/* Product Count (optional) */}
                            {category.productCount !== undefined && category.productCount > 0 && (
                                <span className="text-xs text-gray-400 mt-1">
                                    {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
