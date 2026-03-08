import type { Metadata } from "next";

// Cart page: noindex — transient user state, no value to index
export const metadata: Metadata = {
    title: "Your Shopping Cart",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
