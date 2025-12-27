"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyCourses } from "@/lib/api/courses";
import { useAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function MyCoursesPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        loadMyCourses();
    }, [isAuthenticated]);

    const loadMyCourses = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getMyCourses();
            setEnrollments(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to load your courses");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        My Courses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Continue learning from where you left off
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {enrollments.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="w-24 h-24 text-gray-400 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                            You haven't enrolled in any courses yet
                        </p>
                        <Link
                            href="/courses"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <Link
                                key={enrollment._id}
                                href={`/courses/${enrollment.course._id}`}
                                className="group"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="relative h-48">
                                        <Image
                                            src={enrollment.course.thumbnail}
                                            alt={enrollment.course.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {enrollment.course.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            {enrollment.course.instructor?.name}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                <span className="font-medium text-blue-600">
                                                    {Math.round(enrollment.completionPercentage || 0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${enrollment.completionPercentage || 0}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
