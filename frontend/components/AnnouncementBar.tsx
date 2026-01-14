"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveAnnouncements, dismissAnnouncement, Announcement } from "@/lib/api/promotions";

export default function AnnouncementBar() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dismissed, setDismissed] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await getActiveAnnouncements("top");
                if (res.success && res.data) {
                    // Filter out dismissed announcements
                    const storedDismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
                    setDismissed(storedDismissed);
                    const filtered = res.data.filter((a: Announcement) => !storedDismissed.includes(a._id));
                    setAnnouncements(filtered);
                    setIsVisible(filtered.length > 0);
                }
            } catch (error) {
                console.error("Error fetching announcements:", error);
                setIsVisible(false);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    // Rotate through announcements
    useEffect(() => {
        if (announcements.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [announcements.length]);

    const handleDismiss = async (id: string) => {
        setDismissed((prev) => {
            const updated = [...prev, id];
            localStorage.setItem('dismissedAnnouncements', JSON.stringify(updated));
            return updated;
        });
        const remaining = announcements.filter((a) => a._id !== id);
        setAnnouncements(remaining);
        if (remaining.length === 0) {
            setIsVisible(false);
        }

        try {
            await dismissAnnouncement(id);
        } catch (error) {
            // Ignore errors for dismiss
        }
    };

    // Don't render anything while loading or if no announcements
    if (loading || !isVisible || announcements.length === 0) {
        return null;
    }

    const current = announcements[currentIndex];
    if (!current) return null;

    return (
        <div
            className="relative w-full z-[60] flex-shrink-0"
            style={{
                backgroundColor: current.backgroundColor,
                color: current.textColor
            }}
        >
            <div className="py-2.5 px-12 text-center text-sm font-medium">
                <div className={`flex items-center justify-center gap-2 ${current.isScrolling ? 'animate-marquee' : ''}`}>
                    {current.icon && <span className="text-base">{current.icon}</span>}
                    <span>{current.message}</span>
                    {current.link && (
                        <Link
                            href={current.link}
                            className="underline hover:no-underline ml-2 font-semibold"
                            style={{ color: current.textColor }}
                        >
                            {current.linkText}
                        </Link>
                    )}
                </div>
            </div>

            {current.isCloseable && (
                <button
                    onClick={() => handleDismiss(current._id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity p-1"
                    style={{ color: current.textColor }}
                    aria-label="Dismiss announcement"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Multiple announcements indicator */}
            {announcements.length > 1 && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1">
                    {announcements.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-opacity ${i === currentIndex ? 'opacity-100' : 'opacity-40'
                                }`}
                            style={{ backgroundColor: current.textColor }}
                            aria-label={`View announcement ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
