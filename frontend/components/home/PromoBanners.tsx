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
                    <div className="h-[300px] animate-pulse rounded-lg bg-gray-50" />
                    <div className="h-[300px] animate-pulse rounded-lg bg-gray-50" />
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
                    <div className="overflow-hidden rounded-lg">
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
                        aria-label="Previous promotion"
                        className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg bg-white/80 text-gray-800 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => goToSlide((currentIndex + 1) % banners.length)}
                        aria-label="Next promotion"
                        className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg bg-white/80 text-gray-800 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md"
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
                                aria-label={`Go to promotion ${index + 1}`}
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
            className="group relative h-[300px] cursor-pointer overflow-hidden rounded-lg md:h-[400px]"
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
                    <h2 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{banner.title}</h2>
                    {banner.subtitle && (
                        <p className="text-xl md:text-2xl mb-8 opacity-90 font-light">{banner.subtitle}</p>
                    )}
                    {banner.buttonText && (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-8 py-4 font-medium text-white transition-all hover:bg-[var(--primary-electric)] group-hover:-translate-y-0.5 group-hover:shadow-lg">
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
                    <div className="relative flex h-full min-h-[320px] cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-blue-100/70 bg-gradient-to-br from-blue-50 to-cyan-50 p-10 transition-all duration-500 hover:shadow-lg md:p-14">
                        <div className="relative z-10">
                            <span className="mb-4 inline-block rounded-md border border-blue-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase text-[var(--primary-electric)] backdrop-blur-sm">
                                Limited Time
                            </span>
                            <h3 className="mb-3 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">Mega Sale</h3>
                            <p className="text-gray-500 text-xl font-medium">Up to 70% OFF</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between mt-8">
                            <span className="inline-flex items-center gap-3 text-gray-900 font-semibold group-hover:gap-4 transition-all duration-300">
                                Shop Now
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[var(--primary-electric)] shadow-sm transition-colors group-hover:bg-[var(--primary-electric)] group-hover:text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </div>
                </Link>

                <Link href="/products" className="group">
                    <div className="relative flex h-full min-h-[320px] cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-emerald-100/70 bg-gradient-to-br from-emerald-50 to-sky-50 p-10 transition-all duration-500 hover:shadow-lg md:p-14">
                        <div className="relative z-10">
                            <span className="mb-4 inline-block rounded-md border border-emerald-100 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase text-emerald-700 backdrop-blur-sm">
                                Special Offer
                            </span>
                            <h3 className="mb-3 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">Free Shipping</h3>
                            <p className="text-gray-500 text-xl font-medium">On orders over {"\u20B9"}999</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between mt-8">
                            <span className="inline-flex items-center gap-3 text-gray-900 font-semibold group-hover:gap-4 transition-all duration-300">
                                Learn More
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm transition-colors group-hover:bg-emerald-700 group-hover:text-white">
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
