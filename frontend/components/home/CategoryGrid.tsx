"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/api/products";
import type { Category } from "@/lib/api/products";

const DEFAULT_CATEGORIES = [
    {
        name: "Refurbished Laptops",
        slug: "laptops",
        count: "ThinkPad & Dell",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        accentBg: "bg-blue-50/80 border-blue-100 group-hover:bg-blue-600 group-hover:border-blue-600",
        iconColorClass: "text-blue-600 group-hover:text-white"
    },
    {
        name: "Raspberry Pi & SBC",
        slug: "raspberry-pi",
        count: "Boards & Kits",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        ),
        accentBg: "bg-rose-50/80 border-rose-100 group-hover:bg-rose-600 group-hover:border-rose-600",
        iconColorClass: "text-rose-600 group-hover:text-white"
    },
    {
        name: "Arduino & IoT",
        slug: "iot",
        count: "ESP32 & Sensors",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
        ),
        accentBg: "bg-teal-50/80 border-teal-100 group-hover:bg-teal-600 group-hover:border-teal-600",
        iconColorClass: "text-teal-600 group-hover:text-white"
    },
    {
        name: "3D Printers & CNC",
        slug: "3d-printer",
        count: "Bambu & Ender",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        accentBg: "bg-purple-50/80 border-purple-100 group-hover:bg-purple-600 group-hover:border-purple-600",
        iconColorClass: "text-purple-600 group-hover:text-white"
    },
    {
        name: "Robotics Kits",
        slug: "robotics",
        count: "Drones & Arms",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        accentBg: "bg-amber-50/80 border-amber-100 group-hover:bg-amber-600 group-hover:border-amber-600",
        iconColorClass: "text-amber-600 group-hover:text-white"
    },
    {
        name: "RAM & Storage",
        slug: "components",
        count: "NVMe & DDR4/5",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
            </svg>
        ),
        accentBg: "bg-cyan-50/80 border-cyan-100 group-hover:bg-cyan-600 group-hover:border-cyan-600",
        iconColorClass: "text-cyan-600 group-hover:text-white"
    },
    {
        name: "Online Courses",
        slug: "programming",
        count: "Web & AI Skills",
        isCourse: true,
        icon: (
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
        ),
        accentBg: "bg-indigo-50/80 border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600",
        iconColorClass: "text-indigo-600 group-hover:text-white"
    },
    {
        name: "Flash Deals",
        slug: "deals",
        count: "Up to 70% Off",
        isCourse: false,
        icon: (
            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
        ),
        accentBg: "bg-rose-50/80 border-rose-100 group-hover:bg-rose-600 group-hover:border-rose-600",
        iconColorClass: "text-rose-600 group-hover:text-white"
    }
];

export default function CategoryGrid() {
    const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success && response.data && response.data.length > 0) {
                    const apiMapped = response.data.map((c: Category) => ({
                        name: c.name,
                        slug: c.slug,
                        image: c.image,
                        count: c.productCount ? `${c.productCount} products` : "In Stock",
                        isCourse: false,
                        icon: (
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        ),
                        accentBg: "bg-slate-100/80 border-slate-200 group-hover:bg-slate-900 group-hover:border-slate-900",
                        iconColorClass: "text-slate-700 group-hover:text-white"
                    }));
                    const existingSlugs = new Set(DEFAULT_CATEGORIES.map(d => d.slug));
                    const newOnes = apiMapped.filter(a => !existingSlugs.has(a.slug));
                    setCategories([...DEFAULT_CATEGORIES, ...newOnes]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="bg-white py-10 border-b border-slate-200/80">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#202020] tracking-tight">
                            Shop by Department & Learning Track
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Browse certified hardware, performance upgrades, and practical tech certifications.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="text-xs sm:text-sm font-bold text-[#028eff] hover:text-[#0070d6] flex items-center gap-1 group"
                    >
                        <span>View All Categories</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* Robocraze Style Circular Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
                    {categories.slice(0, 8).map((cat) => {
                        let href = "/products";
                        if (cat.isCourse) {
                            href = "/courses";
                        } else if (cat.slug === "laptops") {
                            href = "/refurbished-laptops";
                        } else if (cat.slug === "iot" || cat.slug === "raspberry-pi" || cat.slug === "robotics" || cat.slug === "3d-printer") {
                            href = "/iot";
                        } else if (cat.slug === "components" || cat.slug === "accessories" || cat.slug === "computer-accessories") {
                            href = "/computer-accessories";
                        } else if (cat.slug === "deals") {
                            href = "/products?deals=true";
                        } else {
                            href = `/products?category=${cat.slug}`;
                        }

                        return (
                            <Link
                                key={cat.slug}
                                href={href}
                                className="group flex flex-col items-center text-center transition-all duration-200"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-slate-100 bg-slate-50/80 flex items-center justify-center p-3 mb-3 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#028eff] group-hover:bg-white group-hover:shadow-md">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <div className="text-slate-700 group-hover:text-[#028eff] transition-colors">
                                            {cat.icon}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#028eff] transition-colors leading-tight text-center max-w-[130px]">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
