"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getActiveBanners, trackBannerClick, Banner } from "@/lib/api/promotions";

export default function DynamicPromoBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getActiveBanners("hero");
                if (res.success && res.data && res.data.length > 0) {
                    setBanners(res.data);
                }
            } catch (error) {
                console.error("Error fetching promo banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const handleBannerClick = useCallback(async (banner: Banner) => {
        try {
            await trackBannerClick(banner._id);
        } catch (error) {
            // Ignore tracking errors
        }
    }, []);

    if (!loading && banners.length === 0) {
        return <StaticPromoBanners />;
    }

    if (loading) {
        return (
            <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-64 rounded-3xl animate-pulse bg-slate-100" />
                    <div className="h-64 rounded-3xl animate-pulse bg-slate-100" />
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
            {banners.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {banners.slice(0, 2).map((banner) => (
                        <div
                            key={banner._id}
                            onClick={() => handleBannerClick(banner)}
                            className="relative rounded-3xl p-8 overflow-hidden shadow-xs border border-slate-200/80 flex flex-col justify-between min-h-[260px]"
                            style={{ backgroundColor: banner.backgroundColor || '#0F172A', color: banner.textColor || '#FFFFFF' }}
                        >
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2">{banner.title}</h3>
                                {banner.subtitle && <p className="text-sm opacity-90">{banner.subtitle}</p>}
                            </div>
                            {banner.link && (
                                <Link
                                    href={banner.link}
                                    className="relative z-10 w-fit px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-blue-50 transition-colors mt-6 shadow-xs"
                                >
                                    {banner.buttonText || "Learn More"} →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <StaticPromoBanners />
            )}
        </section>
    );
}

// Elevated Editorial Dual Banners
function StaticPromoBanners() {
    return (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10 border-b border-slate-200/80">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Banner 1: Hardware Performance Combo */}
                <Link
                    href="/products?category=components"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#028eff]">
                                Performance Boost
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Micron and Samsung Chips</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-2 text-slate-900 group-hover:text-[#028eff] transition-colors">
                            RAM and NVMe SSD Upgrade Combos
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
                            Upgrade your ThinkPad, Dell or desktop with 16GB DDR4 RAM + 512GB PCIe NVMe SSD. Pre-tested with full warranty.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200/70">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Combo Starting At</span>
                            <span className="text-xl font-black text-[#028eff]">₹3,499</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#202020] group-hover:bg-[#028eff] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs">
                            <span>Shop Combos</span>
                            <span>→</span>
                        </span>
                    </div>
                </Link>

                {/* Banner 2: Online Tech Course Career Pass */}
                <Link
                    href="/courses"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-8 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#028eff]">
                                Career Accelerator
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Lifetime Access and Doubt Support</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-2 text-slate-900 group-hover:text-[#028eff] transition-colors">
                            Full-Stack Web and Python AI Pass
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
                            From foundations to scalable production applications. Build real-world portfolio projects and earn verified certificates.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200/70">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrollment From</span>
                            <span className="text-xl font-black text-[#028eff]">₹499</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#202020] group-hover:bg-[#028eff] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs">
                            <span>View Syllabus</span>
                            <span>→</span>
                        </span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
