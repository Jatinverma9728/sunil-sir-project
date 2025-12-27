"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Lesson {
    _id: string;
    title: string;
    duration: string;
    videoUrl?: string;
    isCompleted: boolean;
}

interface Section {
    _id: string;
    title: string;
    lessons: Lesson[];
}

interface Course {
    _id: string;
    title: string;
    instructor: string;
    progress: number;
    sections: Section[];
    totalLessons: number;
    completedLessons: number;
}

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState("");
    const [showNotes, setShowNotes] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            // In production, fetch from API
            const mockCourse = getMockCourse();
            setCourse(mockCourse);

            // Set first incomplete lesson or first lesson
            const firstIncomplete = mockCourse.sections
                .flatMap(s => s.lessons)
                .find(l => !l.isCompleted);
            setCurrentLesson(firstIncomplete || mockCourse.sections[0]?.lessons[0]);

            // Expand all sections initially
            setExpandedSections(mockCourse.sections.map(s => s._id));
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    const getMockCourse = (): Course => {
        return {
            _id: courseId,
            title: "Complete Web Development Bootcamp 2025",
            instructor: "John Doe",
            progress: 35,
            totalLessons: 45,
            completedLessons: 16,
            sections: [
                {
                    _id: "section-1",
                    title: "Introduction to Web Development",
                    lessons: [
                        { _id: "1", title: "Welcome to the Course", duration: "5:30", isCompleted: true },
                        { _id: "2", title: "Course Overview and Roadmap", duration: "8:45", isCompleted: true },
                        { _id: "3", title: "Setting Up Development Environment", duration: "12:20", isCompleted: true },
                        { _id: "4", title: "Your First Webpage", duration: "10:15", isCompleted: false },
                    ],
                },
                {
                    _id: "section-2",
                    title: "HTML5 Fundamentals",
                    lessons: [
                        { _id: "5", title: "HTML Document Structure", duration: "8:30", isCompleted: false },
                        { _id: "6", title: "Text Elements and Formatting", duration: "12:15", isCompleted: false },
                        { _id: "7", title: "Links and Navigation", duration: "9:45", isCompleted: false },
                        { _id: "8", title: "Images and Media", duration: "11:20", isCompleted: false },
                    ],
                },
                {
                    _id: "section-3",
                    title: "CSS3 and Responsive Design",
                    lessons: [
                        { _id: "9", title: "CSS Selectors and Properties", duration: "10:30", isCompleted: false },
                        { _id: "10", title: "Box Model and Layout", duration: "14:20", isCompleted: false },
                        { _id: "11", title: "Flexbox Mastery", duration: "16:45", isCompleted: false },
                        { _id: "12", title: "CSS Grid", duration: "18:30", isCompleted: false },
                    ],
                },
            ],
        };
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleMarkComplete = () => {
        if (!currentLesson || !course) return;

        // Update lesson completion
        const updatedSections = course.sections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) =>
                lesson._id === currentLesson._id
                    ? { ...lesson, isCompleted: true }
                    : lesson
            ),
        }));

        const completedCount = updatedSections
            .flatMap((s) => s.lessons)
            .filter((l) => l.isCompleted).length;

        const progress = Math.round((completedCount / course.totalLessons) * 100);

        setCourse({
            ...course,
            sections: updatedSections,
            completedLessons: completedCount,
            progress,
        });

        setCurrentLesson({ ...currentLesson, isCompleted: true });

        // Auto-advance to next lesson
        const allLessons = updatedSections.flatMap((s) => s.lessons);
        const currentIndex = allLessons.findIndex((l) => l._id === currentLesson._id);
        if (currentIndex < allLessons.length - 1) {
            setCurrentLesson(allLessons[currentIndex + 1]);
        }
    };

    const handlePrevious = () => {
        if (!course || !currentLesson) return;
        const allLessons = course.sections.flatMap((s) => s.lessons);
        const currentIndex = allLessons.findIndex((l) => l._id === currentLesson._id);
        if (currentIndex > 0) {
            setCurrentLesson(allLessons[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (!course || !currentLesson) return;
        const allLessons = course.sections.flatMap((s) => s.lessons);
        const currentIndex = allLessons.findIndex((l) => l._id === currentLesson._id);
        if (currentIndex < allLessons.length - 1) {
            setCurrentLesson(allLessons[currentIndex + 1]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading course...</div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Course not found</h1>
                    <Link href="/my-courses" className="text-blue-600 hover:underline">
                        Back to my courses
                    </Link>
                </div>
            </div>
        );
    }

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
                        <p className="text-sm text-gray-400">by {course.instructor}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Your progress</p>
                        <p className="font-bold">
                            {course.completedLessons}/{course.totalLessons} lessons
                        </p>
                    </div>
                    <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#C1FF72] transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Video Player */}
                    <div className="bg-black aspect-video flex items-center justify-center">
                        {currentLesson ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <div className="text-white text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-4">{currentLesson.title}</h2>
                                    <p className="text-gray-400 mb-2">Duration: {currentLesson.duration}</p>
                                    {currentLesson.isCompleted && (
                                        <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                                            ✓ Completed
                                        </span>
                                    )}
                                </div>
                                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-6xl">▶️</span>
                                </div>
                                <p className="text-gray-500 mt-8">Video Player Placeholder</p>
                                <p className="text-gray-600 text-sm">
                                    In production: integrate Vimeo/YouTube/custom player
                                </p>
                            </div>
                        ) : (
                            <p className="text-white">No lesson selected</p>
                        )}
                    </div>

                    {/* Video Controls */}
                    <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={
                                    !currentLesson ||
                                    course.sections[0].lessons[0]._id === currentLesson._id
                                }
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>

                            {currentLesson && !currentLesson.isCompleted && (
                                <button
                                    onClick={handleMarkComplete}
                                    className="px-8 py-3 bg-[#C1FF72] text-black rounded-lg font-semibold hover:bg-[#b3f063] transition-colors"
                                >
                                    ✓ Mark as Complete
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={
                                    !currentLesson ||
                                    course.sections[course.sections.length - 1].lessons[
                                        course.sections[course.sections.length - 1].lessons.length - 1
                                    ]._id === currentLesson._id
                                }
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                    {/* Tabs: Overview, Notes, Q&A */}
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
                                    About this lesson
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    In this lesson, you'll learn the fundamentals and best practices.
                                    Follow along with the video and complete the exercises to reinforce
                                    your understanding.
                                </p>
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

                {/* Sidebar - Curriculum */}
                <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>

                        <div className="space-y-2">
                            {course.sections.map((section) => (
                                <div key={section._id} className="bg-gray-900 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection(section._id)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-semibold text-white text-sm">
                                                {section.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {section.lessons.filter((l) => l.isCompleted).length}/
                                                {section.lessons.length} completed
                                            </p>
                                        </div>
                                        <span className="text-gray-400">
                                            {expandedSections.includes(section._id) ? "▼" : "▶"}
                                        </span>
                                    </button>

                                    {expandedSections.includes(section._id) && (
                                        <div className="border-t border-gray-700">
                                            {section.lessons.map((lesson) => (
                                                <button
                                                    key={lesson._id}
                                                    onClick={() => setCurrentLesson(lesson)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-700 last:border-0 ${currentLesson?._id === lesson._id
                                                            ? "bg-gray-800 border-l-4 border-[#C1FF72]"
                                                            : ""
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex-shrink-0">
                                                            {lesson.isCompleted ? (
                                                                <span className="text-green-500">✓</span>
                                                            ) : (
                                                                <span className="text-gray-600">▶</span>
                                                            )}
                                                        </div>
                                                        <div className="text-left min-w-0 flex-1">
                                                            <p
                                                                className={`text-sm line-clamp-2 ${lesson.isCompleted
                                                                        ? "text-gray-400 line-through"
                                                                        : "text-white"
                                                                    }`}
                                                            >
                                                                {lesson.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                        {lesson.duration}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
