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
        originalPrice: product?.originalPrice || undefined,
        category: product?.category || "electronics",
        stock: product?.stock || 0,
        brand: product?.brand || "",
        sku: product?.sku || "",
        tags: product?.tags || [],
        images: product?.images || [],
        isActive: product?.isActive ?? true,
        isFeatured: product?.isFeatured ?? false,
        specifications: product?.specifications || {},
        policies: product?.policies || {
            returnPolicy: '',
            shippingPolicy: '',
            cancellationPolicy: ''
        },
        warranty: product?.warranty || {
            duration: '',
            type: '',
            details: ''
        },
        externalLinks: product?.externalLinks || {
            userManual: '',
            supportUrl: '',
            videoUrl: '',
            manufacturerWebsite: ''
        },
        additionalResources: product?.additionalResources || []
    });

    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>(
        product?.images?.map(img => img.url) || []
    );

    // Specifications state
    const [specKey, setSpecKey] = useState("");
    const [specValue, setSpecValue] = useState("");

    // Additional Resources state
    const [resourceTitle, setResourceTitle] = useState("");
    const [resourceUrl, setResourceUrl] = useState("");
    const [resourceType, setResourceType] = useState<'pdf' | 'video' | 'article' | 'download' | 'other'>('other');

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

    const handleAddSpecification = () => {
        if (specKey.trim() && specValue.trim()) {
            const newSpecs = { ...formData.specifications };
            newSpecs[specKey.trim()] = specValue.trim();
            setFormData({ ...formData, specifications: newSpecs });
            setSpecKey("");
            setSpecValue("");
        }
    };

    const handleRemoveSpecification = (key: string) => {
        const newSpecs = { ...formData.specifications };
        delete newSpecs[key];
        setFormData({ ...formData, specifications: newSpecs });
    };

    const handleAddResource = () => {
        if (resourceTitle.trim() && resourceUrl.trim()) {
            const newResources = [
                ...(formData.additionalResources || []),
                {
                    title: resourceTitle.trim(),
                    url: resourceUrl.trim(),
                    type: resourceType
                }
            ];
            setFormData({ ...formData, additionalResources: newResources });
            setResourceTitle("");
            setResourceUrl("");
            setResourceType('other');
        }
    };

    const handleRemoveResource = (index: number) => {
        const newResources = formData.additionalResources?.filter((_, i) => i !== index) || [];
        setFormData({ ...formData, additionalResources: newResources });
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price (₹) *</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            min={0}
                            step={0.01}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Current selling price</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
                        <input
                            type="number"
                            value={formData.originalPrice || ""}
                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            min={0}
                            step={0.01}
                            placeholder="Optional"
                        />
                        <p className="text-xs text-gray-500 mt-1">If set, shows discount badge</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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

            {/* Specifications Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">📋 Technical Specifications</h3>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/30">
                    {formData.specifications && Object.keys(formData.specifications).length > 0 && (
                        <div className="space-y-2 mb-4">
                            {Object.entries(formData.specifications).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <span className="font-medium text-gray-700">{key}</span>
                                        <span className="text-gray-600">{value}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSpecification(key)}
                                        className="ml-3 text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={specKey}
                            onChange={(e) => setSpecKey(e.target.value)}
                            placeholder="e.g., Processor"
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={specValue}
                                onChange={(e) => setSpecValue(e.target.value)}
                                placeholder="e.g., Intel Core i7"
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddSpecification();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddSpecification}
                                className="px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Policies Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">📜 Policies</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Return Policy</label>
                        <textarea
                            value={formData.policies?.returnPolicy || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                policies: { ...formData.policies, returnPolicy: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black resize-none"
                            rows={2}
                            placeholder="e.g., 7-day return policy with original packaging"
                            maxLength={1000}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Policy</label>
                        <textarea
                            value={formData.policies?.shippingPolicy || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                policies: { ...formData.policies, shippingPolicy: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black resize-none"
                            rows={2}
                            placeholder="e.g., Free shipping on orders above ₹500"
                            maxLength={1000}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation Policy</label>
                        <textarea
                            value={formData.policies?.cancellationPolicy || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                policies: { ...formData.policies, cancellationPolicy: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black resize-none"
                            rows={2}
                            placeholder="e.g., Can be cancelled within 24 hours of ordering"
                            maxLength={1000}
                        />
                    </div>
                </div>
            </div>

            {/* Warranty Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">🛡️ Warranty Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Warranty Duration</label>
                        <input
                            type="text"
                            value={formData.warranty?.duration || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                warranty: { ...formData.warranty, duration: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            placeholder="e.g., 1 Year"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Warranty Type</label>
                        <select
                            value={formData.warranty?.type || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                warranty: { ...formData.warranty, type: e.target.value as "" | "manufacturer" | "seller" | "extended" | "none" }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black bg-white"
                        >
                            <option value="">Select Type</option>
                            <option value="manufacturer">Manufacturer Warranty</option>
                            <option value="seller">Seller Warranty</option>
                            <option value="extended">Extended Warranty</option>
                            <option value="none">No Warranty</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Warranty Details</label>
                    <textarea
                        value={formData.warranty?.details || ''}
                        onChange={(e) => setFormData({
                            ...formData,
                            warranty: { ...formData.warranty, details: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black resize-none"
                        rows={2}
                        placeholder="Additional warranty information..."
                        maxLength={500}
                    />
                </div>
            </div>

            {/* External Links Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">🔗 External Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">User Manual URL</label>
                        <input
                            type="url"
                            value={formData.externalLinks?.userManual || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                externalLinks: { ...formData.externalLinks, userManual: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Support URL</label>
                        <input
                            type="url"
                            value={formData.externalLinks?.supportUrl || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                externalLinks: { ...formData.externalLinks, supportUrl: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Video URL</label>
                        <input
                            type="url"
                            value={formData.externalLinks?.videoUrl || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                externalLinks: { ...formData.externalLinks, videoUrl: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Manufacturer Website</label>
                        <input
                            type="url"
                            value={formData.externalLinks?.manufacturerWebsite || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                externalLinks: { ...formData.externalLinks, manufacturerWebsite: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            {/* Additional Resources Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">📁 Additional Resources</h3>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/30">
                    {formData.additionalResources && formData.additionalResources.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {formData.additionalResources.map((resource, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{resource.title}</p>
                                        <p className="text-sm text-gray-500"><a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{resource.url}</a></p>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{resource.type}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveResource(index)}
                                        className="ml-3 text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="text"
                                value={resourceTitle}
                                onChange={(e) => setResourceTitle(e.target.value)}
                                placeholder="Resource Title"
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            />
                            <input
                                type="url"
                                value={resourceUrl}
                                onChange={(e) => setResourceUrl(e.target.value)}
                                placeholder="URL"
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                            />
                            <select
                                value={resourceType}
                                onChange={(e) => setResourceType(e.target.value as any)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black bg-white"
                            >
                                <option value="pdf">PDF</option>
                                <option value="video">Video</option>
                                <option value="article">Article</option>
                                <option value="download">Download</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddResource}
                            className="w-full px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
                        >
                            Add Resource
                        </button>
                    </div>
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
