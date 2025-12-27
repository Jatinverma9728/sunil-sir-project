import { API_URL, ENDPOINTS } from '../constants';
import { getAuthToken } from './auth';

// Types
export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: Array<{ url: string; alt: string }>;
    specs?: Record<string, string>;
    rating: {
        average: number;
        count: number;
    };
    brand?: string;
    tags?: string[];
    inStock: boolean;
    createdAt: string;
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Product[];
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    inStock?: boolean;
    sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

/**
 * Get all products with filters
 */
export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();

    if (filters) {
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.inStock) queryParams.append('inStock', 'true');
        if (filters.sort) queryParams.append('sort', filters.sort);
    }

    const url = `${API_URL}${ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`;
    const response = await fetch(url);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch products');
    }

    return result;
};

/**
 * Get single product by ID
 */
export const getProduct = async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.PRODUCTS.DETAIL(id)}`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch product');
    }

    return result;
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await fetch(`${API_URL}/products/categories`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch categories');
    }

    return result;
};
