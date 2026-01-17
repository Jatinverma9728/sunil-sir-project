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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-gradient-to-t from-gray-50 to-white">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 bg-indigo-50 px-3 py-1 rounded-full">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                        Trusted by Thousands
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        We pride ourselves on providing the best experience for our customers. Here’s what they have to say.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`
                                bg-white rounded-[2rem] p-8 
                                transition-all duration-500
                                border border-gray-100
                                hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1
                                ${index === currentIndex ? 'border-indigo-100 ring-4 ring-indigo-50/50' : ''}
                            `}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 h-20">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-12 bg-gray-100/50 w-fit mx-auto px-4 py-2 rounded-full">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`
                                h-1.5 rounded-full transition-all duration-500
                                ${index === currentIndex
                                    ? "bg-gray-900 w-8"
                                    : "bg-gray-300 w-1.5 hover:bg-gray-400"
                                }
                            `}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
