"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
}

interface Stats {
    orders: number;
    courses: number;
    wishlist: number;
}

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const { items: wishlistItems } = useWishlist();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [stats, setStats] = useState<Stats>({ orders: 0, courses: 0, wishlist: 0 });

    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    });

    const menuItems = [
        { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "My Profile", href: "/profile", active: true },
        { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "My Orders", href: "/orders", active: false, count: stats.orders },
        { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "My Courses", href: "/my-courses", active: false, count: stats.courses },
        { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Wishlist", href: "/account", active: false, count: stats.wishlist },
        { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "Settings", href: "/account", active: false },
    ];

    // Fetch user profile and stats
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || "",
                phone: (user as any).phone || "",
                address: {
                    street: (user as any).address?.street || "",
                    city: (user as any).address?.city || "",
                    state: (user as any).address?.state || "",
                    zipCode: (user as any).address?.zipCode || "",
                    country: (user as any).address?.country || "",
                },
            });
            fetchStats();
            setLoading(false);
        }
    }, [user, isAuthenticated, router]);

    // Update wishlist count when items change
    useEffect(() => {
        setStats(prev => ({ ...prev, wishlist: wishlistItems.length }));
    }, [wishlistItems]);

    const fetchStats = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Get auth token
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) return;

            // Fetch orders count
            try {
                const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const ordersData = await ordersRes.json();
                if (ordersData.success && ordersData.data) {
                    setStats(prev => ({ ...prev, orders: ordersData.data.length }));
                }
            } catch (e) {
                console.log('Could not fetch orders:', e);
            }

            // Fetch courses count
            try {
                const coursesRes = await fetch(`${API_URL}/courses/my-courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const coursesData = await coursesRes.json();
                if (coursesData.courses) {
                    setStats(prev => ({ ...prev, courses: coursesData.courses.length }));
                }
            } catch (e) {
                console.log('Could not fetch courses:', e);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setProfile((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setProfile((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            // Get auth token
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) {
                setMessage({ type: 'error', text: 'Authentication required. Please log in again.' });
                return;
            }

            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Refresh user data in context
                const { loadUser } = useAuth(); // Wait, I need to destructure loadUser at top level. 
                // Using existing hook usage at top level instead.
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile.' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            router.push("/");
        } catch {
            setLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-3xl p-6 h-fit">
                            <div className="h-20 w-20 bg-gray-100 rounded-full animate-pulse mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-100 rounded animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3 mx-auto"></div>
                        </div>
                        <div className="lg:col-span-3 bg-white rounded-3xl p-8 space-y-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">Account</p>
                    <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">My Profile</h1>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Card */}
                        <div className="bg-white rounded-3xl p-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-medium text-gray-600">
                                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{profile.name || 'User'}</h3>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-3xl p-4">
                            <nav className="space-y-1">
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${item.active
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                            </svg>
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        {item.count !== undefined && item.count > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full bg-white rounded-3xl p-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 transition-all"
                        >
                            {loggingOut ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            )}
                            <span className="text-sm font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 lg:p-10">
                            {message && (
                                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                    }`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={
                                            message.type === 'success'
                                                ? "M5 13l4 4L19 7"
                                                : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        } />
                                    </svg>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Info Section */}
                                <div>
                                    <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-6">Personal Information</h2>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profile.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                disabled
                                                className="w-full px-4 py-3.5 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-6">Shipping Address</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2">Street Address</label>
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={profile.address?.street}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                placeholder="123 Main Street"
                                            />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="address.city"
                                                    value={profile.address?.city}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                    placeholder="Mumbai"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">State / Province</label>
                                                <input
                                                    type="text"
                                                    name="address.state"
                                                    value={profile.address?.state}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                    placeholder="Maharashtra"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">ZIP / Postal Code</label>
                                                <input
                                                    type="text"
                                                    name="address.zipCode"
                                                    value={profile.address?.zipCode}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                    placeholder="400001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    name="address.country"
                                                    value={profile.address?.country}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-0 transition-all"
                                                    placeholder="India"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all duration-300 flex items-center gap-3"
                                    >
                                        {saving ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <Link href="/orders" className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all group">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-900 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-light text-gray-900">{stats.orders}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Orders</p>
                            </Link>
                            <Link href="/my-courses" className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all group">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-900 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-light text-gray-900">{stats.courses}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Courses</p>
                            </Link>
                            <Link href="/account" className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all group">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-900 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-light text-gray-900">{stats.wishlist}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Wishlist</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
