import { apiClient, ApiResponse } from './client';
export { apiClient };

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

export interface Address {
    _id?: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    type: 'Home' | 'Work' | 'Other';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isEmailVerified?: boolean;
    addresses?: Address[];
    phone?: string;
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

    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
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

/**
 * Add new address
 */
export const addAddress = async (address: Omit<Address, '_id'>): Promise<{ success: boolean; data: Address[] }> => {
    return apiClient.post<Address[]>('/auth/profile/address', address, true) as Promise<{ success: boolean; data: Address[] }>;
};

/**
 * Update address
 */
export const updateAddress = async (id: string, address: Partial<Address>): Promise<{ success: boolean; data: Address[] }> => {
    return apiClient.put<Address[]>(`/auth/profile/address/${id}`, address, true) as Promise<{ success: boolean; data: Address[] }>;
};

/**
 * Delete address
 */
export const deleteAddress = async (id: string): Promise<{ success: boolean; data: Address[] }> => {
    return apiClient.delete<Address[]>(`/auth/profile/address/${id}`, true) as Promise<{ success: boolean; data: Address[] }>;
};


