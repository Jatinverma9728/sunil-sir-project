"use client";

import { Lesson } from "@/lib/api/courses";

interface LessonPlayerProps {
    lesson: Lesson;
}

export default function LessonPlayer({ lesson }: LessonPlayerProps) {
    if (!lesson.videoUrl) {
        return (
            <div className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <svg
                        className="w-16 h-16 text-gray-600 mx-auto mb-4"
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
                    <p className="text-gray-400 text-lg">This lesson is locked</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Purchase this course to access all lessons
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black rounded-lg overflow-hidden">
            <video
                controls
                className="w-full aspect-video"
                src={lesson.videoUrl}
                poster="https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Loading..."
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
