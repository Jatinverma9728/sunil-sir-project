"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const HERO_SLIDES = [
    {
        id: "laptops",
        tabLabel: "Refurbished Laptops",
        badge: "Grade A+ Certified • 32-Point Inspected",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        headline: "Enterprise Laptops at Half the Price.",
        subheadline: "Certified Lenovo ThinkPads, Dell Latitudes, and MacBooks with verified battery health and 1-year warranty.",
        priceLabel: "Starting from",
        price: "₹14,999",
        originalPrice: "₹48,000",
        savingsBadge: "Save up to 70%",
        primaryCta: { text: "Shop Laptops", href: "/refurbished-laptops" },
        secondaryCta: { text: "Learn More", href: "/about" },
        floatingTag: "ThinkPad T480 & Dell Latitude Series",
        floatingRating: "4.9 ★ (850+ Reviews)",
        warrantyText: "Up to 1-Year Warranty",
        productImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80"
    },
    {
        id: "accessories",
        tabLabel: "RAM & Storage Upgrades",
        badge: "Genuine Hardware • Fast Dispatch",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
        headline: "High-Speed NVMe Storage & RAM Kits.",
        subheadline: "Genuine DDR4/DDR5 memory modules and PCIe 4.0 SSDs tested for uncompromising speed and reliability.",
        priceLabel: "Upgrades from",
        price: "₹899",
        originalPrice: "₹2,499",
        savingsBadge: "Free Shipping Over ₹999",
        primaryCta: { text: "Shop Upgrades", href: "/computer-accessories" },
        secondaryCta: { text: "Browse All", href: "/products" },
        floatingTag: "Crucial, Samsung & Kingston OEM",
        floatingRating: "4.8 ★ (1,200+ Delivered)",
        warrantyText: "3-Year Brand Warranty",
        productImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&auto=format&fit=crop&q=80"
    },
    {
        id: "courses",
        tabLabel: "Practical Tech Courses",
        badge: "Career Tracks • Verified Certification",
        badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
        headline: "Master Real-World Software & Tech Skills.",
        subheadline: "Hands-on, project-driven curriculums in Full-Stack, Python AI, and IoT built by senior industry engineers.",
        priceLabel: "Enrollment from",
        price: "₹499",
        originalPrice: "₹2,999",
        savingsBadge: "Lifetime Access",
        primaryCta: { text: "Explore Courses", href: "/courses" },
        secondaryCta: { text: "View Curriculum", href: "/courses" },
        floatingTag: "Full-Stack Web & Python AI",
        floatingRating: "4.9 ★ (4,200+ Students)",
        warrantyText: "Certificate of Completion",
        productImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80"
    }
];

export default function HeroBanner() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Auto-advance slides every 7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const slide = HERO_SLIDES[currentSlideIndex];

    return (
        <section className="relative overflow-hidden bg-slate-50/60 border-b border-slate-200/80">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Clear, Spacious Headline & Action */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${slide.badgeColor}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                {slide.badge}
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#202020] tracking-tight leading-[1.1] mb-4">
                            {slide.headline}
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-6 max-w-xl">
                            {slide.subheadline}
                        </p>

                        {/* Price Block */}
                        <div className="flex flex-wrap items-baseline gap-3 mb-8">
                            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                                {slide.priceLabel}
                            </span>
                            <span className="text-3xl sm:text-4xl font-black text-[#028eff]">
                                {slide.price}
                            </span>
                            <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                                {slide.originalPrice}
                            </span>
                            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                {slide.savingsBadge}
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <Link
                                href={slide.primaryCta.href}
                                className="px-8 py-3.5 rounded-lg bg-[#028eff] hover:bg-[#0070d6] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95"
                            >
                                <span>{slide.primaryCta.text}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            <Link
                                href={slide.secondaryCta.href}
                                className="px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-xs"
                            >
                                {slide.secondaryCta.text}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Clean, Premium Hardware Visual */}
                    <div className="lg:col-span-5 relative flex items-center justify-center">
                        <div className="relative w-full aspect-[4/3] max-w-lg rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">
                            <Image
                                src={slide.productImage}
                                alt={slide.headline}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            {/* Subtle dark gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                            {/* Floating Glass Spec Banner at Bottom */}
                            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-md flex items-center justify-between pointer-events-none">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-[#028eff] tracking-wider block">
                                        {slide.tabLabel}
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[240px]">
                                        {slide.floatingTag}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-bold text-emerald-600 block">
                                        {slide.warrantyText}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        {slide.floatingRating}
                                    </span>
                                </div>
                            </div>

                            {/* Slider Navigation Arrows */}
                            <button
                                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                                aria-label="Previous slide"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                                aria-label="Next slide"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Minimalist Centered Pagination Dots */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlideIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`transition-all rounded-full ${idx === currentSlideIndex
                                ? "w-8 h-2.5 bg-[#028eff]"
                                : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
