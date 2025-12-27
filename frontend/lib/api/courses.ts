
import { API_URL } from '../constants';

export interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: {
        name: string;
        title: string;
        bio: string;
        rating: number;
        students: number;
        courses: number;
    };
    price: number;
    originalPrice?: number;
    duration: number;
    rating: number;
    reviews: number;
    students: number;
    level: string;
    category: string;
    lessons: number;
    language: string;
    lastUpdated: string;
    isPurchased?: boolean;
    whatYouLearn: string[];
    requirements: string[];
    syllabus: Array<{
        title: string;
        lessons: number;
        duration: string;
        lectures: Array<{
            title: string;
            duration: string;
            isPreview?: boolean;
        }>;
    }>;
    features: string[];
    enrolledStudents?: number;
    isPublished?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const getCourses = async (): Promise<{ success: boolean; data: Course[] }> => {
    const response = await fetch(`${API_URL}/courses`);
    return response.json();
};

export const getCourse = async (id: string): Promise<Course | null> => {
    try {
        const response = await fetch(`${API_URL}/courses/${id}`);
        if (!response.ok) return null;
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching course:', error);
        return null;
    }
};

export const purchaseCourse = async (courseId: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/courses/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courseId })
        });
        const data = await response.json();
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
