"use client";

import { useState, useEffect } from "react";

interface FilterSidebarProps {
    onFilterChange: (filters: FilterState) => void;
    categories: string[];
    brands: string[];
    tags: string[];
    isMobile?: boolean;
}

export interface FilterState {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    brands: string[];
    rating?: number;
    tags: string[];
    isMobile?: boolean;
}

export default function FilterSidebar({
    onFilterChange,
    categories,
    brands,
    tags,
    isMobile
}: FilterSidebarProps) {
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        tags: []
    });

    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

    // Collapsible states
    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
        brands: true,
        rating: false,
        tags: false
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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
        <div className="w-full lg:w-80 bg-white rounded-[2rem] border border-gray-100 p-6 lg:p-8 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] custom-scrollbar">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 bg-rose-50 rounded-full transition-colors uppercase tracking-wide"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="mb-8 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                <button
                    onClick={() => toggleSection('categories')}
                    className="flex items-center justify-between w-full mb-4 group"
                >
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Categories</h4>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.categories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className={`space-y-1 transition-all duration-300 overflow-hidden ${openSections.categories ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 capitalize text-sm font-medium flex items-center justify-between group ${filters.category === category
                                ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                                : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <span>{category}</span>
                            {filters.category === category && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-8 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full mb-4 group"
                >
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Price Range</h4>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${openSections.price ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-1">
                        <div className="flex gap-3">
                            <div className="relative flex-1 group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium group-focus-within:text-gray-900 transition-colors">₹</span>
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-900 outline-none transition-all text-sm font-medium"
                                    placeholder="Min"
                                />
                            </div>
                            <div className="relative flex-1 group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium group-focus-within:text-gray-900 transition-colors">₹</span>
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-900 outline-none transition-all text-sm font-medium"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handlePriceChange}
                            className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all duration-300 text-sm font-bold shadow-lg shadow-gray-200 hover:shadow-xl active:scale-[0.98]"
                        >
                            Apply Price
                        </button>
                    </div>
                </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
                <div className="mb-8 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                    <button
                        onClick={() => toggleSection('brands')}
                        className="flex items-center justify-between w-full mb-4 group"
                    >
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Brands</h4>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.brands ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div className={`transition-all duration-300 overflow-hidden ${openSections.brands ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar pt-1">
                            {brands.map((brand) => (
                                <label key={brand} className="flex items-center gap-3 cursor-pointer group p-1 select-none">
                                    <div className="relative flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={filters.brands.includes(brand)}
                                            onChange={() => handleBrandToggle(brand)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-gray-900 peer-checked:border-gray-900 transition-all group-hover:border-gray-400"></div>
                                        <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-all pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Rating */}
            <div className="mb-8 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                <button
                    onClick={() => toggleSection('rating')}
                    className="flex items-center justify-between w-full mb-4 group"
                >
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Rating</h4>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.rating ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${openSections.rating ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-2 pt-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleRatingChange(rating)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 group ${filters.rating === rating
                                    ? "bg-gray-50 border border-gray-200 ring-1 ring-gray-900/5"
                                    : "hover:bg-gray-50 border border-transparent"
                                    }`}
                            >
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className={`text-sm font-medium ${filters.rating === rating ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>& Up</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('tags')}
                        className="flex items-center justify-between w-full mb-4 group"
                    >
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Tags</h4>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.tags ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div className={`transition-all duration-300 overflow-hidden ${openSections.tags ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filters.tags.includes(tag)
                                        ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
