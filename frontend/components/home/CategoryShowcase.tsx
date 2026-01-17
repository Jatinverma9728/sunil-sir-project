"use client";

import Link from "next/link";

const categories = [
    { name: "Electronics", icon: "📱", color: "from-blue-500 to-cyan-500", link: "/products?category=electronics" },
    { name: "Clothing", icon: "👕", color: "from-purple-500 to-pink-500", link: "/products?category=clothing" },
    { name: "Books", icon: "📚", color: "from-amber-500 to-orange-500", link: "/products?category=books" },
    { name: "Home", icon: "🏠", color: "from-green-500 to-emerald-500", link: "/products?category=home" },
    { name: "Sports", icon: "⚽", color: "from-red-500 to-rose-500", link: "/products?category=sports" },
    { name: "Toys", icon: "🧸", color: "from-indigo-500 to-purple-500", link: "/products?category=toys" },
];

export default function CategoryShowcase() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Shop by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our wide range of products across different categories
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.link}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 aspect-square flex flex-col items-center justify-center text-center bg-white border-2 border-gray-100 hover:border-transparent">
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-5xl md:text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-white transition-colors">
                                        {category.name}
                                    </h3>
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
