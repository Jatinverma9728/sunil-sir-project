// Admin API helper functions
// All endpoints require admin authentication

import { apiClient, ApiResponse } from './client';

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
    // Additional stats from enhanced backend
    todayOrders?: number;
    todayRevenue?: number;
    averageOrderValue?: number;
    revenueGrowth?: number;
    weekRevenue?: number;
    monthRevenue?: number;
    chartData?: Array<{ date: string; revenue: number; orders: number }>;
    statusDistribution?: Array<{ name: string; value: number; color: string }>;
}

export const getAdminDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
    try {
        console.log("Starting dashboard stats fetch...");

        // Fetch order stats
        const orderStatsRes = await apiClient.get<any>('/admin/orders/stats', true);
        console.log("Order stats raw response:", orderStatsRes);
        const orderStats = orderStatsRes;

        // Fetch products count
        const productsRes = await apiClient.get<any>('/admin/products?limit=1', true);
        console.log("Products raw response:", productsRes);
        const productsData = productsRes;

        // Fetch users count
        const usersRes = await apiClient.get<any>('/admin/users?limit=1', true);
        console.log("Users raw response:", usersRes);
        const usersData = usersRes;

        // Fetch courses count
        const coursesRes = await apiClient.get<any>('/admin/courses?limit=1', true);
        console.log("Courses raw response:", coursesRes);
        const coursesData = coursesRes;

        // Fetch recent orders
        const recentOrdersRes = await apiClient.get<{ data: Order[] }>('/admin/orders?limit=5', true);
        console.log("Recent orders raw response:", recentOrdersRes);
        const recentOrdersData = recentOrdersRes;

        const dashboardData = {
            totalRevenue: orderStats.data?.totalRevenue || 0,
            totalOrders: orderStats.data?.totalOrders || 0,
            totalProducts: (productsData as any).total || (productsData as any).count || (productsData as any).pagination?.total || 0,
            totalUsers: (usersData as any).total || (usersData as any).count || (usersData as any).pagination?.total || 0,
            totalCourses: (coursesData as any).total || (coursesData as any).count || (coursesData as any).pagination?.total || 0,
            pendingOrders: orderStats.data?.pendingOrders || 0,
            recentOrders: (recentOrdersData.data as any)?.data || recentOrdersData.data || [] as Order[],
            // Enhanced stats from backend
            todayOrders: orderStats.data?.todayOrders || 0,
            todayRevenue: orderStats.data?.todayRevenue || 0,
            averageOrderValue: orderStats.data?.averageOrderValue || 0,
            revenueGrowth: orderStats.data?.revenueGrowth || 0,
            weekRevenue: orderStats.data?.weekRevenue || 0,
            monthRevenue: orderStats.data?.monthRevenue || 0,
            chartData: orderStats.data?.chartData || [],
            statusDistribution: orderStats.data?.statusDistribution || [],
        };

        console.log("Final dashboard data:", dashboardData);

        return {
            success: true,
            data: dashboardData,
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
    originalPrice?: number;
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
    // Enhanced fields
    specifications?: Record<string, string>;
    policies?: {
        returnPolicy?: string;
        shippingPolicy?: string;
        cancellationPolicy?: string;
    };
    warranty?: {
        duration?: string;
        type?: 'manufacturer' | 'seller' | 'extended' | 'none' | '';
        details?: string;
    };
    externalLinks?: {
        userManual?: string;
        supportUrl?: string;
        videoUrl?: string;
        manufacturerWebsite?: string;
    };
    additionalResources?: Array<{
        title: string;
        url: string;
        type: 'pdf' | 'video' | 'article' | 'download' | 'other';
    }>;
    createdAt: string;
}

export interface ProductFormData {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    stock: number;
    images?: Array<{ url: string; alt?: string }>;
    specs?: Record<string, string>;
    tags?: string[];
    brand?: string;
    sku?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    // Enhanced fields
    specifications?: Record<string, string>;
    policies?: {
        returnPolicy?: string;
        shippingPolicy?: string;
        cancellationPolicy?: string;
    };
    warranty?: {
        duration?: string;
        type?: 'manufacturer' | 'seller' | 'extended' | 'none' | '';
        details?: string;
    };
    externalLinks?: {
        userManual?: string;
        supportUrl?: string;
        videoUrl?: string;
        manufacturerWebsite?: string;
    };
    additionalResources?: Array<{
        title: string;
        url: string;
        type: 'pdf' | 'video' | 'article' | 'download' | 'other';
    }>;
}

export const getAdminProducts = async (page = 1, limit = 20, filters?: { category?: string; isActive?: boolean }) => {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (filters?.category) params.append('category', filters.category);
        if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

        const response = await apiClient.get<any>(`/admin/products?${params}`, true);
        return response;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, message: 'Failed to fetch products' };
    }
};

export const createAdminProduct = async (data: ProductFormData) => {
    try {
        const response = await apiClient.post<any>('/admin/products', data, true);
        return response;
    } catch (error: any) {
        console.error('Error creating product:', error);
        return { success: false, message: error.message || 'Failed to create product' };
    }
};

export const updateAdminProduct = async (id: string, data: Partial<ProductFormData>) => {
    try {
        const response = await apiClient.put<any>(`/admin/products/${id}`, data, true);
        return response;
    } catch (error: any) {
        console.error('Error updating product:', error);
        return { success: false, message: error.message || 'Failed to update product' };
    }
};

export const deleteAdminProduct = async (id: string) => {
    try {
        const response = await apiClient.delete<any>(`/admin/products/${id}`, true);
        return response;
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return { success: false, message: error.message || 'Failed to delete product' };
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
        variant?: string;
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
    discountPrice?: number;
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

        const response = await apiClient.get<any>(`/admin/orders?${params}`, true);
        return response;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, message: 'Failed to fetch orders' };
    }
};

export const updateAdminOrderStatus = async (id: string, status: string, reason?: string) => {
    try {
        const response = await apiClient.put<any>(`/admin/orders/${id}/status`, { status, reason }, true);
        return response;
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, message: 'Failed to update order status' };
    }
};

export const getAdminOrderById = async (id: string) => {
    try {
        const response = await apiClient.get<any>(`/admin/orders/${id}`, true);
        return response;
    } catch (error) {
        console.error('Error fetching order details:', error);
        return { success: false, message: 'Failed to fetch order details' };
    }
};

export const getAdminOrderStats = async () => {
    try {
        const response = await apiClient.get<any>('/admin/orders/stats', true);
        return response;
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

        const response = await apiClient.get<any>(`/admin/courses?${params}`, true);
        return response;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return { success: false, message: 'Failed to fetch courses' };
    }
};

export const createAdminCourse = async (data: CourseFormData) => {
    try {
        const response = await apiClient.post<any>('/admin/courses', data, true);
        return response;
    } catch (error) {
        console.error('Error creating course:', error);
        return { success: false, message: 'Failed to create course' };
    }
};

export const updateAdminCourse = async (id: string, data: Partial<CourseFormData>) => {
    try {
        const response = await apiClient.put<any>(`/admin/courses/${id}`, data, true);
        return response;
    } catch (error) {
        console.error('Error updating course:', error);
        return { success: false, message: 'Failed to update course' };
    }
};

export const deleteAdminCourse = async (id: string) => {
    try {
        const response = await apiClient.delete<any>(`/admin/courses/${id}`, true);
        return response;
    } catch (error) {
        console.error('Error deleting course:', error);
        return { success: false, message: 'Failed to delete course' };
    }
};

export const getAdminCourseStats = async () => {
    try {
        const response = await apiClient.get<any>('/admin/courses/stats', true);
        return response;
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

        const response = await apiClient.get<any>(`/admin/users?${params}`, true);
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, message: 'Failed to fetch users' };
    }
};

export const createAdminUser = async (data: UserFormData) => {
    try {
        const response = await apiClient.post<any>('/admin/users', data, true);
        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Failed to create user' };
    }
};

export const updateAdminUser = async (id: string, data: Partial<UserFormData>) => {
    try {
        const response = await apiClient.put<any>(`/admin/users/${id}`, data, true);
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Failed to update user' };
    }
};

export const deleteAdminUser = async (id: string) => {
    try {
        const response = await apiClient.delete<any>(`/admin/users/${id}`, true);
        return response;
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

        // Use apiClient.upload for file uploads
        const response = await apiClient.upload<{ success: boolean; urls?: string[]; message?: string }>('/upload/images', formData, true);
        return response;
    } catch (error: any) {
        console.error('Error uploading images:', error);
        return { success: false, message: error.message || 'Failed to upload images' };
    }
};

// ============================================
// CATEGORY MANAGEMENT
// ============================================

export interface Category {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    isActive: boolean;
    productCount?: number;
    createdAt: string;
    updatedAt: string;
}

export const getAllCategories = async () => {
    try {
        const response = await apiClient.get<any>('/admin/categories', true);
        return response;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, message: 'Failed to fetch categories' };
    }
};

export const getCategoryById = async (id: string) => {
    try {
        const response = await apiClient.get<any>(`/admin/categories/${id}`, true);
        return response;
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, message: 'Failed to fetch category' };
    }
};

export const createCategory = async (categoryData: Partial<Category>) => {
    try {
        const response = await apiClient.post<any>('/admin/categories', categoryData, true);
        return response;
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, message: 'Failed to create category' };
    }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
        const response = await apiClient.put<any>(`/admin/categories/${id}`, categoryData, true);
        return response;
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, message: 'Failed to update category' };
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await apiClient.delete<any>(`/admin/categories/${id}`, true);
        return response;
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, message: 'Failed to delete category' };
    }
};
