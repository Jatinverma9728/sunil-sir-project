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
import "../src/styles/premium-polish.css";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in'),
  title: {
    default: "North Tech Hub - Buy Electronics & Learn Tech Online in India",
    template: "%s | North Tech Hub"
  },
  description: "North Tech Hub is India's premier platform to buy genuine electronics, gadgets & accessories online. Enroll in expert-led coding, programming & tech courses at affordable prices. Free delivery available.",
  keywords: [
    "buy electronics online India",
    "tech gadgets online",
    "online tech courses India",
    "learn programming online",
    "best electronics store India",
    "online coding courses",
    "buy smartphones India",
    "North Tech Hub",
    "northtechhub.in",
    "tech education India",
    "buy headphones online",
    "web development course",
    "Python course India",
    "JavaScript course",
    "electronics shop India",
    "genuine electronics India",
    "best online learning platform India",
    "affordable tech courses",
    "e-learning platform India",
    "developer tools online"
  ],
  authors: [{ name: "North Tech Hub", url: "https://northtechhub.in" }],
  creator: "North Tech Hub",
  publisher: "North Tech Hub",
  category: "Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "North Tech Hub - Buy Electronics & Learn Tech Online in India",
    description: "North Tech Hub is India's premier platform to buy genuine electronics, gadgets & accessories online. Enroll in expert-led coding, programming & tech courses at affordable prices.",
    url: "/",
    siteName: "North Tech Hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "North Tech Hub - Buy Electronics & Learn Tech Online in India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "North Tech Hub - Buy Electronics & Learn Tech Online in India",
    description: "India's premier platform to buy genuine electronics & enroll in expert-led tech courses. Free delivery. Affordable prices.",
    images: ["/og-image.jpg"],
    creator: "@northtechhub",
    site: "@northtechhub",
  },
  verification: {
    google: "7-4VbfmDLvUFQPoat9HrYsB5gmLumofe21Jk4aejiR0",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    // Geo-targeting signals for India
    'geo.region': 'IN',
    'geo.placename': 'India',
    'content-language': 'en-IN',
    // Dublin Core metadata for better classification
    'DC.language': 'en-IN',
    'DC.coverage': 'India',
    // Additional categorization
    'classification': 'E-commerce, Education, Technology',
    'target': 'all',
    'HandheldFriendly': 'True',
    'MobileOptimized': '320',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${outfit.variable}`}>
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
