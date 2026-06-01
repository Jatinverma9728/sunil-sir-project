import CoursesClient, { type Course } from "./courses-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

interface ApiCourse {
    _id: string;
    title: string;
    description: string;
    instructor?: { name?: string };
    price: number;
    originalPrice?: number;
    level?: string;
    category?: string;
    lessons?: Array<{ _id: string }>;
    rating?: { average?: number; count?: number };
    enrolledStudents?: number;
    thumbnail?: string;
}

async function getInitialCourses(): Promise<ApiCourse[]> {
    try {
        const res = await fetch(`${API_URL}/courses?limit=12`, {
            next: { revalidate: 1800 },
        });
        if (!res.ok) return [];

        const data = await res.json();
        return data.success && Array.isArray(data.data) ? data.data : [];
    } catch {
        return [];
    }
}

function titleCase(value: string | undefined, fallback: string) {
    if (!value) return fallback;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function adaptCourse(course: ApiCourse): Course {
    const lessonCount = course.lessons?.length || 0;

    return {
        _id: course._id,
        title: course.title,
        description: course.description,
        instructor: course.instructor?.name || "North Tech Hub",
        price: course.price,
        originalPrice: course.originalPrice,
        duration: lessonCount,
        rating: course.rating?.average || 0,
        students: course.enrolledStudents || 0,
        level: titleCase(course.level, "Beginner"),
        category: titleCase(course.category, "Other"),
        lessons: lessonCount,
        image: course.thumbnail,
        isBestseller: (course.enrolledStudents || 0) > 100,
    };
}

export default async function CoursesPage() {
    const apiCourses = await getInitialCourses();
    const courses = apiCourses.map(adaptCourse);

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Online Tech Courses India",
        url: `${SITE_URL}/courses`,
        description: "Browse practical online courses in programming, web development, data science, design, and mobile app development from North Tech Hub.",
        isPartOf: {
            "@type": "WebSite",
            name: "North Tech Hub",
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: apiCourses.map((course, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/courses/${course._id}`,
                item: {
                    "@type": "Course",
                    name: course.title,
                    description: course.description,
                    image: course.thumbnail,
                    provider: {
                        "@type": "Organization",
                        name: "North Tech Hub",
                        sameAs: SITE_URL,
                    },
                    offers: {
                        "@type": "Offer",
                        price: String(course.price),
                        priceCurrency: "INR",
                        availability: "https://schema.org/InStock",
                        url: `${SITE_URL}/courses/${course._id}`,
                    },
                },
            })),
        },
    };

    return (
        <>
            <script
                id="courses-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <CoursesClient initialCourses={courses} />
        </>
    );
}
