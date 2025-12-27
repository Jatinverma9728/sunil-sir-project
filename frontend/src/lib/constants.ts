// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Site Configuration
export const SITE_NAME = 'E-Commerce + Course Platform';
export const SITE_DESCRIPTION = 'Premium products and online courses';

// Pagination
export const ITEMS_PER_PAGE = 12;

// API Endpoints
export const ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
    },
    PRODUCTS: {
        LIST: '/products',
        DETAIL: (id: string) => `/products/${id}`,
        SEARCH: '/products/search',
    },
    COURSES: {
        LIST: '/courses',
        DETAIL: (id: string) => `/courses/${id}`,
        ENROLL: (id: string) => `/courses/${id}/enroll`,
    },
    ORDERS: {
        CREATE: '/orders',
        LIST: '/orders',
        DETAIL: (id: string) => `/orders/${id}`,
    },
    CART: {
        GET: '/cart',
        ADD: '/cart/add',
        UPDATE: '/cart/update',
        REMOVE: '/cart/remove',
        CLEAR: '/cart/clear',
    },
} as const;
