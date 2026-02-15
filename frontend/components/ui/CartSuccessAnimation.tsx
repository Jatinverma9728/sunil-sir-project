"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CartSuccessAnimationProps {
    show: boolean;
    productName?: string;
}

export default function CartSuccessAnimation({ show, productName }: CartSuccessAnimationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="fixed bottom-24 right-6 z-50 pointer-events-none"
                >
                    <div className="bg-gradient-to-r from-[var(--primary-electric)] to-[var(--primary-deep)] text-white px-6 py-4 rounded-2xl shadow-[var(--glow-primary)] flex items-center gap-3 min-w-[280px]">
                        {/* Success Icon with bounce */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                                delay: 0.1,
                            }}
                            className="flex-shrink-0"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Text content */}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-base">Added to cart!</p>
                            {productName && (
                                <p className="text-sm text-white/90 truncate">{productName}</p>
                            )}
                        </div>

                        {/* Animated cart icon */}
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                delay: 0.3,
                                ease: "easeOut",
                            }}
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
