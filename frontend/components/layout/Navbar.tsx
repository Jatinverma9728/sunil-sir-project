"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();
    const { items } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Shop" },
        { href: "/courses", label: "Courses" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            setSearchOpen(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const handlePopularSearch = (term: string) => {
        setSearchOpen(false);
        router.push(`/products?search=${encodeURIComponent(term)}`);
    };

    return (
        <>
            {/* Main Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-lg shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16 gap-4">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-xl font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-colors flex items-center gap-1"
                        >
                            <span className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                N
                            </span>
                            <span className="hidden sm:inline">flash<span className="text-[#C1FF72]">.</span></span>
                        </Link>

                        {/* Desktop Search Bar - Pill Style */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
                            <div className="pill-search w-full">
                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 text-sm bg-transparent border-none outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shrink-0"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${pathname === link.href
                                        ? "text-gray-900"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-1">
                            {/* Mobile Search */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="md:hidden p-2 hover:bg-white/50 rounded-full transition"
                                aria-label="Search"
                            >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Cart */}
                            <Link href="/cart" className="p-2 hover:bg-white/50 rounded-full transition relative" aria-label="Cart">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold">
                                        {cartItemCount > 9 ? "9+" : cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Wishlist */}
                            <Link href="/account" className="hidden sm:flex p-2 hover:bg-white/50 rounded-full transition" aria-label="Wishlist">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>

                            {/* User Menu */}
                            {isAuthenticated ? (
                                <div className="hidden md:flex items-center gap-2">
                                    {user?.role === "admin" && (
                                        <Link href="/admin" className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
                                            Admin
                                        </Link>
                                    )}
                                    <Link href="/profile" className="flex items-center gap-2 px-1 py-1 rounded-full hover:bg-white/50 transition">
                                        <span className="text-sm font-medium text-gray-700 hidden xl:inline">{user?.name || "Account"}</span>
                                        <div className="w-8 h-8 bg-[#C1FF72] rounded-full flex items-center justify-center text-sm font-bold text-gray-900 ring-2 ring-white">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    </Link>
                                </div>
                            ) : (
                                <Link href="/login" className="hidden md:flex btn-dark text-sm py-2 px-4">
                                    Sign In
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 hover:bg-white/50 rounded-full transition"
                                aria-label="Menu"
                            >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer */}
            <div className="h-16" />

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                <div className={`absolute top-16 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${pathname === link.href ? "bg-[#C1FF72] text-gray-900" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-gray-200 my-4" />
                        {isAuthenticated ? (
                            <>
                                <Link href="/my-courses" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">📚 My Courses</Link>
                                <Link href="/orders" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">📋 My Orders</Link>
                                {user?.role === "admin" && (
                                    <Link href="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50">⚙️ Admin</Link>
                                )}
                                <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">🚪 Logout</button>
                            </>
                        ) : (
                            <Link href="/login" className="block px-4 py-3 rounded-xl text-center text-sm font-semibold bg-[#C1FF72] text-gray-900">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <div className={`fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 transition-all duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
                <div className={`relative bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl transition-transform ${searchOpen ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSearch} className="flex items-center gap-4 mb-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products, courses..."
                            className="flex-1 text-lg outline-none"
                            autoFocus
                        />
                        <button type="submit" className="px-4 py-2 bg-[#C1FF72] text-gray-900 font-semibold rounded-lg hover:bg-[#b3f063] transition">Search</button>
                        <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Popular:</span>{" "}
                            {["Headphones", "Laptops", "Watches", "Courses"].map((term, i) => (
                                <button key={term} onClick={() => handlePopularSearch(term)} className="hover:text-gray-900 hover:underline">
                                    {term}{i < 3 ? ", " : ""}
                                </button>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
