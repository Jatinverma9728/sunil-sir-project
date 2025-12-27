"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
    {
        name: "Earphones",
        tagline: "Crystal Clear Sound",
        emoji: "🎧",
        href: "/products?category=electronics",
        stats: "50+",
    },
    {
        name: "Smart Watches",
        tagline: "Stay Connected",
        emoji: "⌚",
        href: "/products?category=electronics",
        stats: "30+",
    },
    {
        name: "Laptops",
        tagline: "Power & Performance",
        emoji: "💻",
        href: "/products?category=electronics",
        stats: "25+",
    },
    {
        name: "Gaming",
        tagline: "Level Up Your Game",
        emoji: "🎮",
        href: "/products?category=electronics",
        stats: "40+",
    },
    {
        name: "VR Headsets",
        tagline: "Immersive Experience",
        emoji: "🥽",
        href: "/products?category=electronics",
        stats: "15+",
    },
];

export default function CategoryGrid() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Section Header with animation */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4 animate-fade-in">
                            Collections
                        </p>
                        <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
                            Shop by Category
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-3 text-gray-500 hover:text-gray-900 text-sm font-medium transition-all duration-300 group"
                    >
                        View all
                        <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white transition-all duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Premium Bento Grid - 5 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6">

                    {/* Card 1 - Earphones (Large, spans 2 rows) */}
                    <Link
                        href={categories[0].href}
                        className="lg:col-span-4 lg:row-span-2 group"
                        onMouseEnter={() => setHoveredIndex(0)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="h-full min-h-[480px] lg:min-h-full rounded-3xl p-8 lg:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gray-400/20">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Decorative ring */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 border border-white/5 rounded-full transition-transform duration-700 group-hover:scale-110"></div>
                            <div className="absolute -right-10 -top-10 w-40 h-40 border border-white/10 rounded-full transition-transform duration-700 group-hover:scale-125"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-10">
                                    <span className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] border border-gray-700 px-3 py-1.5 rounded-full">
                                        Featured
                                    </span>
                                    <span className="w-11 h-11 border border-gray-600 rounded-full flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 group-hover:rotate-45">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </span>
                                </div>

                                <h3 className="text-3xl lg:text-4xl font-medium text-white mb-2 tracking-tight">
                                    {categories[0].name}
                                </h3>
                                <p className="text-gray-400 text-base">{categories[0].tagline}</p>

                                {/* Emoji with enhanced animation */}
                                <div className={`
                                    text-[140px] lg:text-[180px] absolute right-0 bottom-16 
                                    transition-all duration-700 ease-out
                                    ${hoveredIndex === 0 ? 'scale-110 -translate-y-4 rotate-6' : 'scale-100'}
                                    drop-shadow-2xl
                                `}>
                                    {categories[0].emoji}
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    <span className="text-white/60 text-sm">{categories[0].stats} products</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2 - Smart Watch */}
                    <Link
                        href={categories[1].href}
                        className="lg:col-span-4 group"
                        onMouseEnter={() => setHoveredIndex(1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="h-full min-h-[230px] rounded-3xl p-7 bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:shadow-amber-200/30 group-hover:-translate-y-1">
                            {/* Decorative element */}
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-medium text-gray-900 mb-1">{categories[1].name}</h3>
                                        <p className="text-gray-500">{categories[1].tagline}</p>
                                    </div>
                                    <span className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300 group-hover:rotate-45">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </span>
                                </div>

                                <div className={`
                                    text-7xl absolute right-4 bottom-6
                                    transition-all duration-500 ease-out
                                    ${hoveredIndex === 1 ? 'scale-125 -rotate-12' : 'scale-100'}
                                `}>
                                    {categories[1].emoji}
                                </div>

                                <div className="mt-auto">
                                    <span className="text-gray-400 text-sm">{categories[1].stats} products</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3 - Laptops */}
                    <Link
                        href={categories[2].href}
                        className="lg:col-span-4 group"
                        onMouseEnter={() => setHoveredIndex(2)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="h-full min-h-[230px] rounded-3xl p-7 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:shadow-gray-300/30 group-hover:-translate-y-1">
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-gray-200/50 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-white shadow-sm rounded-full text-gray-600 text-xs font-medium mb-3">
                                            ⭐ Popular
                                        </span>
                                        <h3 className="text-xl font-medium text-gray-900 mb-1">{categories[2].name}</h3>
                                        <p className="text-gray-500">{categories[2].tagline}</p>
                                    </div>
                                </div>

                                <div className={`
                                    text-7xl absolute right-4 bottom-6
                                    transition-all duration-500 ease-out
                                    ${hoveredIndex === 2 ? 'scale-125 translate-y-[-8px]' : 'scale-100'}
                                `}>
                                    {categories[2].emoji}
                                </div>

                                <div className="mt-auto">
                                    <span className="text-gray-400 text-sm">{categories[2].stats} products</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 4 - Gaming (Wide) */}
                    <Link
                        href={categories[3].href}
                        className="lg:col-span-5 group"
                        onMouseEnter={() => setHoveredIndex(3)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="h-full min-h-[230px] rounded-3xl p-7 lg:p-8 bg-gradient-to-br from-violet-50 to-indigo-50 relative overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:shadow-violet-200/30 group-hover:-translate-y-1">
                            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-violet-200/30 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-medium text-gray-900 mb-1">{categories[3].name}</h3>
                                        <p className="text-gray-500">{categories[3].tagline}</p>
                                    </div>
                                    <span className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium group-hover:bg-violet-600 transition-colors duration-300 shadow-lg">
                                        Browse
                                    </span>
                                </div>

                                <div className={`
                                    text-8xl lg:text-9xl absolute right-8 bottom-2
                                    transition-all duration-500 ease-out
                                    ${hoveredIndex === 3 ? 'scale-110 -translate-y-2 rotate-6' : 'scale-100'}
                                `}>
                                    {categories[3].emoji}
                                </div>

                                <div className="mt-auto">
                                    <span className="text-gray-400 text-sm">{categories[3].stats} products</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 5 - VR Headsets */}
                    <Link
                        href={categories[4].href}
                        className="lg:col-span-3 group"
                        onMouseEnter={() => setHoveredIndex(4)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="h-full min-h-[230px] rounded-3xl p-7 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:shadow-emerald-200/30 group-hover:-translate-y-1">
                            <div className="absolute -right-10 -top-10 w-28 h-28 bg-emerald-200/40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <span className="text-xs font-medium text-emerald-600 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    New Arrival
                                </span>
                                <h3 className="text-xl font-medium text-gray-900 mb-1">{categories[4].name}</h3>
                                <p className="text-gray-500">{categories[4].tagline}</p>

                                <div className={`
                                    text-7xl absolute right-4 bottom-6
                                    transition-all duration-500 ease-out
                                    ${hoveredIndex === 4 ? 'scale-125 rotate-12' : 'scale-100'}
                                `}>
                                    {categories[4].emoji}
                                </div>

                                <div className="mt-auto">
                                    <span className="text-gray-400 text-sm">{categories[4].stats} products</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
