"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
    { id: 1, name: "Phone Pro", category: "Phone", price: 800, rating: 5, reviews: 738, emoji: "📱" },
    { id: 2, name: "Gaming Console", category: "Console", price: 450, rating: 5, reviews: 892, emoji: "🎮" },
    { id: 3, name: "Speaker Amplifier", category: "Speaker", price: 60, rating: 5, reviews: 456, emoji: "🔊" },
    { id: 4, name: "Oculus Headsets", category: "Oculus", price: 400, rating: 5, reviews: 623, emoji: "🥽" },
    { id: 5, name: "Portable Laptop", category: "Laptop", price: 180, rating: 5, reviews: 534, emoji: "💻" },
    { id: 6, name: "Air Glide X", category: "Watch", price: 90, rating: 5, reviews: 289, emoji: "⌚" },
    { id: 7, name: "Wireless Earbuds", category: "Beats", price: 40, rating: 5, reviews: 412, emoji: "🎧" },
    { id: 8, name: "Wireless Headphone", category: "Headphones", price: 120, rating: 5, reviews: 987, emoji: "🎧" },
];

export default function ProductSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemsToShow = 4;
    const maxIndex = Math.max(0, products.length - itemsToShow);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-gray-900">Trendy Products</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ←
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === maxIndex}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex gap-6 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow + 1.5)}%)` }}
                >
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex-shrink-0 w-[calc(25%-18px)] min-w-[250px]"
                        >
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all group">
                                <div className="relative bg-gray-50 h-64 flex items-center justify-center">
                                    <span className="text-7xl">{product.emoji}</span>
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100">
                                            ❤️
                                        </button>
                                        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100">
                                            👁️
                                        </button>
                                        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100">
                                            🛒
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-yellow-400 text-sm">
                                            {"★".repeat(product.rating)}
                                        </div>
                                        <span className="text-xs text-gray-500">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gray-900">
                                            $ {product.price}.00 <span className="text-sm font-normal text-gray-500">USD</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
