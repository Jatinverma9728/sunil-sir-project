"use client";

import { useEffect, useState } from "react";
import {
    Category,
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
    uploadImages,
} from "@/lib/api/admin";

type CategoryFormData = {
    name: string;
    icon: string;
    image: string;
    description: string;
    isActive: boolean;
};

const emptyForm: CategoryFormData = {
    name: "",
    icon: "",
    image: "",
    description: "",
    isActive: true,
};

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(emptyForm);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const response = await getAllCategories();
        if (response.success && response.data) {
            setCategories(response.data);
        }
        setLoading(false);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadImages([file]);
            if (result.success && result.urls?.[0]) {
                setFormData((current) => ({ ...current, image: result.urls![0] }));
            } else {
                alert(result.message || "Failed to upload category image");
            }
        } catch (error) {
            console.error("Category image upload error:", error);
            alert("Failed to upload category image");
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            ...formData,
            name: formData.name.trim(),
            description: formData.description.trim(),
            image: formData.image.trim(),
        };

        const response = editingCategory
            ? await updateCategory(editingCategory._id, payload)
            : await createCategory(payload);

        if (response.success) {
            await fetchCategories();
            handleCloseModal();
        } else {
            alert(response.message || "Failed to save category");
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            icon: category.icon || "",
            image: category.image || "",
            description: category.description || "",
            isActive: category.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? This will fail if products are using it.")) {
            return;
        }

        const response = await deleteCategory(id);
        if (response.success) {
            await fetchCategories();
        } else {
            alert(response.message || "Failed to delete category");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setUploading(false);
        setFormData(emptyForm);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setFormData(emptyForm);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                    <p className="mt-1 text-gray-600">Manage storefront category images and labels</p>
                </div>
                <button
                    type="button"
                    onClick={handleAddNew}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                                    {category.image ? (
                                        <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5V7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 14l2.4-2.4a1 1 0 011.4 0L13 13.8l1.2-1.2a1 1 0 011.4 0L18 15" />
                                        </svg>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate font-bold text-gray-900">{category.name}</h3>
                                    <p className="truncate text-sm text-gray-500">{category.slug}</p>
                                </div>
                            </div>
                        </div>

                        {category.description && (
                            <p className="mb-4 line-clamp-2 text-sm text-gray-600">{category.description}</p>
                        )}

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`rounded-md px-2 py-1 text-xs font-medium ${category.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {category.isActive ? "Active" : "Inactive"}
                                </span>
                                {category.productCount !== undefined && (
                                    <span className="text-xs text-gray-500">{category.productCount} products</span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(category)}
                                    className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                    title="Edit"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(category._id)}
                                    className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
                                    title="Delete"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">
                            {editingCategory ? "Edit Category" : "Add New Category"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Category image</label>
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Category preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <svg className="h-9 w-9 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5V7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 14l2.4-2.4a1 1 0 011.4 0L13 13.8l1.2-1.2a1 1 0 011.4 0L18 15" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-100">
                                                {uploading ? "Uploading..." : "Upload image"}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    className="hidden"
                                                />
                                            </label>
                                            {formData.image && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: "" })}
                                                    className="ml-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                            <p className="mt-2 text-xs text-gray-500">Square JPG or PNG works best.</p>
                                        </div>
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        placeholder="Or paste image URL"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Category Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Laptops"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Brief description of this category"
                                />
                            </div>

                            <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="mt-1 h-4 w-4 accent-blue-600"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-gray-900">Active category</span>
                                    <span className="block text-xs text-gray-500">Show this category on storefront pages.</span>
                                </span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {editingCategory ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
