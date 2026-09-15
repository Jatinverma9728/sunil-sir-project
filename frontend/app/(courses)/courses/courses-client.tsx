"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/courses/CourseCard";
import { API_URL } from "@/lib/constants";

// Interface matching the API response
export interface APICourse {
    _id: string;
    title: string;
    description: string;
    instructor: { name: string; email?: string };
    price: number;
    level: string;
    category: string;
    lessons: { _id: string }[];
    rating: { average: number; count: number };
    enrolledStudents: number;
    thumbnail?: string;
    isPublished?: boolean;
}

// Interface for CourseCard component
export interface Course {
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

// Adapter function to convert API response to component format
const adaptCourse = (apiCourse: APICourse): Course => ({
    _id: apiCourse._id,
    title: apiCourse.title,
    description: apiCourse.description,
    instructor: apiCourse.instructor?.name || "Instructor",
    price: apiCourse.price,
    duration: apiCourse.lessons?.length || 0,
    rating: apiCourse.rating?.average || 0,
    students: apiCourse.enrolledStudents || 0,
    level: apiCourse.level?.charAt(0).toUpperCase() + apiCourse.level?.slice(1) || "Beginner",
    category: apiCourse.category?.charAt(0).toUpperCase() + apiCourse.category?.slice(1) || "Other",
    lessons: apiCourse.lessons?.length || 0,
    image: apiCourse.thumbnail,
    isBestseller: (apiCourse.enrolledStudents || 0) > 100,
});

interface CoursesClientProps {
    initialCourses?: Course[];
}

export default function CoursesClient({ initialCourses = [] }: CoursesClientProps) {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
    const [loading, setLoading] = useState(initialCourses.length === 0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [sortBy, setSortBy] = useState("popular");

    const categories = ["Programming", "Design", "Business", "Marketing", "Photography", "Music", "Health", "Personal-development"];
    const levels = ["Beginner", "Intermediate", "Advanced"];

    useEffect(() => {
        if (initialCourses.length === 0) fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/courses`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    const adaptedCourses = data.data.map(adaptCourse);
                    setCourses(adaptedCourses);
                    setFilteredCourses(adaptedCourses);
                } else {
                    setCourses([]);
                    setFilteredCourses([]);
                }
            } else {
                setCourses([]);
                setFilteredCourses([]);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setCourses([]);
            setFilteredCourses([]);
        } finally {
            setLoading(false);
        }
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

    // Shared Filter Content
    const FilterContent = () => (
        <div className="space-y-8">
            {/* Search */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Keywords..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            value="all"
                            checked={selectedCategory === "all"}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="hidden"
                        />
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCategory === "all" ? "border-gray-900" : "border-gray-300 group-hover:border-gray-400"}`}>
                            {selectedCategory === "all" && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                        </span>
                        <span className={`text-sm font-medium transition-colors ${selectedCategory === "all" ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>All Categories</span>
                    </label>
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={selectedCategory === cat}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="hidden"
                            />
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCategory === cat ? "border-gray-900" : "border-gray-300 group-hover:border-gray-400"}`}>
                                {selectedCategory === cat && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                            </span>
                            <span className={`text-sm font-medium transition-colors ${selectedCategory === cat ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Levels */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Level</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="level"
                            value="all"
                            checked={selectedLevel === "all"}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="hidden"
                        />
                        <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selectedLevel === "all" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 group-hover:border-gray-400"}`}>
                            {selectedLevel === "all" && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </span>
                        <span className={`text-sm font-medium transition-colors ${selectedLevel === "all" ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>All Levels</span>
                    </label>
                    {levels.map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="level"
                                value={level}
                                checked={selectedLevel === level}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="hidden"
                            />
                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selectedLevel === level ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 group-hover:border-gray-400"}`}>
                                {selectedLevel === level && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </span>
                            <span className={`text-sm font-medium transition-colors ${selectedLevel === level ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>{level}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price</h3>
                    <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-md">₹0 - ₹{priceRange[1]}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-gray-900 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Breadcrumb Bar */}
            <div className="border-b border-slate-200/80 bg-white">
                <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 md:px-8">
                    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span>›</span>
                        <span className="font-bold text-slate-900">Online Tech Courses</span>
                    </nav>
                </div>
            </div>

            {/* Minimal Dark Hero */}
            <div className="bg-slate-900 text-white py-12 lg:py-16 relative overflow-hidden border-b border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[96px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            Industry-Ready Tech Certifications
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Knowledge & Skills</span>
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                            Master modern full-stack development, Python, and IoT systems with practical curriculum, code reviews, and verifiable completion diplomas.
                        </p>
                    </div>

                    {/* Trust Strip */}
                    <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { title: "Real-World Projects", desc: "Build production apps" },
                            { title: "Instructor Support", desc: "Direct code guidance" },
                            { title: "Skill Certification", desc: "Verifiable student diploma" },
                            { title: "Lifetime Access", desc: "Self-paced video lessons" }
                        ].map((tp, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-100">{tp.title}</h4>
                                    <p className="text-[11px] text-slate-400">{tp.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-4 gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="pb-6 border-b border-gray-100 mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <p className="text-gray-500 font-medium text-sm">
                                Showing <span className="text-gray-900 font-bold">{filteredCourses.length}</span> results
                            </p>

                            <div className="flex items-center gap-4">
                                <button
                                    className="lg:hidden px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    Filters
                                </button>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-sm font-bold text-gray-900 border-none outline-none cursor-pointer focus:ring-0 text-right pr-8"
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                        </div>

                        {/* Course Grid */}
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-50 rounded-3xl h-[400px] animate-pulse" />
                                ))}
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <div key={course._id}>
                                        <CourseCard course={course} onEnroll={handleEnroll} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">No courses found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                        setSelectedLevel("all");
                                        setPriceRange([0, 10000]);
                                    }}
                                    className="mt-4 text-sm font-bold text-gray-900 underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="relative ml-auto w-full max-w-xs h-full bg-white p-6 overflow-y-auto z-10">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <FilterContent />
                    </div>
                </div>
            )}
        </div>
    );
}
