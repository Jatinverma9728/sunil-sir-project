"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { wishlistApi } from "../api/wishlist";

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
    const { user, loading: authLoading } = useAuth();

    // Initial load logic
    useEffect(() => {
        if (authLoading) return;

        const loadWishlist = async () => {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            let localItems: WishlistItem[] = [];

            if (stored) {
                try {
                    localItems = JSON.parse(stored);
                } catch (error) {
                    console.error('Failed to parse wishlist:', error);
                }
            }

            if (user) {
                // Logged in: Sync and fetch
                try {
                    if (localItems.length > 0) {
                        const productIds = localItems.map(item => item._id);
                        const syncRes = await wishlistApi.syncWishlist(productIds);
                        if (syncRes.success && syncRes.data) {
                            setItems(syncRes.data.products);
                            localStorage.removeItem(WISHLIST_STORAGE_KEY);
                        }
                    } else {
                        const res = await wishlistApi.getWishlist();
                        if (res.success && res.data) {
                            setItems(res.data.products);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist:", error);
                }
            } else {
                // Guest: Use local items
                setItems(localItems);
            }
            setIsLoaded(true);
        };

        loadWishlist();
    }, [user, authLoading]);

    // Save to localStorage ONLY if Guest
    useEffect(() => {
        if (isLoaded && !user) {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded, user]);

    const addToWishlist = useCallback(async (product: WishlistItem) => {
        // Check if already in wishlist
        const alreadyExists = items.some(item => item._id === product._id);
        if (alreadyExists) return;

        const toast = getToast();

        if (user) {
            try {
                const res = await wishlistApi.addToWishlist(product._id);
                if (res.success && res.data) {
                    setItems(res.data.products);
                    toast?.success(`${product.title} added to wishlist ❤️`);
                }
            } catch (error) {
                console.error("Add to wishlist API error:", error);
                toast?.info("Failed to add to wishlist");
            }
        } else {
            setItems((prev) => [...prev, product]);
            toast?.success(`${product.title} added to wishlist ❤️`);
        }
    }, [items, user]);

    const removeFromWishlist = useCallback(async (productId: string) => {
        const item = items.find((i) => i._id === productId);
        if (!item) return;

        const toast = getToast();

        if (user) {
            try {
                const res = await wishlistApi.removeFromWishlist(productId);
                if (res.success && res.data) {
                    setItems(res.data.products);
                    toast?.info(`${item.title} removed from wishlist`);
                }
            } catch (error) {
                console.error("Remove from wishlist API error:", error);
            }
        } else {
            setItems((prev) => prev.filter((item) => item._id !== productId));
            toast?.info(`${item.title} removed from wishlist`);
        }
    }, [items, user]);

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
