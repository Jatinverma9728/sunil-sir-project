import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - How We Protect Your Data",
    description: "Read how North Tech Hub collects, uses, and protects customer data for electronics orders, course accounts, payments, and support.",
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
