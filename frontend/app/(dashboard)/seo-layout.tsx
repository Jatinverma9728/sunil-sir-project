import type { Metadata } from "next";

// Dashboard, account, orders, admin — private pages that must NOT be indexed
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Read existing layout to avoid breaking it - wrap children
    return <>{children}</>;
}
