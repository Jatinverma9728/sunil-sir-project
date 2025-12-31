import { apiClient, ApiResponse } from './client';

// Types
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const result = await apiClient.post<{ user: User; token: string }>('/auth/register', data);

    // Store token in cookie
    if (result.data?.token) {
        setAuthToken(result.data.token);
        apiClient.setAuthToken(result.data.token);
    }

    return result as AuthResponse;
};

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const result = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);

    // Store token in cookie with remember me preference
    if (result.data?.token) {
        setAuthToken(result.data.token, credentials.rememberMe || false);
        apiClient.setAuthToken(result.data.token);
    }

    return result as AuthResponse;
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<{ success: boolean; data: { user: User } }> => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    const result = await apiClient.get<{ user: User }>('/auth/profile', true);
    return result as { success: boolean; data: { user: User } };
};

/**
 * Logout user
 */
export const logout = (): void => {
    removeAuthToken();
    apiClient.removeAuthToken();
};

/**
 * Store auth token in cookie
 */
export const setAuthToken = (token: string, rememberMe: boolean = false): void => {
    // Set cookie with dynamic expiry: 30 days if remember me, otherwise 7 days
    const expires = new Date();
    const days = rememberMe ? 30 : 7;
    expires.setDate(expires.getDate() + days);

    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

/**
 * Get auth token from cookie
 */
export const getAuthToken = (): string | null => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('auth_token='));

    if (!tokenCookie) return null;

    return tokenCookie.split('=')[1];
};

/**
 * Remove auth token from cookie
 */
export const removeAuthToken = (): void => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};
