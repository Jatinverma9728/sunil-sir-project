import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - How We Protect Your Data",
    description: "Read North Tech Hub's Privacy Policy to understand how we collect, use, and protect your personal data. Compliant with the Digital Personal Data Protection Act, 2023.",
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy | North Tech Hub",
        description: "How North Tech Hub collects, uses, and protects your personal data. Compliant with India's Digital Personal Data Protection Act, 2023.",
        url: "/privacy",
        type: "website",
    },
    robots: {
        index: true,
        follow: false,
    },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
