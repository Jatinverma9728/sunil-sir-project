import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Online Tech Courses in India - Learn Programming & Development",
    description: "Enroll in expert-led online tech courses in India. Learn Python, JavaScript, web development, data science & more. Affordable prices, lifetime access, and certificates.",
    keywords: [
        "online courses India",
        "tech courses India",
        "programming courses",
        "learn Python online",
        "JavaScript course India",
        "web development course",
        "data science course",
        "online learning India",
        "coding bootcamp India",
        "affordable tech courses"
    ],
    alternates: {
        canonical: "/courses",
    },
    openGraph: {
        title: "Online Tech Courses in India | North Tech Hub",
        description: "Enroll in expert-led online tech courses. Learn Python, JavaScript, web development & more. Lifetime access with certificate.",
        url: "/courses",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Online Tech Courses | North Tech Hub",
        description: "Expert-led online courses in Python, JavaScript, web development & more. Affordable. Certificate included.",
    },
};

const siteUrl = "https://northtechhub.in";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script id="courses-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
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
                            "name": "Courses",
                            "item": `${siteUrl}/courses`
                        }
                    ]
                })
            }} />
            {children}
        </>
    );
}
