"use client";

import Link from "next/link";

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    originalPrice?: number;
    duration: number;
    rating: number;
    students: number;
    level: string;
    category: string;
    lessons: number;
    image?: string;
    isPurchased?: boolean;
    isBestseller?: boolean;
}

interface CourseCardProps {
    course: Course;
    onEnroll?: (courseId: string) => void;
}

export default function CourseCard({ course }: CourseCardProps) {
    const discount = course.originalPrice && course.originalPrice > course.price
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0;

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5">
            {/* Thumbnail Header */}
            <div className="relative aspect-video overflow-hidden bg-slate-950 border-b border-slate-100">
                <Link href={`/courses/${course._id}`} className="block h-full w-full">
                    {course.image ? (
                        <img
                            src={course.image}
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-6 text-white text-center">
                            <div>
                                <svg className="w-10 h-10 mx-auto text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-400">{course.category}</p>
                            </div>
                        </div>
                    )}
                </Link>

                {/* Top Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
                    {course.isBestseller && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase shadow-xs">
                            ★ Bestseller
                        </span>
                    )}
                    {course.isPurchased && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase shadow-xs">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Enrolled
                        </span>
                    )}
                </div>

                {discount > 0 && (
                    <span className="absolute right-3 top-3 inline-flex items-center rounded bg-[#e95144] px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-xs z-10">
                        -{discount}%
                    </span>
                )}

                {/* Overlay Metadata */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 pt-6 flex items-center justify-between text-white text-[11px] font-semibold">
                    <span className="capitalize bg-white/10 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                        {course.level || "All Levels"}
                    </span>
                    <span className="flex items-center gap-1 text-slate-200">
                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration ? `${course.duration}h` : "16h"} • {course.lessons || 24} Lessons</span>
                    </span>
                </div>
            </div>

            {/* Course Content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Category & Verified Certificate Pill */}
                <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-[#028eff] text-[10px]">
                        {course.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200/60">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Certificate
                    </span>
                </div>

                {/* Title */}
                <Link href={`/courses/${course._id}`} className="block mb-2">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 hover:text-[#028eff] transition-colors">
                        {course.title}
                    </h3>
                </Link>

                {/* Instructor */}
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {course.instructor?.charAt(0) || "T"}
                    </span>
                    <span className="truncate font-medium">{course.instructor}</span>
                </p>

                {/* Rating & Learners */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-t border-slate-100 pt-2.5 text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <span>★</span>
                        <span className="text-slate-700">{course.rating ? course.rating.toFixed(1) : "4.9"}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-[11px]">
                        {course.students ? (course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k` : course.students) : "1.2k"} Learners
                    </span>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#028eff]">
                            {course.price === 0 ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}
                        </span>
                        {course.originalPrice && course.originalPrice > course.price && (
                            <span className="text-xs text-slate-400 line-through">
                                ₹{course.originalPrice.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>

                    <Link
                        href={`/courses/${course._id}`}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${course.isPurchased
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-[#202020] hover:bg-[#028eff] text-white shadow-xs"
                            }`}
                    >
                        {course.isPurchased ? "Continue →" : "View Syllabus"}
                    </Link>
                </div>
            </div>
        </article>
    );
}
