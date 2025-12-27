"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
    const [hoveredValue, setHoveredValue] = useState<number | null>(null);

    const stats = [
        { number: "50K+", label: "Happy Customers" },
        { number: "10K+", label: "Products Sold" },
        { number: "500+", label: "Courses Delivered" },
        { number: "99%", label: "Satisfaction Rate" },
    ];

    const values = [
        {
            icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
            title: "Quality First",
            description: "We source only the finest products and create courses with industry experts.",
        },
        {
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            title: "Innovation",
            description: "Constantly evolving to bring you the latest technology and learning experiences.",
        },
        {
            icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Sustainability",
            description: "Committed to eco-friendly practices and responsible business operations.",
        },
        {
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            title: "Customer Focus",
            description: "Your success is our priority. We're here to support you every step of the way.",
        },
    ];

    const team = [
        { name: "Alex Johnson", role: "Founder & CEO", initials: "AJ" },
        { name: "Sarah Chen", role: "Head of Products", initials: "SC" },
        { name: "Michael Park", role: "Lead Designer", initials: "MP" },
        { name: "Emily Davis", role: "Customer Success", initials: "ED" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-6 border border-gray-700 px-4 py-2 rounded-full">
                            About Flash
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-medium mb-6 tracking-tight">
                            Empowering Your Digital Journey
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            We're on a mission to make premium technology and education accessible to everyone.
                            From cutting-edge gadgets to transformative courses, we're here to help you thrive.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 lg:p-14 -mt-20 relative z-20">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className="text-4xl lg:text-5xl font-medium text-gray-900 mb-2 tracking-tight group-hover:scale-110 transition-transform">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Our Story</p>
                            <h2 className="text-3xl lg:text-4xl font-medium text-gray-900 tracking-tight mb-6">
                                From a Simple Idea to a Global Platform
                            </h2>
                            <div className="space-y-4 text-gray-500 leading-relaxed">
                                <p>
                                    Flash was born from a simple belief: everyone deserves access to quality technology
                                    and education. What started in 2020 as a small online store has grown into a
                                    comprehensive platform serving thousands worldwide.
                                </p>
                                <p>
                                    We carefully curate every product and develop courses with industry experts to
                                    ensure you get the best. Our team works tirelessly to find innovative solutions
                                    that make your life easier.
                                </p>
                                <p>
                                    Today, Flash stands as a testament to what's possible when passion meets purpose.
                                    We're not just a marketplace—we're a community of learners, creators, and dreamers.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center overflow-hidden">
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">Growing Together</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Our Values</p>
                        <h2 className="text-3xl lg:text-4xl font-medium text-gray-900 tracking-tight">
                            What We Stand For
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setHoveredValue(i)}
                                onMouseLeave={() => setHoveredValue(null)}
                                className={`
                                    rounded-3xl p-8 text-center transition-all duration-500
                                    ${hoveredValue === i
                                        ? 'bg-gray-900 text-white -translate-y-2 shadow-2xl'
                                        : 'bg-gray-50 text-gray-900'
                                    }
                                `}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors ${hoveredValue === i ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    <svg className={`w-8 h-8 ${hoveredValue === i ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium mb-3">{value.title}</h3>
                                <p className={hoveredValue === i ? 'text-gray-300' : 'text-gray-500'}>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Our Team</p>
                        <h2 className="text-3xl lg:text-4xl font-medium text-gray-900 tracking-tight">
                            Meet the People Behind Flash
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-medium text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                    {member.initials}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                                <p className="text-gray-500 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl lg:text-5xl font-medium text-white mb-6 tracking-tight">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Explore our curated collection of products and courses.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Shop Products
                        </Link>
                        <Link
                            href="/courses"
                            className="px-8 py-4 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
