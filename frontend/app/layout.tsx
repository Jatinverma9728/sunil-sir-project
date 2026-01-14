import type { Metadata } from "next";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import "../src/styles/globals.css";

export const metadata: Metadata = {
  title: "Flash - Premium E-Commerce & Courses",
  description: "Your destination for premium gadgets and online learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {/* Sticky Header Container */}
                <header className="sticky top-0 z-50 flex flex-col">
                  <AnnouncementBar />
                  <Navbar />
                </header>
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
