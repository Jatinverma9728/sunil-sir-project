import { API_URL } from '../constants';

interface Review {
    _id: string;
    product: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    helpfulVotes: Array<{ user: string }>;
    images?: Array<{ url: string; alt?: string }>;
    createdAt: string;
    timeAgo?: string;
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    rating5: number;
    rating4: number;
    rating3: number;
    rating2: number;
    rating1: number;
}

interface ReviewsResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    stats: ReviewStats;
    data: Review[];
}

interface SingleReviewResponse {
    success: boolean;
    data: Review;
    message?: string;
}

interface CanReviewResponse {
    success: boolean;
    canReview: boolean;
    isVerifiedPurchase?: boolean;
    reason?: string;
    existingReview?: Review;
}

interface HelpfulResponse {
    success: boolean;
    message: string;
    helpfulCount: number;
    hasVoted: boolean;
}

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

/**
 * Get reviews for a product
 */
export const getProductReviews = async (
    productId: string,
    params?: {
        page?: number;
        limit?: number;
        sort?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
        ratingFilter?: number | null;
    }
): Promise<ReviewsResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.ratingFilter) queryParams.append('rating', params.ratingFilter.toString());

        const url = `${API_URL}/reviews/product/${productId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

/**
 * Create a new review
 */
export const createReview = async (data: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    images?: Array<{ url: string; alt?: string }>;
}): Promise<SingleReviewResponse> => {
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to create review');
        }

        return result;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

/**
 * Update an existing review
 */
export const updateReview = async (
    reviewId: string,
    data: {
        rating?: number;
        title?: string;
        comment?: string;
        images?: Array<{ url: string; alt?: string }>;
    }
): Promise<SingleReviewResponse> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update review');
        }

        return result;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete review');
        }

        return result;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

/**
 * Mark a review as helpful (toggle)
 */
export const toggleHelpful = async (reviewId: string): Promise<HelpfulResponse> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update helpful status');
        }

        return result;
    } catch (error) {
        console.error('Error toggling helpful:', error);
        throw error;
    }
};

/**
 * Check if user can review a product
 */
export const canReviewProduct = async (productId: string): Promise<CanReviewResponse> => {
    try {
        const response = await fetch(`${API_URL}/reviews/can-review/${productId}`, {
            headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to check review eligibility');
        }

        return result;
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        throw error;
    }
};

/**
 * Get user's own reviews
 */
export const getMyReviews = async (params?: {
    page?: number;
    limit?: number;
}): Promise<ReviewsResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const url = `${API_URL}/reviews/my-reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch reviews');
        }

        return result;
    } catch (error) {
        console.error('Error fetching my reviews:', error);
        throw error;
    }
};

export type { Review, ReviewStats, ReviewsResponse, SingleReviewResponse, CanReviewResponse, HelpfulResponse };
