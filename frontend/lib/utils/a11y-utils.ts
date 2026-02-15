/**
 * Accessibility Utility Functions
 * Helpers for improving accessibility across the application
 */

/**
 * Generate consistent ARIA labels for common actions
 */
export function generateAriaLabel(action: string, item: string): string {
    return `${action} ${item}`;
}

/**
 * Handle keyboard navigation (Enter/Space) for custom interactive elements
 */
export function handleKeyboardNav(
    e: React.KeyboardEvent,
    callback: () => void
): void {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
    }
}

/**
 * Get ARIA label for product actions
 */
export function getProductActionLabel(
    action: 'addToCart' | 'buyNow' | 'quickView' | 'wishlist',
    productName?: string
): string {
    const labels = {
        addToCart: productName ? `Add ${productName} to cart` : 'Add to cart',
        buyNow: productName ? `Buy ${productName} now` : 'Buy now',
        quickView: productName ? `Quick view ${productName}` : 'Quick view',
        wishlist: productName ? `Add ${productName} to wishlist` : 'Add to wishlist',
    };
    return labels[action];
}

/**
 * Get contrast ratio between two colors (simplified)
 * Returns 'pass' or 'fail' for WCAG AA compliance (4.5:1 for normal text)
 */
export function checkContrast(foreground: string, background: string): 'pass' | 'fail' {
    // Simplified check - in production you'd use a proper contrast calculation
    // For now, we'll check common problematic combinations

    const problematicCombos = [
        { fg: 'text-gray-400', bg: 'bg-white' }, // Low contrast
        { fg: 'text-gray-300', bg: 'bg-gray-100' }, // Too similar
    ];

    const isProblem = problematicCombos.some(
        combo => foreground.includes(combo.fg) && background.includes(combo.bg)
    );

    return isProblem ? 'fail' : 'pass';
}

/**
 * Announce to screen readers using ARIA live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Screen reader only
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(liveRegion);
    }, 1000);
}

/**
 * Check if element is keyboard focusable
 */
export function isFocusable(element: HTMLElement): boolean {
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    const isFocusableTag = focusableTags.includes(element.tagName);
    const hasTabIndex = element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1';

    return (isFocusableTag || hasTabIndex) && !element.hasAttribute('disabled');
}

/**
 * Get descriptive label for form validation
 */
export function getValidationMessage(field: string, error: string): string {
    return `${field}: ${error}`;
}
