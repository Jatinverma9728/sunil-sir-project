import { apiClient } from './client';
import { CartItem } from '../context/CartContext';

export const cartApi = {
    // Get user cart
    // T is the type of 'data' in the response. Controller returns { data: cart }.
    getCart: async () => {
        return apiClient.get<{ items: CartItem[] }>('/cart', true);
    },

    // Add or update item in cart
    addToCart: async (productId: string, quantity: number) => {
        return apiClient.post<{ items: CartItem[] }>('/cart', {
            productId,
            quantity
        }, true);
    },

    // Update specific item quantity
    updateItem: async (productId: string, quantity: number) => {
        return apiClient.put<{ items: CartItem[] }>(`/cart/${productId}`, {
            quantity
        }, true);
    },

    // Remove item from cart
    removeItem: async (productId: string) => {
        return apiClient.delete<{ items: CartItem[] }>(`/cart/${productId}`, true);
    },

    // Clear cart
    clearCart: async () => {
        return apiClient.delete<{ items: any[] }>('/cart', true);
    },

    // Sync local cart to backend
    syncCart: async (items: { product: string | any; quantity: number }[]) => {
        const payload = items.map(item => ({
            product: item.product._id || item.product.id || item.product,
            quantity: item.quantity
        }));

        return apiClient.post<{ items: CartItem[] }>('/cart/sync', {
            items: payload
        }, true);
    }
};
