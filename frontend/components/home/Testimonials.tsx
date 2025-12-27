"use client";

import { useState, useEffect } from "react";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Software Developer",
        initials: "SJ",
        rating: 5,
        text: "Amazing products and excellent customer service! I've purchased multiple items and they all exceeded my expectations.",
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "Entrepreneur",
        initials: "MC",
        rating: 5,
        text: "The courses helped me launch my startup. The instructors are knowledgeable and the content is practical.",
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Designer",
        initials: "ED",
        rating: 5,
        text: "Fast shipping, great quality products, and responsive support team. Highly recommended!",
    },
    {
        id: 4,
        name: "David Brown",
        role: "Student",
        initials: "DB",
        rating: 5,
        text: "The learning platform is intuitive and the courses are well-structured. Best investment I've made!",
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Premium Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
                        Testimonials
                    </p>
                    <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Join thousands of satisfied customers worldwide
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            onMouseEnter={() => setHoveredId(testimonial.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`
                                bg-white rounded-3xl p-7 
                                transition-all duration-500
                                border border-gray-100
                                ${hoveredId === testimonial.id
                                    ? 'shadow-2xl shadow-gray-200/60 border-gray-200 -translate-y-2'
                                    : index === currentIndex
                                        ? 'shadow-lg border-gray-200'
                                        : 'shadow-sm hover:shadow-md'
                                }
                            `}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-600 text-base leading-relaxed mb-6">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                                    transition-colors duration-300
                                    ${hoveredId === testimonial.id
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }
                                `}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`
                                h-2 rounded-full transition-all duration-500
                                ${index === currentIndex
                                    ? "bg-gray-900 w-8"
                                    : "bg-gray-200 w-2 hover:bg-gray-400"
                                }
                            `}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
