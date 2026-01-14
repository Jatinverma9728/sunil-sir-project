"use client";

import { useState } from "react";
import { Course, CourseFormData } from "@/lib/api/admin";

interface CourseFormProps {
    course: Course | null;
    onSubmit: (data: CourseFormData) => void;
    onCancel: () => void;
}

export default function CourseForm({
    course,
    onSubmit,
    onCancel,
}: CourseFormProps) {
    const [formData, setFormData] = useState<CourseFormData>({
        title: course?.title || "",
        description: course?.description || "",
        price: course?.price || 0,
        category: course?.category || "programming",
        level: course?.level || "beginner",
        thumbnail: course?.thumbnail || "",
        language: course?.language || "English",
        isPublished: course?.isPublished ?? false,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Course Details</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Course title"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                        rows={4}
                        placeholder="Detailed course description"
                        required
                    />
                </div>
            </div>

            {/* Pricing & Level */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                    <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black bg-white"
                    >
                        <option value="beginner">🟢 Beginner</option>
                        <option value="intermediate">🟡 Intermediate</option>
                        <option value="advanced">🔴 Advanced</option>
                    </select>
                </div>
            </div>

            {/* Category & Language */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black bg-white"
                    >
                        <option value="programming">💻 Programming</option>
                        <option value="design">🎨 Design</option>
                        <option value="business">📊 Business</option>
                        <option value="marketing">📢 Marketing</option>
                        <option value="photography">📷 Photography</option>
                        <option value="music">🎵 Music</option>
                        <option value="health">💪 Health</option>
                        <option value="personal-development">🧠 Personal Development</option>
                        <option value="other">📚 Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
                    <input
                        type="text"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                        placeholder="English"
                    />
                </div>
            </div>

            {/* Thumbnail */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
                <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                    placeholder="https://example.com/thumbnail.jpg"
                />
                {formData.thumbnail && (
                    <div className="mt-2">
                        <img
                            src={formData.thumbnail}
                            alt="Thumbnail preview"
                            className="h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                )}
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-5 h-5 accent-green-600 rounded"
                />
                <label htmlFor="isPublished" className="flex-1 cursor-pointer">
                    <span className="font-semibold text-gray-900">📢 Published</span>
                    <p className="text-sm text-gray-500">Make this course visible to students</p>
                </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 font-semibold transition-all shadow-lg shadow-black/10"
                >
                    {submitting ? "Saving..." : course ? "Update Course" : "Create Course"}
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
