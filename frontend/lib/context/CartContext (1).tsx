"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type ToastFunction = (message: string) => void;

export interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
        category: string;
    };
    quantity: number;
    price: number;
    addedAt: string;
    _id?: string;
}

export interface SavedItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    };
    quantity: number;
    savedAt: string;
    _id?: string;
}

interface Product {
    _id: string;
    title?: string;
    name?: string;
    price: number;
    images?: any;
    image?: string;
    stock?: number;
    category?: string;
    [key: string]: any;
}

interface CartContextType {
    items: CartItem[];
    savedForLater: SavedItem[];
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    saveForLater: (productId: string) => Promise<void>;
    moveToCart: (productId: string) => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    refreshCart: () => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getToast = (): { success: ToastFunction; info: ToastFunction; error: ToastFunction } | null => {
    if (typeof window === 'undefined') return null;
    try {
        return {
            success: (message: string) => {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'success' } }));
            },
            info: (message: string) => {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'info' } }));
            },
            error: (message: string) => {
                window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'error' } }));
            }
        };
    } catch {
        return null;
    }
};

const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [savedForLater, setSavedForLater] = useState<SavedItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Load cart from API on mount
    const refreshCart = useCallback(async () => {
        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart`, { headers });
            const data = await response.json();

            if (data.success && data.data) {
                setItems(data.data.items || []);
                setSavedForLater(data.data.savedForLater || []);
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
        }
    }, []);

    // Initialize cart on mount
    useEffect(() => {
        if (!isInitialized) {
            refreshCart().finally(() => setIsInitialized(true));
        }
    }, [isInitialized, refreshCart]);

    // Merge cart when user logs in
    useEffect(() => {
        const handleUserLogin = async () => {
            if (user && isInitialized) {
                try {
                    const token = getAuthToken();
                    const headers: HeadersInit = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(`${API_URL}/cart/merge`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({})
                    });
                    const data = await response.json();

                    if (data.success && data.data) {
                        setItems(data.data.items || []);
                        setSavedForLater(data.data.savedForLater || []);
                        const toast = getToast();
                        toast?.success('Cart synced successfully!');
                    }
                } catch (error) {
                    console.error('Failed to merge cart:', error);
                }
            }
        };

        handleUserLogin();
    }, [user, isInitialized]);

    const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
        const toast = getToast();
        setIsLoading(true);

        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart/add`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ productId: product._id, quantity })
            });
            const data = await response.json();

            if (data.success && data.data) {
                setItems(data.data.items || []);
                setSavedForLater(data.data.savedForLater || []);
                toast?.success('Added to cart! 🛒');
            } else {
                toast?.error(data.message || 'Failed to add item');
            }
        } catch (error: any) {
            console.error('Add to cart error:', error);
            toast?.error(error.message || 'Failed to add item to cart');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeFromCart = useCallback(async (productId: string) => {
        const toast = getToast();
        setIsLoading(true);

        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
                method: 'DELETE',
                headers
            });
            const data = await response.json();

            if (data.success && data.data) {
                setItems(data.data.items || []);
                setSavedForLater(data.data.savedForLater || []);
                toast?.info('Item removed from cart');
            }
        } catch (error: any) {
            console.error('Remove from cart error:', error);
            toast?.error(error.message || 'Failed to remove item');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        const toast = getToast();
        setIsLoading(true);

        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart/update/${productId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();

            if (data.success && data.data) {
                setItems(data.data.items || []);
                setSavedForLater(data.data.savedForLater || []);
                toast?.info('Cart updated');
            } else {
                toast?.error(data.message || 'Failed to update quantity');
            }
        } catch (error: any) {
            console.error('Update quantity error:', error);
            toast?.error(error.message || 'Failed to update cart');
        } finally {
            setIsLoading(false);
        }
    }, [removeFromCart]);

    const clearCart = useCallback(async () => {
        const toast = getToast();
        setIsLoading(true);

        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart/clear`, {
                method: 'DELETE',
                headers
            });
            const data = await response.json();

            if (data.success) {
                setItems([]);
                setSavedForLater([]);
                toast?.info('Cart cleared');
            }
        } catch (error: any) {
            console.error('Clear cart error:', error);
            toast?.error(error.message || 'Failed to clear cart');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveForLaterFunc = useCallback(async (productId: string) => {
        const toast = getToast();
        setIsLoading(true);

        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart/save-later/${productId}`, {
                method: 'POST',
                headers
            });
            const data = await response.json();

            if (data.success && data.data) {
                setItems(data.data.items || []);
                setSavedForLater(data.data.savedForLater || []);
                toast?.success('Saved for later');
            }
        } catch (error: any) {
            console.error('Save for later error:', error);
            toast?.error(error.message || 'Failed to save item');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const moveToCartFunc = useCallback(async (productId: string) => {
        const toast = getToast();
        setIsLoading(true);

        try {
            const token = getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cart/move-to-cart/${productId}`, {
                method: 'POST',
                headers
            });
            const data = await response.json();

            if (data.success && data.data) {
                setItems(data.data.items || []);
                setSavedForLater(data.data.savedForLater || []);
                toast?.success('Moved to cart');
            }
        } catch (error: any) {
            console.error('Move to cart error:', error);
            toast?.error(error.message || 'Failed to move item');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getTotalItems = useCallback((): number => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const getTotalPrice = useCallback((): number => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [items]);

    const value = React.useMemo(() => ({
        items,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater: saveForLaterFunc,
        moveToCart: moveToCartFunc,
        getTotalItems,
        getTotalPrice,
        refreshCart,
        isLoading,
    }), [items, savedForLater, addToCart, removeFromCart, updateQuantity, clearCart, saveForLaterFunc, moveToCartFunc, getTotalItems, getTotalPrice, refreshCart, isLoading]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};
