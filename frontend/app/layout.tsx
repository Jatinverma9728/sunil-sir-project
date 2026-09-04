import type { Metadata } from "next";
import { Montserrat, Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { OffersProvider } from "@/lib/hooks/useOffers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import "../src/styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

// Robocraze Signature Font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "North Tech Hub: Electronics & Tech Courses India",
    template: "%s | North Tech Hub"
  },
  description: "Shop genuine electronics and refurbished laptops in India, and learn coding with practical courses. Browse North Tech Hub deals today.",
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
  authors: [{ name: "North Tech Hub", url: SITE_URL }],
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
    title: "North Tech Hub: Electronics & Tech Courses India",
    description: "Shop genuine electronics and refurbished laptops in India, and learn coding with practical courses from North Tech Hub.",
    url: "/",
    siteName: "North Tech Hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "North Tech Hub electronics and tech courses in India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "North Tech Hub: Electronics & Courses",
    description: "Buy genuine electronics and refurbished laptops, then learn practical coding skills with North Tech Hub.",
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
    <html lang="en-IN" className={`${montserrat.variable} ${inter.variable} ${outfit.variable}`}>
      <body className={`${montserrat.className} antialiased min-h-screen flex flex-col font-sans`}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <OffersProvider>
                  {/* Announcement Bar scrolls away naturally */}
                  <AnnouncementBar />

                  {/* Sticky Navigation Header */}
                  <header className="sticky top-0 z-50 flex flex-col bg-white shadow-xs">
                    <Navbar />
                  </header>
                  <main className="flex-grow">
                    {children}
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
