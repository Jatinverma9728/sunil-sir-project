import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Information - Fast Delivery Across India",
    description: "Learn about North Tech Hub's shipping options: Standard (free), Express (2-3 days), and Overnight delivery. Track your order and get fast, reliable delivery.",
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
