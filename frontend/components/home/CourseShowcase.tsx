"use client";

import Link from "next/link";
import { useState } from "react";

const courses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "John Doe",
        initials: "JD",
        rating: 4.9,
        students: 12543,
        price: 49,
        originalPrice: 199,
        level: "Beginner",
        lessons: 12,
        color: "from-violet-100 to-indigo-100",
        hoverColor: "violet",
    },
    {
        id: 2,
        title: "Advanced React & Next.js",
        instructor: "Jane Smith",
        initials: "JS",
        rating: 4.8,
        students: 8392,
        price: 59,
        originalPrice: 249,
        level: "Intermediate",
        lessons: 18,
        color: "from-amber-50 to-orange-50",
        hoverColor: "amber",
    },
    {
        id: 3,
        title: "Full Stack JavaScript",
        instructor: "Mike Johnson",
        initials: "MJ",
        rating: 4.9,
        students: 15234,
        price: 69,
        originalPrice: 299,
        level: "Advanced",
        lessons: 24,
        color: "from-emerald-50 to-teal-50",
        hoverColor: "emerald",
    },
];

export default function CourseShowcase() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Premium Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
                            Online Learning
                        </p>
                        <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
                            Transform Your Career
                        </h2>
                    </div>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-3 text-gray-500 hover:text-gray-900 text-sm font-medium transition-all duration-300 group"
                    >
                        View all courses
                        <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white transition-all duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Course Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            onMouseEnter={() => setHoveredId(course.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`
                                bg-white rounded-3xl overflow-hidden
                                border border-gray-100
                                transition-all duration-500 group
                                ${hoveredId === course.id
                                    ? 'shadow-2xl shadow-gray-200/80 border-gray-200 -translate-y-2'
                                    : 'shadow-sm hover:shadow-lg'
                                }
                            `}
                        >
                            {/* Course Header */}
                            <div className={`relative bg-gradient-to-br ${course.color} h-48 flex items-center justify-center overflow-hidden p-6`}>
                                {/* Decorative blur */}
                                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-white/40 rounded-full blur-2xl transition-transform duration-500 ${hoveredId === course.id ? 'scale-150' : 'scale-100'}`}></div>

                                <div className={`
                                    w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg
                                    transition-transform duration-500
                                    ${hoveredId === course.id ? 'scale-110 rotate-3' : 'scale-100'}
                                `}>
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 text-xs font-medium shadow-sm">
                                        {course.level}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-gray-500 text-sm">{course.lessons} lessons</span>
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-4 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                    {course.title}
                                </h3>

                                {/* Instructor */}
                                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold
                                        transition-all duration-300
                                        ${hoveredId === course.id
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                        }
                                    `}>
                                        {course.initials}
                                    </div>
                                    <span className="text-sm text-gray-500">{course.instructor}</span>
                                </div>

                                {/* Rating & Students */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                                    </div>
                                    <span className="text-gray-200">|</span>
                                    <span className="text-sm text-gray-400">{(course.students / 1000).toFixed(1)}k students</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-semibold text-gray-900">${course.price}</span>
                                        <span className="text-sm text-gray-400 line-through">${course.originalPrice}</span>
                                    </div>
                                    <span className={`
                                        w-11 h-11 rounded-full flex items-center justify-center 
                                        transition-all duration-300
                                        ${hoveredId === course.id
                                            ? 'bg-gray-900 text-white rotate-45'
                                            : 'border border-gray-200 text-gray-400'
                                        }
                                    `}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
