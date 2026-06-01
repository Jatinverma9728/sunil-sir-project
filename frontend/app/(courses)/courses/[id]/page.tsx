import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailClient from "./course-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";
const TITLE_SUFFIX = " | North Tech Hub";

type CourseRouteParams = Promise<{ id: string }>;

async function getCourse(id: string) {
    try {
        const res = await fetch(`${API_URL}/courses/${id}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.data : null;
    } catch {
        return null;
    }
}

function cleanText(value: unknown): string {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function lessonCountFor(course: any): number {
    if (typeof course.lessons === "number") return course.lessons;
    if (Array.isArray(course.lessons)) return course.lessons.length;
    return 0;
}

function courseTitle(course: any): string {
    const name = truncateText(cleanText(course.title), 60 - TITLE_SUFFIX.length);
    return `${name}${TITLE_SUFFIX}`;
}

function courseDescription(course: any): string {
    const title = truncateText(cleanText(course.title), 58);
    const instructor = cleanText(course.instructor?.name || "North Tech Hub");
    const base = `Learn ${title} with ${instructor}. Includes ${lessonCountFor(course)} lessons, practical projects, certificate guidance, and India-friendly pricing.`;
    return truncateText(base, 155);
}

export async function generateMetadata({ params }: { params: CourseRouteParams }): Promise<Metadata> {
    const { id } = await params;
    const course = await getCourse(id);

    if (!course) {
        return {
            title: "Course Not Found",
            description: "The course you're looking for doesn't exist.",
            robots: { index: false, follow: true },
        };
    }

    const title = courseTitle(course);
    const description = courseDescription(course);

    return {
        title: { absolute: title },
        description,
        keywords: [
            course.title,
            `${course.title} course`,
            `learn ${course.category}`,
            `${course.category} course India`,
            `online ${course.level} ${course.category} course`,
            "North Tech Hub courses",
        ].filter(Boolean),
        alternates: {
            canonical: `/courses/${id}`,
        },
        openGraph: {
            title,
            description,
            url: `/courses/${id}`,
            type: "website",
            images: course.thumbnail
                ? [{ url: course.thumbnail, width: 1280, height: 720, alt: cleanText(course.title) }]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: course.thumbnail ? [course.thumbnail] : undefined,
        },
    };
}

export default async function CourseDetailPage({ params }: { params: CourseRouteParams }) {
    const { id } = await params;
    const course = await getCourse(id);

    if (!course) {
        notFound();
    }

    const ratingAverage = typeof course.rating === "object" ? course.rating.average : course.rating;
    const ratingCount = typeof course.rating === "object" ? course.rating.count : course.reviews;

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.description,
            provider: {
                "@type": "Organization",
                name: "North Tech Hub",
                sameAs: SITE_URL,
            },
            instructor: course.instructor?.name
                ? {
                    "@type": "Person",
                    name: course.instructor.name,
                }
                : undefined,
            image: course.thumbnail,
            offers: {
                "@type": "Offer",
                price: String(course.price),
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}/courses/${id}`,
            },
            ...(ratingAverage && ratingCount > 0
                ? {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: ratingAverage,
                        reviewCount: ratingCount,
                    },
                }
                : {}),
            educationalLevel: course.level,
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: SITE_URL,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Courses",
                    item: `${SITE_URL}/courses`,
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: course.title,
                    item: `${SITE_URL}/courses/${id}`,
                },
            ],
        },
    ];

    return (
        <>
            <script
                id="course-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CourseDetailClient />
        </>
    );
}
