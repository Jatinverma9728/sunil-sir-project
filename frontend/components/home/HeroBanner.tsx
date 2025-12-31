"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api/products";

interface Product {
    _id: string;
    title: string;
    price: number;
    images: { url: string; alt?: string }[];
    category: string;
    rating: { average: number; count: number };
}

const heroSlides = [
    {
        id: 1,
        tag: "🎧 Music is Classic",
        title: "Sequoia Inspiring\nMusico.",
        subtitle: "Clear Sounds",
        description: "Making your dream music come true stay with Sequios Sounds!",
        buttonText: "View All Products",
        buttonLink: "/products",
        emoji: "🎧",
    },
    {
        id: 2,
        tag: "🏠 Smart Home",
        title: "Transform Your\nHome.",
        subtitle: "IoT Devices",
        description: "Experience the future with smart home automation!",
        buttonText: "Explore Devices",
        buttonLink: "/products?category=home",
        emoji: "🏠",
    },
    {
        id: 3,
        tag: "📚 Learn & Grow",
        title: "Master New\nSkills.",
        subtitle: "Online Courses",
        description: "Learn from experts and upgrade your career!",
        buttonText: "Start Learning",
        buttonLink: "/courses",
        emoji: "📚",
    },
];

const popularColors = [
    { color: "#3B82F6", name: "Blue" },
    { color: "#F59E0B", name: "Orange" },
    { color: "#10B981", name: "Green" },
    { color: "#06B6D4", name: "Cyan" },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const fetchProducts = async () => {
        try {
            const response = await getProducts({ limit: 3, featured: true });
            setProducts(response.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const slide = heroSlides[currentSlide];

    return (
        <section className="min-h-screen py-6 px-4 md:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)' }}>
            <div className="max-w-[1600px] mx-auto h-full">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                    {/* Main Hero Card - Takes 3 columns */}
                    <div className="lg:col-span-3 glass-card p-8 md:p-10 relative overflow-hidden min-h-[480px]">
                        {/* Tag */}
                        <span className="product-tag mb-6 inline-block">
                            {slide.tag}
                        </span>

                        <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                            {/* Content */}
                            <div className="z-10">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight whitespace-pre-line">
                                    {slide.title}
                                </h1>

                                {/* Slide Number */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-4xl font-light text-gray-300">
                                        0{currentSlide + 1}
                                    </span>
                                    <div className="h-px w-12 bg-gray-300"></div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{slide.subtitle}</p>
                                        <p className="text-sm text-gray-500">{slide.description}</p>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link href={slide.buttonLink} className="btn-accent">
                                    {slide.buttonText}
                                    <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </span>
                                </Link>

                                {/* Social Links */}
                                <div className="flex items-center gap-4 mt-8">
                                    <span className="text-sm text-gray-500">Follow us on:</span>
                                    <div className="flex gap-3">
                                        {["twitter", "tiktok", "instagram", "linkedin"].map((social) => (
                                            <a key={social} href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                <span className="text-xs">
                                                    {social === "twitter" && "𝕏"}
                                                    {social === "tiktok" && "♪"}
                                                    {social === "instagram" && "◎"}
                                                    {social === "linkedin" && "in"}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Product Image Area */}
                            <div className="hidden md:flex items-center justify-center relative">
                                <div className="text-[180px] opacity-90 animate-pulse">
                                    {slide.emoji}
                                </div>
                                {/* Dots decoration */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                </div>
                            </div>
                        </div>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentSlide
                                        ? "bg-gray-900 w-8"
                                        : "bg-gray-300 w-2 hover:bg-gray-400"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Cards - Takes 1 column */}
                    <div className="flex flex-col gap-4">
                        {/* Popular Colors Card */}
                        <div className="glass-card p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Popular Colors</h3>
                            <div className="flex gap-2">
                                {popularColors.map((item, index) => (
                                    <button
                                        key={index}
                                        className="color-dot"
                                        style={{ backgroundColor: item.color }}
                                        title={item.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Featured Product Cards */}
                        {products.slice(0, 2).map((product, index) => (
                            <Link key={product._id} href={`/products/${product._id}`} className="glass-card p-4 group cursor-pointer flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                            {product.title.length > 20
                                                ? product.title.substring(0, 20) + "..."
                                                : product.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                                    </div>
                                    <span className="arrow-link group-hover:bg-[#C1FF72]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="h-24 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden relative">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                            alt={product.title}
                                            width={200}
                                            height={200}
                                            unoptimized
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl opacity-50">📦</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {/* More Products Card */}
                    <Link href="/products" className="glass-card p-5 group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-900">More Products</h4>
                                <p className="text-sm text-gray-500">460 plus items.</p>
                            </div>
                            <span className="text-red-500 text-xl">♥</span>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                                    📦
                                </div>
                            ))}
                        </div>
                    </Link>

                    {/* Downloads Card */}
                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {["👨‍💻", "👩‍💻", "🧑‍💻"].map((emoji, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                    {emoji}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="bg-[#C1FF72] px-3 py-1 rounded-full text-sm font-bold inline-block mb-1">
                                5m+
                            </div>
                            <p className="text-xs text-gray-500">Downloads</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-xs text-gray-600">4.6 reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Popular Card */}
                    <div className="glass-card p-5">
                        <span className="product-tag mb-2 inline-block">
                            ♥ Popular
                        </span>
                        <h4 className="font-semibold text-gray-900 text-sm">Listening Has</h4>
                        <h4 className="font-semibold text-gray-900 text-sm">Been Released</h4>
                        <div className="flex gap-2 mt-3">
                            {["🎧", "🎵"].map((emoji, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating Card */}
                    <div className="glass-card p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <span className="arrow-link">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </span>
                            <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm font-semibold">4.7</span>
                            </div>
                        </div>
                        <div className="mt-auto pt-8">
                            <h4 className="font-semibold text-gray-900 text-sm">Light Grey Surface</h4>
                            <h4 className="font-semibold text-gray-900 text-sm">Headphone</h4>
                            <p className="text-xs text-gray-500 mt-1">Boosted with bass</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
