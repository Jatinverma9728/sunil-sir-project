"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface WishlistItem {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    category?: string;
    image?: string;
    images?: Array<{ url: string; alt?: string }>;
    inStock?: boolean;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (product: WishlistItem) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: WishlistItem) => void;
    clearWishlist: () => void;
    getTotalItems: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'wishlist';

// Helper to safely use toast
const getToast = () => {
    if (typeof window === 'undefined') return null;
    try {
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

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse wishlist:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToWishlist = useCallback((product: WishlistItem) => {
        // Check if already in wishlist BEFORE updating state
        const alreadyExists = items.some(item => item._id === product._id);
        if (alreadyExists) return;

        // Show toast BEFORE state update to avoid double-firing in Strict Mode
        const toast = getToast();
        toast?.success(`${product.title} added to wishlist ❤️`);

        setItems((prev) => [...prev, product]);
    }, [items]);

    const removeFromWishlist = useCallback((productId: string) => {
        const item = items.find((i) => i._id === productId);
        if (!item) return;

        // Show toast BEFORE state update
        const toast = getToast();
        toast?.info(`${item.title} removed from wishlist`);

        setItems((prev) => prev.filter((item) => item._id !== productId));
    }, [items]);

    const isInWishlist = useCallback((productId: string) => {
        return items.some((item) => item._id === productId);
    }, [items]);

    const toggleWishlist = useCallback((product: WishlistItem) => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    }, [isInWishlist, removeFromWishlist, addToWishlist]);

    const clearWishlist = useCallback(() => {
        if (items.length > 0) {
            const toast = getToast();
            toast?.info("Wishlist cleared");
        }
        setItems([]);
    }, [items.length]);

    const getTotalItems = useCallback(() => items.length, [items]);

    return (
        <WishlistContext.Provider
            value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, clearWishlist, getTotalItems }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
