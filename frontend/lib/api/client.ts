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

export class ApiClient {
    private baseURL: string;
    private defaultHeaders: HeadersInit;
    private csrfToken: string | null = null;
    private csrfReady: Promise<void>;

    constructor(baseURL: string = API_URL) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
        // Initialize CSRF and store the promise
        this.csrfReady = this.initCsrf();
    }

    private async initCsrf(): Promise<void> {
        if (typeof window !== 'undefined') {
            try {
                await this.fetchCsrfToken();
            } catch (error) {
                console.warn('Failed to initialize CSRF token:', error);
            }
        }
    }

    public async fetchCsrfToken() {
        const startTime = Date.now();
        try {
            // Add 5 second timeout to prevent blocking
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${this.baseURL}/csrf-token`, {
                credentials: 'include',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                this.csrfToken = data.csrfToken;
                console.log(`⏱️ CSRF token fetched in ${Date.now() - startTime}ms`);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.warn(`⏱️ CSRF token fetch timed out after ${Date.now() - startTime}ms`);
            } else {
                console.error('Error fetching CSRF token:', error);
            }
        }
    }

    /**
     * Get auth token from cookie (matches auth.ts storage)
     */
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        // Read from cookie (matching auth.ts)
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('auth_token='));

        if (!tokenCookie) return null;

        return tokenCookie.split('=')[1];
    }

    /**
     * Set auth token in cookie (matches auth.ts storage)
     */
    setAuthToken(token: string): void {
        if (typeof window === 'undefined') return;

        // Store in cookie with 30 day expiry (matching auth.ts)
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);

        document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }

    /**
     * Remove auth token from cookie
     */
    removeAuthToken(): void {
        if (typeof window === 'undefined') return;

        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    /**
     * Build headers for request
     */
    private buildHeaders(requiresAuth: boolean = false, method: string = 'GET', isMultipart: boolean = false): HeadersInit {
        const headers: Record<string, string> = { ...this.defaultHeaders as Record<string, string> };

        // Add CSRF token if available and not a safe method (GET, HEAD, OPTIONS)
        if (this.csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
            headers['X-CSRF-Token'] = this.csrfToken;
        }

        if (isMultipart) {
            delete headers['Content-Type']; // Content-Type will be set automatically by FormData
        }

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
            throw new ApiError(errorMessage || 'Access forbidden', 403, errorData);
        }

        // Handle session locked (Admin inactivity)
        if (response.status === 423) {
            // Dispatch event for AdminAuthContext to detect
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('admin-session-locked'));
            }
            throw new ApiError(errorMessage || 'Session locked due to inactivity', 423, errorData);
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
        config: RequestConfig = {},
        isRetryAfterCsrf: boolean = false
    ): Promise<ApiResponse<T>> {
        const {
            requiresAuth = false,
            retries = 1,
            ...fetchConfig
        } = config;

        const url = `${this.baseURL}${endpoint}`;

        // Ensure CSRF token is fetched before making request (especially for mutations)
        if (typeof window !== 'undefined') {
            await this.csrfReady;
        }

        const headers = this.buildHeaders(requiresAuth, fetchConfig.method || 'GET');

        let lastError: Error | null = null;

        // Retry logic
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...fetchConfig,
                    credentials: 'include', // Ensure cookies are sent (vital for CSRF)
                    headers: {
                        ...headers,
                        ...fetchConfig.headers,
                    },
                });

                if (!response.ok) {
                    // Check if it's a CSRF error and we haven't retried yet
                    if (response.status === 403 && !isRetryAfterCsrf) {
                        try {
                            const errorData = await response.clone().json();
                            if (errorData.message && errorData.message.toLowerCase().includes('csrf')) {
                                // Refetch CSRF token and retry once
                                console.log('CSRF token invalid, refreshing and retrying...');
                                await this.fetchCsrfToken();
                                return this.request<T>(endpoint, config, true);
                            }
                        } catch {
                            // If we can't parse JSON, continue with normal error handling
                        }
                    }
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
        const url = `${this.baseURL}${endpoint}`;

        // Ensure CSRF token is fetched before making request (especially for mutations)
        if (typeof window !== 'undefined') {
            await this.csrfReady;
        }

        // Use buildHeaders with isMultipart=true to handle logic correctly
        const headers = this.buildHeaders(requiresAuth, 'POST', true) as HeadersInit;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
                credentials: 'include',
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
