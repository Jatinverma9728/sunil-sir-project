"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getActiveOffers, Offer } from "@/lib/api/promotions";
import { getProducts, Product } from "@/lib/api/products";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function FlashSale() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 8,
        minutes: 42,
        seconds: 15,
    });

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return { days: 0, hours: 12, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDeals = async () => {
            setLoading(true);
            try {
                // Fetch promotional products or top clearance items
                const res = await getProducts({ limit: 12 });
                if (res.success && res.data && res.data.length > 0) {
                    const discounted = res.data.filter((p: Product) =>
                        p.originalPrice && p.originalPrice > p.price
                    );
                    setProducts(discounted.length >= 4 ? discounted.slice(0, 4) : res.data.slice(0, 4));
                }
            } catch (err) {
                console.error("Error fetching flash sale deals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    return (
        <section className="bg-white py-12 md:py-16 border-b border-slate-200/80">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                {/* Header with Urgency Timer */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-6 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#e95144] animate-ping" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e95144]">
                                Limited Time Clearance
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Flash Deals and Hardware Clearance
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Strictly limited stock units on refurbished laptops and genuine accessories.
                        </p>
                    </div>

                    {/* Digital Countdown Timer */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white border border-slate-200 shadow-xs text-center">
                            <span className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                                {String(timeLeft.days).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Days</span>
                        </div>
                        <span className="text-xl font-bold text-slate-300">:</span>
                        <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white border border-slate-200 shadow-xs text-center">
                            <span className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                                {String(timeLeft.hours).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Hours</span>
                        </div>
                        <span className="text-xl font-bold text-slate-300">:</span>
                        <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white border border-slate-200 shadow-xs text-center">
                            <span className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                                {String(timeLeft.minutes).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Mins</span>
                        </div>
                        <span className="text-xl font-bold text-slate-300">:</span>
                        <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-red-50 border border-red-200 shadow-xs text-center">
                            <span className="text-lg sm:text-xl font-black text-[#e95144] leading-none">
                                {String(timeLeft.seconds).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-red-400 mt-1">Secs</span>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-96 rounded-2xl bg-slate-50 border border-slate-100 p-4 animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {products.map((product, index) => (
                            <div key={product._id} className="flex flex-col">
                                <ProductCard product={product} index={index} />
                                {/* Stock Claim Meter under card */}
                                <div className="mt-2 px-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                                        <span className="text-rose-600">76% Claimed</span>
                                        <span>Few units left</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full w-[76%]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
