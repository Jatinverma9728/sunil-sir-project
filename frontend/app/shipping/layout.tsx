import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping & Delivery India",
    description: "Review North Tech Hub shipping options, delivery timelines, tracking support, and order handling for electronics across India.",
    alternates: {
        canonical: "/shipping",
    },
    openGraph: {
        title: "Shipping Information | North Tech Hub",
        description: "Shipping options at North Tech Hub: Free standard shipping, Express 2-3 day delivery, and Overnight service. Ship across India and worldwide.",
        url: "/shipping",
        type: "website",
    },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
