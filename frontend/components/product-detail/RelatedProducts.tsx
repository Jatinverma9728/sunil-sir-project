"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    rating?: number;
    image?: string;
    images?: Array<{ url: string; alt?: string }>;
}

interface RelatedProductsProps {
    currentProductId: string;
    category: string;
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchRelatedProducts();
    }, [category, currentProductId]);

    const fetchRelatedProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/products?category=${category}&limit=8`
            );
            const data = await response.json();
            const relatedProducts = (data.data || []).filter(
                (p: Product) => p._id !== currentProductId
            );
            setProducts(relatedProducts);
        } catch (error) {
            console.error("Failed to fetch related products:", error);
            // Use mock data
            setProducts(getMockProducts());
        } finally {
            setLoading(false);
        }
    };

    const getMockProducts = (): Product[] => {
        return [
            { _id: "1", title: "Similar Product 1", category, price: 99, rating: 4.5 },
            { _id: "2", title: "Similar Product 2", category, price: 149, rating: 4.8 },
            { _id: "3", title: "Similar Product 3", category, price: 199, rating: 4.6 },
            { _id: "4", title: "Similar Product 4", category, price: 79, rating: 4.7 },
        ];
    };

    const itemsToShow = 4;
    const maxIndex = Math.max(0, products.length - itemsToShow);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
                {products.length > itemsToShow && (
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ←
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === maxIndex}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex gap-6 transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToShow + 1.5)}%)`,
                    }}
                >
                    {products.map((product) => (
                        <Link
                            key={product._id}
                            href={`/products/${product._id}`}
                            className="flex-shrink-0 w-[calc(25%-18px)] min-w-[250px]"
                        >
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="bg-gray-50 h-48 flex items-center justify-center">
                                    {(product.images?.[0]?.url || product.image) ? (
                                        <img
                                            src={product.images?.[0]?.url || product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-6xl">📱</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold">${product.price}</span>
                                        {product.rating && (
                                            <div className="flex text-yellow-400 text-xs">
                                                {"★".repeat(Math.floor(product.rating))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
