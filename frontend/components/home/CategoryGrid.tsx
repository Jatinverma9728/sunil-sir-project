"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/api/products";
import type { Category } from "@/lib/api/products";

const colorOptions = [
    "bg-blue-50 border-blue-100",
    "bg-emerald-50 border-emerald-100",
    "bg-slate-50 border-slate-200",
    "bg-cyan-50 border-cyan-100",
    "bg-amber-50 border-amber-100",
    "bg-rose-50 border-rose-100",
];

function CategoryImage({ category, tone }: { category: Category; tone: string }) {
    return (
        <div className={`relative mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border ${tone} shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md md:h-24 md:w-24`}>
            {category.image ? (
                <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <svg className="h-9 w-9 text-gray-300 md:h-10 md:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5V7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 14l2.4-2.4a1 1 0 011.4 0L13 13.8l1.2-1.2a1 1 0 011.4 0L18 15" />
                </svg>
            )}
        </div>
    );
}

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
            <section className="bg-white py-8 md:py-12">
                <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-100" />
                            <div className="h-8 w-52 animate-pulse rounded bg-gray-100" />
                        </div>
                        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
                    </div>
                    <div className="flex gap-6 overflow-hidden md:grid md:grid-cols-5 lg:grid-cols-10">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="flex shrink-0 flex-col items-center">
                                <div className="mb-4 h-20 w-20 animate-pulse rounded-full bg-gray-100 md:h-24 md:w-24" />
                                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="bg-white py-8 md:py-12">
            <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase text-[var(--primary-electric)]">Shop faster</p>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Shop by category</h2>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-[var(--primary-electric)] hover:text-[var(--primary-electric)]"
                    >
                        View all
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="-mx-4 flex overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:grid md:grid-cols-5 md:gap-6 md:px-0 md:pb-0 lg:grid-cols-10">
                    {categories.map((category, index) => (
                        <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="group mr-6 flex shrink-0 flex-col items-center md:mr-0"
                        >
                            <CategoryImage
                                category={category}
                                tone={colorOptions[index % colorOptions.length]}
                            />
                            <span className="max-w-[7rem] text-center text-sm font-semibold leading-tight text-gray-800 transition-colors group-hover:text-[var(--primary-electric)]">
                                {category.name}
                            </span>
                            {category.productCount !== undefined && category.productCount > 0 && (
                                <span className="mt-1 text-xs text-gray-400">
                                    {category.productCount} {category.productCount === 1 ? "item" : "items"}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
