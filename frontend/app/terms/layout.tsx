import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - User Agreement",
    description: "Read North Tech Hub's Terms of Service. By using our platform to buy electronics or enroll in courses, you agree to these terms. Governed by Indian law.",
    alternates: {
        canonical: "/terms",
    },
    openGraph: {
        title: "Terms of Service | North Tech Hub",
        description: "North Tech Hub's Terms of Service for buying electronics and enrolling in online courses. Governed by Indian law.",
        url: "/terms",
        type: "website",
    },
    robots: {
        index: true,
        follow: false,
    },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
