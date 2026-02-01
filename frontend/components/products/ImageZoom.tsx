"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
}

/**
 * Professional image hover zoom component like Flipkart/Amazon
 * Shows a magnified popup on hover (desktop only)
 */
export default function ImageZoom({ src, alt, className = "" }: ImageZoomProps) {
    const [isZooming, setIsZooming] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Zoom level (2.5x magnification)
    const ZOOM_LEVEL = 2.5;
    // Lens size (the small square that follows the cursor)
    const LENS_SIZE = 150;

    const handleMouseEnter = useCallback(() => {
        // Only enable zoom on desktop (screen width > 1024px)
        if (typeof window !== 'undefined' && window.innerWidth > 1024) {
            setIsZooming(true);
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsZooming(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !isZooming) return;

        const rect = containerRef.current.getBoundingClientRect();

        // Calculate cursor position relative to the image container (0-1)
        let x = (e.clientX - rect.left) / rect.width;
        let y = (e.clientY - rect.top) / rect.height;

        // Clamp values between 0 and 1
        x = Math.max(0, Math.min(1, x));
        y = Math.max(0, Math.min(1, y));

        // Set position for the zoomed image (background-position percentage)
        setPosition({ x: x * 100, y: y * 100 });

        // Calculate lens position (centered on cursor)
        const lensX = (e.clientX - rect.left) - (LENS_SIZE / 2);
        const lensY = (e.clientY - rect.top) - (LENS_SIZE / 2);

        // Clamp lens to stay within image bounds
        const clampedLensX = Math.max(0, Math.min(rect.width - LENS_SIZE, lensX));
        const clampedLensY = Math.max(0, Math.min(rect.height - LENS_SIZE, lensY));

        setLensPosition({ x: clampedLensX, y: clampedLensY });
    }, [isZooming, LENS_SIZE]);

    return (
        <div className="relative w-full h-full">
            {/* Main Image Container */}
            <div
                ref={containerRef}
                className={`relative w-full h-full cursor-crosshair ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 1024px) 100vw, 600px"
                />

                {/* Lens Indicator (the small square that follows cursor) */}
                {isZooming && (
                    <div
                        className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-10 transition-opacity duration-150"
                        style={{
                            width: LENS_SIZE,
                            height: LENS_SIZE,
                            left: lensPosition.x,
                            top: lensPosition.y,
                        }}
                    />
                )}
            </div>

            {/* Zoom Popup (appears to the right of the image) */}
            {isZooming && (
                <div
                    className="absolute left-full top-0 ml-4 w-[500px] h-[500px] border-2 border-gray-200 bg-white shadow-2xl z-50 overflow-hidden hidden lg:block"
                    role="img"
                    aria-label={`Zoomed view of ${alt}`}
                >
                    <img
                        src={src}
                        alt={`Zoomed: ${alt}`}
                        className="absolute"
                        style={{
                            width: `${ZOOM_LEVEL * 100}%`,
                            height: `${ZOOM_LEVEL * 100}%`,
                            maxWidth: 'none',
                            left: `${-position.x * (ZOOM_LEVEL - 1)}%`,
                            top: `${-position.y * (ZOOM_LEVEL - 1)}%`,
                            objectFit: 'contain',
                        }}
                        draggable={false}
                    />
                </div>
            )}

            {/* Hover hint (shows on first hover) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 text-xs text-gray-500 bg-white/90 px-3 py-1.5 rounded-full shadow-sm pointer-events-none opacity-80">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <span>Hover to zoom</span>
            </div>
        </div>
    );
}
