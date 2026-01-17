"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const mainSlides = [
        {
            title: "EKO 40\"",
            subtitle: "Android TV",
            description: "Smart Full HD Android TV\nwith Google Assistant",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
            // Soft gradient
            bgColor: "from-blue-50 to-indigo-50",
            accentColor: "text-indigo-600",
        },
        {
            title: "Smart Watch",
            subtitle: "Series 7",
            description: "Advanced Health Features\nwith Stylish Design",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            // Soft gradient
            bgColor: "from-purple-50 to-pink-50",
            accentColor: "text-purple-600",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-6 md:py-8">
            <div className="max-w-[1600px] mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-6 h-auto md:h-[600px]">
                    {/* Main Slideshow - 2 columns */}
                    <div className="lg:col-span-2 relative rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-white h-[500px] md:h-full">
                        {mainSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                <div className={`h-full w-full bg-gradient-to-br ${slide.bgColor} flex flex-col md:flex-row items-center`}>
                                    {/* Left Content */}
                                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-start z-10">
                                        <span className={`inline-block px-4 py-1 rounded-full bg-white/60 backdrop-blur-sm text-sm font-semibold tracking-wide mb-6 ${slide.accentColor}`}>
                                            New Arrival
                                        </span>
                                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
                                            {slide.title}
                                        </h2>
                                        <h3 className="text-3xl md:text-5xl font-medium text-gray-500 mb-6">
                                            {slide.subtitle}
                                        </h3>
                                        <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                                            {slide.description}
                                        </p>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Shop Now
                                        </Link>
                                    </div>

                                    {/* Right Image */}
                                    <div className="flex-1 relative h-64 md:h-full w-full md:w-auto flex items-center justify-center p-8 md:p-12">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                fill
                                                className="object-contain drop-shadow-2xl"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Slide Indicators */}
                        <div className="absolute bottom-8 left-8 md:left-16 flex gap-2 z-20">
                            {mainSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? "w-8 bg-gray-900"
                                        : "w-2 bg-gray-300 hover:bg-gray-400"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side Column - Stacked Banners */}
                    <div className="hidden lg:flex flex-col gap-6 h-full">
                        {/* Top Card */}
                        <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-[#F8F9FA] border border-gray-100 p-8 group hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Comfort Air</h3>
                                    <p className="text-gray-500 font-medium">From ₹299</p>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                                    >
                                        Discover <span className="ml-2">→</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 translate-x-4 translate-y-4 group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                                    alt="Humidifying Fan"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Bottom Card */}
                        <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-[#FFF8F1] border border-orange-50 p-8 group hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">iPad Mini</h3>
                                    <p className="text-orange-600/80 font-medium">New Arrival</p>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                                    >
                                        Shop Now <span className="ml-2">→</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-40 h-40 translate-x-2 translate-y-2 group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80"
                                    alt="iPad mini"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
