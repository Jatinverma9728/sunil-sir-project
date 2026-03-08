import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Contact Us - Get Support",
    description: "Get in touch with North Tech Hub. Contact our support team for help with orders, returns, product queries, or business partnerships. Available 24/7.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us | North Tech Hub",
        description: "Get in touch with North Tech Hub. Contact our support team for help with orders, returns, and more.",
        url: "/contact",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Contact Us | North Tech Hub",
        description: "Reach out to North Tech Hub's support team. We're here to help.",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://northtechhub.in";

    return (
        <>
            <Script id="contact-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "North Tech Hub",
                    "url": siteUrl,
                    "telephone": "+91 9876543210",
                    "email": "support@northtechhub.in",
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "IN"
                    },
                    "openingHours": "Mo-Su 09:00-21:00",
                    "priceRange": "₹₹",
                    "description": "North Tech Hub is India's premier platform for genuine electronics and expert-led tech courses.",
                    "sameAs": [
                        "https://www.facebook.com/northtechhub",
                        "https://www.instagram.com/northtechhub"
                    ]
                })
            }} />
            {children}
        </>
    );
}
