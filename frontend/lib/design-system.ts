// Design System Helper Utilities for Playful Tech Brand
// Centralized constants and helpers for consistent styling

/**
 * Color Palette
 * Use these in your components for consistent theming
 */
export const colors = {
    // Primary - Electric Indigo
    primary: {
        electric: '#6366F1',
        deep: '#4F46E5',
        light: '#A5B4FC',
        glow: '#818CF8',
        50: '#EEF2FF',
    },
    // Secondary - Playful Amber
    secondary: {
        pop: '#F59E0B',
        warm: '#FBBF24',
        light: '#FEF3C7',
    },
    // Action & States
    action: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    // Neutrals
    neutral: {
        950: '#0A0A0B',
        900: '#18181B',
        800: '#27272A',
        600: '#52525B',
        400: '#A1A1AA',
        200: '#E4E4E7',
        100: '#F4F4F5',
        50: '#FAFAFA',
        white: '#FFFFFF',
    },
} as const;

/**
 * Border Radius Values
 * Mobile-first, optimized from 2rem
 */
export const radius = {
    xs: '0.5rem',    // 8px - Small elements, tags
    sm: '0.75rem',   // 12px - Input fields
    md: '1rem',      // 16px - Buttons
    lg: '1.25rem',   // 20px - Cards (reduced from 2rem)
    xl: '1.5rem',    // 24px - Modals, sections
    '2xl': '2rem',   // 32px - Hero sections only
    full: '9999px',  // Pills, avatars
} as const;

/**
 * Shadow Presets
 */
export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    elevated: '0 20px 40px -12px rgba(0, 0, 0, 0.08)',
    glowPrimary: '0 8px 32px rgba(99, 102, 241, 0.15)',
    glowSecondary: '0 8px 32px rgba(245, 158, 11, 0.15)',
} as const;

/**
 * Typography Utilities
 */
export const typography = {
    fontFamily: {
        heading: 'var(--font-outfit), Outfit, Inter, sans-serif',
        body: 'var(--font-inter), Inter, system-ui, sans-serif',
    },
    fontSize: {
        display: 'clamp(2.5rem, 6vw, 4.5rem)',
        section: 'clamp(1.75rem, 4vw, 3rem)',
        h1: 'clamp(2rem, 5vw, 3.5rem)',
        h2: 'clamp(1.5rem, 4vw, 2.5rem)',
        h3: 'clamp(1.25rem, 3vw, 1.875rem)',
        h4: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    },
} as const;

/**
 * Animation Easing Functions
 */
export const easing = {
    smooth: [0.22, 1, 0.36, 1],        // easeOutExpo
    playful: [0.34, 1.56, 0.64, 1],    // easeOutBack (bounce)
    default: [0.4, 0, 0.2, 1],         // ease cubic
} as const;

/**
 * Breakpoints (Mobile-First)
 */
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

/**
 * Helper: Generate gradient background
 */
export const gradient = {
    primary: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    secondary: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    action: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    soft: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
    indigo: 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)',
    amber: 'linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%)',
} as const;

/**
 * Helper: Class name combiner (alternative to clsx/classnames)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]) => {
    return classes.filter(Boolean).join(' ');
};

/**
 * Helper: Get responsive padding
 */
export const responsivePadding = {
    page: 'px-4 sm:px-6 lg:px-8',
    section: 'py-12 sm:py-16 lg:py-20',
    card: 'p-4 sm:p-5 lg:p-6',
    button: 'px-4 py-2.5 sm:px-6 sm:py-3',
} as const;

/**
 * Helper: Generate mobile-friendly touch target classes
 */
export const touchTarget = 'min-h-[44px] min-w-[44px]';

/**
 * Button Size Variants (use with button classes)
 */
export const buttonSizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
} as const;

/**
 * Common animation duration values
 */
export const duration = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
} as const;

/**
 * Z-index layers
 */
export const zIndex = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
} as const;

/**
 * Helper: Check if color is dark (for text contrast)
 */
export const isDarkColor = (hex: string): boolean => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
};

/**
 * Spacer values (use with Tailwind or inline styles)
 */
export const spacing = {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
} as const;
