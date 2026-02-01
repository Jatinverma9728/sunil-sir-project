"use client";

import { AdminAuthProvider } from "@/lib/context/AdminAuthContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthProvider>
            {children}
        </AdminAuthProvider>
    );
}
