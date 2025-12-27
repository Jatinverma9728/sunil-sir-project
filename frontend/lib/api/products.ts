import { API_URL } from '../constants';

interface Product {
    _id: string;
    title: string;
    description: string;
    category: string;
    brand?: string;
    price: number;
    stock: number;
    images: Array<{ url: string; alt?: string }>;
    specs?: Record<string, string>;
    rating: {
        average: number;
        count: number;
    };
    tags?: string[];
}

interface ProductsResponse {
    success: boolean;
    data: Product[];
    count: number;
    pagination?: {
        page: number;
        limit: number;
        totalPages: number;
        total: number;
    };
}

interface SingleProductResponse {
    success: boolean;
    data: Product;
}

interface CategoriesResponse {
    success: boolean;
    data: string[];
}

// Get all products with optional filters
export const getProducts = async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: string;
    featured?: boolean;
}): Promise<ProductsResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.category) queryParams.append('category', params.category);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.featured) queryParams.append('featured', 'true');

        const url = `${API_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get single product by ID
export const getProduct = async (id: string): Promise<SingleProductResponse> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Get all categories
export const getCategories = async (): Promise<CategoriesResponse> => {
    try {
        const response = await fetch(`${API_URL}/products/categories`);

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (
    category: string,
    params?: {
        page?: number;
        limit?: number;
        sort?: string;
    }
): Promise<ProductsResponse> => {
    return getProducts({ category, ...params });
};

export type { Product, ProductsResponse, SingleProductResponse, CategoriesResponse };
