import type { Metadata } from "next";

const TITLE_SUFFIX = " | North Tech Hub";

function cleanText(value: string | undefined): string {
    return (value || "").replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

/**
 * Generate product-specific metadata for SEO.
 */
export function generateProductMetadata(product: {
    title: string;
    description: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
    category: string;
    rating?: { average: number; count: number };
}): Metadata {
    const imageUrl = product.images[0]?.url || "/placeholder.png";
    const rating = product.rating?.average || 0;
    const reviewCount = product.rating?.count || 0;
    const title = `${truncateText(cleanText(product.title), 60 - TITLE_SUFFIX.length)}${TITLE_SUFFIX}`;
    const description = truncateText(
        `Buy ${cleanText(product.title)} for Rs. ${product.price}. ${cleanText(product.description)}`,
        155
    );

    return {
        title: { absolute: title },
        description,
        keywords: [
            product.title,
            product.category,
            "buy online",
            "north tech hub shop",
            "electronics",
            "gadgets",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
            siteName: "North Tech Hub",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        other: {
            "product:price:amount": product.price.toString(),
            "product:price:currency": "INR",
            "product:availability": "in stock",
            "product:rating": rating.toString(),
            "product:rating:count": reviewCount.toString(),
        },
    };
}

/**
 * Generate course-specific metadata for SEO.
 */
export function generateCourseMetadata(course: {
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    instructor: { name: string };
    level?: string;
    duration?: number;
}): Metadata {
    const imageUrl = course.thumbnail || "/placeholder-course.png";
    const title = `${truncateText(cleanText(course.title), 60 - TITLE_SUFFIX.length)}${TITLE_SUFFIX}`;
    const description = truncateText(
        `Learn ${cleanText(course.title)} with ${course.instructor.name}. ${cleanText(course.description)}`,
        155
    );

    return {
        title: { absolute: title },
        description,
        keywords: [
            course.title,
            "online course",
            "learn",
            course.instructor.name,
            course.level || "all levels",
            "north tech hub learn",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: course.title,
                },
            ],
            siteName: "North Tech Hub",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

/**
 * Generate category page metadata.
 */
export function generateCategoryMetadata(
    category: string,
    productCount: number
): Metadata {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const title = `${truncateText(categoryTitle, 60 - TITLE_SUFFIX.length - 9)} Products${TITLE_SUFFIX}`;

    return {
        title: { absolute: title },
        description: `Browse ${productCount}+ ${categoryTitle.toLowerCase()} products with secure checkout, warranty support, and delivery across India.`,
        keywords: [category, "buy", "shop", "online", "north tech hub", "deals"],
        openGraph: {
            title,
            description: `Shop ${productCount}+ ${categoryTitle.toLowerCase()} products at North Tech Hub.`,
            type: "website",
            siteName: "North Tech Hub",
        },
        twitter: {
            card: "summary",
            title,
            description: `Shop ${productCount}+ ${categoryTitle.toLowerCase()} products at North Tech Hub.`,
        },
    };
}
