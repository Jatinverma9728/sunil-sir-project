"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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

    // Smart Scroll State
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Shop" },
        { href: "/courses", label: "Courses" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Smart Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolled (for background style)
            setIsScrolled(currentScrollY > 10);

            // Determine visibility (hide on scroll down, show on scroll up)
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Scrolling DOWN
            } else {
                setIsVisible(true); // Scrolling UP
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

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
                className={`w-full z-40 transition-all duration-300 transform ${isVisible ? "translate-y-0" : "-translate-y-full"
                    } ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-colors flex items-center gap-2"
                        >
                            <span className="w-8 h-8 lg:w-9 lg:h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-gray-200">
                                N
                            </span>
                            <span className="hidden sm:inline">North Tech Hub<span className="text-[#C1FF72]">.</span></span>
                        </Link>

                        {/* Desktop Search Bar - Pill Style */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8 group">
                            <div className={`flex items-center w-full px-4 py-2.5 rounded-full transition-all duration-200 ${isScrolled ? "bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100" : "bg-white/80 focus-within:bg-white shadow-sm"
                                }`}>
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search for anything..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 ml-3 text-sm bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-black transition-transform active:scale-95 shrink-0"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${pathname === link.href
                                        ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Wishlist (Desktop) */}
                            <Link href="/account" className="hidden sm:flex p-2.5 hover:bg-gray-100 rounded-full transition-colors group" title="Wishlist">
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="p-2.5 hover:bg-gray-100 rounded-full transition-all relative group" title="Cart">
                                <svg className="w-6 h-6 text-gray-900 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#C1FF72] text-gray-900 text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold border-2 border-white">
                                        {cartItemCount > 9 ? "9+" : cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu (Desktop) */}
                            {isAuthenticated ? (
                                <Link href="/profile" className="hidden md:flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200">
                                    <span className="text-sm font-semibold text-gray-700 pl-1">{user?.name?.split(' ')[0]}</span>
                                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </Link>
                            ) : (
                                <Link href="/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-gray-200 hover:shadow-gray-300 transform hover:-translate-y-0.5">
                                    Sign In
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors ml-1"
                            >
                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer Panel */}
                <div className={`absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    <div className="flex flex-col h-full overflow-y-auto">
                        {/* Drawer Header & Profile */}
                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        <Link href="/profile" className="text-xs text-indigo-600 font-medium hover:underline mt-1 inline-block">
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block w-full py-3 bg-gray-900 text-white text-center font-bold rounded-xl shadow-lg hover:bg-black transition-all"
                                >
                                    Sign In / Register
                                </Link>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 p-6 space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Navigation</p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all ${pathname === link.href
                                        ? "bg-gray-900 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {link.label}
                                    {pathname === link.href && (
                                        <svg className="w-5 h-5 text-[#C1FF72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Footer / Account Links */}
                        {isAuthenticated && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Account</p>
                                <div className="space-y-2">
                                    <Link href="/my-courses" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-white rounded-xl transition-colors">
                                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">📚</span>
                                        My Courses
                                    </Link>
                                    <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-white rounded-xl transition-colors">
                                        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">🛍️</span>
                                        My Orders
                                    </Link>
                                    {user?.role === "admin" && (
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-white rounded-xl transition-colors">
                                            <span className="w-8 h-8 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center text-sm">⚙️</span>
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors mt-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal (Same as before but refined) */}
            <div className={`fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 transition-all duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
                <div className={`relative bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl transition-all duration-300 transform ${searchOpen ? "scale-100 translate-y-0" : "scale-95 -translate-y-4"}`}>
                    <form onSubmit={handleSearch} className="flex items-center gap-4 mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="What are you looking for?"
                            className="flex-1 text-lg outline-none placeholder-gray-400 text-gray-900 font-medium"
                            autoFocus
                        />
                        <button type="button" onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
                        <div className="flex flex-wrap gap-2">
                            {["Electronics", "Courses", "Laptops", "Watches", "Headphones"].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => handlePopularSearch(term)}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 rounded-full transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
