"use client";

import Link from "next/link";
import { useState } from "react";

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    originalPrice?: number;
    duration: number; // in hours
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
    const [isWishlisted, setIsWishlisted] = useState(false);

    const discount = course.originalPrice
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0;

    return (
        <Link
            href={`/courses/${course._id}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all"
        >
            {/* Course Image */}
            <div className="relative bg-gradient-to-br from-blue-400 to-indigo-500 h-48 overflow-hidden">
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl opacity-20">📚</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        {course.isBestseller && (
                            <span className="px-3 py-1 bg-[#C1FF72] text-black text-xs font-bold rounded-full shadow-lg">
                                BESTSELLER
                            </span>
                        )}
                        {course.isPurchased && (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                ✓ PURCHASED
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                        {isWishlisted ? "❤️" : "🤍"}
                    </button>
                </div>

                {/* Course Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full">
                        {course.level}
                    </span>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full">
                        {course.lessons} Lessons
                    </span>
                </div>
            </div>

            {/* Course Details */}
            <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">👨‍💼</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {course.instructor}
                        </p>
                        <p className="text-xs text-gray-500">Expert Instructor</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400 text-sm">
                            {"★".repeat(Math.floor(course.rating))}
                            {"☆".repeat(5 - Math.floor(course.rating))}
                        </div>
                        <span className="text-sm text-gray-600">{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span>👥</span>
                        <span>{(course.students / 1000).toFixed(1)}k</span>
                    </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{course.duration}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>📊</span>
                        <span className="capitalize">{course.level}</span>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                ₹{course.price}
                            </span>
                            {course.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{course.originalPrice}
                                </span>
                            )}
                        </div>
                        {discount > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    {course.isPurchased ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/my-courses/${course._id}`;
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onEnroll?.(course._id);
                            }}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                        >
                            Enroll
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
