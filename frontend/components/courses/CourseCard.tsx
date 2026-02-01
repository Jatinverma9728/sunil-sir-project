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

    return (
        <Link
            href={`/courses/${course._id}`}
            className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
        >
            {/* Course Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                        {course.isBestseller && (
                            <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wide rounded">
                                Bestseller
                            </span>
                        )}
                        {course.isPurchased && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide rounded">
                                Enrolled
                            </span>
                        )}
                    </div>
                    {discount > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <div className="flex items-center gap-2 text-white text-xs">
                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded capitalize">
                            {course.level}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.lessons} lessons
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                    {course.category}
                </p>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-sm text-gray-500 mb-3">
                    {course.instructor}
                </p>

                {/* Rating & Students */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900">{course.rating.toFixed(1)}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= Math.floor(course.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                        {course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k` : course.students} students
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                        </span>
                        {course.originalPrice && course.originalPrice > course.price && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{course.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {course.isPurchased ? (
                        <span className="text-sm font-medium text-emerald-600">
                            Continue →
                        </span>
                    ) : (
                        <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            View →
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
