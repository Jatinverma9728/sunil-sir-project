import type { Metadata } from "next";
import Script from "next/script";
import ProductDetailClient from "./product-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://northtechhub.in";

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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = await getProduct(params.id);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The product you're looking for doesn't exist.",
        };
    }

    const imageUrl = product.images?.[0]
        ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0].url
        : `${SITE_URL}/og-image.jpg`;

    const rating =
        typeof product.rating === "object"
            ? product.rating.average
            : product.rating || 0;

    return {
        title: `${product.title} - Buy Online at Best Price`,
        description: `Buy ${product.title} at ₹${product.price} on North Tech Hub. ${product.description?.substring(0, 130)}... Genuine product with warranty. Free shipping available.`,
        keywords: [
            `buy ${product.title}`,
            `${product.title} price India`,
            `${product.brand || ""} online India`.trim(),
            `${product.category} online India`,
            product.title,
            "North Tech Hub",
        ].filter(Boolean),
        alternates: {
            canonical: `/products/${params.id}`,
        },
        openGraph: {
            title: `${product.title} | North Tech Hub`,
            description: `${product.title} at ₹${product.price}. ${product.description?.substring(0, 150)}`,
            url: `/products/${params.id}`,
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.title} | North Tech Hub`,
            description: `Buy ${product.title} at ₹${product.price}. ${product.description?.substring(0, 120)}`,
            images: [imageUrl],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    const jsonLd = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            sku: product.sku || product._id,
            brand: product.brand
                ? { "@type": "Brand", name: product.brand }
                : undefined,
            image: product.images?.map((img: any) =>
                typeof img === "string" ? img : img.url
            ),
            offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "INR",
                availability:
                    product.stock > 0
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                seller: { "@type": "Organization", name: "North Tech Hub" },
                url: `${SITE_URL}/products/${params.id}`,
            },
            aggregateRating:
                product.rating && product.rating.count > 0
                    ? {
                        "@type": "AggregateRating",
                        ratingValue:
                            typeof product.rating === "object"
                                ? product.rating.average
                                : product.rating,
                        reviewCount:
                            typeof product.rating === "object"
                                ? product.rating.count
                                : product.reviews || 0,
                    }
                    : undefined,
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
                        name: "Products",
                        item: `${SITE_URL}/products`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: product.title,
                        item: `${SITE_URL}/products/${params.id}`,
                    },
                ],
            },
        }
        : null;

    return (
        <>
            {jsonLd && (
                <Script
                    id="product-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductDetailClient />
        </>
    );
}
