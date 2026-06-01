import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";
const TITLE_SUFFIX = " | North Tech Hub";

type ProductRouteParams = Promise<{ id: string }>;

async function getProduct(id: string) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
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

function getImageUrls(product: any): string[] {
    return (product.images || [])
        .map((img: any) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean);
}

function productTitle(product: any): string {
    const productName = truncateText(cleanText(product.title), 60 - TITLE_SUFFIX.length);
    return `${productName}${TITLE_SUFFIX}`;
}

function productDescription(product: any): string {
    const title = truncateText(cleanText(product.title), 58);
    const detail = cleanText(product.description);
    const base = `Buy ${title} for Rs. ${product.price} from North Tech Hub. ${detail} Secure checkout, warranty support, and India delivery.`;
    return truncateText(base, 155);
}

export async function generateMetadata({ params }: { params: ProductRouteParams }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The product you're looking for doesn't exist.",
            robots: { index: false, follow: true },
        };
    }

    const imageUrl = getImageUrls(product)[0] || `${SITE_URL}/og-image.jpg`;
    const title = productTitle(product);
    const description = productDescription(product);

    return {
        title: { absolute: title },
        description,
        keywords: [
            `buy ${product.title}`,
            `${product.title} price India`,
            `${product.brand || ""} online India`.trim(),
            `${product.category} online India`,
            product.title,
            "North Tech Hub",
        ].filter(Boolean),
        alternates: {
            canonical: `/products/${id}`,
        },
        openGraph: {
            title,
            description,
            url: `/products/${id}`,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: cleanText(product.title),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: ProductRouteParams }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const imageUrls = getImageUrls(product);
    const ratingAverage = typeof product.rating === "object" ? product.rating.average : product.rating;
    const ratingCount = typeof product.rating === "object" ? product.rating.count : product.reviews;

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            sku: product.sku || product._id,
            brand: {
                "@type": "Brand",
                name: product.brand || "North Tech Hub",
            },
            image: imageUrls,
            category: product.category,
            offers: {
                "@type": "Offer",
                price: String(product.price),
                priceCurrency: "INR",
                availability:
                    product.stock > 0
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                seller: { "@type": "Organization", name: "North Tech Hub" },
                url: `${SITE_URL}/products/${id}`,
            },
            ...(ratingAverage && ratingCount > 0
                ? {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: ratingAverage,
                        reviewCount: ratingCount,
                        bestRating: 5,
                        worstRating: 1,
                    },
                }
                : {}),
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
                    name: "Products",
                    item: `${SITE_URL}/products`,
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: product.title,
                    item: `${SITE_URL}/products/${id}`,
                },
            ],
        },
    ];

    return (
        <>
            <script
                id="product-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient initialProduct={product} />
        </>
    );
}
