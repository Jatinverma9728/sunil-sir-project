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

export default function Home() {
  return (
    <div className="bg-gray-50">
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
