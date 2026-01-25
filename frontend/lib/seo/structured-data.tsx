/**
 * Generate JSON-LD structured data for products
 * Helps search engines understand product information
 */
export function generateProductSchema(product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: Array<{ url: string; alt?: string }>;
    category: string;
    brand?: string;
    rating?: { average: number; count: number };
    stock: number;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.images.map((img) => img.url),
        brand: {
            "@type": "Brand",
            name: product.brand || "North Tech Hub",
        },
        offers: {
            "@type": "Offer",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product._id}`,
            priceCurrency: "USD",
            price: product.price,
            priceValidUntil: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days
            availability:
                product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
        },
        ...(product.rating &&
            product.rating.count > 0 && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating.average,
                reviewCount: product.rating.count,
                bestRating: 5,
                worstRating: 1,
            },
        }),
        category: product.category,
    };
}

/**
 * Generate JSON-LD structured data for courses
 */
export function generateCourseSchema(course: {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    instructor: { name: string; avatar?: string };
    level?: string;
    duration?: number;
    enrolledStudents?: number;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: {
            "@type": "Organization",
            name: "North Tech Hub Learn",
            sameAs: process.env.NEXT_PUBLIC_SITE_URL,
        },
        instructor: {
            "@type": "Person",
            name: course.instructor.name,
            ...(course.instructor.avatar && { image: course.instructor.avatar }),
        },
        ...(course.thumbnail && { image: course.thumbnail }),
        ...(course.level && { courseLevel: course.level }),
        ...(course.duration && {
            timeRequired: `PT${Math.floor(course.duration / 60)}H${course.duration % 60}M`,
        }),
        offers: {
            "@type": "Offer",
            price: course.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
    };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
        })),
    };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "North Tech Hub",
        description: "Your destination for premium gadgets and online learning",
        url: process.env.NEXT_PUBLIC_SITE_URL,
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "support@flash.com",
        },
        sameAs: [
            "https://twitter.com/flash",
            "https://facebook.com/flash",
            "https://instagram.com/flash",
        ],
    };
}

/**
 * Component to inject JSON-LD script into page
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
