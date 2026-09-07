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
    Cpu, 
    PackageCheck, 
    Wrench, 
    Truck, 
    ChevronRight, 
    Search,
    Boxes
} from "lucide-react";

const IOT_SUB_FILTERS = [
    { id: "all", label: "All IoT & Robotics" },
    { id: "esp32", label: "ESP32 & Wi-Fi" },
    { id: "raspberry-pi", label: "Raspberry Pi & SBCs" },
    { id: "sensors", label: "Sensors & Modules" },
    { id: "diy-kits", label: "Robotics & DIY Kits" },
    { id: "3d-printer", label: "3D Printers & CNC" },
];

const IOT_TRUST_POINTS = [
    { icon: Cpu, title: "Tested Silicon", desc: "100% genuine ICs & verified pinouts" },
    { icon: PackageCheck, title: "Same-Day Dispatch", desc: "Orders packed within 4 hours" },
    { icon: Wrench, title: "Maker Friendly", desc: "Tutorials & GitHub library support" },
    { icon: Truck, title: "Pan-India Courier", desc: "Reliable BlueDart & Delhivery" },
];

interface IoTClientProps {
    initialProducts: Product[];
    totalCount?: number;
}

function IoTContent({ initialProducts = [], totalCount = 0 }: IoTClientProps) {
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

        // Search text
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q) ||
                p.tags?.some(t => t.toLowerCase().includes(q))
            );
        }

        // Subcategory pill filter
        if (activeSubFilter === "esp32") {
            list = list.filter(p =>
                p.title.toLowerCase().includes("esp32") ||
                p.title.toLowerCase().includes("esp8266") ||
                p.title.toLowerCase().includes("wifi") ||
                p.tags?.some(t => t.toLowerCase().includes("esp") || t.toLowerCase().includes("wifi"))
            );
        } else if (activeSubFilter === "raspberry-pi") {
            list = list.filter(p =>
                p.category === "raspberry-pi" ||
                p.title.toLowerCase().includes("raspberry") ||
                p.tags?.some(t => t.toLowerCase().includes("raspberry"))
            );
        } else if (activeSubFilter === "sensors") {
            list = list.filter(p =>
                p.category === "sensor" ||
                p.category === "rfid" ||
                p.title.toLowerCase().includes("sensor") ||
                p.title.toLowerCase().includes("rfid") ||
                p.title.toLowerCase().includes("antenna") ||
                p.title.toLowerCase().includes("module")
            );
        } else if (activeSubFilter === "diy-kits") {
            list = list.filter(p =>
                p.category === "diy-kits" ||
                p.category === "drone-kit" ||
                p.title.toLowerCase().includes("kit") ||
                p.title.toLowerCase().includes("robot") ||
                p.title.toLowerCase().includes("drone")
            );
        } else if (activeSubFilter === "3d-printer") {
            list = list.filter(p =>
                p.category === "3d-printer" ||
                p.title.toLowerCase().includes("printer") ||
                p.title.toLowerCase().includes("bambu")
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
                        <span className="font-bold text-slate-900">IoT, Robotics & Kits</span>
                    </nav>
                </div>
            </div>

            {/* Hero Header Banner */}
            <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:py-12 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                                Prototyping & Embedded Systems
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                                IoT, Robotics & Development Gear
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                                Genuine microcontrollers, development boards, and maker modules. From ESP32 and Raspberry Pi kits to wireless telemetry, industrial sensors, and autonomous robot chassis.
                            </p>
                        </div>

                        {/* Stats Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0 text-xs">
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                                <div className="text-xl font-extrabold text-teal-400">100%</div>
                                <div className="text-slate-300 font-medium mt-0.5">Original Silicon</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                                <div className="text-xl font-extrabold text-blue-400">Fast</div>
                                <div className="text-slate-300 font-medium mt-0.5">Pan-India Dispatch</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center col-span-2 sm:col-span-1">
                                <div className="text-xl font-extrabold text-amber-400">Lab Ready</div>
                                <div className="text-slate-300 font-medium mt-0.5">Maker Tested</div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Strip */}
                    <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {IOT_TRUST_POINTS.map((tp, idx) => {
                            const IconComponent = tp.icon;
                            return (
                                <div key={idx} className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
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
                        {IOT_SUB_FILTERS.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => handleSubFilterClick(sub.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                    activeSubFilter === sub.id
                                        ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/20"
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
                {/* Search & Sort Controls */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search ESP32, Raspberry Pi, Sensor, Camera..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
                        <span className="text-xs text-slate-500 font-medium">
                            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> IoT components
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
                            {paginatedProducts.map(item => (
                                <ProductCard
                                    key={item._id}
                                    product={item}
                                    onAddToCart={() => handleAddToCart(item._id)}
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
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <Boxes className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No matching IoT components found</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            Try adjusting your search or switching to "All IoT & Robotics" to see all available boards and kits.
                        </p>
                        <button
                            onClick={() => {
                                setActiveSubFilter("all");
                                setSearchQuery("");
                            }}
                            className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
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

export default function IoTClient(props: IoTClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50/60 p-8 text-center text-xs text-slate-400">Loading IoT gear...</div>}>
            <IoTContent {...props} />
        </Suspense>
    );
}
