"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, type Product } from "@/lib/api/products";

const FILTER_TABS = [
    { id: "all", label: "All Certified Laptops" },
    { id: "thinkpad", label: "Lenovo ThinkPad" },
    { id: "dell", label: "Dell Latitude" },
    { id: "hp", label: "HP EliteBook" },
    { id: "apple", label: "Apple MacBook" },
    { id: "budget", label: "Under ₹25,000" },
];

const CHECKLIST_ITEMS = [
    "Battery Health ≥ 80% Certified",
    "Original OEM Power Charger",
    "Fresh Thermal Paste & Clean Fans",
    "Zero Display Bleed & Dead Pixels",
    "Keyboard, Trackpad & Ports Tested",
    "7-Day Direct Replacement Policy",
];

export default function RefurbishedSection() {
    const [laptops, setLaptops] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLaptops = async () => {
            setLoading(true);
            try {
                const [catRes, searchRes] = await Promise.all([
                    getProducts({ category: "laptops", limit: 20 }),
                    getProducts({ search: "laptop", limit: 20 })
                ]);

                const merged = new Map<string, Product>();
                if (catRes.success && catRes.data) {
                    catRes.data.forEach((p: Product) => merged.set(p._id, p));
                }
                if (searchRes.success && searchRes.data) {
                    searchRes.data.forEach((p: Product) => {
                        const isLaptop = p.category?.toLowerCase() === "laptops" ||
                            p.title?.toLowerCase().includes("thinkpad") ||
                            p.title?.toLowerCase().includes("latitude") ||
                            p.title?.toLowerCase().includes("elitebook") ||
                            p.title?.toLowerCase().includes("macbook") ||
                            p.title?.toLowerCase().includes("precision") ||
                            p.title?.toLowerCase().includes("laptop");

                        if (isLaptop && !merged.has(p._id)) {
                            merged.set(p._id, p);
                        }
                    });
                }

                setLaptops(Array.from(merged.values()));
            } catch (error) {
                console.error("Error fetching refurbished laptops:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLaptops();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!laptops.length) return [];

        if (activeTab === "thinkpad") {
            const matches = laptops.filter(p =>
                p.title.toLowerCase().includes("thinkpad") ||
                p.brand?.toLowerCase() === "lenovo"
            );
            return matches.length > 0 ? matches : laptops;
        }
        if (activeTab === "dell") {
            const matches = laptops.filter(p =>
                p.title.toLowerCase().includes("dell") ||
                p.title.toLowerCase().includes("latitude") ||
                p.title.toLowerCase().includes("precision") ||
                p.brand?.toLowerCase() === "dell"
            );
            return matches.length > 0 ? matches : laptops;
        }
        if (activeTab === "hp") {
            const matches = laptops.filter(p =>
                p.title.toLowerCase().includes("hp") ||
                p.title.toLowerCase().includes("elitebook") ||
                p.brand?.toLowerCase() === "hp"
            );
            return matches.length > 0 ? matches : laptops;
        }
        if (activeTab === "apple") {
            const matches = laptops.filter(p =>
                p.title.toLowerCase().includes("macbook") ||
                p.title.toLowerCase().includes("apple") ||
                p.brand?.toLowerCase() === "apple"
            );
            return matches.length > 0 ? matches : laptops;
        }
        if (activeTab === "budget") {
            const matches = laptops.filter(p => p.price <= 25000);
            return matches.length > 0 ? matches : laptops;
        }

        return laptops;
    }, [laptops, activeTab]);

    return (
        <section className="bg-slate-50/70 py-12 md:py-16 border-b border-slate-200/80">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Certified Refurbished Business Laptops
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Enterprise ThinkPads, Latitudes, and EliteBooks inspected across 32 checkpoints with up to 1-year warranty.
                        </p>
                    </div>

                    <Link
                        href="/refurbished-laptops"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#202020] hover:bg-[#028eff] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs self-start md:self-auto"
                    >
                        <span>Explore Laptops</span>
                        <span>→</span>
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-96 rounded-2xl bg-white border border-slate-200/80 p-4 animate-pulse" />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {filteredProducts.slice(0, 4).map((product, index) => (
                            <ProductCard key={product._id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500 text-sm">No laptops matching this tab right now.</p>
                        <Link href="/refurbished-laptops" className="text-blue-600 font-bold text-xs mt-2 inline-block">
                            Browse All Certified Laptops →
                        </Link>
                    </div>
                )}

                {/* 32-Point Quality Checklist Trust Banner */}
                <div className="mt-8 rounded-2xl bg-slate-950 text-white p-5 md:p-7 shadow-sm border border-slate-800">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
                            <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                                Rigorous Standard
                            </span>
                            <h3 className="text-lg sm:text-xl font-extrabold mt-0.5 text-white">
                                32-Point Inspection Checklist
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Every single machine is hand-tested by our hardware lab before dispatch.
                            </p>
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                            {CHECKLIST_ITEMS.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-200 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
