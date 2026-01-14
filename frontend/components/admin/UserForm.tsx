"use client";

import { useState } from "react";
import { User, UserFormData } from "@/lib/api/admin";

interface UserFormProps {
    user: User | null;
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
}

export default function UserForm({
    user,
    onSubmit,
    onCancel,
}: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "user",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) delete dataToSubmit.password;
        await onSubmit(dataToSubmit);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Info */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">User Information</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Full name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="email@example.com"
                        required
                    />
                </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Security</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password {user && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="••••••••"
                        {...(!user && { required: true })}
                        minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-3">
                    <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'user'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={formData.role === 'user'}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}
                            className="hidden"
                        />
                        <span className="text-2xl">👤</span>
                        <div>
                            <p className="font-semibold text-gray-900">User</p>
                            <p className="text-xs text-gray-500">Standard access</p>
                        </div>
                    </label>
                    <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'admin'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={formData.role === 'admin'}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}
                            className="hidden"
                        />
                        <span className="text-2xl">👑</span>
                        <div>
                            <p className="font-semibold text-gray-900">Admin</p>
                            <p className="text-xs text-gray-500">Full access</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 font-semibold transition-all shadow-lg shadow-black/10"
                >
                    {submitting ? "Saving..." : user ? "Update User" : "Create User"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
