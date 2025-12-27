import { API_URL } from '../constants';
import { getAuthToken } from './auth';

// Admin API service - requires admin role

const getAdminHeaders = (): HeadersInit => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

// ============================================
// STATISTICS
// ============================================

export const getCourseStats = async () => {
    const response = await fetch(`${API_URL}/admin/courses/stats`, {
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch course stats');
    return result;
};

export const getOrderStats = async () => {
    const response = await fetch(`${API_URL}/admin/orders/stats`, {
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch order stats');
    return result;
};

// ============================================
// PRODUCT MANAGEMENT
// ============================================

export const getAllProducts = async (params?: any) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/admin/products?${queryParams}`, {
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch products');
    return result;
};

export const createProduct = async (data: any) => {
    const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create product');
    return result;
};

export const updateProduct = async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update product');
    return result;
};

export const deleteProduct = async (id: string) => {
    const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete product');
    return result;
};

// ============================================
// ORDER MANAGEMENT
// ============================================

export const getAllOrders = async (params?: any) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/admin/orders?${queryParams}`, {
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch orders');
    return result;
};

export const updateOrderStatus = async (id: string, status: string, reason?: string) => {
    const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, reason }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update order status');
    return result;
};

// ============================================
// COURSE MANAGEMENT
// ============================================

export const getAllCourses = async (params?: any) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/admin/courses?${queryParams}`, {
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch courses');
    return result;
};

export const createCourse = async (data: any) => {
    const response = await fetch(`${API_URL}/admin/courses`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create course');
    return result;
};

export const updateCourse = async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/admin/courses/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update course');
    return result;
};

export const deleteCourse = async (id: string) => {
    const response = await fetch(`${API_URL}/admin/courses/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete course');
    return result;
};
