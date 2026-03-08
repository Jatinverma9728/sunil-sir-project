import type { Metadata } from "next";

// All auth pages (login, register, forgot-password, reset-password, verify-email)
// should NEVER be indexed by search engines
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
