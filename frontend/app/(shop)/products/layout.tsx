import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Electronics & Tech Gadgets India",
    description: "Shop genuine electronics, smartphones, headphones, laptops, and tech gadgets in India with secure checkout and warranty support.",
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script id="products-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
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
