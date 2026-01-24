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
                setCourse(data.data);
            } else {
                setCourse(getMockCourse());
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            setCourse(getMockCourse());
        } finally {
            setLoading(false);
        }
    };

    const getMockCourse = (): Course => {
        return {
            _id: courseId,
            title: "Complete Web Development Bootcamp 2025",
            description: `Master web development from scratch with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, Node.js, MongoDB, and deploy real-world projects.

This course is designed to take you from zero to hero in web development. You'll build 15+ projects and gain practical experience with modern web technologies.`,
            instructor: {
                name: "John Doe",
                title: "Senior Web Developer & Instructor",
                bio: "John has over 10 years of experience in web development and has taught over 100,000 students worldwide. He specializes in React, Node.js, and modern JavaScript.",
                rating: 4.8,
                students: 125430,
                courses: 12,
            },
            price: 49,
            originalPrice: 199,
            duration: 42,
            rating: 4.9,
            reviews: 12543,
            students: 125430,
            level: "Beginner",
            category: "Development",
            lessons: 320,
            language: "English",
            lastUpdated: "December 2024",
            isPurchased: false,
            whatYouLearn: [
                "Build responsive websites with HTML5 and CSS3",
                "Master JavaScript programming fundamentals",
                "Create modern web apps with React and Next.js",
                "Build server-side applications with Node.js and Express",
                "Work with databases using MongoDB",
                "Deploy applications to production",
                "Implement authentication and authorization",
                "Create RESTful APIs",
            ],
            requirements: [
                "A computer with internet access",
                "No prior programming experience required",
                "Willingness to learn and practice",
            ],
            syllabus: [
                {
                    title: "Introduction to Web Development",
                    lessons: 12,
                    duration: "1.5 hours",
                    lectures: [
                        { title: "Welcome to the Course", duration: "5:30", isPreview: true },
                        { title: "Course Overview and Roadmap", duration: "8:45", isPreview: true },
                        { title: "Setting Up Your Development Environment", duration: "12:20" },
                        { title: "Your First Webpage", duration: "10:15" },
                    ],
                },
                {
                    title: "HTML5 Fundamentals",
                    lessons: 25,
                    duration: "3.5 hours",
                    lectures: [
                        { title: "HTML Document Structure", duration: "8:30" },
                        { title: "Text Elements and Formatting", duration: "12:15" },
                        { title: "Links and Navigation", duration: "9:45" },
                        { title: "Images and Media", duration: "11:20" },
                    ],
                },
                {
                    title: "CSS3 and Responsive Design",
                    lessons: 30,
                    duration: "4.2 hours",
                    lectures: [
                        { title: "CSS Selectors and Properties", duration: "10:30" },
                        { title: "Box Model and Layout", duration: "14:20" },
                        { title: "Flexbox Mastery", duration: "16:45" },
                        { title: "CSS Grid", duration: "18:30" },
                    ],
                },
                {
                    title: "JavaScript Programming",
                    lessons: 45,
                    duration: "6.5 hours",
                    lectures: [
                        { title: "Variables and Data Types", duration: "12:30" },
                        { title: "Functions and Scope", duration: "15:20" },
                        { title: "Arrays and Objects", duration: "18:45" },
                        { title: "DOM Manipulation", duration: "20:15" },
                    ],
                },
            ],
            features: [
                "42 hours on-demand video",
                "320 downloadable resources",
                "Full lifetime access",
                "Access on mobile and TV",
                "Certificate of completion",
            ],
        };
    };

    const toggleSection = (index: number) => {
        setExpandedSections((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleEnroll = () => {
        if (course?.isPurchased) {
            router.push(`/my-courses/${courseId}`);
        } else {
            // Add to cart and redirect to checkout
            router.push(`/checkout?course=${courseId}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-gray-200 animate-pulse h-96"></div>
                <div className="container mx-auto px-4 py-8">
                    <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Course not found</h1>
                    <Link href="/courses" className="text-blue-600 hover:underline">
                        Back to courses
                    </Link>
                </div>
            </div>
        );
    }

    const discount = course.originalPrice
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <Link href="/courses">Courses</Link>
                            <span>/</span>
                            <span className="capitalize">{course.category}</span>
                        </div>

                        <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
                        <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                            {course.description.split('\n')[0]}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 text-lg">★</span>
                                <span className="font-bold">{typeof course.rating === 'number' ? course.rating : course.rating?.average || 0}</span>
                                <span className="text-gray-300">({(course.reviews || (typeof course.rating === 'object' ? course.rating?.count : 0) || 0).toLocaleString()} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>👥</span>
                                <span>{(course.students || course.enrolledStudents || 0).toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🌐</span>
                                <span>{course.language || 'English'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span>Updated {course.lastUpdated || 'Recently'}</span>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-2xl">👨‍💼</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Created by</p>
                                <p className="font-semibold">{course.instructor?.name || 'Instructor'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* What You'll Learn */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {(course.whatYouLearn || course.whatYouWillLearn || []).map((item: string, index: number) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content / Syllabus */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
                            <p className="text-gray-600 mb-6">
                                {(course.syllabus?.length || 0)} sections • {typeof course.lessons === 'number' ? course.lessons : (Array.isArray(course.lessons) ? course.lessons.length : 0)} lectures • {course.duration || 0}h total length
                            </p>

                            <div className="space-y-2">
                                {(course.syllabus || []).map((section: { title: string; lessons: number; duration: string; lectures: Array<{ title: string; duration: string; isPreview?: boolean }> }, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(index)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-600">
                                                    {expandedSections.includes(index) ? "▼" : "▶"}
                                                </span>
                                                <div className="text-left">
                                                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {section.lessons} lectures • {section.duration}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        {expandedSections.includes(index) && (
                                            <div className="bg-gray-50 border-t border-gray-200">
                                                {section.lectures.map((lecture, lectureIndex) => (
                                                    <div
                                                        key={lectureIndex}
                                                        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-gray-400">▶</span>
                                                            <span className="text-gray-700">{lecture.title}</span>
                                                            {lecture.isPreview && (
                                                                <button
                                                                    onClick={() => setShowVideoModal(true)}
                                                                    className="text-sm text-blue-600 hover:underline"
                                                                >
                                                                    Preview
                                                                </button>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-gray-600">{lecture.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                            <ul className="space-y-3">
                                {(course.requirements || []).map((req: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <span className="text-gray-400 mt-1">•</span>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Description */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                                {course.description}
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
                            <div className="flex gap-6">
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-6xl">👨‍💼</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                        {course.instructor.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{course.instructor.title}</p>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                                <span>★</span>
                                                <span className="text-gray-900 font-semibold">
                                                    {course.instructor.rating}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Instructor Rating</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900 mb-1">
                                                {((course.instructor.students || 0) / 1000).toFixed(0)}K
                                            </p>
                                            <p className="text-sm text-gray-600">Students</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900 mb-1">
                                                {course.instructor.courses}
                                            </p>
                                            <p className="text-sm text-gray-600">Courses</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700">{course.instructor.bio}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>

                            {/* Rating Summary */}
                            <div className="flex items-center gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-gray-900 mb-2">
                                        {typeof course.rating === 'number' ? course.rating : (course.rating?.average || 0)}
                                    </div>
                                    <div className="flex text-yellow-400 text-xl mb-2">★★★★★</div>
                                    <p className="text-gray-600">Course Rating</p>
                                </div>
                                <div className="flex-1">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex items-center gap-3 mb-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400"
                                                    style={{ width: `${star === 5 ? 75 : star === 4 ? 15 : 5}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-20 text-right">
                                                {star} stars
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-6">
                                {[
                                    {
                                        name: "Sarah Johnson",
                                        rating: 5,
                                        date: "2 weeks ago",
                                        comment: "Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.",
                                    },
                                    {
                                        name: "Mike Chen",
                                        rating: 5,
                                        date: "1 month ago",
                                        comment: "Best web development course I've taken. Highly recommend for beginners!",
                                    },
                                    {
                                        name: "Emily Davis",
                                        rating: 4,
                                        date: "1 month ago",
                                        comment: "Great content and projects. Would love to see more advanced topics covered.",
                                    },
                                ].map((review, index) => (
                                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-2xl">👤</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{review.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex text-yellow-400 text-sm">
                                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                    </div>
                                                    <span className="text-sm text-gray-500">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            {/* Video Preview Card */}
                            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-lg">
                                <div
                                    className="relative bg-gradient-to-br from-blue-400 to-indigo-500 h-48 flex items-center justify-center cursor-pointer group"
                                    onClick={() => setShowVideoModal(true)}
                                >
                                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="text-4xl">▶️</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <p className="text-sm font-medium">Preview this course</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-4xl font-bold text-gray-900">
                                                ₹{course.price}
                                            </span>
                                            {course.originalPrice && (
                                                <span className="text-xl text-gray-400 line-through">
                                                    ₹{course.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        {discount > 0 && (
                                            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="space-y-3 mb-6">
                                        <button
                                            onClick={handleEnroll}
                                            className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
                                        >
                                            {course.isPurchased ? "Go to Course" : "Enroll Now"}
                                        </button>
                                        <button className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                                            Add to Wishlist
                                        </button>
                                    </div>

                                    {/* Course Includes */}
                                    <div className="space-y-3 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-4">
                                            This course includes:
                                        </h3>
                                        {(course.features || []).map((feature: string, index: number) => (
                                            <div key={index} className="flex items-center gap-3 text-sm">
                                                <span className="text-gray-600">✓</span>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
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
                                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
                            <p className="text-white text-xl">Video Preview Placeholder</p>
                            <p className="text-gray-400 text-sm mt-2">
                                In production: embed Vimeo/YouTube player here
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
