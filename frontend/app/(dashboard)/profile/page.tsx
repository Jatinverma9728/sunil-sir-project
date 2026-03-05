"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Address, addAddress, updateAddress, deleteAddress, User } from "@/lib/api/auth";

interface Stats {
    orders: number;
    courses: number;
    wishlist: number;
}

export default function ProfilePage() {
    const { user, isAuthenticated, logout, loadUser } = useAuth();
    const { items: wishlistItems } = useWishlist();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [stats, setStats] = useState<Stats>({ orders: 0, courses: 0, wishlist: 0 });

    // Address Management State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState<Omit<Address, '_id'>>({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        isDefault: false,
        type: "Home"
    });

    // Profile Form State
    const [profile, setProfile] = useState<{ name: string; email: string; phone: string }>({
        name: "",
        email: "",
        phone: "",
    });

    const menuItems = [
        { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "My Profile", href: "/profile", active: true },
        { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", label: "My Orders", href: "/orders", active: false, count: stats.orders },
        { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "My Courses", href: "/my-courses", active: false, count: stats.courses },
        { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Wishlist", href: "/account", active: false, count: stats.wishlist },
    ];

    useEffect(() => {
        if (!isAuthenticated) return;
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || "",
                phone: (user as User).phone || "",
            });
            fetchStats();
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        setStats(prev => ({ ...prev, wishlist: wishlistItems.length }));
    }, [wishlistItems]);

    const fetchStats = async () => {
        // ... (Stats fetching logic same as before, keeping it simple)
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!token) return;

            // Fetch orders count
            try {
                const ordersRes = await fetch(`${API_URL}/orders/my-orders?limit=1`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const ordersData = await ordersRes.json();
                if (ordersData.success) {
                    setStats(prev => ({ ...prev, orders: ordersData.total || 0 }));
                }
            } catch (e) { console.log(e); }

            // Fetch courses
            try {
                const coursesRes = await fetch(`${API_URL}/courses/my-courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const coursesData = await coursesRes.json();
                if (coursesData.courses) setStats(prev => ({ ...prev, courses: coursesData.courses.length }));
            } catch (e) { console.log(e); }

        } catch (error) { console.error(error); }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
            const token = tokenCookie ? tokenCookie.split('=')[1] : null;

            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                loadUser();
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let res;
            if (editingAddress && editingAddress._id) {
                res = await updateAddress(editingAddress._id, addressForm);
            } else {
                res = await addAddress(addressForm);
            }

            if (res.success) {
                setMessage({ type: 'success', text: `Address ${editingAddress ? 'updated' : 'added'} successfully` });
                setShowAddressModal(false);
                setEditingAddress(null);
                resetAddressForm();
                loadUser();
            } else {
                setMessage({ type: 'error', text: 'Failed to save address' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const res = await deleteAddress(id);
            if (res.success) {
                setMessage({ type: 'success', text: 'Address deleted successfully' });
                loadUser();
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to delete address' });
        }
    };

    const resetAddressForm = () => {
        setAddressForm({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
            isDefault: false,
            type: "Home"
        });
    };

    const openEditModal = (addr: Address) => {
        setEditingAddress(addr);
        setAddressForm({
            fullName: addr.fullName,
            phone: addr.phone,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country,
            isDefault: addr.isDefault,
            type: addr.type
        });
        setShowAddressModal(true);
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            router.push("/");
        } catch { setLoggingOut(false); }
    };

    if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">Loading...</div>;

    const addresses = (user as User)?.addresses || [];

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
                        <div className="bg-white rounded-3xl p-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-medium text-gray-600">
                                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{profile.name || 'User'}</h3>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>

                        <div className="bg-white rounded-3xl p-4">
                            <nav className="space-y-1">
                                {menuItems.map((item, i) => (
                                    <Link key={i} href={item.href} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        {item.count !== undefined && item.count > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{item.count}</span>}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <button onClick={handleLogout} disabled={loggingOut} className="w-full bg-white rounded-3xl p-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 transition-all">
                            <span className="text-sm font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {message && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        {/* Personal Info */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10">
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-6">Personal Information</h2>
                            <form onSubmit={handleProfileSubmit} className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Full Name</label>
                                    <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 transition-all" />
                                </div>
                                <div className="relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm text-gray-500">Email</label>
                                        {user && !user.isEmailVerified ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-red-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00-.707-1.707h-3.172a1 1 0 00-.707.293l-.828.828A1 1 0 009 5.586V7a2 2 0 012 2z" /></svg>
                                                Unverified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-green-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <input type="email" value={profile.email} disabled className={`w-full px-4 py-3.5 bg-gray-100 border ${user && !user.isEmailVerified ? 'border-red-200' : 'border-gray-100'} rounded-xl text-gray-500 cursor-not-allowed`} />
                                    {user && !user.isEmailVerified && (
                                        <div className="absolute right-3 top-[42px]">
                                            <Link href="/verify-email" className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                                                Verify Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Phone</label>
                                    <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-gray-300 transition-all" />
                                </div>
                                <div className="sm:col-span-2">
                                    <button type="submit" disabled={saving} className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all">
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Address Book */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Address Book</h2>
                                <button onClick={() => { setEditingAddress(null); resetAddressForm(); setShowAddressModal(true); }} className="text-sm text-blue-600 font-medium hover:underline">
                                    + Add New Address
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {addresses.map((addr, idx) => (
                                    <div key={addr._id || idx} className="border border-gray-100 rounded-2xl p-5 relative group hover:border-gray-300 transition-all">
                                        {addr.isDefault && <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">DEFAULT</span>}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded">{addr.type}</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{addr.fullName}</p>
                                        <p className="text-sm text-gray-500 mt-1">{addr.street}, {addr.city}</p>
                                        <p className="text-sm text-gray-500">{addr.state} - {addr.zipCode}</p>
                                        <p className="text-sm text-gray-500 mt-2">{addr.phone}</p>

                                        <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(addr)} className="text-xs font-medium text-blue-600 hover:text-blue-800">Edit</button>
                                            <button onClick={() => handleDeleteAddress(addr._id!)} className="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {addresses.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-gray-400 text-sm">No addresses saved. Add one to speed up checkout.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Modal */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 lg:p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                                        <select value={addressForm.type} onChange={e => setAddressForm({ ...addressForm, type: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg">
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                                        <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                                    <input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                                    <input type="text" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                                        <input type="text" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                                        <input type="text" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Zip Code</label>
                                        <input type="text" required value={addressForm.zipCode} onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                                        <input type="text" value={addressForm.country} disabled className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} id="isDefault" />
                                    <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
                                        {saving ? 'Saving...' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
