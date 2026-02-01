"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface PageTransitionProps {
    children: React.ReactNode;
}

/**
 * Page Transition Wrapper
 * Smooth slide animation on mobile/tablet only (< 1024px)
 * - Forward navigation: slide in from right
 * - Back navigation: slide in from left
 */
export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
    const previousPathRef = useRef(pathname);

    useEffect(() => {
        // Check screen size
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        // Detect navigation direction using browser history
        const handlePopState = () => {
            setDirection(-1); // Back button pressed
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    useEffect(() => {
        // When pathname changes, set forward direction (unless popstate set it to back)
        if (pathname !== previousPathRef.current) {
            // Reset to forward for regular navigation
            const timer = setTimeout(() => setDirection(1), 50);
            previousPathRef.current = pathname;
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    // Simple slide variants
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? "100%" : "-100%",
            opacity: 0.5,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "tween", duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.2 },
            },
        },
        exit: (dir: number) => ({
            x: dir > 0 ? "-30%" : "30%",
            opacity: 0,
            transition: {
                x: { type: "tween", duration: 0.2, ease: "easeIn" },
                opacity: { duration: 0.15 },
            },
        }),
    };

    // On desktop, render without animation
    if (!isMobile) {
        return <>{children}</>;
    }

    // On mobile/tablet, apply slide transition
    return (
        <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
                key={pathname}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
                style={{ willChange: "transform, opacity" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
