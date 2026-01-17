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
            <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="h-[300px] bg-gray-50 rounded-[2.5rem] animate-pulse" />
                    <div className="h-[300px] bg-gray-50 rounded-[2.5rem] animate-pulse" />
                </div>
            </section>
        );
    }

    const current = banners[currentIndex];

    return (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16">
            {/* Hero Banner Carousel */}
            {banners.length === 1 ? (
                <SingleBanner banner={current} onClick={() => handleBannerClick(current)} />
            ) : (
                <div className="relative">
                    <div className="overflow-hidden rounded-[2.5rem]">
                        <div
                            className="flex transition-transform duration-700 ease-out"
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
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md text-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => goToSlide((currentIndex + 1) % banners.length)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md text-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gray-800 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
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
            className="relative rounded-[2.5rem] overflow-hidden h-[300px] md:h-[400px] cursor-pointer group"
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
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0,0,0,${banner.overlayOpacity})` }}
                />
            )}

            <div className="absolute inset-0 flex flex-col justify-center p-10 md:p-20" style={{ color: banner.textColor }}>
                <div className="max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">{banner.title}</h2>
                    {banner.subtitle && (
                        <p className="text-xl md:text-2xl mb-8 opacity-90 font-light">{banner.subtitle}</p>
                    )}
                    {banner.buttonText && (
                        <span className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all group-hover:shadow-lg group-hover:-translate-y-0.5">
                            {banner.buttonText}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Static fallback banners (Soft Light Theme)
function StaticPromoBanners() {
    return (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-8">
                <Link href="/products?sale=true" className="group">
                    <div className="relative bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] p-10 md:p-14 overflow-hidden cursor-pointer transition-all duration-500 h-full min-h-[320px] flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.1)] border border-indigo-100/50">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-indigo-100">
                                Limited Time
                            </span>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">Mega Sale</h3>
                            <p className="text-gray-500 text-xl font-medium">Up to 70% OFF</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between mt-8">
                            <span className="inline-flex items-center gap-3 text-gray-900 font-semibold group-hover:gap-4 transition-all duration-300">
                                Shop Now
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </div>
                </Link>

                <Link href="/products" className="group">
                    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2.5rem] p-10 md:p-14 overflow-hidden cursor-pointer transition-all duration-500 h-full min-h-[320px] flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.1)] border border-purple-100/50">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-100/50 rounded-full blur-2xl translate-y-1/3 translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <span className="inline-block text-xs font-bold text-purple-600 uppercase tracking-widest mb-4 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-100">
                                Special Offer
                            </span>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">Free Shipping</h3>
                            <p className="text-gray-500 text-xl font-medium">On orders over ₹999</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between mt-8">
                            <span className="inline-flex items-center gap-3 text-gray-900 font-semibold group-hover:gap-4 transition-all duration-300">
                                Learn More
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
