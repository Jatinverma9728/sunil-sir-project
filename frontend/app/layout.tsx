import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { OffersProvider } from "@/lib/hooks/useOffers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PageTransition from "@/components/ui/PageTransition";
import "../src/styles/globals.css";

// Playful Tech Fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "North Tech Hub - Premium E-Commerce & Courses",
  description: "Your destination for premium gadgets and online learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <OffersProvider>
                  {/* Sticky Header Container */}
                  <header className="sticky top-0 z-50 flex flex-col">
                    <AnnouncementBar />
                    <Navbar />
                  </header>
                  <main className="flex-grow">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </OffersProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
