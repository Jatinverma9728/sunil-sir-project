"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    discount?: number;
    rating: number;
    soldCount?: number;
}

export default function FlashSale() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 30,
        seconds: 45,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const products: Product[] = [
        {
            id: "1",
            name: "Wireless Earbuds Pro",
            price: 49.99,
            originalPrice: 99.99,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
            discount: 50,
            rating: 4.5,
            soldCount: 234,
        },
        {
            id: "2",
            name: "Smart Watch Series 7",
            price: 199.99,
            originalPrice: 299.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
            discount: 33,
            rating: 4.8,
            soldCount: 456,
        },
        {
            id: "3",
            name: "Portable Speaker",
            price: 79.99,
            originalPrice: 129.99,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
            discount: 38,
            rating: 4.6,
            soldCount: 189,
        },
        {
            id: "4",
            name: "Bluetooth Headphones",
            price: 89.99,
            originalPrice: 159.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
            discount: 44,
            rating: 4.7,
            soldCount: 312,
        },
        {
            id: "5",
            name: "USB-C Hub",
            price: 29.99,
            originalPrice: 49.99,
            image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&q=80",
            discount: 40,
            rating: 4.4,
            soldCount: 567,
        },
    ];

    return (
        <section className="bg-white py-8">
            <div className="max-w-[1600px] mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Flash Sale</h2>

                        {/* Countdown Timer */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Ends in:</span>
                            <div className="flex gap-1">
                                {[
                                    { value: timeLeft.hours, label: "h" },
                                    { value: timeLeft.minutes, label: "m" },
                                    { value: timeLeft.seconds, label: "s" },
                                ].map((time, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[32px] text-center">
                                            {String(time.value).padStart(2, "0")}
                                        </div>
                                        {index < 2 && <span className="text-gray-400 mx-1">:</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/products"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                    >
                        See All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                />
                                {product.discount && (
                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                                    {product.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-bold text-red-600">
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Rating & Sold */}
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-3 h-3 ${i < Math.floor(product.rating)
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-gray-500">{product.rating}</span>
                                    </div>
                                    {product.soldCount && (
                                        <span className="text-gray-500">{product.soldCount} sold</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
