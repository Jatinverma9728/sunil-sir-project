import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { OffersProvider } from "@/lib/hooks/useOffers";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";

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
                    <CartProvider>
                        <WishlistProvider>
                            <OffersProvider>
                                <div className="fixed top-0 w-full z-50">
                                    <AnnouncementBar />
                                    <Navbar />
                                </div>
                                <main className="min-h-screen pt-[var(--header-height,64px)]">
                                    {children}
                                </main>
                                {/* <Footer /> */}
                            </OffersProvider>
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
