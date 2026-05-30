
"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
}

/**
 * Page Transition Wrapper
 * Performs a clean, premium entrance fade-in and slight slide-up animation.
 * This entrance-only transition avoids using AnimatePresence exit animations,
 * which cause conflicts with Next.js App Router's route lifecycle and result
 * in blank screens on mobile/tablet back navigation.
 */
export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
