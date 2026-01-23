import { apiClient } from './client';

// Helper type if Product is not globally available yet, 
// though typically we'd import from central types.
// For now, let's use 'any' for product in response to avoid build errors if type is missing,
// or better, define interface here.

interface WishlistResponse {
    _id: string;
    user: string;
    products: any[]; // populated products
    createdAt: string;
    updatedAt: string;
}

export const wishlistApi = {
    // Get user wishlist
    getWishlist: async () => {
        return apiClient.get<WishlistResponse>('/wishlist', true);
    },

    // Add item to wishlist
    addToWishlist: async (productId: string) => {
        return apiClient.post<WishlistResponse>('/wishlist/add', {
            productId
        }, true);
    },

    // Remove item from wishlist
    removeFromWishlist: async (productId: string) => {
        return apiClient.delete<WishlistResponse>(`/wishlist/${productId}`, true);
    },

    // Sync local wishlist to backend
    syncWishlist: async (productIds: string[]) => {
        return apiClient.post<WishlistResponse>('/wishlist/sync', {
            items: productIds
        }, true);
    }
};
