"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useAccessibility";

export default function Hero() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100/50 overflow-hidden">
            {/* Animated Background Elements */}
            {!prefersReducedMotion && (
                <>
                    <motion.div
                        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-[var(--primary-electric)]/10 to-[var(--secondary-pop)]/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-[var(--action)]/10 to-[var(--primary-deep)]/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </>
            )}

            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-electric)]/10 to-[var(--secondary-pop)]/10 rounded-full mb-4 border border-[var(--primary-electric)]/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <span className="w-2 h-2 bg-[var(--primary-electric)] rounded-full animate-pulse" />
                            <p className="text-sm font-bold text-[var(--primary-electric)] tracking-wide uppercase">
                                Welcome to North Tech Hub
                            </p>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-heading font-bold  text-gray-900 mb-6 leading-tight">
                            Premium
                            <br />
                            <span className="bg-gradient-to-r from-[var(--primary-electric)] via-[var(--primary-deep)] to-[var(--action)] bg-clip-text text-transparent">
                                Tech & Learning
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md leading-relaxed">
                            Discover cutting-edge devices and world-class courses.
                            Elevate your tech life and skills with our premium offerings.
                        </p>

                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <Link
                                href="/products"
                                className="group relative px-8 py-4 bg-gradient-to-r from-[var(--primary-electric)] to-[var(--primary-deep)] text-white rounded-full font-bold shadow-[var(--glow-primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden btn-shine"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Now
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>

                            <Link
                                href="/courses"
                                className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold border-2 border-gray-200 hover:border-[var(--primary-electric)] hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                            >
                                Explore Courses
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <div>
                                <p className="text-2xl font-bold text-gray-900">500+</p>
                                <p className="text-sm text-gray-600">Products</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">100+</p>
                                <p className="text-sm text-gray-600">Courses</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">50K+</p>
                                <p className="text-sm text-gray-600">Happy Customers</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        className="relative flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Main Circle with Premium Gradient */}
                        <div className="relative">
                            <motion.div
                                className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-[var(--primary-electric)] via-[var(--primary-deep)] to-[var(--action)] rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform rotate-45" />

                                <span className="text-9xl filter drop-shadow-lg">🎧</span>
                            </motion.div>

                            {/* Floating Badges */}
                            <motion.div
                                className="absolute -top-4 -right-4 px-5 py-3 bg-gradient-to-r from-[var(--secondary-pop)] to-[var(--action)] text-white rounded-2xl font-bold text-sm shadow-xl"
                                animate={!prefersReducedMotion ? {
                                    y: [0, -10, 0],
                                } : {}}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                🔥 Hot Deal
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-4 -left-4 px-5 py-3 bg-white rounded-2xl font-bold text-sm shadow-xl border-2 border-gray-100"
                                animate={!prefersReducedMotion ? {
                                    y: [0, 10, 0],
                                } : {}}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1.5,
                                }}
                            >
                                ⭐ 4.9/5 Rating
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
