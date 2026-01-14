"use client";

import { useState } from "react";
import { Product, ProductFormData, Category, uploadImages } from "@/lib/api/admin";

interface ProductFormProps {
    product: Product | null;
    categories: Category[];
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
}

export default function ProductForm({
    product,
    categories,
    onSubmit,
    onCancel,
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || 0,
        category: product?.category || "electronics",
        stock: product?.stock || 0,
        brand: product?.brand || "",
        sku: product?.sku || "",
        tags: product?.tags || [],
        images: product?.images || [],
        isActive: product?.isActive ?? true,
        isFeatured: product?.isFeatured ?? false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>(
        product?.images?.map(img => img.url) || []
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const result = await uploadImages(Array.from(files));
            if (result.success && result.urls) {
                const newUrls = [...imageUrls, ...result.urls];
                setImageUrls(newUrls);
                setFormData({
                    ...formData,
                    images: newUrls.map(url => ({ url, alt: formData.title }))
                });
            } else {
                alert(result.message || "Failed to upload images");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls);
        setFormData({
            ...formData,
            images: newUrls.map(url => ({ url, alt: formData.title }))
        });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            const newTags = [...(formData.tags || []), tagInput.trim()];
            setFormData({ ...formData, tags: newTags });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter(t => t !== tag) || []
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    const handleAddImageUrl = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = e.currentTarget;
            if (input.value) {
                const newUrls = [...imageUrls, input.value];
                setImageUrls(newUrls);
                setFormData({
                    ...formData,
                    images: newUrls.map(url => ({ url, alt: formData.title }))
                });
                input.value = '';
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Basic Information</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Product name"
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
                        placeholder="Detailed product description"
                        required
                    />
                </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product Images</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 bg-gray-50/50">
                    {/* Image Preview Grid */}
                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img
                                        src={url}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer px-5 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-sm font-medium transition-all shadow-sm">
                            {uploading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span> Uploading...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">📁 Choose Images</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                        <span className="text-xs text-gray-500">PNG, JPG up to 5MB each</span>
                    </div>

                    {/* Or URL input */}
                    <div className="mt-3">
                        <input
                            type="url"
                            placeholder="Or paste image URL and press Enter"
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            onKeyDown={handleAddImageUrl}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pricing & Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            min={0}
                            step={0.01}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            min={0}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                        <input
                            type="text"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            placeholder="SKU-001"
                        />
                    </div>
                </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black bg-white"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories && categories.length > 0 ? (
                            categories.map((cat) => (
                                <option key={cat._id} value={cat.slug}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading categories...</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                    <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                        placeholder="Brand name"
                    />
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                        placeholder="Add a tag..."
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Status Toggles */}
            <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 accent-black rounded"
                    />
                    <label htmlFor="isActive" className="flex-1 cursor-pointer">
                        <span className="font-semibold text-gray-900">Product Active</span>
                        <p className="text-sm text-gray-500">Visible on the store and available for purchase</p>
                    </label>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 accent-purple-600 rounded"
                    />
                    <label htmlFor="isFeatured" className="flex-1 cursor-pointer">
                        <span className="font-semibold text-gray-900">⭐ Featured Product</span>
                        <p className="text-sm text-gray-500">Display on home page in the featured products section</p>
                    </label>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 font-semibold transition-all shadow-lg shadow-black/10"
                >
                    {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
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
