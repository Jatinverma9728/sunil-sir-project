"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Fallback placeholder
    const displayImages = images.length > 0 ? images : ["/placeholder-product.png"];
    const hasMultipleImages = displayImages.length > 1;

    return (
        <div className="w-full">
            {/* Main Image Container */}
            <div
                className="relative bg-[#F8F8F8] rounded-2xl overflow-hidden aspect-square mb-4 cursor-pointer group"
                onClick={() => setIsZoomed(true)}
            >
                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Product Image */}
                {images.length > 0 ? (
                    <Image
                        src={displayImages[selectedImage]}
                        alt={`${productName} - Image ${selectedImage + 1}`}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl opacity-30">📦</span>
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-3">
                    {displayImages.slice(0, 4).map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`relative bg-[#F8F8F8] rounded-xl overflow-hidden aspect-square transition-all ${selectedImage === i
                                    ? "ring-2 ring-[#2D5A27]"
                                    : "hover:ring-2 hover:ring-gray-300"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${i + 1}`}
                                fill
                                className="object-contain p-2"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {isZoomed && images.length > 0 && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <button
                        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
                        onClick={() => setIsZoomed(false)}
                    >
                        ✕
                    </button>
                    <div className="relative w-full max-w-4xl aspect-square">
                        <Image
                            src={displayImages[selectedImage]}
                            alt={productName}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
