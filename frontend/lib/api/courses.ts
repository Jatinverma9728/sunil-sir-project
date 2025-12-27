
import { API_URL } from '../constants';

export interface Lesson {
    _id: string;
    title: string;
    description?: string;
    duration: number;
    videoUrl?: string;
    isFree: boolean;
    completed?: boolean;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: {
        name: string;
        email: string;
        avatar?: string;
        title?: string;
        bio?: string;
        rating?: number;
        students?: number;
        courses?: number;
    };
    price: number;
    originalPrice?: number;
    totalDuration: number;
    rating: {
        average: number;
        count: number;
    };
    enrolledStudents: number;
    level: string;
    category: string;
    lessons: Lesson[];
    language: string;
    lastUpdated: string;
    isPurchased?: boolean;
    whatYouWillLearn: string[];
    requirements: string[];
    features: string[];
    isPublished?: boolean;
    createdAt?: string;
    updatedAt?: string;
    // Keeping older flexible fields just in case
    syllabus?: Array<{
        title: string;
        lessons: number;
        duration: string;
        lectures: Array<{
            title: string;
            duration: string;
            isPreview?: boolean;
        }>;
    }>;
}

export const getCourses = async (): Promise<{ success: boolean; data: Course[] }> => {
    const response = await fetch(`${API_URL}/courses`);
    return response.json();
};

export const getCourse = async (id: string): Promise<{ success: boolean; data: Course }> => {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const purchaseCourse = async (courseId: string, token?: string) => {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/courses/purchase`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ courseId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to purchase course');
        return data;
    } catch (error) {
        throw error;
    }
};

// Admin functions
export const createCourse = async (courseData: Partial<Course>, token: string) => {
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
    });
    return response.json();
};

export const updateCourse = async (id: string, courseData: Partial<Course>, token: string) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
    });
    return response.json();
};

export const deleteCourse = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};
