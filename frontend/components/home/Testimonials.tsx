"use client";

import { useState, useEffect } from "react";
import { getTestimonials, Review } from "@/lib/api/reviews";

export default function Testimonials() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getTestimonials();
                if (response.success && response.data.length > 0) {
                    setReviews(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Format helper for initials
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <section className="py-24 bg-gradient-to-t from-gray-50 to-white overflow-hidden">
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return null;
    }

    // Duplicate reviews to create seamless loop
    // Ensure we have enough items to scroll smoothly
    const marqueeReviews = [...reviews, ...reviews, ...reviews];
    if (marqueeReviews.length < 10) {
        marqueeReviews.push(...reviews, ...reviews);
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white py-24">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="mb-3 inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-[var(--primary-electric)]">
                        Testimonials
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-5xl">
                        Loved by thousands of learners
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Join our community of verified customers and successful students improving their lives.
                    </p>
                </div>

                {/* Infinite Marquee Container */}
                <div
                    className="relative w-full overflow-hidden group"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                    }}
                >
                    {/* Removed overlapping gradient divs for better background compatibility */}

                    <div className="testimonial-marquee flex gap-6 py-10">
                        {/* We need two sets of the data for seamless looping if using 0 to -50% logic with doubled content. */}
                        {/* Actually, let's just map the large array `marqueeReviews` and scroll it. */}
                        {marqueeReviews.map((testimonial, idx) => {
                            const productTitle = (testimonial as any).product?.title || "Verified Purchase";

                            return (
                                <div
                                    key={`${testimonial._id}-${idx}`}
                                    className="
                                        w-[350px] md:w-[400px] flex-shrink-0
                                        bg-white/70 backdrop-blur-xl
                                        rounded-lg p-8
                                        border border-white/50
                                        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                                        hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)]
                                        hover:bg-white
                                        hover:border-indigo-100
                                        transition-all duration-300
                                        flex flex-col
                                    "
                                >
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-grow line-clamp-4">
                                        "{testimonial.comment}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 border-t border-gray-100/50 pt-6 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                            {testimonial.user?.avatar ? (
                                                <img src={testimonial.user.avatar} alt={testimonial.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(testimonial.user?.name || "User")
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                                {testimonial.user?.name || "Verified User"}
                                            </h4>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide truncate" title={productTitle}>
                                                {productTitle}
                                            </p>
                                        </div>
                                        {/* Verified Badge */}
                                        {testimonial.isVerifiedPurchase && (
                                            <div className="shrink-0" title="Verified Purchase">
                                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
