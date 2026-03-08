import type { Metadata } from "next";
import Script from "next/script";
import CourseDetailClient from "./course-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://northtechhub.in";

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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const course = await getCourse(params.id);

    if (!course) {
        return {
            title: "Course Not Found",
            description: "The course you're looking for doesn't exist.",
        };
    }

    const rating =
        typeof course.rating === "object"
            ? course.rating.average
            : course.rating || 0;

    const lessonCount =
        typeof course.lessons === "number"
            ? course.lessons
            : Array.isArray(course.lessons)
                ? course.lessons.length
                : 0;

    return {
        title: `${course.title} - Online Course`,
        description: `Enroll in ${course.title} by ${course.instructor?.name || "Expert Instructor"}. ${course.description?.substring(0, 120)}... ${lessonCount} lessons. ₹${course.price} only on North Tech Hub.`,
        keywords: [
            course.title,
            `${course.title} course`,
            `learn ${course.category}`,
            `${course.category} course India`,
            `online ${course.level} ${course.category} course`,
            "North Tech Hub courses",
        ].filter(Boolean),
        alternates: {
            canonical: `/courses/${params.id}`,
        },
        openGraph: {
            title: `${course.title} | North Tech Hub`,
            description: `${course.description?.substring(0, 150)}`,
            url: `/courses/${params.id}`,
            type: "website",
            images: course.thumbnail
                ? [{ url: course.thumbnail, width: 1280, height: 720, alt: course.title }]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${course.title} | North Tech Hub`,
            description: `${course.description?.substring(0, 120)}`,
            images: course.thumbnail ? [course.thumbnail] : undefined,
        },
    };
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
    const course = await getCourse(params.id);

    const jsonLd = course
        ? {
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
                price: course.price,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}/courses/${params.id}`,
            },
            aggregateRating:
                course.rating &&
                    (typeof course.rating === "object"
                        ? course.rating.count > 0
                        : true)
                    ? {
                        "@type": "AggregateRating",
                        ratingValue:
                            typeof course.rating === "object"
                                ? course.rating.average
                                : course.rating,
                        reviewCount:
                            typeof course.rating === "object"
                                ? course.rating.count
                                : course.reviews || 0,
                    }
                    : undefined,
            educationalLevel: course.level,
            breadcrumb: {
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
                        item: `${SITE_URL}/courses/${params.id}`,
                    },
                ],
            },
        }
        : null;

    return (
        <>
            {jsonLd && (
                <Script
                    id="course-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <CourseDetailClient />
        </>
    );
}
