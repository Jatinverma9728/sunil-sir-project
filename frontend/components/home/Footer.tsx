"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
    const [email, setEmail] = useState("");
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        shop: [
            { name: "Electronics", href: "/products?category=electronics" },
            { name: "Laptops & Computers", href: "/products?category=laptops" },
            { name: "Smartphones", href: "/products?category=smartphones" },
            { name: "Flash Sales", href: "/products?sale=true" },
        ],
        learn: [
            { name: "Web Development", href: "/courses?cat=web-dev" },
            { name: "Data Science", href: "/courses?cat=data-science" },
            { name: "UI/UX Design", href: "/courses?cat=design" },
            { name: "Mobile Apps", href: "/courses?cat=mobile" },
        ],
        company: [
            { name: "Our Story", href: "/story" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" },
        ],
        support: [
            { name: "FAQ", href: "/faq" },
            { name: "Help Center", href: "/help" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms & Conditions", href: "/terms" },
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <footer className="bg-[#030303] text-white relative overflow-hidden font-sans selection:bg-[#C1FF72] selection:text-black border-t border-white/5">
            {/* Animated Background Marquee */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-[0.04] pointer-events-none select-none overflow-hidden">
                <motion.div
                    className="whitespace-nowrap font-black text-[20vw] leading-none text-white tracking-tighter"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 50,
                        ease: "linear"
                    }}
                >
                    NORTH TECH HUB  NORTH TECH HUB  NORTH TECH HUB
                </motion.div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C1FF72]/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12 relative z-10">

                {/* Top Section: CTA & Newsletter */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24 pb-12 border-b border-white/5"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-outfit tracking-tight text-white !text-white mb-6">
                            Constructing the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-[#C1FF72]">digital future.</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium max-w-lg">
                            Join our community of 50,000+ engineers and creators. Get early access to drops and courses.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto min-w-[350px]">
                        <form onSubmit={(e) => e.preventDefault()} className="relative group">
                            <motion.div
                                className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-[#C1FF72] rounded-2xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"
                            />
                            <div className="relative flex items-center bg-[#0A0A0A] rounded-2xl border border-white/10 p-1.5 transition-colors group-focus-within:border-white/20">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent border-none px-4 py-3 text-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-0 font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-black font-bold rounded-xl px-6 py-3 transition-colors hover:bg-[#C1FF72]"
                                >
                                    Join
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Grid Links Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24"
                >
                    {/* Brand Card */}
                    <motion.div variants={itemVariants} className="md:col-span-5 lg:col-span-4 space-y-8">
                        <Link href="/" onClick={scrollToTop} className="inline-flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:rotate-6">
                                N
                            </div>
                            <span className="text-2xl font-bold font-outfit text-white tracking-tight group-hover:text-[#C1FF72] transition-colors">North Tech Hub.</span>
                        </Link>
                        <p className="text-gray-500 text-base leading-relaxed font-medium">
                            Premium electronics and expert-led courses. Designed for those who refuse to settle for average.
                        </p>

                        <div className="flex gap-4">
                            {['Twitter', 'Instagram', 'LinkedIn'].map((social, i) => (
                                <motion.a
                                    key={social}
                                    href={social === 'Twitter' ? 'https://twitter.com' : social === 'Instagram' ? 'https://instagram.com' : 'https://linkedin.com/company/northtechhub'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, backgroundColor: "#ffffff", color: "#000000" }}
                                    className="w-12 h-12 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-gray-400 transition-colors"
                                >
                                    <span className="sr-only">{social}</span>
                                    {/* Simple Icon Placeholders */}
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        {i === 0 && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
                                        {i === 1 && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                        {i === 2 && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                                    </svg>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div variants={itemVariants} className="md:col-span-7 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { title: "Shop", links: footerLinks.shop, color: "text-[#C1FF72]" },
                            { title: "Learn", links: footerLinks.learn, color: "text-indigo-400" },
                            { title: "Company", links: footerLinks.company, color: "text-purple-400" },
                            { title: "Support", links: footerLinks.support, color: "text-pink-400" },
                        ].map((section) => (
                            <div key={section.title}>
                                <h3 className={`font-mono text-sm uppercase mb-6 tracking-wider font-bold !text-white`}>{section.title}</h3>
                                <ul className="space-y-4">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="group flex items-center gap-2">
                                                <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{link.name}</span>
                                                <motion.span
                                                    initial={{ opacity: 0, x: -5 }}
                                                    whileHover={{ opacity: 1, x: 0 }}
                                                    className={`text-xs ${section.color}`}
                                                >
                                                    ●
                                                </motion.span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5"
                >
                    <p className="text-gray-600 text-sm font-medium">© {currentYear} North Tech Hub. Crafted for the future.</p>

                    <div className="flex items-center gap-6">
                        {/* Premium Averiq Badge */}
                        <motion.a
                            href="https://northtechhub.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Powered by</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#C1FF72] shadow-[0_0_8px_#C1FF72] animate-pulse"></span>
                                <img
                                    src="/averiq.png"
                                    alt="Averiq"
                                    className="h-7 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all"
                                />
                            </div>
                        </motion.a>

                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#C1FF72] transition-colors shadow-lg shadow-white/10"
                            aria-label="Back to Top"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
