"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    progress: number;
    lessons: number;
    completedLessons: number;
    image?: string;
    category: string;
    duration: number;
}

export default function MyCoursesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        fetchMyCourses();
    }, [isAuthenticated]);

    const fetchMyCourses = async () => {
        setLoading(true);
        try {
            // Try localStorage first, then cookies
            let token = localStorage.getItem('token');
            if (!token) {
                const cookies = document.cookie.split(';');
                const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
                token = tokenCookie ? tokenCookie.split('=')[1] : null;
            }

            if (!token) {
                setCourses([]);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/my-courses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                // API returns array of enrollments with course and completionPercentage
                const enrollments = data.data || [];
                const transformedCourses = enrollments.map((enrollment: any) => ({
                    _id: enrollment.course?._id || enrollment._id,
                    title: enrollment.course?.title || 'Untitled Course',
                    description: enrollment.course?.description || '',
                    instructor: enrollment.course?.instructor?.name || 'Instructor',
                    progress: Math.round(enrollment.completionPercentage || 0),
                    lessons: enrollment.course?.lessons?.length || 0,
                    completedLessons: enrollment.progress?.filter((p: any) => p.completed)?.length || 0,
                    image: enrollment.course?.thumbnail,
                    category: enrollment.course?.category || 'Other',
                    duration: enrollment.course?.totalDuration || 0,
                }));
                setCourses(transformedCourses);
            } else {
                setCourses([]);
            }
        } catch {
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter((course) => {
        if (filter === "completed") return course.progress === 100;
        if (filter === "in-progress") return course.progress > 0 && course.progress < 100;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="h-8 w-48 bg-white rounded-lg animate-pulse mb-8"></div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-40 bg-gray-100"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                                    <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-2 bg-gray-100 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">Learning</p>
                        <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">My Courses</h1>
                        <p className="text-gray-500 mt-2">Continue learning from where you left off</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Profile
                        </Link>
                        <Link
                            href="/courses"
                            className="px-6 py-3 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 transition-all"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8">
                    {[
                        { id: "all", label: "All Courses" },
                        { id: "in-progress", label: "In Progress" },
                        { id: "completed", label: "Completed" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as typeof filter)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${filter === tab.id
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Link
                                key={course._id}
                                href={`/my-courses/${course._id}`}
                                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Course Image */}
                                <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                    {course.image ? (
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    )}
                                    {course.progress === 100 && (
                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completed
                                        </div>
                                    )}
                                </div>

                                {/* Course Info */}
                                <div className="p-6">
                                    <span className="text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">
                                        {course.category}
                                    </span>
                                    <h3 className="font-medium text-gray-900 mt-2 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-5">{course.instructor}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-medium text-gray-900">{course.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${course.progress === 100 ? "bg-green-500" : "bg-gray-900"
                                                    }`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <span>{course.completedLessons}/{course.lessons} lessons</span>
                                        <span>{course.duration}h total</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">No courses found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            {filter === "completed"
                                ? "You haven't completed any courses yet."
                                : filter === "in-progress"
                                    ? "You don't have any courses in progress."
                                    : "You haven't enrolled in any courses yet."}
                        </p>
                        <Link
                            href="/courses"
                            className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 transition-all"
                        >
                            Explore Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
