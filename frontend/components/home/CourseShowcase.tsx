"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CourseCard from "@/components/courses/CourseCard";
import { getCourses } from "@/lib/api/courses";

const CURATED_COURSES = [
    {
        _id: "course-fullstack-dev",
        title: "Full-Stack Web Development Bootcamp (MERN + Next.js)",
        description: "Master React, Next.js, Node.js, Express & MongoDB from scratch with real portfolio projects.",
        instructor: "Sunil Verma (Senior Architect)",
        price: 2499,
        originalPrice: 7999,
        duration: 32,
        rating: 4.9,
        students: 2400,
        level: "Beginner to Pro",
        category: "Web Development",
        lessons: 56,
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        isBestseller: true
    },
    {
        _id: "course-python-ai",
        title: "Python for Data Science, Automation & Machine Learning",
        description: "Hands-on Python course covering NumPy, Pandas, Scikit-Learn and building automated AI scripts.",
        instructor: "Dr. A. Sharma (AI Researcher)",
        price: 1999,
        originalPrice: 5999,
        duration: 24,
        rating: 4.8,
        students: 1850,
        level: "Intermediate",
        category: "Data Science & AI",
        lessons: 42,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        isBestseller: false
    },
    {
        _id: "course-embedded-iot",
        title: "Microcontroller Programming & IoT Systems (ESP32/Arduino)",
        description: "Hardware interfacing, sensor circuits, Wi-Fi telemetry and building automated smart systems.",
        instructor: "Er. Rahul Tech (Hardware Lead)",
        price: 1799,
        originalPrice: 4999,
        duration: 20,
        rating: 4.9,
        students: 1200,
        level: "Hands-on",
        category: "IoT & Hardware",
        lessons: 38,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        isBestseller: true
    }
];

export default function CourseShowcase() {
    const [courses, setCourses] = useState<any[]>(CURATED_COURSES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShowcaseCourses = async () => {
            try {
                const res = await getCourses();
                if (res.success && res.data && res.data.length > 0) {
                    const mapped = res.data.map((c: any) => ({
                        _id: c._id,
                        title: c.title,
                        description: c.description || "",
                        instructor: typeof c.instructor === "object" ? c.instructor?.name : c.instructor || "North Tech Hub Instructor",
                        price: c.price,
                        originalPrice: c.originalPrice,
                        duration: c.totalDuration || c.duration || 20,
                        rating: typeof c.rating === "object" ? c.rating?.average : c.rating || 4.8,
                        students: c.enrolledStudents || c.students || 850,
                        level: c.level || "All Levels",
                        category: c.category || "Tech Skills",
                        lessons: Array.isArray(c.lessons) ? c.lessons.length : 24,
                        image: c.thumbnail || c.image,
                        isBestseller: c.isBestseller || false
                    }));
                    setCourses(mapped.slice(0, 3));
                }
            } catch (err) {
                console.error("Error fetching courses for showcase:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchShowcaseCourses();
    }, []);

    return (
        <section className="bg-slate-50/70 py-12 md:py-16 border-b border-slate-200/80">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Build Job-Ready Tech and Engineering Skills
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Practical, project-driven video curriculums designed by industry engineers to build real-world systems.
                        </p>
                    </div>

                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#202020] hover:bg-[#028eff] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs self-start md:self-auto"
                    >
                        <span>Explore Courses</span>
                        <span>→</span>
                    </Link>
                </div>

                {/* Courses Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 rounded-2xl bg-white border border-slate-200/80 p-4 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}

                {/* Value Strip */}
                <div className="mt-8 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs grid sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Project-Based Learning</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Build 4+ real applications to showcase on GitHub and your resume</p>
                    </div>
                    <div className="p-3 border-y sm:border-y-0 sm:border-x border-slate-100">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Verified Certification</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Shareable digital credentials verifiable online for LinkedIn</p>
                    </div>
                    <div className="p-3">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Direct WhatsApp Assistance</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Ask questions directly on WhatsApp with our instructor team</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
