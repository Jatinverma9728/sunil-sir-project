"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stats = [
        { number: "50K+", label: "Happy Customers" },
        { number: "10K+", label: "Products Sold" },
        { number: "500+", label: "Courses Delivered" },
        { number: "4.9", label: "Average Rating" },
    ];

    const values = [
        {
            title: "Innovation First",
            description: "We constantly push boundaries to bring you the latest in tech and education.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Community Driven",
            description: "Built by learners for learners. We grow together with our community.",
            color: "bg-purple-50 text-purple-600"
        },
        {
            title: "Premium Quality",
            description: "Every product and course is rigorously tested to meet our high standards.",
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Transparency",
            description: "No hidden fees, no confusing terms. Just honest business.",
            color: "bg-orange-50 text-orange-600"
        },
    ];

    const team = [
        { name: "Alex Johnson", role: "Founder & CEO", initials: "AJ" },
        { name: "Sarah Chen", role: "Head of Education", initials: "SC" },
        { name: "Michael Park", role: "Product Lead", initials: "MP" },
        { name: "Emily Davis", role: "Community Manager", initials: "ED" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-50 to-transparent rounded-tr-full opacity-50" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeIn}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium tracking-wide mb-8">
                            EST. 2020
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
                            We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">North Tech Hub.</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                            Bridging the gap between premium technology and transformative education.
                            We believe in empowering your digital journey.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - Floating Cards */}
            <section className="py-12">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow text-center"
                            >
                                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm font-medium text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-lg">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image/Video Break */}
            <section className="py-20">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[3rem] overflow-hidden aspect-[21/9] bg-gray-900"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="text-center text-white px-4">
                                <h3 className="text-3xl font-bold mb-4">Our Methodology</h3>
                                <p className="text-gray-400 max-w-xl mx-auto text-lg">
                                    We combine cutting-edge hardware with expert knowledge to create a complete ecosystem for growth.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
                                Built on Trust & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Innovation</span>
                            </h2>
                            <p className="text-lg text-gray-500 leading-relaxed mb-8">
                                We started with a simple idea: technology shouldn't be complicated, and education shouldn't be boring.
                                By blending these two worlds, we created a platform that adapts to your needs.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-colors"
                            >
                                Get in Touch
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {values.map((value, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet The Team</h2>
                        <p className="text-gray-500">The creative minds behind the platform.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden rounded-3xl"
                            >
                                <div className="aspect-[4/5] bg-gray-100 relative">
                                    {/* Placeholder for real team images */}
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-300">
                                        {member.initials}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md group-hover:text-white transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {member.role}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
