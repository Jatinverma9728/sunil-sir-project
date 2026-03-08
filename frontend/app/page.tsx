"use client";

import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FlashSale from "@/components/home/FlashSale";
import FeaturedSection from "@/components/home/FeaturedSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import PromoBanners from "@/components/home/PromoBanners";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import CourseShowcase from "@/components/home/CourseShowcase";
import Script from "next/script";

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* JSON-LD Structured Data for the Home Page */}
      <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "North Tech Hub",
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in',
          "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in'}/logo.png`,
          "sameAs": [
            "https://www.facebook.com/northtechhub",
            "https://www.instagram.com/northtechhub",
            "https://www.linkedin.com/company/northtechhub"
          ],
          "description": "Your premier destination for high-quality electronics, gadgets, and expert-led online courses in technology and development."
        })
      }} />
      <Script id="website-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "North Tech Hub",
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in',
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in'}/products?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })
      }} />

      {/* Hero Banner - Modern E-commerce Style */}
      <HeroBanner />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Featured Section */}
      <FeaturedSection />

      {/* Featured Products - Only shows products marked as featured in admin */}
      <div className="bg-white">
        <ProductCarousel
          title="Featured Products"
          subtitle="Handpicked just for you"
          limit={12}
          featuredOnly={true}
        />
      </div>

      {/* Promo Banners */}
      <PromoBanners />

      {/* Trending Products */}
      <div className="bg-white">
        <ProductCarousel
          title="Trending Now"
          subtitle="What's hot this week"
          category="electronics"
          limit={8}
        />
      </div>

      {/* New Arrivals */}
      <div className="bg-white">
        <ProductCarousel
          title="New Arrivals"
          subtitle="Just added to our store"
          limit={8}
        />
      </div>

      {/* Courses Showcase */}
      <CourseShowcase />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
