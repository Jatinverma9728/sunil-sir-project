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
            console.error("Error dismissing announcement:", error);
        }
    };

    if (!isVisible || announcements.length === 0) return null;

    const current = announcements[currentIndex];

    return (
        <div
            className="relative z-50 text-xs md:text-sm font-medium transition-all duration-300 shadow-sm"
            style={{
                backgroundColor: current.backgroundColor || '#0F172A',
                color: current.textColor || '#F8FAFC'
            }}
        >
            <div className="py-2 px-12 text-center">
                <div className={`flex items-center justify-center gap-2 ${current.isScrolling ? 'animate-marquee' : ''}`}>
                    {current.icon && <span className="text-base">{current.icon}</span>}
                    <span>{current.message}</span>
                    {current.link && (
                        <Link
                            href={current.link}
                            className="ml-2 inline-flex items-center font-semibold underline hover:no-underline"
                            style={{ color: current.textColor }}
                        >
                            {current.linkText || "Learn More"}
                        </Link>
                    )}
                </div>
            </div>

            {current.isCloseable && (
                <button
                    onClick={() => handleDismiss(current._id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                    style={{ color: current.textColor }}
                    aria-label="Dismiss announcement"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Multiple announcements indicator */}
            {announcements.length > 1 && (
                <div className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1">
                    {announcements.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className="flex h-5 w-5 items-center justify-center"
                            aria-label={`View announcement ${i + 1}`}
                        >
                            <span
                                className={`block h-1.5 w-1.5 rounded-full transition-all ${i === currentIndex ? 'w-3 opacity-100' : 'opacity-40'}`}
                                style={{ backgroundColor: current.textColor }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
