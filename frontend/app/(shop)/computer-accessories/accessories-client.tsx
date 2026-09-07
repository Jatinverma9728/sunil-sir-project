"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import ProductList from "@/components/products/ProductList";
import ViewToggle from "@/components/products/ViewToggle";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";
import type { Product } from "@/lib/api/products";
import { 
    Zap, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    ChevronRight, 
    Search, 
    Keyboard 
} from "lucide-react";

const ACCESSORY_SUB_FILTERS = [
    { id: "all", label: "All Accessories" },
    { id: "input", label: "Keyboards & Mice" },
    { id: "hubs", label: "USB-C Hubs & Docks" },
    { id: "chargers", label: "GaN Chargers & Cables" },
    { id: "storage", label: "Storage & Enclosures" },
    { id: "ergonomic", label: "Stands & Desk Mats" },
];

const ACCESSORY_TRUST_POINTS = [
    { icon: Zap, title: "Universal Compatibility", desc: "Tested with Mac, Windows & Linux" },
    { icon: ShieldCheck, title: "1-Year Warranty", desc: "Full replacement on electronics" },
    { icon: Truck, title: "Express Dispatch", desc: "Delivered safely across India" },
    { icon: RotateCcw, title: "7-Day Easy Return", desc: "Hassle-free guarantee" },
];

interface AccessoriesClientProps {
    initialProducts: Product[];
    totalCount?: number;
}

function AccessoriesContent({ initialProducts = [], totalCount = 0 }: AccessoriesClientProps) {
    const searchParams = useSearchParams();
    const { addToCart } = useCart();

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSubFilter, setActiveSubFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    const itemsPerPage = 12;

    const filteredProducts = useMemo(() => {
        let list = [...products];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q) ||
                p.tags?.some(t => t.toLowerCase().includes(q))
            );
        }

        // Subcategory pill filter
        if (activeSubFilter === "input") {
            list = list.filter(p =>
                p.title.toLowerCase().includes("keyboard") ||
                p.title.toLowerCase().includes("mouse") ||
                p.tags?.some(t => t.toLowerCase().includes("keyboard") || t.toLowerCase().includes("mouse"))
            );
        } else if (activeSubFilter === "hubs") {
            list = list.filter(p =>
                p.title.toLowerCase().includes("hub") ||
                p.title.toLowerCase().includes("dock") ||
                p.tags?.some(t => t.toLowerCase().includes("hub") || t.toLowerCase().includes("dock"))
            );
        } else if (activeSubFilter === "chargers") {
            list = list.filter(p =>
                p.title.toLowerCase().includes("charger") ||
                p.title.toLowerCase().includes("cable") ||
                p.title.toLowerCase().includes("gan") ||
                p.tags?.some(t => t.toLowerCase().includes("charger") || t.toLowerCase().includes("cable"))
            );
        } else if (activeSubFilter === "storage") {
            list = list.filter(p =>
                p.title.toLowerCase().includes("nvme") ||
                p.title.toLowerCase().includes("enclosure") ||
                p.title.toLowerCase().includes("ssd") ||
                p.tags?.some(t => t.toLowerCase().includes("storage") || t.toLowerCase().includes("enclosure"))
            );
        } else if (activeSubFilter === "ergonomic") {
            list = list.filter(p =>
                p.title.toLowerCase().includes("stand") ||
                p.title.toLowerCase().includes("mat") ||
                p.title.toLowerCase().includes("mousepad") ||
                p.tags?.some(t => t.toLowerCase().includes("stand") || t.toLowerCase().includes("desk mat"))
            );
        }

        // Sorting
        if (sortBy === "price-asc") {
            list.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            list.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            list.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        } else {
            list.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        }

        return list;
    }, [products, searchQuery, activeSubFilter, sortBy]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

    const handleAddToCart = (productId: string) => {
        const product = products.find(p => p._id === productId);
        if (product) addToCart(product, 1);
    };

    const handleSubFilterClick = (filterId: string) => {
        setActiveSubFilter(filterId);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
            {/* Breadcrumb Bar */}
            <div className="border-b border-slate-200/80 bg-white">
                <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
                    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-900">Computer Accessories</span>
                    </nav>
                </div>
            </div>

            {/* Hero Header Banner */}
            <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
                                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                Productivity & Workstation Peripherals
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                                Computer Accessories & Gear
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                                Premium mechanical keyboards, precision ergonomic mice, 100W GaN fast chargers, 7-in-1 Thunderbolt docks, NVMe external enclosures, and aluminum laptop stands designed for developers and power users.
                            </p>
                        </div>

                        {/* Top Highlights */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0 text-xs">
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                                <div className="text-xl font-extrabold text-sky-400">100%</div>
                                <div className="text-slate-300 font-medium mt-0.5">Tested Quality</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                                <div className="text-xl font-extrabold text-emerald-400">1 Year</div>
                                <div className="text-slate-300 font-medium mt-0.5">Warranty Backed</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center col-span-2 sm:col-span-1">
                                <div className="text-xl font-extrabold text-amber-400">Express</div>
                                <div className="text-slate-300 font-medium mt-0.5">India Delivery</div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Strip */}
                    <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ACCESSORY_TRUST_POINTS.map((tp, idx) => {
                            const IconComponent = tp.icon;
                            return (
                                <div key={idx} className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-100">{tp.title}</h4>
                                        <p className="text-[11px] text-slate-400">{tp.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Sub-Filter Pill Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
                <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {ACCESSORY_SUB_FILTERS.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => handleSubFilterClick(sub.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                    activeSubFilter === sub.id
                                        ? "bg-sky-600 text-white shadow-sm ring-2 ring-sky-600/20"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                                }`}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Catalog Section */}
            <main className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8">
                {/* Search & Sort Bar */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search Keyboards, Mice, Docks, Chargers..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
                        <span className="text-xs text-slate-500 font-medium">
                            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> accessories
                        </span>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                        <SortDropdown value={sortBy} onChange={setSortBy} />
                        <ViewToggle view={view} onViewChange={setView} />
                    </div>
                </div>

                {/* Product Grid / List */}
                {paginatedProducts.length > 0 ? (
                    view === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map(acc => (
                                <ProductCard
                                    key={acc._id}
                                    product={acc}
                                    onAddToCart={() => handleAddToCart(acc._id)}
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
                    <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 my-8 shadow-xs">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <Keyboard className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No matching accessories found</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            Try adjusting your search terms or clearing active filters to see all available computer peripherals.
                        </p>
                        <button
                            onClick={() => {
                                setActiveSubFilter("all");
                                setSearchQuery("");
                            }}
                            className="mt-4 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors shadow-xs"
                        >
                            Reset Filter
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

export default function AccessoriesClient(props: AccessoriesClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50/60 p-8 text-center text-xs text-slate-400">Loading computer accessories...</div>}>
            <AccessoriesContent {...props} />
        </Suspense>
    );
}
