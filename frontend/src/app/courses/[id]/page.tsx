"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourse, purchaseCourse } from "@/lib/api/courses";
import { Course } from "@/lib/api/courses";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";
import Button from "@/components/ui/Button";
import LessonPlayer from "@/components/course/LessonPlayer";
import Image from "next/image";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [enrolling, setEnrolling] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(0);

    useEffect(() => {
        if (params.id) {
            loadCourse(params.id as string);
        }
    }, [params.id]);

    const loadCourse = async (id: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await getCourse(id);
            setCourse(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!course) return;

        setEnrolling(true);
        setError("");

        try {
            await purchaseCourse(course._id);
            // Reload course to get updated lesson access
            await loadCourse(course._id);
        } catch (err: any) {
            setError(err.message || "Failed to enroll in course");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
                </div>
            </div>
        );
    }

    if (!course) return null;

    const isEnrolled = course.lessons.some(lesson => lesson.videoUrl !== null && !lesson.isFree);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" onClick={() => router.push("/courses")} className="mb-6">
                    ← Back to Courses
                </Button>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="mb-6">
                            <LessonPlayer lesson={course.lessons[selectedLesson]} />
                        </div>

                        {/* Course Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {course.title}
                            </h1>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(course.rating.average)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2. 98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                                        {course.rating.average.toFixed(1)} ({course.rating.count} reviews)
                                    </span>
                                </div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {course.enrolledStudents} students
                                </span>
                            </div>

                            <div className="prose dark:prose-invert max-w-none mb-6">
                                <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
                            </div>

                            {/* What You'll Learn */}
                            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h2 className="font-semibold text-xl mb-4">What You'll Learn</h2>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {course.whatYouWillLearn.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <svg
                                                    className="w-5 h-5 text-green-500 shrink-0 mt-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Requirements */}
                            {course.requirements && course.requirements.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                    <h2 className="font-semibold text-xl mb-4">Requirements</h2>
                                    <ul className="space-y-2">
                                        {course.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                <span>•</span>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Instructor */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                <h2 className="font-semibold text-xl mb-4">Instructor</h2>
                                <div className="flex items-center gap-4">
                                    {course.instructor.avatar && (
                                        <Image
                                            src={course.instructor.avatar}
                                            alt={course.instructor.name}
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-medium text-lg">{course.instructor.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{course.instructor.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                            {/* Thumbnail */}
                            <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Price & Enroll */}
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-blue-600 mb-4">
                                    {formatCurrency(course.price)}
                                </div>

                                {!isEnrolled && (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                    >
                                        {enrolling ? "Enrolling..." : "Enroll Now"}
                                    </Button>
                                )}

                                {isEnrolled && (
                                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-center font-medium">
                                        ✓ Enrolled
                                    </div>
                                )}
                            </div>

                            {/* Course Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Level:</span>
                                    <span className="font-medium">
                                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                    <span className="font-medium">{course.category}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Lessons:</span>
                                    <span className="font-medium">{course.lessons.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                    <span className="font-medium">{course.totalDuration || 0} min</span>
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="font-semibold text-lg mb-4">Course Content</h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {course.lessons.map((lesson, index) => (
                                        <button
                                            key={lesson._id}
                                            onClick={() => setSelectedLesson(index)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedLesson === index
                                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium">Lesson {index + 1}</span>
                                                        {lesson.isFree && (
                                                            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                                                Free
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium truncate">{lesson.title}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {lesson.duration} min
                                                    </div>
                                                </div>
                                                {!lesson.videoUrl && !lesson.isFree && (
                                                    <svg
                                                        className="w-5 h-5 text-gray-400 shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
