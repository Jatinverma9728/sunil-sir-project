"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";

interface Course {
    _id: string;
    title: string;
    instructor: { name: string };
    rating: { average: number; count: number };
    enrolledStudents: number;
    price: number;
    level: string;
    lessons: { _id: string }[];
    thumbnail?: string;
}

// Color schemes for cards based on level
const levelColors: Record<string, { color: string; iconColor: string }> = {
    beginner: { color: "bg-gradient-to-br from-violet-50 to-indigo-50", iconColor: "text-indigo-500" },
    intermediate: { color: "bg-gradient-to-br from-amber-50 to-orange-50", iconColor: "text-orange-500" },
    advanced: { color: "bg-gradient-to-br from-emerald-50 to-teal-50", iconColor: "text-emerald-500" },
};

// Get initials from name
const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function CourseShowcase() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

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

    // Don't render section if no courses
    if (!loading && courses.length === 0) {
        return null;
    }

    return (
        <section className="py-20 lg:py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div>
                        <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 bg-indigo-50 px-3 py-1 rounded-full">
                            Online Learning
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                            Expand Your Skills
                        </h2>
                    </div>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-all group"
                    >
                        View all courses
                        <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 animate-pulse">
                                <div className="h-56 bg-gray-100" />
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                                            <div className="h-3 bg-gray-200 rounded w-32" />
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between">
                                        <div className="h-8 bg-gray-200 rounded w-16" />
                                        <div className="h-6 bg-gray-200 rounded w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Course Grid */
                    <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const colors = levelColors[course.level] || levelColors.beginner;
                            const lessonCount = course.lessons?.length || 0;

                            return (
                                <Link
                                    key={course._id}
                                    href={`/courses/${course._id}`}
                                    onMouseEnter={() => setHoveredId(course._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`
                                        group relative bg-white rounded-[2rem] overflow-hidden
                                        border border-gray-100
                                        transition-all duration-300
                                        hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1
                                    `}
                                >
                                    {/* Card Top */}
                                    <div className={`relative h-56 p-8 flex flex-col justify-between ${colors.color}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm ${colors.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 capitalize">
                                                {course.level}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 mb-1 block">{lessonCount} Lessons</span>
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-700 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Instructor */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {getInitials(course.instructor?.name || "IN")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{course.instructor?.name || "Instructor"}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    <span>{course.rating?.average?.toFixed(1) || "0.0"}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{course.enrolledStudents > 1000 ? `${(course.enrolledStudents / 1000).toFixed(1)}k` : course.enrolledStudents} students</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                                            </div>
                                            <span className="text-sm font-medium text-indigo-600 hover:underline">Enroll Now</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
