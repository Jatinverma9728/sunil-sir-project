"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
    {
        name: "Gaming",
        icon: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&q=80",
        href: "/products?category=gaming",
        color: "bg-purple-50",
    },
    {
        name: "Sports",
        icon: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80",
        href: "/products?category=sports",
        color: "bg-blue-50",
    },
    {
        name: "Kitchen",
        icon: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&q=80",
        href: "/products?category=kitchen",
        color: "bg-orange-50",
    },
    {
        name: "Home",
        icon: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
        href: "/products?category=home",
        color: "bg-teal-50",
    },
    {
        name: "Mobiles",
        icon: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
        href: "/products?category=electronics",
        color: "bg-indigo-50",
    },
    {
        name: "Office",
        icon: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&q=80",
        href: "/products?category=office",
        color: "bg-gray-50",
    },
    {
        name: "Cameras",
        icon: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80",
        href: "/products?category=cameras",
        color: "bg-pink-50",
    },
    {
        name: "Computers",
        icon: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&q=80",
        href: "/products?category=computers",
        color: "bg-cyan-50",
    },
    {
        name: "TV & Audio",
        icon: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
        href: "/products?category=televisions",
        color: "bg-yellow-50",
    },
    {
        name: "More",
        icon: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80",
        href: "/products",
        color: "bg-green-50",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-8 md:py-12">
            <div className="max-w-[1600px] mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
                    <Link
                        href="/products"
                        className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-5 lg:grid-cols-10 md:gap-6 md:mx-0 md:px-0 md:pb-0">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.href}
                            className="flex-shrink-0 flex flex-col items-center group mr-6 md:mr-0"
                        >
                            {/* Circle Icon */}
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${category.color} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden border border-white`}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black" />
                                <Image
                                    src={category.icon}
                                    alt={category.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-12 h-12 md:w-14 md:h-14 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            </div>

                            {/* Category Name */}
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors text-center whitespace-nowrap">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
