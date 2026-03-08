import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Our Story & Mission",
    description: "Learn about North Tech Hub - India's platform for premium electronics and tech education. Discover our mission, values, and the passionate team behind the platform.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Us | North Tech Hub",
        description: "Learn about North Tech Hub - India's platform for premium electronics and tech education. Our mission: empowering your digital journey.",
        url: "/about",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "About Us | North Tech Hub",
        description: "Learn about the team and mission behind North Tech Hub, India's premier tech platform.",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
