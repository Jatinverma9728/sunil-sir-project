import { API_URL } from '../constants';
import { getAuthToken } from './auth';

// Types
export interface Lesson {
    _id: string;
    title: string;
    description: string;
    videoUrl?: string;
    duration: number;
    order: number;
    resources?: Array<{ title: string; url: string; type: string }>;
    isFree: boolean;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    instructor: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    category: string;
    level: string;
    thumbnail: string;
    images?: Array<{ url: string; alt: string }>;
    lessons: Lesson[];
    requirements?: string[];
    whatYouWillLearn?: string[];
    rating: {
        average: number;
        count: number;
    };
    enrolledStudents: number;
    isPublished: boolean;
    tags?: string[];
    language?: string;
    totalDuration?: number;
    lessonCount?: number;
    createdAt: string;
}

export interface CoursesResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Course[];
}

export interface CourseFilters {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: 'price-asc' | 'price-desc' | 'rating' | 'popular' | 'newest';
}

/**
 * Get all courses with filters
 */
export const getCourses = async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const queryParams = new URLSearchParams();

    if (filters) {
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.level) queryParams.append('level', filters.level);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.sort) queryParams.append('sort', filters.sort);
    }

    const url = `${API_URL}/courses?${queryParams.toString()}`;
    const response = await fetch(url);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch courses');
    }

    return result;
};

/**
 * Get single course by ID
 */
export const getCourse = async (id: string): Promise<{ success: boolean; data: Course }> => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/courses/${id}`, { headers });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch course');
    }

    return result;
};

/**
 * Purchase/Enroll in course
 */
export const purchaseCourse = async (id: string): Promise<{ success: boolean; message: string }> => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('You must be logged in to purchase courses');
    }

    const response = await fetch(`${API_URL}/courses/${id}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to enroll in course');
    }

    return result;
};

/**
 * Get user's enrolled courses
 */
export const getMyCourses = async (): Promise<{ success: boolean; count: number; data: any[] }> => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('You must be logged in');
    }

    const response = await fetch(`${API_URL}/courses/my-courses`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch your courses');
    }

    return result;
};

/**
 * Get course categories
 */
export const getCourseCategories = async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await fetch(`${API_URL}/courses/categories`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch categories');
    }

    return result;
};
