"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/courses/CourseCard";

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

export default function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [sortBy, setSortBy] = useState("popular");

    const categories = ["Development", "Design", "Business", "Marketing", "Photography"];
    const levels = ["Beginner", "Intermediate", "Advanced"];

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data.data || []);
                setFilteredCourses(data.data || []);
            } else {
                setCourses(getMockCourses());
                setFilteredCourses(getMockCourses());
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setCourses(getMockCourses());
            setFilteredCourses(getMockCourses());
        } finally {
            setLoading(false);
        }
    };

    const getMockCourses = (): Course[] => {
        return [
            {
                _id: "1",
                title: "Complete Web Development Bootcamp 2025",
                description: "Learn HTML, CSS, JavaScript, React, Node.js and more with this comprehensive web development course.",
                instructor: "John Doe",
                price: 49,
                originalPrice: 199,
                duration: 42,
                rating: 4.9,
                students: 12543,
                level: "Beginner",
                category: "Development",
                lessons: 320,
                isBestseller: true,
            },
            {
                _id: "2",
                title: "Advanced React & Next.js Development",
                description: "Master React, Next.js, TypeScript, and modern web development practices.",
                instructor: "Jane Smith",
                price: 59,
                originalPrice: 249,
                duration: 35,
                rating: 4.8,
                students: 8392,
                level: "Intermediate",
                category: "Development",
                lessons: 180,
                isBestseller: true,
            },
            {
                _id: "3",
                title: "UI/UX Design Masterclass",
                description: "Learn user interface and user experience design with Figma, Adobe XD, and modern design principles.",
                instructor: "Mike Johnson",
                price: 69,
                originalPrice: 299,
                duration: 28,
                rating: 4.9,
                students: 15234,
                level: "Beginner",
                category: "Design",
                lessons: 240,
            },
            {
                _id: "4",
                title: "Digital Marketing Complete Guide",
                description: "Master SEO, social media marketing, email marketing, and paid advertising strategies.",
                instructor: "Sarah Williams",
                price: 39,
                originalPrice: 149,
                duration: 22,
                rating: 4.7,
                students: 6789,
                level: "Beginner",
                category: "Marketing",
                lessons: 150,
                isBestseller: true,
            },
            {
                _id: "5",
                title: "Business Strategy & Management",
                description: "Learn business fundamentals, strategy, leadership, and management skills.",
                instructor: "David Brown",
                price: 79,
                originalPrice: 299,
                duration: 30,
                rating: 4.6,
                students: 4521,
                level: "Advanced",
                category: "Business",
                lessons: 200,
            },
            {
                _id: "6",
                title: "Professional Photography Course",
                description: "Master camera settings, composition, lighting, and photo editing with Lightroom and Photoshop.",
                instructor: "Emily Davis",
                price: 89,
                originalPrice: 349,
                duration: 38,
                rating: 4.8,
                students: 9876,
                level: "Intermediate",
                category: "Photography",
                lessons: 220,
            },
        ];
    };

    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedCategory, selectedLevel, priceRange, sortBy, courses]);

    const applyFilters = () => {
        let filtered = [...courses];

        if (searchQuery) {
            filtered = filtered.filter((course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter((course) => course.category === selectedCategory);
        }

        if (selectedLevel !== "all") {
            filtered = filtered.filter((course) => course.level === selectedLevel);
        }

        filtered = filtered.filter(
            (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
        );

        switch (sortBy) {
            case "price-asc":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
                filtered.sort((a, b) => b.students - a.students);
                break;
            case "newest":
            default:
                break;
        }

        setFilteredCourses(filtered);
    };

    const handleEnroll = (courseId: string) => {
        router.push(`/courses/${courseId}`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
                {/* Decorative blurs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
                        Online Learning
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-medium mb-4 tracking-tight">Explore Courses</h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl">
                        Learn new skills and advance your career with expert-led courses
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for courses..."
                                className="w-full pl-14 pr-4 py-4 rounded-2xl text-gray-900 text-base bg-white focus:ring-4 focus:ring-white/30 outline-none"
                            />
                            <svg
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100">
                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Level Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Level
                            </label>
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                            >
                                <option value="all">All Levels</option>
                                {levels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price: <span className="font-semibold text-gray-900">₹{priceRange[1]}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="500"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="w-full accent-gray-900"
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-4 animate-pulse">
                                <div className="h-48 bg-gray-100 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/4 mb-3"></div>
                                <div className="h-5 bg-gray-100 rounded w-full mb-2"></div>
                                <div className="h-5 bg-gray-100 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCourses.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-medium text-gray-900 mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Try adjusting your filters or search query
                        </p>
                    </div>
                )}

                {/* Courses Grid */}
                {!loading && filteredCourses.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} onEnroll={handleEnroll} />
                        ))}
                    </div>
                )}

                {/* Why Learn With Us */}
                <div className="mt-20 bg-gray-50 rounded-3xl p-10 lg:p-14">
                    <h2 className="text-3xl font-medium text-gray-900 mb-10 text-center tracking-tight">
                        Why Learn With Us?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", title: "Expert Instructors", desc: "Learn from industry professionals" },
                            { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Learn Anywhere", desc: "Access on mobile, tablet & desktop" },
                            { icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", title: "Certificates", desc: "Earn certificates upon completion" },
                            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Lifetime Access", desc: "Learn at your own pace, forever" },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-900 transition-colors">
                                    <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
