"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getActiveBanners, trackBannerClick, Banner } from "@/lib/api/promotions";

interface PromoBannersProps {
    position?: "hero" | "sidebar" | "popup" | "footer" | "category";
    className?: string;
}

export default function PromoBanners({ position = "hero", className = "" }: PromoBannersProps) {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getActiveBanners(position);
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
    }, [position]);

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
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrev = () => goToSlide((currentIndex - 1 + banners.length) % banners.length);
    const goToNext = () => goToSlide((currentIndex + 1) % banners.length);

    if (loading) {
        return (
            <div className={`bg-gray-100 animate-pulse ${position === 'hero' ? 'h-[400px] md:h-[500px]' : 'h-48'} ${className}`} />
        );
    }

    if (banners.length === 0) return null;

    const current = banners[currentIndex];

    // Hero banner (full width carousel)
    if (position === "hero") {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                {/* Banner Slides */}
                <div className="relative h-[400px] md:h-[500px]">
                    {banners.map((banner, index) => (
                        <div
                            key={banner._id}
                            className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            {banner.link ? (
                                <Link
                                    href={banner.link}
                                    onClick={() => handleBannerClick(banner)}
                                    className="block relative w-full h-full"
                                >
                                    <BannerContent banner={banner} />
                                </Link>
                            ) : (
                                <BannerContent banner={banner} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                            aria-label="Previous banner"
                        >
                            ←
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                            aria-label="Next banner"
                        >
                            →
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {banners.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Sidebar or smaller banner
    return (
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
            {current.link ? (
                <Link
                    href={current.link}
                    onClick={() => handleBannerClick(current)}
                    className="block"
                >
                    <BannerContent banner={current} small />
                </Link>
            ) : (
                <BannerContent banner={current} small />
            )}
        </div>
    );
}

// Banner content component
function BannerContent({ banner, small = false }: { banner: Banner; small?: boolean }) {
    return (
        <div className="relative w-full h-full">
            {/* Background Image */}
            <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
            />

            {/* Overlay */}
            {banner.overlay && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: banner.backgroundColor,
                        opacity: banner.overlayOpacity
                    }}
                />
            )}

            {/* Content */}
            <div className={`absolute inset-0 flex flex-col justify-center ${small ? 'p-4' : 'p-8 md:p-16'}`}>
                <div className="max-w-2xl" style={{ color: banner.textColor }}>
                    <h2 className={`font-bold mb-2 ${small ? 'text-xl' : 'text-3xl md:text-5xl'}`}>
                        {banner.title}
                    </h2>
                    {banner.subtitle && (
                        <p className={`mb-4 ${small ? 'text-sm' : 'text-lg md:text-xl'} opacity-90`}>
                            {banner.subtitle}
                        </p>
                    )}
                    {banner.buttonText && banner.buttonLink && (
                        <Link
                            href={banner.buttonLink}
                            className={`inline-block bg-white text-black ${small ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-lg font-semibold hover:bg-gray-100 transition-colors`}
                        >
                            {banner.buttonText}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
