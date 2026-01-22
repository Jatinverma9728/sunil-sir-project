// Scroll animation variants for Playful Tech brand
// Properly typed for framer-motion

/**
 * Fade in from bottom with slide up
 * Perfect for: Product cards, content sections, CTAs
 */
export const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

/**
 * Fade in from left
 * Perfect for: Alternating content sections, images
 */
export const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

/**
 * Fade in from right
 * Perfect for: Alternating content sections, images
 */
export const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

/**
 * Scale in with fade (playful bounce)
 * Perfect for: Category cards, badges, featured items
 */
export const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
};

/**
 * Stagger container for lists
 * Perfect for: Product grids, feature lists
 */
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

/**
 * Stagger item (use with staggerContainer)
 */
export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

/**
 * Fade in only (no movement)
 * Perfect for: Backgrounds, overlays
 */
export const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5 }
};

/**
 * Slide up from bottom (for modals, drawers)
 */
export const slideUp = {
    initial: { y: 100 },
    animate: { y: 0 },
    exit: { y: 100 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

/**
 * Rotate and scale (playful entrance)
 * Perfect for: Icons, badges
 */
export const rotateScale = {
    initial: { opacity: 0, scale: 0, rotate: -180 },
    whileInView: { opacity: 1, scale: 1, rotate: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
};

// Mobile-optimized versions (faster, shorter distances)
export const mobileOptimized = {
    fadeInUp: {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
    }
};
