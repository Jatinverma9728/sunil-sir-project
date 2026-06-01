import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import RefurbishedSection from "@/components/home/RefurbishedSection";
import FlashSale from "@/components/home/FlashSale";
import FeaturedSection from "@/components/home/FeaturedSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import PromoBanners from "@/components/home/PromoBanners";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import CourseShowcase from "@/components/home/CourseShowcase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";
const LAST_REVIEWED = "2026-06-01";
const LAST_REVIEWED_LABEL = "June 1, 2026";

export const metadata: Metadata = {
  title: { absolute: "North Tech Hub: Electronics & Tech Courses India" },
  description: "Shop genuine electronics and refurbished laptops in India, and learn coding with practical courses. Browse North Tech Hub deals today.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "North Tech Hub: Electronics & Tech Courses India",
    description: "Buy electronics, refurbished laptops, accessories, and practical tech courses from North Tech Hub in India.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "North Tech Hub: Electronics & Courses",
    description: "Shop electronics and learn coding with North Tech Hub.",
  },
};

export default function Home() {
  return (
    <div className="bg-gray-50">
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
          "description": "Your premier destination for high-quality electronics, gadgets, and expert-led online courses in technology and development."
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
            "target": `${SITE_URL}/products?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })
      }} />
      <script id="homepage-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "North Tech Hub: Electronics & Tech Courses India",
          "url": SITE_URL,
          "description": "Shop genuine electronics and refurbished laptops in India, and learn coding with practical courses from North Tech Hub.",
          "datePublished": "2025-12-22",
          "dateModified": LAST_REVIEWED,
          "author": {
            "@type": "Organization",
            "name": "North Tech Hub"
          },
          "reviewedBy": {
            "@type": "Organization",
            "name": "North Tech Hub product and learning team"
          },
          "isPartOf": {
            "@type": "WebSite",
            "name": "North Tech Hub",
            "url": SITE_URL
          }
        })
      }} />

      {/* Hero Banner - Modern E-commerce Style */}
      <HeroBanner />

      <section className="bg-white py-10 sm:py-12" aria-labelledby="homepage-intro-heading">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-[var(--primary-electric)]">
                  Electronics + learning
                </span>
                <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                  India support
                </span>
              </div>
              <h1 id="homepage-intro-heading" className="text-3xl font-bold leading-tight text-gray-950 md:text-4xl">
                North Tech Hub brings practical tech shopping and skill building together.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
                Shop genuine electronics, refurbished laptops, computer accessories, IoT kits, Arduino parts, drone kits, and developer tools. Then build stronger skills with practical courses in coding, web development, design, data, and mobile apps.
              </p>
              <p className="mt-3 text-sm font-medium text-gray-500">
                Reviewed by the North Tech Hub product and learning team. Updated {LAST_REVIEWED_LABEL}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  title: "Compare useful products",
                  text: "Browse by category, price, stock, rating, and practical use case.",
                  tone: "border-blue-100 bg-blue-50/70",
                },
                {
                  title: "Learn project skills",
                  text: "Find courses with clear pricing, lesson details, and instructor context.",
                  tone: "border-emerald-100 bg-emerald-50/70",
                },
                {
                  title: "Get buying help",
                  text: "Use secure checkout, warranty guidance, delivery support, and WhatsApp assistance.",
                  tone: "border-slate-200 bg-slate-50",
                },
              ].map((item) => (
                <article key={item.title} className={`rounded-lg border p-4 ${item.tone}`}>
                  <h2 className="text-base font-bold text-gray-950">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Refurbished Laptops and Accessories */}
      <RefurbishedSection />

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
