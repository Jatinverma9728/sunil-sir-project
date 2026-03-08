import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Buy Electronics & Tech Gadgets Online in India",
    description: "Shop genuine electronics, smartphones, headphones, laptops, and tech gadgets at the best prices in India. Free shipping available. Authentic products with manufacturer warranty.",
    keywords: [
        "buy electronics India",
        "electronics online shopping",
        "smartphones India",
        "headphones online",
        "laptops online India",
        "tech gadgets India",
        "genuine electronics",
        "online electronics store"
    ],
    alternates: {
        canonical: "/products",
    },
    openGraph: {
        title: "Buy Electronics & Tech Gadgets Online | North Tech Hub",
        description: "Shop genuine electronics at the best prices in India. Free shipping. Authentic products with manufacturer warranty.",
        url: "/products",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy Electronics Online | North Tech Hub",
        description: "Shop genuine electronics, smartphones, headphones & more at the best prices in India.",
    },
};

const siteUrl = "https://northtechhub.in";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script id="products-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": siteUrl
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Products",
                            "item": `${siteUrl}/products`
                        }
                    ]
                })
            }} />
            {children}
        </>
    );
}
