import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";

export const metadata: Metadata = {
    title: "North tech hub",
    description: "Modern e-commerce and online course platform built with Next.js",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <AuthProvider>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
