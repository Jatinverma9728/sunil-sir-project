"use client";

import { Course } from "@/lib/api/courses";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "../ui/Card";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/courses/${course._id}`}>
            <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium">
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </div>
                </div>

                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                            {course.category}
                        </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {course.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(course.rating.average)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                ({course.rating.count})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {course.enrolledStudents} students
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.totalDuration || 0}min
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(course.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                        {course.lessonCount || 0} lessons
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
