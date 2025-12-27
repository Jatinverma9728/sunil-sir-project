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

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                setItems(parsedCart);
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

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

        // Show toast after state update (outside setItems to avoid double-trigger in strict mode)
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
        if (items.length > 0) {
            const toast = getToast();
            toast?.info("Cart cleared");
        }
        setItems([]);
    }, [items.length]);

    const getTotalItems = useCallback((): number => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const getTotalPrice = useCallback((): number => {
        return items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
    }, [items]);

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};

