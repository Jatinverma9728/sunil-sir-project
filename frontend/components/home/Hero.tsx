"use client";

import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 tracking-wide">
                            WELCOME TO FLASH
                        </p>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            Wireless
                            <br />
                            <span className="text-gray-400">Headphone</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                            Experience premium sound quality with our latest wireless technology.
                            Crystal clear audio, all-day battery life.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block mt-4 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            SHOP NOW →
                        </Link>
                    </div>
                    <div className="relative flex justify-center items-center">
                        <div className="w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-2xl">
                            <span className="text-9xl">🎧</span>
                        </div>
                        {/* Floating badge */}
                        <div className="absolute top-10 right-10 px-4 py-2 bg-[#C1FF72] text-black rounded-full font-bold text-sm shadow-lg">
                            NEW
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
