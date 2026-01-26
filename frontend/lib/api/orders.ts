import { apiClient } from './client';

export interface OrderItem {
    product: { _id: string, title: string, price: number, images: { url: string }[] } | string;
    title: string;
    quantity: number;
    price: number;
    image?: string;
}

export interface Order {
    _id: string;
    orderItems: OrderItem[];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentInfo: {
        razorpayPaymentId?: string;
        razorpayOrderId?: string;
        razorpaySignature?: string;
        status: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    discountPrice: number;
    orderStatus: string;
    createdAt: string;
}

export interface CreateOrderPayload {
    orderItems: {
        product: string;
        title: string;
        quantity: number;
        price: number;
        image: string;
    }[];
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    discountPrice: number;
    couponCode?: string;
}

export const orderApi = {
    // Create new order
    createOrder: async (data: CreateOrderPayload) => {
        return apiClient.post<{
            order: Order;
            razorpayOrderId: string;
            razorpayKeyId: string
        }>('/orders', data, true);
    },

    // Verify payment
    verifyPayment: async (orderId: string, data: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }) => {
        return apiClient.post<Order>(`/orders/${orderId}/verify`, data, true);
    },

    // Get my orders
    getMyOrders: async (page = 1, limit = 10) => {
        return apiClient.get<Order[]>(`/orders/my-orders?page=${page}&limit=${limit}`, true) as Promise<{
            success: boolean;
            count: number;
            total: number;
            page: number;
            pages: number;
            data: Order[];
            message?: string;
        }>;
    },

    // Get single order
    getOrder: async (id: string) => {
        return apiClient.get<Order>(`/orders/${id}`, true);
    }
};
