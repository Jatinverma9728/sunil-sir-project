"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, type Product } from "@/lib/api/products";

const IOT_TABS = [
    { id: "all", label: "All Robotics & IoT" },
    { id: "raspberry", label: "Raspberry Pi & SBC" },
    { id: "arduino", label: "Arduino & ESP32" },
    { id: "robotics", label: "Robots & 3D Printers" },
];

export default function IoTSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIoT = async () => {
            setLoading(true);
            try {
                const res = await getProducts({ limit: 40 });
                if (res.success && res.data) {
                    // Filter for electronics, iot, robotics, 3d printers, kits, controllers
                    const iotList = res.data.filter((p: Product) => {
                        const title = p.title.toLowerCase();
                        const cat = p.category?.toLowerCase() || "";
                        const isLaptop = cat.includes("laptop") || title.includes("thinkpad") || title.includes("latitude") || title.includes("elitebook") || title.includes("macbook");
                        return !isLaptop;
                    });
                    setProducts(iotList);
                }
            } catch (err) {
                console.error("Error fetching IoT products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchIoT();
    }, []);

    const filtered = useMemo(() => {
        if (!products.length) return [];

        if (activeTab === "raspberry") {
            const matches = products.filter(p => p.title.toLowerCase().includes("raspberry"));
            return matches.length > 0 ? matches : products.slice(0, 4);
        }
        if (activeTab === "arduino") {
            const matches = products.filter(p =>
                p.title.toLowerCase().includes("arduino") ||
                p.title.toLowerCase().includes("esp32") ||
                p.title.toLowerCase().includes("esp8266")
            );
            return matches.length > 0 ? matches : products.slice(0, 4);
        }
        if (activeTab === "robotics") {
            const matches = products.filter(p =>
                p.title.toLowerCase().includes("robot") ||
                p.title.toLowerCase().includes("printer") ||
                p.title.toLowerCase().includes("wavego") ||
                p.title.toLowerCase().includes("bambu")
            );
            return matches.length > 0 ? matches : products.slice(0, 4);
        }

        return products.slice(0, 8);
    }, [products, activeTab]);

    if (!loading && products.length === 0) return null;

    return (
        <section className="bg-white py-12 md:py-16 border-b border-slate-200/80">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#028eff] border border-blue-200/60">
                                Powered by Robocraze Standard
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Robotics, IoT & Embedded Hardware
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Genuine development boards, microcontrollers, Raspberry Pi kits, and 3D printers with Pan-India dispatch.
                        </p>
                    </div>

                    <Link
                        href="/iot"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#202020] hover:bg-[#028eff] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs self-start md:self-auto"
                    >
                        <span>Explore IoT Hardware</span>
                        <span>→</span>
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {IOT_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-[#028eff] text-white shadow-xs"
                                : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-96 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {filtered.map((product, index) => (
                            <ProductCard key={product._id} product={product} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
