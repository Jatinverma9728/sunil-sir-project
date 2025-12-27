"use client";

import { useState, useEffect } from "react";

interface FilterSidebarProps {
    onFilterChange: (filters: FilterState) => void;
    categories: string[];
    brands: string[];
    tags: string[];
}

export interface FilterState {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    brands: string[];
    rating?: number;
    tags: string[];
}

export default function FilterSidebar({
    onFilterChange,
    categories,
    brands,
    tags
}: FilterSidebarProps) {
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        tags: []
    });

    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    const handleCategoryChange = (category: string) => {
        setFilters(prev => ({ ...prev, category: category === prev.category ? undefined : category }));
    };

    const handleBrandToggle = (brand: string) => {
        setFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handlePriceChange = () => {
        setFilters(prev => ({
            ...prev,
            priceMin: priceRange.min,
            priceMax: priceRange.max
        }));
    };

    const handleRatingChange = (rating: number) => {
        setFilters(prev => ({ ...prev, rating: prev.rating === rating ? undefined : rating }));
    };

    const clearFilters = () => {
        setFilters({ brands: [], tags: [] });
        setPriceRange({ min: 0, max: 5000 });
    };

    const hasActiveFilters = filters.category || filters.brands.length > 0 ||
        filters.tags.length > 0 || filters.rating || filters.priceMin || filters.priceMax;

    return (
        <div className="w-full lg:w-80 bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${filters.category === category
                                    ? "bg-[#C1FF72] text-black font-medium"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Min"
                        />
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Max"
                        />
                    </div>
                    <button
                        onClick={handlePriceChange}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
                <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Brands</h4>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.brands.includes(brand)}
                                    onChange={() => handleBrandToggle(brand)}
                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-[#C1FF72]"
                                />
                                <span className="text-gray-700 group-hover:text-gray-900">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Rating</h4>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleRatingChange(rating)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filters.rating === rating
                                    ? "bg-[#C1FF72] text-black"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <span className="text-yellow-400">{"★".repeat(rating)}</span>
                            <span>& Up</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.tags.includes(tag)
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
