"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { getActiveOffers, Offer } from "@/lib/api/promotions";

interface OfferPrice {
    originalPrice: number;
    discountedPrice: number;
    discountPercent: number;
    offerName: string;
    offerType: string;
    endDate?: string;
}

interface OffersContextType {
    offers: Offer[];
    loading: boolean;
    getProductOffer: (productId: string, category: string, price: number) => OfferPrice | null;
    refreshOffers: () => Promise<void>;
}

const OffersContext = createContext<OffersContextType | null>(null);

export function OffersProvider({ children }: { children: ReactNode }) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch active offers
    const fetchOffers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getActiveOffers();
            console.log("[OffersProvider] Fetched offers:", res);
            if (res.success && res.data) {
                setOffers(res.data as Offer[]);
            }
        } catch (error) {
            console.error("[OffersProvider] Error fetching offers:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    // Get the best applicable offer for a product
    const getProductOffer = useCallback((productId: string, category: string, originalPrice: number): OfferPrice | null => {
        console.log('[getProductOffer] Called with:', { productId, category, originalPrice, offersCount: offers.length });

        if (!offers.length) {
            console.log('[getProductOffer] No offers available');
            return null;
        }

        const now = new Date();

        // Find all applicable offers for this product
        const applicableOffers = offers.filter(offer => {
            // Check if offer is active and within date range
            if (!offer.isActive) return false;
            if (new Date(offer.startDate) > now) return false;
            if (offer.endDate && new Date(offer.endDate) < now) return false;

            // Check usage limit
            if (offer.usageLimit && offer.usedCount >= offer.usageLimit) return false;

            // Check if product is excluded
            if (offer.excludedProducts?.includes(productId)) return false;

            // Check if offer applies to this product
            if (offer.applicableProducts && offer.applicableProducts.length > 0) {
                // Offer is for specific products
                return offer.applicableProducts.includes(productId);
            }

            if (offer.applicableCategories && offer.applicableCategories.length > 0) {
                // Offer is for specific categories
                return offer.applicableCategories.includes(category);
            }

            // Offer applies to all products (no category/product restrictions)
            return true;
        });

        if (applicableOffers.length === 0) return null;

        // Get the best offer (highest priority, then highest discount)
        const sortedOffers = applicableOffers.sort((a, b) => {
            // First by priority (higher first)
            if (b.priority !== a.priority) return b.priority - a.priority;
            // Then by discount value (higher first)
            return b.discountValue - a.discountValue;
        });

        const bestOffer = sortedOffers[0];

        // Calculate discount
        let discountedPrice = originalPrice;
        let discountPercent = 0;

        if (bestOffer.discountType === "percentage") {
            discountPercent = bestOffer.discountValue;
            discountedPrice = originalPrice * (1 - bestOffer.discountValue / 100);

            // Apply max discount cap if set
            if (bestOffer.maxDiscount && (originalPrice - discountedPrice) > bestOffer.maxDiscount) {
                discountedPrice = originalPrice - bestOffer.maxDiscount;
                discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
            }
        } else {
            // Fixed discount
            discountedPrice = Math.max(0, originalPrice - bestOffer.discountValue);
            discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        }

        // Round to 2 decimal places
        discountedPrice = Math.round(discountedPrice * 100) / 100;

        return {
            originalPrice,
            discountedPrice,
            discountPercent,
            offerName: bestOffer.name,
            offerType: bestOffer.type,
            endDate: bestOffer.endDate,
        };
    }, [offers]);

    const contextValue: OffersContextType = {
        offers,
        loading,
        getProductOffer,
        refreshOffers: fetchOffers,
    };

    return (
        <OffersContext.Provider value={contextValue}>
            {children}
        </OffersContext.Provider>
    );
}

// Hook to use offers in components
export function useOffers() {
    const context = useContext(OffersContext);
    if (!context) {
        // Return a default context if provider not found (for pages that don't need offers)
        return {
            offers: [] as Offer[],
            loading: false,
            getProductOffer: () => null,
            refreshOffers: async () => { },
        };
    }
    return context;
}

// Standalone hook for simple discount calculation without context
export function useProductDiscount(productId: string, category: string, price: number) {
    const { getProductOffer, loading } = useOffers();
    const [offerPrice, setOfferPrice] = useState<OfferPrice | null>(null);

    useEffect(() => {
        if (!loading) {
            const result = getProductOffer(productId, category, price);
            setOfferPrice(result);
        }
    }, [productId, category, price, loading, getProductOffer]);

    return { offerPrice, loading };
}
