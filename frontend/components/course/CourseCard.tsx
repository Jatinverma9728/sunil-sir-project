"use client";

import Link from "next/link";

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    originalPrice?: number;
    duration: number;
    rating: number;
    students: number;
    level: string;
    category: string;
    lessons: number;
    image?: string;
    isPurchased?: boolean;
    isBestseller?: boolean;
}

interface CourseCardProps {
    course: Course;
    onEnroll?: (courseId: string) => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
    const discount = course.originalPrice
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0;

    const handleClick = () => {
        if (onEnroll) {
            onEnroll(course._id);
        }
    };

    return (
        <Link
            href={`/courses/${course._id}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {course.isBestseller && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                            Bestseller
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* Level badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full capitalize">
                        {course.level}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Category */}
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                    {course.category}
                </span>

                {/* Title */}
                <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                </h3>

                {/* Instructor */}
                <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>

                {/* Stats */}
                <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-gray-900">{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span>{course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k` : course.students}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{course.lessons} lessons</span>
                    </div>
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">
                            {course.price === 0 ? "Free" : `₹${course.price}`}
                        </span>
                        {course.originalPrice && course.originalPrice > course.price && (
                            <span className="text-sm text-gray-400 line-through">₹{course.originalPrice}</span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-indigo-600 group-hover:underline">
                        {course.isPurchased ? "Continue" : "View Course"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
