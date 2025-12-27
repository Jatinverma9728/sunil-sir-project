"use client";

import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import PromoBanners from "@/components/home/PromoBanners";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import CourseShowcase from "@/components/home/CourseShowcase";

export default function Home() {
  return (
    <>
      {/* Hero Section - Mint Green Background (100vh) */}
      <HeroBanner />

      {/* Rest of page - White Background */}
      <div className="bg-white">
        {/* Category Grid */}
        <CategoryGrid />

        {/* Featured Products - Only shows products marked as featured in admin */}
        <ProductCarousel
          title="Featured Products"
          subtitle="Handpicked just for you"
          limit={12}
          featuredOnly={true}
        />

        {/* Promo Banners */}
        <PromoBanners />

        {/* Trending Products */}
        <ProductCarousel
          title="Trending Now"
          subtitle="What's hot this week"
          category="electronics"
          limit={8}
        />

        {/* New Arrivals */}
        <ProductCarousel
          title="New Arrivals"
          subtitle="Just added to our store"
          limit={8}
        />

        {/* Courses Showcase */}
        <CourseShowcase />

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />
      </div>
    </>
  );
}
