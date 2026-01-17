"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const heroSlides = [
    {
        title: "Premium Electronics",
        subtitle: "Up to 50% OFF",
        description: "Discover the latest gadgets and tech accessories",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
        cta: "Shop Electronics",
        link: "/products?category=electronics",
        gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
        title: "Fashion Forward",
        subtitle: "New Collection",
        description: "Trendy clothing and accessories for every occasion",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
        cta: "Explore Fashion",
        link: "/products?category=clothing",
        gradient: "from-pink-500 via-rose-500 to-red-500"
    },
    {
        title: "Smart Home",
        subtitle: "Transform Your Space",
        description: "Innovative home products for modern living",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        cta: "Browse Home",
        link: "/products?category=home",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
];

export default function EnhancedHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    return (
        <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden bg-gray-900">
            {/* Background Slides */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 flex items-center">
                        <div className="max-w-2xl text-white">
                            <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-4 text-[#C1FF72] animate-fade-in">
                                {slide.subtitle}
                            </p>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-xl animate-fade-in-delay">
                                {slide.description}
                            </p>
                            <Link
                                href={slide.link}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-[#C1FF72] hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl animate-fade-in-delay-2"
                            >
                                {slide.cta}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center justify-center z-10"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center justify-center z-10"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                                ? "w-12 bg-white"
                                : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
