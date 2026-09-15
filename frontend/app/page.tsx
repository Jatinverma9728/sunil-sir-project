import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import RefurbishedSection from "@/components/home/RefurbishedSection";
import IoTSection from "@/components/home/IoTSection";
import FlashSale from "@/components/home/FlashSale";
import CourseShowcase from "@/components/home/CourseShowcase";
import PromoBanners from "@/components/home/PromoBanners";
import BrandCarousel from "@/components/home/BrandCarousel";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

export const metadata: Metadata = {
  title: { absolute: "North Tech Hub: Refurbished Laptops, Tech & Online Courses India" },
  description: "India's trusted platform for 32-point certified refurbished laptops, computer accessories, and practical online tech courses. 6-12 months warranty.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "North Tech Hub: Refurbished Laptops, Tech & Online Courses India",
    description: "Shop certified refurbished laptops with 6-12M warranty, genuine computer accessories, and build career skills with hands-on tech courses.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "North Tech Hub: Electronics, Refurbished Laptops & Courses",
    description: "Certified refurbished laptops, tech accessories, and practical coding courses.",
  },
};

export default function Home() {
  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* JSON-LD Structured Data for the Home Page */}
      <script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "North Tech Hub",
          "url": SITE_URL,
          "logo": `${SITE_URL}/logo.png`,
          "sameAs": [
            "https://www.facebook.com/northtechhub",
            "https://www.instagram.com/northtechhub",
            "https://www.linkedin.com/company/northtechhub"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-93553-86007",
            "contactType": "Customer Support",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Nalka Chowk, 12 Quarter, Near Sector 1-4",
            "addressLocality": "Hisar",
            "addressRegion": "Haryana",
            "addressCountry": "IN"
          },
          "description": "Your premier destination for certified refurbished laptops, genuine computer accessories, and expert-led tech courses."
        })
      }} />
      <script id="website-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "North Tech Hub",
          "url": SITE_URL,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${SITE_URL}/products?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })
      }} />

      {/* 1. Hero Showcase with High-Impact Hardware Photography */}
      <HeroBanner />

      {/* 2. Circular Department & Category Tiles (Robocraze Style) */}
      <CategoryGrid />

      {/* 4. Certified Refurbished Laptops (ThinkPad, Dell Latitude, HP EliteBook, MacBook) */}
      <RefurbishedSection />

      {/* 5. Robotics, IoT & Embedded Hardware (Raspberry Pi, Arduino, 3D Printers) */}
      <IoTSection />

      {/* 6. Flash Clearance Deals with Live Countdown */}
      <FlashSale />

      {/* 7. Practical Online Tech & Career Courses */}
      <CourseShowcase />

      {/* 8. Editorial Performance Upgrade Combos & Career Pass */}
      <PromoBanners />

      {/* 9. Official Brand Showcase (Intel, Lenovo, Dell, Arduino, Raspberry Pi) */}
      <BrandCarousel />

      {/* 10. Verified Customer Testimonials */}
      <Testimonials />

      {/* 11. VIP Tech Club & Discount Voucher */}
      <Newsletter />
    </div>
  );
}
