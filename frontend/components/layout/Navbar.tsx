"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";

const CATEGORIES = [
    { id: "all", label: "All Categories", href: "/products" },
    { id: "laptops", label: "Refurbished Laptops", href: "/refurbished-laptops", badge: "Certified", badgeColor: "bg-emerald-500 text-white" },
    { id: "iot", label: "IoT & Robotics", href: "/iot", badge: "Maker Lab", badgeColor: "bg-teal-600 text-white" },
    { id: "accessories", label: "Computer Accessories", href: "/computer-accessories" },
    { id: "courses", label: "Online Tech Courses", href: "/courses", badge: "Skill Pass", badgeColor: "bg-blue-600 text-white" },
    { id: "deals", label: "Flash Deals & Offers", href: "/products?deals=true", badge: "HOT", badgeColor: "bg-rose-500 text-white animate-pulse" },
];

const POPULAR_SEARCHES = [
    "ThinkPad T480",
    "Dell Latitude 16GB",
    "HP EliteBook i5",
    "ESP32 Wi-Fi",
    "Raspberry Pi 4B",
    "Mechanical Keyboard",
    "Full-Stack Web Dev",
    "Python & AI Course"
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();
    const { items, getTotalPrice } = useCart();
    const { getTotalItems: getWishlistCount } = useWishlist();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<"hardware" | "courses">("hardware");

    const searchRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotalPrice = getTotalPrice ? getTotalPrice() : items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const wishlistCount = getWishlistCount ? getWishlistCount() : 0;

    // Close popups on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setAccountMenuOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setCategoryDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setIsSearchFocused(false);
        setAccountMenuOpen(false);
        setCategoryDropdownOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;

        setIsSearchFocused(false);
        if (searchCategory === "courses") {
            router.push(`/courses?search=${encodeURIComponent(trimmed)}`);
        } else if (searchCategory === "laptops") {
            router.push(`/refurbished-laptops?search=${encodeURIComponent(trimmed)}`);
        } else if (searchCategory === "iot") {
            router.push(`/iot?search=${encodeURIComponent(trimmed)}`);
        } else if (searchCategory === "accessories") {
            router.push(`/computer-accessories?search=${encodeURIComponent(trimmed)}`);
        } else if (searchCategory !== "all") {
            router.push(`/products?category=${encodeURIComponent(searchCategory)}&search=${encodeURIComponent(trimmed)}`);
        } else {
            router.push(`/products?search=${encodeURIComponent(trimmed)}`);
        }
    };

    const handlePopularClick = (term: string) => {
        setSearchQuery(term);
        setIsSearchFocused(false);
        router.push(`/products?search=${encodeURIComponent(term)}`);
    };

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-100 font-sans z-40">
            {/* ============================================================== */}
            {/* TIER 1: Utility Bar (Helpline, Fast Delivery, Trust Badges)   */}
            {/* ============================================================== */}
            <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>⚡ Free Express Delivery on orders above ₹999</span>
                        </div>
                        <span className="text-slate-600">|</span>
                        <div className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>100% Certified Refurbished • 32-Point Quality Tested</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <a
                            href="https://wa.me/919355386007"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                        >
                            <span className="text-sm">💬</span>
                            <span>WhatsApp: +91 93553 86007</span>
                        </a>
                        <span className="text-slate-600">|</span>
                        <Link href="/orders" className="hover:text-white transition-colors">
                            Track Order
                        </Link>
                        <span className="text-slate-600">|</span>
                        <Link href="/about" className="hover:text-white transition-colors">
                            Warranty & Assurance
                        </Link>
                        <span className="text-slate-600">|</span>
                        <Link href="/contact" className="hover:text-white transition-colors">
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* TIER 2: Main Branding, Omnichannel Search, and Action Hub     */}
            {/* ============================================================== */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5">
                <div className="flex items-center justify-between gap-3 md:gap-6">
                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open navigation menu"
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Brand Logo - High tech feel */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                            N
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold tracking-tight text-gray-950 text-lg sm:text-xl md:text-2xl leading-none">
                                NORTH<span className="text-blue-600">TECH</span>HUB
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 mt-0.5">
                                Refurbished Tech & Skills
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Omnichannel Search Bar */}
                    <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative mx-2">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-center w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all shadow-sm"
                        >
                            {/* Category Selector Pill */}
                            <div className="relative border-r border-gray-200 shrink-0">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    aria-label="Filter search by category"
                                    className="h-11 pl-3.5 pr-7 bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer appearance-none rounded-l-xl hover:text-blue-600"
                                >
                                    <option value="all">All Departments</option>
                                    <option value="laptops">💻 Refurbished Laptops</option>
                                    <option value="iot">⚡ IoT & Robotics</option>
                                    <option value="accessories">⌨️ PC Accessories</option>
                                    <option value="courses">🎓 Tech Courses</option>
                                </select>
                                <svg
                                    className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Main Search Input */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Search refurbished laptops (ThinkPad, Dell), RAM, SSD, or courses..."
                                className="flex-1 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none font-medium"
                            />

                            {/* Clear query button */}
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search input"
                                    className="p-1.5 text-gray-400 hover:text-gray-600 mr-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            {/* Search Action Button */}
                            <button
                                type="submit"
                                aria-label="Submit search"
                                className="h-9 px-4 mr-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="hidden lg:inline">Search</span>
                            </button>
                        </form>

                        {/* Search Dropdown / Popular Suggestions */}
                        {isSearchFocused && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Popular Searches</span>
                                    <span className="text-[11px] text-blue-600 font-semibold">Instant Recommendations</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {POPULAR_SEARCHES.map((term) => (
                                        <button
                                            key={term}
                                            type="button"
                                            onClick={() => handlePopularClick(term)}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-100 rounded-lg transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                                    <Link
                                        href="/refurbished-laptops"
                                        onClick={() => setIsSearchFocused(false)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-gray-700"
                                    >
                                        <span className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">💻</span>
                                        <div>
                                            <p className="font-semibold">Refurbished Laptops</p>
                                            <p className="text-[10px] text-gray-400">Lenovo, Dell, HP with Warranty</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/courses"
                                        onClick={() => setIsSearchFocused(false)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-gray-700"
                                    >
                                        <span className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">🎓</span>
                                        <div>
                                            <p className="font-semibold">Tech Courses</p>
                                            <p className="text-[10px] text-gray-400">Python, Web Dev, IoT & Hardware</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Action Icons: Account, Wishlist, Cart */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Account Menu / Popover */}
                        <div ref={accountRef} className="relative">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors group text-left"
                                    aria-label="User account menu"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div className="hidden xl:block">
                                        <p className="text-xs font-semibold text-gray-500 leading-tight">Hello, {user?.name?.split(" ")[0]}</p>
                                        <p className="text-xs font-bold text-gray-900 leading-tight">My Account</p>
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-800 font-bold text-xs hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Sign In</span>
                                </Link>
                            )}

                            {/* Account Dropdown */}
                            {accountMenuOpen && isAuthenticated && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>👤</span> Profile Settings
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>📦</span> My Orders
                                    </Link>
                                    <Link
                                        href="/my-courses"
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>🎓</span> Enrolled Courses
                                    </Link>
                                    {user?.role === "admin" && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                                        >
                                            <span>⚙️</span> Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setAccountMenuOpen(false);
                                            }}
                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 w-full text-left"
                                        >
                                            <span>🚪</span> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wishlist Icon */}
                        <Link
                            href="/wishlist"
                            aria-label={`Wishlist (${wishlistCount} items)`}
                            className="p-2 sm:p-2.5 rounded-xl text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all relative"
                            title="Wishlist"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart Widget (Robocraze style with Item Count & Total Price) */}
                        <Link
                            href="/cart"
                            aria-label={`Shopping cart with ${cartItemCount} items`}
                            className="flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all duration-200 shadow-md shadow-slate-900/10 active:scale-95 group"
                        >
                            <div className="relative">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                                        {cartItemCount > 9 ? "9+" : cartItemCount}
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-[10px] uppercase font-semibold text-slate-300 leading-none">Cart</span>
                                <span className="text-xs font-bold leading-tight">₹{cartTotalPrice.toLocaleString("en-IN")}</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Input (Visible only on mobile) */}
                <div className="md:hidden mt-2.5">
                    <form onSubmit={handleSearchSubmit} className="flex items-center w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                        <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search laptops, accessories, courses..."
                            className="w-full text-xs text-gray-900 bg-transparent outline-none placeholder-gray-400 font-medium"
                        />
                        <button type="submit" aria-label="Submit search" className="text-xs font-bold text-blue-600 shrink-0 ml-1">
                            Go
                        </button>
                    </form>
                </div>
            </div>

            {/* ============================================================== */}
            {/* TIER 3: Sticky Department & Category Mega-Bar                  */}
            {/* ============================================================== */}
            <div className="hidden lg:block bg-slate-50/80 backdrop-blur-sm border-t border-gray-200">
                <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
                    {/* Left: Browse Categories Dropdown */}
                    <div ref={categoryRef} className="relative">
                        <button
                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                            className="flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors shadow-sm"
                            aria-expanded={categoryDropdownOpen}
                            aria-label="All Categories menu"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span>Browse All Departments</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Mega Dropdown */}
                        {categoryDropdownOpen && (
                            <div className="absolute top-full left-0 w-72 bg-white rounded-b-xl shadow-2xl border border-gray-100 py-2 z-50 divide-y divide-gray-50 animate-in fade-in-50">
                                {CATEGORIES.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={cat.href}
                                        onClick={() => setCategoryDropdownOpen(false)}
                                        className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    >
                                        <span>{cat.label}</span>
                                        {cat.badge && (
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${cat.badgeColor || "bg-gray-100 text-gray-700"}`}>
                                                {cat.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Middle: Horizontal Navigation Links with Badges */}
                    <nav className="flex items-center gap-1 font-medium text-xs text-gray-700">
                        {CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.href}
                                className={`flex items-center gap-1.5 px-3.5 py-3 hover:text-blue-600 transition-colors relative group font-semibold ${pathname === cat.href ? "text-blue-600" : ""}`}
                            >
                                <span>{cat.label}</span>
                                {cat.badge && (
                                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${cat.badgeColor || "bg-gray-200 text-gray-800"}`}>
                                        {cat.badge}
                                    </span>
                                )}
                                <span className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-600 transform transition-transform duration-200 ${pathname === cat.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Certified Assurance Guarantee */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Verified 7-Day Replacement Guarantee</span>
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* MOBILE NAVIGATION DRAWER                                       */}
            {/* ============================================================== */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

                <div className={`absolute left-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {/* Drawer Header */}
                    <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                                N
                            </div>
                            <span className="font-extrabold text-sm tracking-tight">NORTH TECH HUB</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" className="p-1 text-slate-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Tabs: Hardware vs Courses */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setMobileTab("hardware")}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${mobileTab === "hardware" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500"}`}
                        >
                            💻 Tech Hardware
                        </button>
                        <button
                            onClick={() => setMobileTab("courses")}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${mobileTab === "courses" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500"}`}
                        >
                            🎓 Tech Courses
                        </button>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
                        {mobileTab === "hardware" ? (
                            <div className="space-y-1 pb-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Hardware Categories</p>
                                <Link href="/refurbished-laptops" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>💻 Refurbished Laptops</span>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Grade A+</span>
                                </Link>
                                <Link href="/iot" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>⚡ IoT & Robotics Gear</span>
                                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">ESP32/Pi</span>
                                </Link>
                                <Link href="/computer-accessories" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>⌨️ Computer Accessories</span>
                                </Link>
                                <Link href="/products?deals=true" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-rose-600">
                                    <span>🔥 Hot Deals & Offers</span>
                                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">Sale</span>
                                </Link>
                                <Link href="/products" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>📦 All Products</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-1 pb-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Coding & Skills</p>
                                <Link href="/courses" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>📚 All Online Courses</span>
                                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Live</span>
                                </Link>
                                <Link href="/courses?category=web-dev" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>🌐 Web Development</span>
                                </Link>
                                <Link href="/courses?category=programming" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-gray-800">
                                    <span>🐍 Python & Data Science</span>
                                </Link>
                                <Link href="/my-courses" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-sm font-semibold text-emerald-700">
                                    <span>🎓 My Enrolled Courses</span>
                                </Link>
                            </div>
                        )}

                        {/* Account & Help */}
                        <div className="pt-4 space-y-1 text-sm font-semibold">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">My Account</p>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                                        <span>👤</span> Profile & Settings
                                    </Link>
                                    <Link href="/orders" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                                        <span>📦</span> Orders & Tracking
                                    </Link>
                                    <Link href="/wishlist" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                                        <span>❤️</span> Wishlist ({wishlistCount})
                                    </Link>
                                    <button onClick={logout} className="flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-rose-600 w-full text-left">
                                        <span>🚪</span> Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="block w-full py-2.5 bg-blue-600 text-white text-center rounded-xl font-bold">
                                    Sign In / Register
                                </Link>
                            )}
                        </div>

                        {/* WhatsApp Helpline */}
                        <div className="pt-4">
                            <a
                                href="https://wa.me/919355386007"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                            >
                                <span>💬</span> Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
