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
            description: "SMART FULL HD\nANDROID TV WITH\nGOOGLE ASSISTANT",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
            bgColor: "from-gray-900 to-gray-800",
        },
        {
            title: "Smart Watch",
            subtitle: "Series 7",
            description: "ADVANCED HEALTH\nFEATURES WITH\nSTYLISH DESIGN",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            bgColor: "from-gray-900 to-gray-800",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-white py-4">
            <div className="max-w-[1600px] mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-4 h-[60vh] min-h-[500px]">
                    {/* Main Slideshow - 2 columns */}
                    <div className="lg:col-span-2 relative rounded-3xl overflow-hidden h-full">
                        {mainSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                <div className={`h-full bg-gradient-to-br ${slide.bgColor} grid md:grid-cols-2`}>
                                    {/* Left Content */}
                                    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                                        <h2 className="text-5xl md:text-6xl font-light text-white mb-2 leading-tight">
                                            {slide.title}
                                        </h2>
                                        <h3 className="text-5xl md:text-6xl font-light text-white mb-8">
                                            {slide.subtitle}
                                        </h3>
                                        <p className="text-white/80 text-sm uppercase tracking-wider mb-8 whitespace-pre-line">
                                            {slide.description}
                                        </p>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors w-fit"
                                        >
                                            Shop Now
                                        </Link>
                                    </div>

                                    {/* Right Image */}
                                    <div className="relative hidden md:flex items-center justify-center p-8">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            width={400}
                                            height={400}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Slide Indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {mainSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentSlide
                                            ? "w-8 bg-white"
                                            : "w-2 bg-white/40 hover:bg-white/60"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side Banner - 1 column */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 h-full">
                        <div className="h-full flex flex-col justify-between p-8 lg:p-10">
                            <div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    Humidifying Fan
                                </h3>
                                <p className="text-white/90 text-sm">From $299</p>
                            </div>

                            <div className="relative h-64 my-4">
                                <Image
                                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                                    alt="Humidifying Fan"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors w-fit"
                            >
                                Discover Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - 3 Smaller Banners */}
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                    {/* iPad Mini */}
                    <Link
                        href="/products"
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 h-48 group"
                    >
                        <div className="h-full flex items-center justify-between p-6 lg:p-8">
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-1">iPad mini</h4>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">2022</h4>
                                <p className="text-gray-600 text-sm mb-4">Mega Power in mini size</p>
                                <span className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full group-hover:bg-gray-800 transition-colors">
                                    Shop Now
                                </span>
                            </div>
                            <div className="relative w-32 h-32">
                                <Image
                                    src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80"
                                    alt="iPad mini"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Air Purifier */}
                    <Link
                        href="/products"
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 h-48 group"
                    >
                        <div className="h-full flex items-center justify-between p-6 lg:p-8">
                            <div>
                                <h4 className="text-xl font-semibold text-white mb-1">Air</h4>
                                <h4 className="text-xl font-semibold text-white mb-2">Purifier</h4>
                                <p className="text-gray-400 text-xs mb-2">FROM</p>
                                <p className="text-green-400 text-2xl font-bold">$169</p>
                            </div>
                            <div className="relative w-28 h-28">
                                <Image
                                    src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80"
                                    alt="Air Purifier"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Washing Machine */}
                    <Link
                        href="/products"
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-48 group"
                    >
                        <div className="h-full flex items-center justify-between p-6 lg:p-8">
                            <div>
                                <p className="text-gray-500 text-xs uppercase mb-2">WASHING MACHINE</p>
                                <h4 className="text-xl font-semibold text-gray-900 mb-1">Anatico</h4>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">Max 2</h4>
                                <span className="inline-flex items-center justify-center px-6 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full group-hover:bg-gray-50 transition-colors shadow-sm">
                                    Shop Now
                                </span>
                            </div>
                            <div className="relative w-28 h-28">
                                <Image
                                    src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&q=80"
                                    alt="Washing Machine"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
