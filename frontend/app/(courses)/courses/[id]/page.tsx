"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: {
        name: string;
        title?: string;
        bio?: string;
        rating?: number;
        students?: number;
        courses?: number;
    };
    price: number;
    originalPrice?: number;
    duration?: number;
    rating: number | { average: number; count: number };
    reviews?: number;
    students?: number;
    enrolledStudents?: number;
    level: string;
    category: string;
    lessons: number | Array<{ _id: string; title: string; duration: number; isFree?: boolean }>;
    language?: string;
    lastUpdated?: string;
    isPurchased?: boolean;
    whatYouLearn?: string[];
    whatYouWillLearn?: string[];
    requirements?: string[];
    thumbnail?: string;
    syllabus?: Array<{
        title: string;
        lessons: number;
        duration: string;
        lectures: Array<{
            title: string;
            duration: string;
            isPreview?: boolean;
        }>;
    }>;
    features?: string[];
}

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<number[]>([0]);
    const [showVideoModal, setShowVideoModal] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setCourse(data.data);
                } else {
                    setCourse(null);
                }
            } else {
                setCourse(null);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index: number) => {
        setExpandedSections((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleEnroll = () => {
        if (!course) return;

        if (course.isPurchased) {
            const lessons = Array.isArray(course.lessons) ? course.lessons : [];
            if (lessons.length > 0) {
                router.push(`/courses/${courseId}/lessons/${lessons[0]._id}`);
            } else {
                router.push(`/my-courses`);
            }
            return;
        }

        router.push(`/checkout/course?course=${courseId}`);
    };

    // Helper to get rating values
    const getRating = () => {
        if (typeof course?.rating === 'number') return course.rating;
        return course?.rating?.average || 0;
    };

    const getReviewCount = () => {
        if (course?.reviews) return course.reviews;
        if (typeof course?.rating === 'object') return course.rating?.count || 0;
        return 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Hero Skeleton */}
                <div className="bg-slate-900 py-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <div className="h-4 w-32 bg-slate-700 rounded mb-6 animate-pulse" />
                            <div className="h-12 w-3/4 bg-slate-700 rounded mb-4 animate-pulse" />
                            <div className="h-6 w-full bg-slate-700 rounded mb-2 animate-pulse" />
                            <div className="h-6 w-2/3 bg-slate-700 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-64 bg-white rounded-xl animate-pulse" />
                            <div className="h-96 bg-white rounded-xl animate-pulse" />
                        </div>
                        <div className="h-[500px] bg-white rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                    <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    const discount = course.originalPrice
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0;

    const lessonCount = typeof course.lessons === 'number' ? course.lessons : (Array.isArray(course.lessons) ? course.lessons.length : 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-16 relative">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Course Info */}
                        <div className="lg:col-span-2">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-white capitalize">{course.category}</span>
                            </nav>

                            {/* Level Badge */}
                            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full mb-4 capitalize">
                                {course.level}
                            </span>

                            {/* Title */}
                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                                {course.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-2xl">
                                {course.description.split('\n')[0]}
                            </p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.floor(getRating()) ? 'text-amber-400' : 'text-slate-600'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="font-semibold">{getRating().toFixed(1)}</span>
                                    <span className="text-slate-400">({getReviewCount().toLocaleString()} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{(course.students || course.enrolledStudents || 0).toLocaleString()} students</span>
                                </div>
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {course.instructor?.name?.charAt(0) || 'I'}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Created by</p>
                                    <p className="font-semibold">{course.instructor?.name || 'Instructor'}</p>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-700 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    <span>{course.language || 'English'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Updated {course.lastUpdated || 'Recently'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>{lessonCount} lessons</span>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Sidebar - Hidden on Mobile (shown below) */}
                        <div className="hidden lg:block" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        {(course.whatYouLearn || course.whatYouWillLearn || []).length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {(course.whatYouLearn || course.whatYouWillLearn || []).map((item: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                                                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Course Content */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                                <p className="text-sm text-gray-500">
                                    {course.syllabus?.length || 0} sections • {lessonCount} lectures
                                </p>
                            </div>

                            <div className="space-y-3">
                                {(course.syllabus || []).map((section, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(index)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg
                                                    className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.includes(index) ? 'rotate-90' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <span className="font-semibold text-gray-900 text-left">{section.title}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">{section.lessons} lectures • {section.duration}</span>
                                        </button>

                                        {expandedSections.includes(index) && (
                                            <div className="divide-y divide-gray-100">
                                                {section.lectures.map((lecture, lectureIndex) => (
                                                    <div
                                                        key={lectureIndex}
                                                        className="flex items-center justify-between px-4 py-3 pl-11"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-gray-700">{lecture.title}</span>
                                                            {lecture.isPreview && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShowVideoModal(true);
                                                                    }}
                                                                    className="text-xs text-blue-600 font-medium hover:underline"
                                                                >
                                                                    Preview
                                                                </button>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-gray-500">{lecture.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        {(course.requirements || []).length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Requirements</h2>
                                <ul className="space-y-3">
                                    {course.requirements.map((req: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-700">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {course.description}
                                </p>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Instructor</h2>
                            <div className="flex gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-3xl text-white font-bold">
                                        {course.instructor?.name?.charAt(0) || 'I'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {course.instructor.name}
                                    </h3>
                                    {course.instructor.title && (
                                        <p className="text-gray-500 mb-4">{course.instructor.title}</p>
                                    )}

                                    <div className="flex flex-wrap gap-6 mb-4">
                                        {course.instructor.rating && (
                                            <div>
                                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-gray-900 font-semibold">{course.instructor.rating}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">Rating</p>
                                            </div>
                                        )}
                                        {course.instructor.students && (
                                            <div>
                                                <p className="font-semibold text-gray-900">{(course.instructor.students / 1000).toFixed(0)}K</p>
                                                <p className="text-xs text-gray-500">Students</p>
                                            </div>
                                        )}
                                        {course.instructor.courses && (
                                            <div>
                                                <p className="font-semibold text-gray-900">{course.instructor.courses}</p>
                                                <p className="text-xs text-gray-500">Courses</p>
                                            </div>
                                        )}
                                    </div>

                                    {course.instructor.bio && (
                                        <p className="text-gray-700">{course.instructor.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                {/* Thumbnail / Video Preview */}
                                <div
                                    className="relative aspect-video bg-slate-900 cursor-pointer group"
                                    onClick={() => setShowVideoModal(true)}
                                >
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                                        Preview this course
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                                            </span>
                                            {course.originalPrice && course.originalPrice > course.price && (
                                                <span className="text-lg text-gray-400 line-through">
                                                    ₹{course.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        {discount > 0 && (
                                            <span className="inline-block px-2.5 py-1 bg-rose-100 text-rose-700 text-sm font-semibold rounded">
                                                {discount}% off
                                            </span>
                                        )}
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="space-y-3 mb-6">
                                        <button
                                            onClick={handleEnroll}
                                            className={`w-full py-3.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${course.isPurchased
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                                                }`}
                                        >
                                            {course.isPurchased ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Go to Course
                                                </>
                                            ) : course.price === 0 ? (
                                                'Enroll Free'
                                            ) : (
                                                'Enroll Now'
                                            )}
                                        </button>
                                        {!course.isPurchased && (
                                            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                                Add to Wishlist
                                            </button>
                                        )}
                                    </div>

                                    {/* Course Includes */}
                                    {(course.features || []).length > 0 && (
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="font-semibold text-gray-900 mb-4">This course includes:</h3>
                                            <ul className="space-y-3">
                                                {course.features.map((feature: string, index: number) => (
                                                    <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Preview Modal */}
            {showVideoModal && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowVideoModal(false)}
                >
                    <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setShowVideoModal(false)}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-white text-lg font-medium">Video Preview</p>
                            <p className="text-slate-400 text-sm mt-1">Preview video will appear here</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
