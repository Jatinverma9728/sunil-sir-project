"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/course/VideoPlayer";
import { API_URL } from "@/lib/constants";

// Get token from localStorage
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

interface Lesson {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    order: number;
    isFree: boolean;
    resources?: { title: string; url: string; type: string }[];
}

interface Course {
    _id: string;
    title: string;
    lessons: Lesson[];
    instructor: { name: string };
}

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const lessonId = params.lessonId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    useEffect(() => {
        fetchCourse();
    }, [courseId, lessonId]);

    const fetchCourse = async () => {
        try {
            const token = getToken();
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/courses/${courseId}`, { headers });
            const data = await response.json();

            if (data.success && data.data) {
                setCourse(data.data);
                const lesson = data.data.lessons.find((l: Lesson) => l._id === lessonId);
                setCurrentLesson(lesson || data.data.lessons[0]);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonComplete = async () => {
        if (!currentLesson) return;

        // Mark lesson as complete locally
        setCompletedLessons(prev => [...prev, currentLesson._id]);

        // TODO: Call API to mark lesson complete
        // await fetch(`${API_URL}/courses/${courseId}/lessons/${currentLesson._id}/complete`, {
        //     method: 'POST',
        //     headers: { 'Authorization': `Bearer ${getToken()}` }
        // });

        // Auto-advance to next lesson
        if (course) {
            const currentIndex = course.lessons.findIndex(l => l._id === currentLesson._id);
            if (currentIndex < course.lessons.length - 1) {
                const nextLesson = course.lessons[currentIndex + 1];
                router.push(`/courses/${courseId}/lessons/${nextLesson._id}`);
            }
        }
    };

    const goToLesson = (lesson: Lesson) => {
        setCurrentLesson(lesson);
        router.push(`/courses/${courseId}/lessons/${lesson._id}`);
    };

    const currentIndex = course?.lessons.findIndex(l => l._id === currentLesson?._id) ?? 0;
    const progress = course ? ((completedLessons.length / course.lessons.length) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!course || !currentLesson) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
                    <Link href={`/courses/${courseId}`} className="text-indigo-400 hover:underline">
                        Back to course
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-80' : ''}`}>
                {/* Top Bar */}
                <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/courses/${courseId}`}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <p className="text-xs text-gray-400">{course.title}</p>
                            <h1 className="text-white font-medium">{currentLesson.title}</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white transition-colors lg:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Video Player */}
                <div className="p-4 lg:p-6">
                    {currentLesson.videoUrl ? (
                        <VideoPlayer
                            videoUrl={currentLesson.videoUrl}
                            title={currentLesson.title}
                            onComplete={handleLessonComplete}
                        />
                    ) : (
                        <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p>This lesson requires enrollment</p>
                            </div>
                        </div>
                    )}

                    {/* Lesson Info */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">{currentLesson.title}</h2>
                            <button
                                onClick={handleLessonComplete}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${completedLessons.includes(currentLesson._id)
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                {completedLessons.includes(currentLesson._id) ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        Completed
                                    </span>
                                ) : (
                                    'Mark as Complete'
                                )}
                            </button>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{currentLesson.description}</p>

                        {/* Resources */}
                        {currentLesson.resources && currentLesson.resources.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                                <div className="grid gap-3">
                                    {currentLesson.resources.map((resource, index) => (
                                        <a
                                            key={index}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                                {resource.type === 'pdf' ? (
                                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                                        <path d="M15 3h6v6M10 14L21 3" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-white">{resource.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                            <button
                                onClick={() => currentIndex > 0 && goToLesson(course.lessons[currentIndex - 1])}
                                disabled={currentIndex === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentIndex === 0
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous Lesson
                            </button>
                            <button
                                onClick={() => currentIndex < course.lessons.length - 1 && goToLesson(course.lessons[currentIndex + 1])}
                                disabled={currentIndex === course.lessons.length - 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentIndex === course.lessons.length - 1
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                Next Lesson
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Lesson List */}
            <div
                className={`fixed right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Course Content</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-white lg:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>{completedLessons.length} of {course.lessons.length} completed</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Lesson List */}
                <div className="overflow-y-auto h-[calc(100vh-120px)]">
                    {course.lessons.map((lesson, index) => {
                        const isCompleted = completedLessons.includes(lesson._id);
                        const isCurrent = lesson._id === currentLesson._id;

                        return (
                            <button
                                key={lesson._id}
                                onClick={() => goToLesson(lesson)}
                                className={`w-full p-4 text-left border-b border-gray-700/50 transition-colors ${isCurrent
                                    ? 'bg-indigo-600/20 border-l-2 border-l-indigo-500'
                                    : 'hover:bg-gray-750'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                        ? 'bg-green-500'
                                        : isCurrent
                                            ? 'bg-indigo-500'
                                            : 'bg-gray-700'
                                        }`}>
                                        {isCompleted ? (
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs text-white font-medium">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-medium truncate ${isCurrent ? 'text-white' : 'text-gray-300'
                                            }`}>
                                            {lesson.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {lesson.duration} min
                                            {lesson.isFree && <span className="ml-2 text-green-400">Free</span>}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
