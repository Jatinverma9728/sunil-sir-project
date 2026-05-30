import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency to Indian Rupees with Unicode escape sequences to prevent mojibake.
 */
export function formatCurrency(amount: number, includeDecimals = false): string {
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: includeDecimals ? 2 : 0,
        maximumFractionDigits: includeDecimals ? 2 : 0,
    }).format(amount);
    return `\u20B9${formatted}`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

/**
 * Truncate text
 */
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}
