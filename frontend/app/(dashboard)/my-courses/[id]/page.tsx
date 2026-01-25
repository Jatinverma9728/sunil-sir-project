"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/course/VideoPlayer";
import { getEnrollmentProgress, markLessonComplete as markLessonCompleteAPI } from "@/lib/api/courses";

interface Lesson {
    _id: string;
    title: string;
    description?: string;
    duration: number;
    videoUrl?: string;
    isCompleted: boolean;
    order: number;
    resources?: { title: string; url: string; type: string }[];
}

interface CourseData {
    _id: string;
    title: string;
    instructor: { name: string };
    thumbnail?: string;
    totalLessons: number;
    totalDuration: number;
}

interface ProgressData {
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
    enrolledAt: string;
    completedAt?: string;
}

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<CourseData | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [markingComplete, setMarkingComplete] = useState(false);
    const [notes, setNotes] = useState("");
    const [showNotes, setShowNotes] = useState(false);

    const getToken = (): string | null => {
        if (typeof document === "undefined") return null;

        // Token is stored in cookie as 'auth_token'
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));

        if (!tokenCookie) return null;
        return tokenCookie.split('=')[1];
    };

    useEffect(() => {
        fetchCourseProgress();
    }, [courseId]);

    const fetchCourseProgress = async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                router.push(`/login?redirect=/my-courses/${courseId}`);
                return;
            }

            const data = await getEnrollmentProgress(courseId, token);

            if (data.success && data.data) {
                setCourse(data.data.course);
                setLessons(data.data.lessons);
                setProgress(data.data.progress);

                // Set first incomplete lesson or first lesson
                const firstIncomplete = data.data.lessons.find((l: Lesson) => !l.isCompleted);
                setCurrentLesson(firstIncomplete || data.data.lessons[0]);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async () => {
        if (!currentLesson || markingComplete) return;

        setMarkingComplete(true);
        try {
            const token = getToken();
            if (!token) return;

            const result = await markLessonCompleteAPI(courseId, currentLesson._id, token);

            if (result.success) {
                // Update local state
                setLessons(prev =>
                    prev.map(l =>
                        l._id === currentLesson._id
                            ? { ...l, isCompleted: true }
                            : l
                    )
                );

                setProgress(prev => prev ? {
                    ...prev,
                    completedLessons: prev.completedLessons + 1,
                    completionPercentage: result.data.completionPercentage,
                } : null);

                setCurrentLesson({ ...currentLesson, isCompleted: true });

                // Auto-advance to next incomplete lesson
                const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
                if (currentIndex < lessons.length - 1) {
                    setCurrentLesson(lessons[currentIndex + 1]);
                }
            }
        } catch (error) {
            console.error("Error marking lesson complete:", error);
        } finally {
            setMarkingComplete(false);
        }
    };

    const handlePrevious = () => {
        if (!lessons.length || !currentLesson) return;
        const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
        if (currentIndex > 0) {
            setCurrentLesson(lessons[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (!lessons.length || !currentLesson) return;
        const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
        if (currentIndex < lessons.length - 1) {
            setCurrentLesson(lessons[currentIndex + 1]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-white">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course || !lessons.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Course not found</h1>
                    <p className="text-gray-400 mb-6">You may not be enrolled in this course.</p>
                    <Link href="/my-courses" className="text-indigo-400 hover:underline">
                        Back to my courses
                    </Link>
                </div>
            </div>
        );
    }

    const currentIndex = lessons.findIndex(l => l._id === currentLesson?._id);
    const isFirstLesson = currentIndex === 0;
    const isLastLesson = currentIndex === lessons.length - 1;

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <Link
                        href="/my-courses"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg line-clamp-1">{course.title}</h1>
                        <p className="text-sm text-gray-400">by {course.instructor?.name || "Instructor"}</p>
                    </div>
                </div>

                {/* Progress */}
                {progress && (
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Your progress</p>
                            <p className="font-bold">
                                {progress.completedLessons}/{progress.totalLessons} lessons
                            </p>
                        </div>
                        <div className="w-32">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-400">{Math.round(progress.completionPercentage)}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#C1FF72] transition-all duration-500"
                                    style={{ width: `${progress.completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Video Player */}
                    <div className="bg-black">
                        {currentLesson?.videoUrl ? (
                            <VideoPlayer
                                videoUrl={currentLesson.videoUrl}
                                title={currentLesson.title}
                                onComplete={handleMarkComplete}
                            />
                        ) : (
                            <div className="aspect-video flex items-center justify-center">
                                <div className="text-center text-white">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-lg">{currentLesson?.title || "Select a lesson"}</p>
                                    <p className="text-gray-500 text-sm mt-2">No video available for this lesson</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Controls */}
                    <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={isFirstLesson}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>

                            {currentLesson && !currentLesson.isCompleted && (
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={markingComplete}
                                    className="px-8 py-3 bg-[#C1FF72] text-black rounded-lg font-semibold hover:bg-[#b3f063] transition-colors disabled:opacity-70 flex items-center gap-2"
                                >
                                    {markingComplete ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "✓ Mark as Complete"
                                    )}
                                </button>
                            )}

                            {currentLesson?.isCompleted && (
                                <span className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold">
                                    ✓ Completed
                                </span>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={isLastLesson}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                    {/* Tabs: Overview, Notes */}
                    <div className="bg-gray-800 border-t border-gray-700">
                        <div className="flex gap-1 px-6">
                            <button
                                onClick={() => setShowNotes(false)}
                                className={`px-6 py-3 font-medium transition-colors ${!showNotes
                                    ? "text-white border-b-2 border-[#C1FF72]"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setShowNotes(true)}
                                className={`px-6 py-3 font-medium transition-colors ${showNotes
                                    ? "text-white border-b-2 border-[#C1FF72]"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                Notes
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
                        {!showNotes ? (
                            <div className="max-w-4xl">
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {currentLesson?.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {currentLesson?.description || "No description available for this lesson."}
                                </p>
                                {currentLesson?.duration && (
                                    <p className="text-gray-500 mt-4">
                                        Duration: {currentLesson.duration} minutes
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-4xl">
                                <h3 className="text-2xl font-bold text-white mb-4">My Notes</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Take notes while learning..."
                                    className="w-full h-64 px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C1FF72] focus:border-transparent resize-none"
                                />
                                <button className="mt-4 px-6 py-2 bg-[#C1FF72] text-black rounded-lg font-medium hover:bg-[#b3f063] transition-colors">
                                    Save Notes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Lesson List */}
                <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>

                        <div className="space-y-1">
                            {lessons.map((lesson, index) => (
                                <button
                                    key={lesson._id}
                                    onClick={() => setCurrentLesson(lesson)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${currentLesson?._id === lesson._id
                                        ? "bg-indigo-600/20 border-l-2 border-indigo-500"
                                        : "hover:bg-gray-700"
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.isCompleted
                                        ? "bg-green-500"
                                        : currentLesson?._id === lesson._id
                                            ? "bg-indigo-500"
                                            : "bg-gray-700"
                                        }`}>
                                        {lesson.isCompleted ? (
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs text-white font-medium">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className={`text-sm line-clamp-2 ${lesson.isCompleted
                                            ? "text-gray-400"
                                            : currentLesson?._id === lesson._id
                                                ? "text-white"
                                                : "text-gray-300"
                                            }`}>
                                            {lesson.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {lesson.duration} min
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
