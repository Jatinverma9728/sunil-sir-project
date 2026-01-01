// Admin API helper functions
// All endpoints require admin authentication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from cookie
const getAuthToken = (): string | null => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('auth_token='));

    if (!tokenCookie) return null;

    return tokenCookie.split('=')[1];
};

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalCourses: number;
    pendingOrders: number;
    recentOrders: Order[];
}

export const getAdminDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
    try {
        // Fetch order stats
        const orderStatsRes = await fetch(`${API_URL}/admin/orders/stats`, {
            headers: getAuthHeaders(),
        });
        const orderStats = await orderStatsRes.json();

        // Fetch products count
        const productsRes = await fetch(`${API_URL}/admin/products?limit=1`, {
            headers: getAuthHeaders(),
        });
        const productsData = await productsRes.json();

        // Fetch users count
        const usersRes = await fetch(`${API_URL}/admin/users?limit=1`, {
            headers: getAuthHeaders(),
        });
        const usersData = await usersRes.json();

        // Fetch courses count
        const coursesRes = await fetch(`${API_URL}/admin/courses?limit=1`, {
            headers: getAuthHeaders(),
        });
        const coursesData = await coursesRes.json();

        // Fetch recent orders
        const recentOrdersRes = await fetch(`${API_URL}/admin/orders?limit=5`, {
            headers: getAuthHeaders(),
        });
        const recentOrdersData = await recentOrdersRes.json();

        return {
            success: true,
            data: {
                totalRevenue: orderStats.data?.totalRevenue || 0,
                totalOrders: orderStats.data?.totalOrders || 0,
                totalProducts: productsData.total || 0,
                totalUsers: usersData.total || 0,
                totalCourses: coursesData.total || 0,
                pendingOrders: orderStats.data?.pendingOrders || 0,
                recentOrders: recentOrdersData.data || [],
            },
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { success: false, message: 'Failed to fetch dashboard stats' };
    }
};

// ============================================
// PRODUCTS
// ============================================

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: Array<{ url: string; alt?: string }>;
    specs?: Record<string, string>;
    rating?: { average: number; count: number };
    isActive: boolean;
    isFeatured?: boolean;
    tags?: string[];
    brand?: string;
    sku?: string;
    createdAt: string;
}

export interface ProductFormData {
    title: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images?: Array<{ url: string; alt?: string }>;
    specs?: Record<string, string>;
    tags?: string[];
    brand?: string;
    sku?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}

export const getAdminProducts = async (page = 1, limit = 20, filters?: { category?: string; isActive?: boolean }) => {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (filters?.category) params.append('category', filters.category);
        if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

        const response = await fetch(`${API_URL}/admin/products?${params}`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, message: 'Failed to fetch products' };
    }
};

export const createAdminProduct = async (data: ProductFormData) => {
    try {
        const response = await fetch(`${API_URL}/admin/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, message: 'Failed to create product' };
    }
};

export const updateAdminProduct = async (id: string, data: Partial<ProductFormData>) => {
    try {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, message: 'Failed to update product' };
    }
};

export const deleteAdminProduct = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, message: 'Failed to delete product' };
    }
};

// ============================================
// ORDERS
// ============================================

export interface Order {
    _id: string;
    user: { _id: string; name: string; email: string };
    orderItems: Array<{
        product: string;
        title: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentInfo: {
        method: string;
        status: string;
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    deliveredAt?: string;
    cancelledAt?: string;
}

export const getAdminOrders = async (page = 1, limit = 20, filters?: { status?: string; paymentStatus?: string }) => {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (filters?.status) params.append('status', filters.status);
        if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

        const response = await fetch(`${API_URL}/admin/orders?${params}`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, message: 'Failed to fetch orders' };
    }
};

export const updateAdminOrderStatus = async (id: string, status: string, reason?: string) => {
    try {
        const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status, reason }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, message: 'Failed to update order status' };
    }
};

export const getAdminOrderById = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/admin/orders/${id}`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching order details:', error);
        return { success: false, message: 'Failed to fetch order details' };
    }
};

export const getAdminOrderStats = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/orders/stats`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching order stats:', error);
        return { success: false, message: 'Failed to fetch order stats' };
    }
};

// ============================================
// COURSES
// ============================================

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    instructor: { _id: string; name: string; email: string };
    category: string;
    level: string;
    thumbnail: string;
    images?: Array<{ url: string; alt?: string }>;
    lessons?: Array<{ title: string; duration: number; videoUrl?: string }>;
    requirements?: string[];
    whatYouWillLearn?: string[];
    rating?: { average: number; count: number };
    enrolledStudents: number;
    isPublished: boolean;
    tags?: string[];
    language?: string;
    createdAt: string;
}

export interface CourseFormData {
    title: string;
    description: string;
    price: number;
    category: string;
    level: string;
    thumbnail: string;
    images?: Array<{ url: string; alt?: string }>;
    lessons?: Array<{ title: string; duration: number; videoUrl?: string }>;
    requirements?: string[];
    whatYouWillLearn?: string[];
    tags?: string[];
    language?: string;
    isPublished?: boolean;
}

export const getAdminCourses = async (page = 1, limit = 20, filters?: { category?: string; isPublished?: boolean }) => {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (filters?.category) params.append('category', filters.category);
        if (filters?.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));

        const response = await fetch(`${API_URL}/admin/courses?${params}`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching courses:', error);
        return { success: false, message: 'Failed to fetch courses' };
    }
};

export const createAdminCourse = async (data: CourseFormData) => {
    try {
        const response = await fetch(`${API_URL}/admin/courses`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating course:', error);
        return { success: false, message: 'Failed to create course' };
    }
};

export const updateAdminCourse = async (id: string, data: Partial<CourseFormData>) => {
    try {
        const response = await fetch(`${API_URL}/admin/courses/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating course:', error);
        return { success: false, message: 'Failed to update course' };
    }
};

export const deleteAdminCourse = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/admin/courses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting course:', error);
        return { success: false, message: 'Failed to delete course' };
    }
};

export const getAdminCourseStats = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/courses/stats`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching course stats:', error);
        return { success: false, message: 'Failed to fetch course stats' };
    }
};

// ============================================
// USERS
// ============================================

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar?: string;
    isEmailVerified: boolean;
    createdAt: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role?: 'user' | 'admin';
    avatar?: string;
}

export const getAdminUsers = async (page = 1, limit = 20, search?: string) => {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.append('search', search);

        const response = await fetch(`${API_URL}/admin/users?${params}`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, message: 'Failed to fetch users' };
    }
};

export const createAdminUser = async (data: UserFormData) => {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Failed to create user' };
    }
};

export const updateAdminUser = async (id: string, data: Partial<UserFormData>) => {
    try {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Failed to update user' };
    }
};

export const deleteAdminUser = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user' };
    }
};

// ============================================
// IMAGE UPLOAD
// ============================================

export const uploadImages = async (files: File[]): Promise<{ success: boolean; urls?: string[]; message?: string }> => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const token = getAuthToken();
        const response = await fetch(`${API_URL}/upload/images`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Error uploading images:', error);
        return { success: false, message: 'Failed to upload images' };
    }
};
