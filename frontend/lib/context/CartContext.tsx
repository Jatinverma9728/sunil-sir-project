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


// ... (imports remain similar, assume 'useAuth' is imported)
import { useAuth } from "./AuthContext";
import { cartApi } from "../api/cart";

// ... (Interface definitions same)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user, loading: authLoading } = useAuth(); // Get auth state

    const [couponCode, setCouponCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discountType: string;
        discountValue: number;
        discount: number;
    } | null>(null);

    // Initial load logic
    useEffect(() => {
        // If auth is loading, wait
        if (authLoading) return;

        const loadCart = async () => {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            let localItems: CartItem[] = [];

            if (storedCart) {
                try {
                    localItems = JSON.parse(storedCart);
                } catch (error) {
                    console.error('Failed to parse cart from localStorage:', error);
                }
            }

            if (user) {
                // Logged in: Fetch backend cart
                try {
                    // Start sync if local items exist
                    if (localItems.length > 0) {
                        try {
                            const syncRes = await cartApi.syncCart(localItems);
                            if (syncRes.success && syncRes.data) {
                                setItems(syncRes.data.items); // Fixed: Access res.data.items
                                // Clear local storage after sync
                                localStorage.removeItem(CART_STORAGE_KEY);
                            }
                        } catch (syncErr) {
                            console.error("Sync cart failed", syncErr);
                            // Fallback to fetching remote if sync fails? 
                            // Or keep local? Let's just create a merge view? 
                            // For simplicity, just fetch backend cart if sync failed
                            const res = await cartApi.getCart();
                            if (res.success && res.data) setItems(res.data.items);
                        }
                    } else {
                        // Just fetch
                        const res = await cartApi.getCart();
                        if (res.success && res.data) setItems(res.data.items);
                    }
                } catch (error) {
                    console.error("Failed to fetch backend cart:", error);
                    // Fallback to local items if backend fails?
                    // Better to show empty or error toast. 
                    // But if fetching failed, maybe network error.
                    // Let's keep existing items if any, but setItems([]) is safer if we want to avoid desync
                    // Or keep local view
                }
            } else {
                // Guest: Use local items
                setItems(localItems);
            }

            // Load coupon (local only for now, unless we persist coupon in backend too - Task doesn't specify coupon persistence)
            const storedCoupon = localStorage.getItem('cart_coupon');
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
        };

        loadCart();
    }, [user, authLoading]);

    // Save cart to localStorage ONLY if Guest
    useEffect(() => {
        if (isLoaded && !user) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }

        // Always persist coupon locally for now (simplified)
        if (isLoaded) {
            if (appliedCoupon) {
                localStorage.setItem('cart_coupon', JSON.stringify(appliedCoupon));
            } else {
                localStorage.removeItem('cart_coupon');
            }
        }
    }, [items, appliedCoupon, isLoaded, user]);

    const addToCart = useCallback(async (product: any, quantity: number = 1) => {
        const toast = getToast();

        // Optimistic UI update or wait for API?
        // Let's wait for API if logged in, to ensure stock/validation? 
        // Or Optimistic for speed.
        // Let's go with Optimistic for Guest, API for User to verify persistence.

        if (user) {
            try {
                // API Call
                const res = await cartApi.addToCart(product._id || product.id, quantity);
                if (res.success && res.data) {
                    setItems(res.data.items); // Backend returns full updated cart items usually
                    toast?.success(`${product.title} added to cart! 🛒`);
                } else {
                    toast?.info(res.message || "Could not add to cart");
                }
            } catch (error) {
                console.error("Add to cart API error:", error);
                toast?.info("Failed to add to cart. Please try again.");
            }
        } else {
            // Guest Logic (Local)
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
            toast?.success(`${product.title} added to cart! 🛒`);
        }
    }, [items, user]);

    const removeFromCart = useCallback(async (productId: string) => {
        const toast = getToast();
        const item = items.find((i) => i.product._id === productId);

        if (user) {
            try {
                const res = await cartApi.removeItem(productId);
                if (res.success && res.data) {
                    setItems(res.data.items);
                    toast?.info(`${item?.product?.title || 'Item'} removed from cart`);
                }
            } catch (error) {
                console.error("Remove cart item API error:", error);
            }
        } else {
            setItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
            if (item) {
                toast?.info(`${item.product.title} removed from cart`);
            }
        }
    }, [items, user]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        const toast = getToast();
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const item = items.find((i) => i.product._id === productId);

        if (user) {
            try {
                const res = await cartApi.updateItem(productId, quantity);
                if (res.success && res.data) {
                    setItems(res.data.items);
                    toast?.info(`Cart updated: ${item?.product?.title} × ${quantity}`);
                }
            } catch (error) {
                console.error("Update cart item API error:", error);
            }
        } else {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.product._id === productId ? { ...item, quantity } : item
                )
            );

            if (item) {
                toast?.info(`Cart updated: ${item.product.title} × ${quantity}`);
            }
        }
    }, [items, removeFromCart, user]);

    const clearCart = useCallback(async () => {
        if (user) {
            try {
                await cartApi.clearCart();
                setItems([]);
            } catch (e) {
                console.error("Clear cart error", e);
            }
        } else {
            setItems([]);
        }
        setAppliedCoupon(null);
        setCouponCode("");
    }, [user]);

    // ... (rest of calculations same) ...
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

