"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TabType = "wishlist" | "addresses" | "settings";

export default function AccountPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const { items: wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("wishlist");
    const [addresses, setAddresses] = useState([
        {
            id: "1",
            name: user?.name || "User",
            address: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
            isDefault: true,
        },
    ]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    const tabs = [
        { id: "wishlist" as TabType, label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", count: wishlistItems.length },
        { id: "addresses" as TabType, label: "Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
        { id: "settings" as TabType, label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    ];

    const handleAddToCart = (item: typeof wishlistItems[0]) => {
        addToCart({
            _id: item._id,
            title: item.title,
            price: item.price,
            originalPrice: item.originalPrice,
            category: item.category || '',
            images: item.images,
            inStock: item.inStock ?? true,
        }, 1);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">Account</p>
                        <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">My Account</h1>
                    </div>
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Profile
                    </Link>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-3xl p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                                            </svg>
                                            <span className="text-sm font-medium">{tab.label}</span>
                                        </div>
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-white rounded-3xl p-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Wishlist Tab */}
                        {activeTab === "wishlist" && (
                            <div className="bg-white rounded-3xl p-8">
                                <h2 className="text-xl font-medium text-gray-900 mb-6">Wishlist ({wishlistItems.length})</h2>

                                {wishlistItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 mb-6">Your wishlist is empty</p>
                                        <Link
                                            href="/products"
                                            className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all"
                                        >
                                            Browse Products
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {wishlistItems.map((item) => (
                                            <div
                                                key={item._id}
                                                className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
                                            >
                                                <div className="aspect-square bg-gray-50 relative">
                                                    {item.images && item.images.length > 0 ? (
                                                        <img
                                                            src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url}
                                                            alt={item.title}
                                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-6xl opacity-30">📦</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => removeFromWishlist(item._id)}
                                                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-lg font-medium text-gray-900">₹{item.price}</span>
                                                            {item.originalPrice && (
                                                                <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                                                            )}
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${item.inStock !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                            }`}>
                                                            {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        disabled={item.inStock === false}
                                                        className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <div className="bg-white rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-medium text-gray-900">Saved Addresses</h2>
                                    <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all">
                                        Add New
                                    </button>
                                </div>

                                <div className="text-center py-12 text-gray-500">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                    </div>
                                    <p className="mb-2">No saved addresses</p>
                                    <p className="text-sm">Add an address for faster checkout</p>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="bg-white rounded-3xl p-8">
                                <h2 className="text-xl font-medium text-gray-900 mb-6">Account Settings</h2>

                                <div className="space-y-6">
                                    {/* Email Notifications */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                            <p className="text-sm text-gray-500">Receive updates about orders and promotions</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                                        </label>
                                    </div>

                                    {/* Order Updates */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Order Updates</h3>
                                            <p className="text-sm text-gray-500">Get SMS updates about your orders</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                                        </label>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
                                        <button className="px-5 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-full hover:bg-red-50 transition-all">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
