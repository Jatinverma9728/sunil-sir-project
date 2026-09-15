"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import ProductList from "@/components/products/ProductList";
import ViewToggle from "@/components/products/ViewToggle";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";
import type { Product } from "@/lib/api/products";

const QUICK_FILTERS = [
    { id: "all", label: "All Certified Laptops" },
    { id: "thinkpad", label: "ThinkPad" },
    { id: "dell", label: "Dell Latitude" },
    { id: "hp", label: "HP EliteBook" },
    { id: "apple", label: "Apple MacBook" },
    { id: "workstation", label: "Workstations" },
    { id: "under25k", label: "Under ₹25,000" },
];

const TRUST_POINTS = [
    { icon: "✓", title: "32-Point Inspected", desc: "Motherboard, thermal & display tested" },
    { icon: "★", title: "1-Year Warranty", desc: "Comprehensive hardware coverage" },
    { icon: "⚡", title: "Battery Health ≥ 80%", desc: "Verified original battery backup" },
    { icon: "↺", title: "7-Day Replacement", desc: "No questions asked rapid exchange" },
    { icon: "🚚", title: "Free Express Shipping", desc: "Insured transit across India" },
];

interface LaptopsClientProps {
    initialProducts: Product[];
    totalCount?: number;
}

function LaptopsContent({ initialProducts = [], totalCount = 0 }: LaptopsClientProps) {
    const searchParams = useSearchParams();
    const { addToCart } = useCart();

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeQuickFilter, setActiveQuickFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    const itemsPerPage = 12;

    // Filter & sort products locally if loaded, or fetch if needed
    const filteredProducts = useMemo(() => {
        let list = [...products];

        // Search query filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q) ||
                p.tags?.some(t => t.toLowerCase().includes(q))
            );
        }

        // Quick filter pills
        if (activeQuickFilter === "thinkpad") {
            list = list.filter(p => p.title.toLowerCase().includes("thinkpad") || p.tags?.includes("thinkpad"));
        } else if (activeQuickFilter === "dell") {
            list = list.filter(p => p.brand?.toLowerCase() === "dell" || p.title.toLowerCase().includes("latitude") || p.title.toLowerCase().includes("dell"));
        } else if (activeQuickFilter === "hp") {
            list = list.filter(p => p.brand?.toLowerCase() === "hp" || p.title.toLowerCase().includes("elitebook") || p.title.toLowerCase().includes("hp"));
        } else if (activeQuickFilter === "apple") {
            list = list.filter(p => p.brand?.toLowerCase() === "apple" || p.title.toLowerCase().includes("macbook") || p.title.toLowerCase().includes("apple"));
        } else if (activeQuickFilter === "workstation") {
            list = list.filter(p => p.title.toLowerCase().includes("workstation") || p.title.toLowerCase().includes("precision") || p.tags?.includes("workstation"));
        } else if (activeQuickFilter === "under25k") {
            list = list.filter(p => p.price <= 25000);
        }

        // Dedicated brand dropdown / sidebar
        if (selectedBrand !== "all") {
            list = list.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
        }

        // Price filter
        if (maxPrice !== null) {
            list = list.filter(p => p.price <= maxPrice);
        }

        // Sorting
        if (sortBy === "price-asc") {
            list.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            list.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            list.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        } else {
            // Default / popular
            list.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        }

        return list;
    }, [products, searchQuery, activeQuickFilter, selectedBrand, maxPrice, sortBy]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

    const handleAddToCart = (productId: string) => {
        const product = products.find(p => p._id === productId);
        if (product) addToCart(product, 1);
    };

    const handleQuickFilterClick = (filterId: string) => {
        setActiveQuickFilter(filterId);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
            {/* Breadcrumb Bar */}
            <div className="border-b border-slate-200/80 bg-white">
                <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
                    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span>›</span>
                        <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
                        <span>›</span>
                        <span className="font-bold text-slate-900">Refurbished Laptops</span>
                    </nav>
                </div>
            </div>

            {/* Hero Header Banner */}
            <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Grade A+ Certified Inventory
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                                Certified Refurbished Laptops
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                                Enterprise-grade Lenovo ThinkPads, Dell Latitudes, HP EliteBooks and Apple MacBooks. Thoroughly sanitized, bench-tested across 32 checkpoints, and backed by a 1-Year Comprehensive Warranty.
                            </p>
                        </div>

                        {/* Top Highlights Pill Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0 text-xs">
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                                <div className="text-xl font-extrabold text-blue-400">100%</div>
                                <div className="text-slate-300 font-medium mt-0.5">Tested Hardware</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                                <div className="text-xl font-extrabold text-emerald-400">1 Year</div>
                                <div className="text-slate-300 font-medium mt-0.5">Warranty Included</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center col-span-2 sm:col-span-1">
                                <div className="text-xl font-extrabold text-amber-400">7 Days</div>
                                <div className="text-slate-300 font-medium mt-0.5">Easy Replacement</div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Strip */}
                    <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-4">
                        {TRUST_POINTS.map((tp, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                                    {tp.icon}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-100">{tp.title}</h4>
                                    <p className="text-[11px] text-slate-400">{tp.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Filter Pill Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
                <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {QUICK_FILTERS.map(qf => (
                            <button
                                key={qf.id}
                                onClick={() => handleQuickFilterClick(qf.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                    activeQuickFilter === qf.id
                                        ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                                }`}
                            >
                                {qf.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Catalog Section */}
            <main className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8">
                {/* Search, Filter Summary, and View Toggles Bar */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    {/* Search inside laptops */}
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search ThinkPad, i5, 16GB, SSD..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
                        <span className="text-xs text-slate-500 font-medium">
                            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> certified models
                        </span>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                        {/* Sort Dropdown */}
                        <SortDropdown value={sortBy} onChange={setSortBy} />

                        {/* View Toggle (Grid / List) */}
                        <ViewToggle view={view} onViewChange={setView} />
                    </div>
                </div>

                {/* Product Grid / List */}
                {paginatedProducts.length > 0 ? (
                    view === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map(laptop => (
                                <ProductCard
                                    key={laptop._id}
                                    product={laptop}
                                    onAddToCart={() => handleAddToCart(laptop._id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <ProductList
                            products={paginatedProducts}
                            onAddToCart={handleAddToCart}
                        />
                    )
                ) : (
                    <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 my-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                            💻
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No matching certified laptops found</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            Try adjusting your search terms or clearing active filters to see all available refurbished models.
                        </p>
                        <button
                            onClick={() => {
                                setActiveQuickFilter("all");
                                setSearchQuery("");
                                setSelectedBrand("all");
                                setMaxPrice(null);
                            }}
                            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 400, behavior: "smooth" });
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default function LaptopsClient(props: LaptopsClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50/60 p-8 text-center text-xs text-slate-400">Loading certified laptops...</div>}>
            <LaptopsContent {...props} />
        </Suspense>
    );
}
