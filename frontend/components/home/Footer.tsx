"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        products: [
            { name: "Shop All", href: "/products" },
            { name: "Electronics", href: "/products?category=electronics" },
            { name: "Clothing", href: "/products?category=clothing" },
            { name: "Special Offers", href: "/products?sale=true" },
        ],
        learning: [
            { name: "All Courses", href: "/courses" },
            { name: "Development", href: "/courses?category=programming" },
            { name: "Design", href: "/courses?category=design" },
            { name: "My Courses", href: "/my-courses" },
        ],
        support: [
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "FAQ", href: "/faq" },
            { name: "Shipping", href: "/shipping" },
        ],
    };

    return (
        <footer className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block group">
                            <h3 className="text-3xl font-semibold text-gray-900 mb-1 tracking-tight">
                                Flash<span className="text-gray-300 group-hover:text-gray-900 transition-colors">.</span>
                            </h3>
                        </Link>
                        <p className="text-gray-500 text-base leading-relaxed mt-5 max-w-sm">
                            Your premium destination for cutting-edge gadgets and transformative online courses.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-8">
                            {[
                                { name: "X", icon: "𝕏" },
                                { name: "In", icon: "in" },
                                { name: "Ig", icon: "◎" },
                                { name: "Li", icon: "▶" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-sm text-gray-400 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 hover:-translate-y-1"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Products Links */}
                    <div
                        onMouseEnter={() => setHoveredSection('products')}
                        onMouseLeave={() => setHoveredSection(null)}
                    >
                        <h4 className={`text-sm font-semibold uppercase tracking-[0.15em] mb-6 transition-colors duration-300 ${hoveredSection === 'products' ? 'text-gray-900' : 'text-gray-400'}`}>
                            Products
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.products.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-base text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-3"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Learning Links */}
                    <div
                        onMouseEnter={() => setHoveredSection('learning')}
                        onMouseLeave={() => setHoveredSection(null)}
                    >
                        <h4 className={`text-sm font-semibold uppercase tracking-[0.15em] mb-6 transition-colors duration-300 ${hoveredSection === 'learning' ? 'text-gray-900' : 'text-gray-400'}`}>
                            Learning
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.learning.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-base text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-3"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div
                        onMouseEnter={() => setHoveredSection('support')}
                        onMouseLeave={() => setHoveredSection(null)}
                    >
                        <h4 className={`text-sm font-semibold uppercase tracking-[0.15em] mb-6 transition-colors duration-300 ${hoveredSection === 'support' ? 'text-gray-900' : 'text-gray-400'}`}>
                            Support
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-base text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-3"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-10 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Flash. All rights reserved.
                        </p>

                        <div className="flex gap-8 text-sm">
                            {["Privacy", "Terms", "Cookies"].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="text-gray-400 hover:text-gray-900 transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
