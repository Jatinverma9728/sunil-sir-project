import type { Metadata } from "next";

/**
 * Generate product-specific metadata for SEO
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

    return {
        title: `${product.title} | Flash Shop`,
        description: product.description.substring(0, 160), // Google preview is ~160 chars
        keywords: [
            product.title,
            product.category,
            "buy online",
            "flash shop",
            "electronics",
            "gadgets",
        ],
        openGraph: {
            title: product.title,
            description: product.description,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
            siteName: "Flash Shop",
        },
        twitter: {
            card: "summary_large_image",
            title: product.title,
            description: product.description.substring(0, 200),
            images: [imageUrl],
        },
        other: {
            "product:price:amount": product.price.toString(),
            "product:price:currency": "USD",
            "product:availability": "in stock",
            "product:rating": rating.toString(),
            "product:rating:count": reviewCount.toString(),
        },
    };
}

/**
 * Generate course-specific metadata for SEO
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

    return {
        title: `${course.title} - Online Course | Flash Learn`,
        description: course.description.substring(0, 160),
        keywords: [
            course.title,
            "online course",
            "learn",
            course.instructor.name,
            course.level || "all levels",
            "flash learn",
        ],
        openGraph: {
            title: course.title,
            description: course.description,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: course.title,
                },
            ],
            siteName: "Flash Learn",
        },
        twitter: {
            card: "summary_large_image",
            title: course.title,
            description: course.description.substring(0, 200),
            images: [imageUrl],
        },
    };
}

/**
 * Generate category page metadata
 */
export function generateCategoryMetadata(
    category: string,
    productCount: number
): Metadata {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${categoryTitle} - Shop ${productCount}+ Products | Flash`,
        description: `Browse ${productCount}+ ${categoryTitle.toLowerCase()} products. Find the best deals on electronics, gadgets, and more. Free shipping on orders over $50.`,
        keywords: [category, "buy", "shop", "online", "flash", "deals"],
        openGraph: {
            title: `${categoryTitle} Products`,
            description: `Shop ${productCount}+ ${categoryTitle.toLowerCase()} products`,
            type: "website",
            siteName: "Flash",
        },
        twitter: {
            card: "summary",
            title: `${categoryTitle} Products`,
            description: `Shop ${productCount}+ products`,
        },
    };
}
