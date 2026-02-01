"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";

interface Course {
    _id: string;
    title: string;
    description?: string;
    instructor: { name: string };
    rating: { average: number; count: number };
    enrolledStudents: number;
    price: number;
    originalPrice?: number;
    level: string;
    lessons: { _id: string }[];
    thumbnail?: string;
    duration?: number;
}

export default function CourseShowcase() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_URL}/courses?limit=3`);
                const data = await response.json();
                if (data.success && data.data) {
                    setCourses(data.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (!loading && courses.length === 0) {
        return null;
    }

    return (
        <section className="py-20 lg:py-24 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3">
                        Learn From The Best
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Featured Courses
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Accelerate your career with industry-leading courses taught by experts
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                <div className="aspect-video bg-gray-200" />
                                <div className="p-6 space-y-4">
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const lessonCount = course.lessons?.length || 0;
                            const discount = course.originalPrice
                                ? Math.round((1 - course.price / course.originalPrice) * 100)
                                : 0;

                            return (
                                <Link
                                    key={course._id}
                                    href={`/courses/${course._id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Overlay Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-md capitalize shadow-sm">
                                                {course.level}
                                            </span>
                                            {discount > 0 && (
                                                <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md shadow-sm">
                                                    {discount}% OFF
                                                </span>
                                            )}
                                        </div>

                                        {/* Duration Badge */}
                                        <div className="absolute bottom-3 right-3">
                                            <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-md flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {lessonCount} lessons
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Title */}
                                        <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>

                                        {/* Instructor */}
                                        <p className="text-sm text-gray-500 mb-4">
                                            by <span className="text-gray-700 font-medium">{course.instructor?.name || "Instructor"}</span>
                                        </p>

                                        {/* Rating & Students */}
                                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {course.rating?.average?.toFixed(1) || "0.0"}
                                                </span>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= Math.floor(course.rating?.average || 0)
                                                                ? 'text-amber-400'
                                                                : 'text-gray-200'
                                                                }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    ({course.rating?.count || 0})
                                                </span>
                                            </div>
                                            <div className="h-4 w-px bg-gray-200" />
                                            <span className="text-sm text-gray-500">
                                                {course.enrolledStudents > 1000
                                                    ? `${(course.enrolledStudents / 1000).toFixed(1)}k`
                                                    : course.enrolledStudents
                                                } students
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ₹{course.price.toLocaleString()}
                                                </span>
                                                {course.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{course.originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-blue-600 group-hover:underline">
                                                View Course →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-colors"
                    >
                        Browse All Courses
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
