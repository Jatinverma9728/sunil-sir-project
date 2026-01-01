"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
    {
        name: "Gaming",
        icon: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&q=80",
        href: "/products?category=gaming",
    },
    {
        name: "Sport Equip",
        icon: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80",
        href: "/products?category=sports",
    },
    {
        name: "Kitchen",
        icon: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&q=80",
        href: "/products?category=kitchen",
    },
    {
        name: "Robot Cleaner",
        icon: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
        href: "/products?category=home",
    },
    {
        name: "Mobiles",
        icon: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
        href: "/products?category=electronics",
    },
    {
        name: "Office",
        icon: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&q=80",
        href: "/products?category=office",
    },
    {
        name: "Cameras",
        icon: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80",
        href: "/products?category=cameras",
    },
    {
        name: "Computers",
        icon: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&q=80",
        href: "/products?category=computers",
    },
    {
        name: "Televisions",
        icon: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
        href: "/products?category=televisions",
    },
    {
        name: "Audios",
        icon: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80",
        href: "/products?category=audio",
    },
];

export default function CategoryGrid() {
    return (
        <section className="bg-white py-6">
            <div className="max-w-[1600px] mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
                    <Link
                        href="/products"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                        View All
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.href}
                            className="flex flex-col items-center group"
                        >
                            {/* Circle Icon */}
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden group-hover:bg-gray-200 transition-colors">
                                <Image
                                    src={category.icon}
                                    alt={category.name}
                                    width={50}
                                    height={50}
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            {/* Category Name */}
                            <span className="text-sm font-medium text-gray-900 text-center">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
