"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getActiveBanners, trackBannerClick, Banner } from "@/lib/api/promotions";

export default function DynamicPromoBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getActiveBanners("hero");
                if (res.success && res.data) {
                    setBanners(res.data);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-rotate banners
    useEffect(() => {
        if (banners.length <= 1 || !isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length, isAutoPlaying]);

    const handleBannerClick = useCallback(async (banner: Banner) => {
        try {
            await trackBannerClick(banner._id);
        } catch (error) {
            // Ignore tracking errors
        }
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Show static banners as fallback if no dynamic banners
    if (!loading && banners.length === 0) {
        return <StaticPromoBanners />;
    }

    if (loading) {
        return (
            <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-[280px] bg-gray-100 rounded-3xl animate-pulse" />
                    <div className="h-[280px] bg-gray-100 rounded-3xl animate-pulse" />
                </div>
            </section>
        );
    }

    const current = banners[currentIndex];

    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16">
            {/* Hero Banner Carousel */}
            {banners.length === 1 ? (
                <SingleBanner banner={current} onClick={() => handleBannerClick(current)} />
            ) : (
                <div className="relative">
                    <div className="overflow-hidden rounded-3xl">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {banners.map((banner) => (
                                <div key={banner._id} className="w-full flex-shrink-0">
                                    <SingleBanner banner={banner} onClick={() => handleBannerClick(banner)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => goToSlide((currentIndex - 1 + banners.length) % banners.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => goToSlide((currentIndex + 1) % banners.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

// Single banner display
function SingleBanner({ banner, onClick }: { banner: Banner; onClick: () => void }) {
    const content = (
        <div
            className="relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] cursor-pointer group"
            style={{ backgroundColor: banner.backgroundColor }}
        >
            {banner.image && (
                <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            )}

            {banner.overlay && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: banner.overlayOpacity }}
                />
            )}

            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16" style={{ color: banner.textColor }}>
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{banner.title}</h2>
                    {banner.subtitle && (
                        <p className="text-lg md:text-xl mb-6 opacity-90">{banner.subtitle}</p>
                    )}
                    {banner.buttonText && (
                        <span className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors group-hover:translate-x-1">
                            {banner.buttonText}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    if (banner.link || banner.buttonLink) {
        return (
            <Link href={banner.buttonLink || banner.link || "/"} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return content;
}

// Static fallback banners (original design)
function StaticPromoBanners() {
    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/products?sale=true" className="group">
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 md:p-12 overflow-hidden cursor-pointer transition-all duration-500 h-full min-h-[280px] flex flex-col justify-between group-hover:shadow-2xl group-hover:shadow-gray-400/20 group-hover:-translate-y-1">
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full transition-transform duration-700 group-hover:scale-150"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full transition-transform duration-700 group-hover:scale-125"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            <span className="inline-block text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-4 border border-gray-700 px-3 py-1.5 rounded-full">
                                Limited Time
                            </span>
                            <h3 className="text-4xl md:text-5xl font-medium text-white mb-3 tracking-tight">Mega Sale</h3>
                            <p className="text-gray-400 text-xl">Up to 70% OFF</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between mt-6">
                            <span className="inline-flex items-center gap-3 text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                                Shop Now
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </Link>

                <Link href="/products" className="group">
                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-3xl p-10 md:p-12 overflow-hidden cursor-pointer transition-all duration-500 h-full min-h-[280px] flex flex-col justify-between group-hover:shadow-2xl group-hover:shadow-indigo-200/50 group-hover:-translate-y-1">
                        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-200/30 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-200/40 rounded-full blur-xl transition-transform duration-700 group-hover:scale-125"></div>
                        <div className="relative z-10">
                            <span className="inline-block text-xs font-medium text-indigo-600 uppercase tracking-[0.2em] mb-4 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                ✦ Special Offer
                            </span>
                            <h3 className="text-4xl md:text-5xl font-medium text-gray-900 mb-3 tracking-tight">Free Shipping</h3>
                            <p className="text-gray-500 text-xl">On orders over ₹999</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between mt-6">
                            <span className="inline-flex items-center gap-3 text-gray-900 font-medium group-hover:translate-x-2 transition-transform duration-300">
                                Learn More
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
