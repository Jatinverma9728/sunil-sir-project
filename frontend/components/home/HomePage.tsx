"use client";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import EnhancedHero from "@/components/home/EnhancedHero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustBadges from "@/components/home/TrustBadges";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Announcement Bar */}
            <AnnouncementBar />

            {/* Hero Section */}
            <EnhancedHero />

            {/* Category Showcase */}
            <CategoryShowcase />

            {/* Featured/Trending Products */}
            <FeaturedProducts />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Updated with Flash
                        </h2>
                        <p className="text-gray-300 mb-8">
                            Subscribe to our newsletter and get exclusive deals, new arrivals, and special offers delivered to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-6 py-4 rounded-full bg-white text-gray-900 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-[#C1FF72]"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-[#C1FF72] text-gray-900 font-bold rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-sm text-gray-400 mt-4">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
