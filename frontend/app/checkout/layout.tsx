import type { Metadata } from "next";

// Cart and checkout pages must NOT be indexed
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
