import { API_URL } from '../constants';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    count?: number;
    pagination?: {
        page: number;
        limit: number;
        totalPages: number;
        total: number;
    };
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestConfig extends RequestInit {
    requiresAuth?: boolean;
    retries?: number;
}

class ApiClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    /**
     * Get auth token from localStorage
     */
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }

    /**
     * Set auth token in localStorage
     */
    setAuthToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('token', token);
    }

    /**
     * Remove auth token from localStorage
     */
    removeAuthToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('token');
    }

    /**
     * Build headers for request
     */
    private buildHeaders(requiresAuth: boolean = false): HeadersInit {
        const headers: Record<string, string> = { ...this.defaultHeaders as Record<string, string> };

        if (requiresAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Handle API errors
     */
    private async handleError(response: Response): Promise<never> {
        let errorMessage = 'An error occurred';
        let errorData: any = null;

        try {
            errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }

        // Handle specific status codes
        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login
            this.removeAuthToken();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
            throw new ApiError('Authentication required', 401, errorData);
        }

        if (response.status === 403) {
            throw new ApiError('Access forbidden', 403, errorData);
        }

        if (response.status === 404) {
            throw new ApiError('Resource not found', 404, errorData);
        }

        if (response.status === 422) {
            throw new ApiError(errorMessage, 422, errorData);
        }

        if (response.status >= 500) {
            throw new ApiError('Server error. Please try again later.', response.status, errorData);
        }

        throw new ApiError(errorMessage, response.status, errorData);
    }

    /**
     * Make HTTP request with retry logic
     */
    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const {
            requiresAuth = false,
            retries = 1,
            ...fetchConfig
        } = config;

        const url = `${this.baseUrl}${endpoint}`;
        const headers = this.buildHeaders(requiresAuth);

        let lastError: Error | null = null;

        // Retry logic
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...fetchConfig,
                    headers: {
                        ...headers,
                        ...fetchConfig.headers,
                    },
                });

                if (!response.ok) {
                    await this.handleError(response);
                }

                const data = await response.json();
                return data as ApiResponse<T>;
            } catch (error) {
                lastError = error as Error;

                // Don't retry on auth errors or client errors (4xx)
                if (error instanceof ApiError && error.status && error.status < 500) {
                    throw error;
                }

                // Don't retry on last attempt
                if (attempt === retries) {
                    break;
                }

                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }

        throw lastError || new Error('Request failed');
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
            requiresAuth,
            retries: 2,
        });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: any,
        requiresAuth: boolean = false
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            requiresAuth,
            retries: 1,
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: any,
        requiresAuth: boolean = false
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            requiresAuth,
            retries: 1,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        body?: any,
        requiresAuth: boolean = false
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
            requiresAuth,
            retries: 1,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            requiresAuth,
            retries: 1,
        });
    }

    /**
     * Upload file(s)
     */
    async upload<T>(
        endpoint: string,
        formData: FormData,
        requiresAuth: boolean = true
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers: HeadersInit = {};

        if (requiresAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                await this.handleError(response);
            }

            const data = await response.json();
            return data as ApiResponse<T>;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Upload failed', 0, error);
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_URL);

// Export for testing or custom instances
export default ApiClient;
