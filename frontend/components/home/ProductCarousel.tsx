"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/products/ProductCard";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    rating: { average: number; count: number };
    images: Array<{ url: string; alt?: string }>;
    stock: number;
    originalPrice?: number;
    brand?: string;
    isFeatured?: boolean;
}

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    category?: string;
    limit?: number;
    featuredOnly?: boolean;
}

export default function ProductCarousel({
    title,
    subtitle,
    category,
    limit = 8,
    featuredOnly = false,
}: ProductCarouselProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProducts();
    }, [category, featuredOnly]);

    const fetchProducts = async () => {
        try {
            const { getProducts } = await import('@/lib/api/products');
            const response = await getProducts({ category, limit, featured: featuredOnly });

            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToNext = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.scrollWidth / products.length;
            container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    };

    const scrollToPrev = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.scrollWidth / products.length;
            container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-100 rounded-xl w-56 mb-10"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-50 rounded-[2rem]"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-20">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                        {subtitle || "Discover"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{title}</h2>
                </div>
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={scrollToPrev}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-indigo-600 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={scrollToNext}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:text-indigo-600 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* Product Slider - Touch Scrollable with Snap */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-6 -my-6 px-4 md:px-0 scroll-smooth"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {products.map((product, index) => (
                    <div
                        key={product._id}
                        className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] snap-start snap-always h-full"
                    >
                        <ProductCard product={product as any} index={index} />
                    </div>
                ))}
            </div>

            {/* Add scrollbar hide styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
