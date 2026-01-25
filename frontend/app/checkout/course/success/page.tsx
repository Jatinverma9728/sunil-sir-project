"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/lib/api/courses";

interface Course {
    _id: string;
    title: string;
    thumbnail?: string;
    lessons?: any[];
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = searchParams.get("course");

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const response = await getCourse(courseId!);
            if (response.success && response.data) {
                setCourse(response.data);
            }
        } catch (err) {
            console.error("Failed to load course:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-50" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    🎉 Enrollment Successful!
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                    Welcome to your new course
                </p>
                {course && (
                    <p className="text-xl font-semibold text-indigo-600 mb-8">
                        {course.title}
                    </p>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="font-semibold text-gray-900 mb-4">What's Next?</h2>
                    <ul className="text-left space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>You now have full access to all course content</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>Track your progress as you complete lessons</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>Get a certificate upon completion</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href={courseId ? `/my-courses/${courseId}` : "/my-courses"}
                        className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Start Learning Now
                    </Link>
                    <Link
                        href="/my-courses"
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        My Courses
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    );
}

export default function CourseCheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
