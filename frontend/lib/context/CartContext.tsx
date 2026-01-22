"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

// Toast function type - we'll get this from ToastContext
type ToastFunction = (message: string) => void;

export interface CartItem {
    product: any; // Will be replaced with Product type
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    // New exports
    appliedCoupon: {
        code: string;
        discountType: string;
        discountValue: number;
        discount: number;
    } | null;
    couponCode: string;
    applyCoupon: (couponData: any) => void;
    removeCoupon: () => void;
    getCartTotal: () => {
        subtotal: number;
        shipping: number;
        tax: number;
        discount: number;
        total: number;
    };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

// Helper to safely use toast (avoids circular dependency)
const getToast = (): { success: ToastFunction; info: ToastFunction } | null => {
    if (typeof window === 'undefined') return null;
    try {
        // We'll dispatch custom events that ToastContext listens to
        return {
            success: (message: string) => {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'success' } }));
            },
            info: (message: string) => {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'info' } }));
            }
        };
    } catch {
        return null;
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [couponCode, setCouponCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discountType: string;
        discountValue: number;
        discount: number;
    } | null>(null);

    // Load cart and coupon from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        const storedCoupon = localStorage.getItem('cart_coupon');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                setItems(parsedCart);
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }
        if (storedCoupon) {
            try {
                const parsedCoupon = JSON.parse(storedCoupon);
                setAppliedCoupon(parsedCoupon);
                setCouponCode(parsedCoupon.code);
            } catch (error) {
                console.error('Failed to parse coupon from localStorage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart and coupon to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            if (appliedCoupon) {
                localStorage.setItem('cart_coupon', JSON.stringify(appliedCoupon));
            } else {
                localStorage.removeItem('cart_coupon');
            }
        }
    }, [items, appliedCoupon, isLoaded]);

    const addToCart = useCallback((product: any, quantity: number = 1) => {
        const toast = getToast();

        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.product._id === product._id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { product, quantity }];
            }
        });

        // Show toast
        const existingItem = items.find((item) => item.product._id === product._id);
        if (existingItem) {
            toast?.success(`Updated ${product.title} quantity in cart`);
        } else {
            toast?.success(`${product.title} added to cart! 🛒`);
        }
    }, [items]);

    const removeFromCart = useCallback((productId: string) => {
        const item = items.find((i) => i.product._id === productId);

        setItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));

        if (item) {
            const toast = getToast();
            toast?.info(`${item.product.title} removed from cart`);
        }
    }, [items]);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const item = items.find((i) => i.product._id === productId);

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.product._id === productId ? { ...item, quantity } : item
            )
        );

        if (item) {
            const toast = getToast();
            toast?.info(`Cart updated: ${item.product.title} × ${quantity}`);
        }
    }, [items, removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        setAppliedCoupon(null);
        setCouponCode("");
        // Toast handled in component if needed, or re-add here if consistent with design
    }, []);

    const getTotalItems = useCallback((): number => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    // Raw subtotal
    const getTotalPrice = useCallback((): number => {
        return items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
    }, [items]);

    // Centralized Cart Summary Calculation
    const getCartTotal = useCallback(() => {
        const subtotal = getTotalPrice();
        const couponDiscount = appliedCoupon?.discount || 0;

        // Shipping Logic: Free if > 999, else 99
        // Note: Check if subtotal is after discount or before. Usually shipping is on subtotal.
        const shipping = subtotal > 999 ? 0 : 99;

        const taxableAmount = Math.max(0, subtotal - couponDiscount);
        const tax = taxableAmount * 0.1; // 10% tax

        const total = taxableAmount + tax + shipping;

        return {
            subtotal,
            shipping,
            tax,
            discount: couponDiscount,
            total: Math.max(0, total)
        };
    }, [getTotalPrice, appliedCoupon]);

    const applyCoupon = useCallback((couponData: any) => {
        setAppliedCoupon(couponData);
        setCouponCode(couponData.code);
        const toast = getToast();
        toast?.success("Coupon applied successfully!");
    }, []);

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null);
        setCouponCode("");
        const toast = getToast();
        toast?.info("Coupon removed");
    }, []);

    const value = React.useMemo(() => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        // New exports
        appliedCoupon,
        couponCode,
        applyCoupon,
        removeCoupon,
        getCartTotal
    }), [
        items, addToCart, removeFromCart, updateQuantity, clearCart,
        getTotalItems, getTotalPrice, appliedCoupon, couponCode,
        applyCoupon, removeCoupon, getCartTotal
    ]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};

