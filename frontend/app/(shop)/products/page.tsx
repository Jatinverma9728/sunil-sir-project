"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import Breadcrumb from "@/components/products/Breadcrumb";
import FilterSidebar, { FilterState } from "@/components/products/FilterSidebar";
import SearchBar from "@/components/products/SearchBar";
import ViewToggle from "@/components/products/ViewToggle";
import SortDropdown from "@/components/products/SortDropdown";
import ProductGrid from "@/components/products/ProductGrid";
import ProductList from "@/components/products/ProductList";
import Pagination from "@/components/products/Pagination";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    rating: { average: number; count: number };
    images: Array<{ url: string; alt?: string }>;
    stock: number;
    brand?: string;
    tags?: string[];
}

// Inner component using useSearchParams
function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart } = useCart();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>({ brands: [], tags: [] });

    useEffect(() => {
        fetchCategories();
    }, []);

    // Sync search query with URL params (for navbar search)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== searchQuery) {
            setSearchQuery(urlSearch);
            setCurrentPage(1);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [filters, sortBy, currentPage, searchQuery]);

    const fetchCategories = async () => {
        try {
            const { getCategories } = await import('@/lib/api/products');
            const response = await getCategories();
            if (response.success && response.data) {
                // Map category objects to slugs for backward compatibility with filters
                setCategories(response.data.map(cat => cat.slug));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { getProducts } = await import('@/lib/api/products');

            const params: any = {
                page: currentPage,
                limit: 12,
            };

            if (searchQuery) params.search = searchQuery;

            const categoryParam = searchParams.get('category');
            if (categoryParam) params.category = categoryParam;
            else if (filters.category) params.category = filters.category;

            if (filters.priceMin) params.minPrice = filters.priceMin;
            if (filters.priceMax) params.maxPrice = filters.priceMax;

            params.sort = sortBy;

            const response = await getProducts(params);

            if (response.success && response.data) {
                setProducts(response.data);

                // Use pagination.total for the total count, not count (which is the current page count)
                if (response.pagination) {
                    setTotalProducts(response.pagination.total || 0);
                    setTotalPages(response.pagination.totalPages || 1);
                } else {
                    // Fallback for backward compatibility
                    setTotalProducts(response.total || response.count || 0);
                    setTotalPages(response.pages || 1);
                }

                const uniqueBrands = Array.from(new Set(response.data.map(p => p.brand).filter(Boolean))) as string[];
                const uniqueTags = Array.from(new Set(response.data.flatMap(p => p.tags || []))).filter(Boolean) as string[];

                setBrands(uniqueBrands);
                setTags(uniqueTags);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: string) => {
        try {
            const { getProduct } = await import('@/lib/api/products');
            const response = await getProduct(productId);

            if (response.success && response.data) {
                addToCart(response.data, 1);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategorySelect = (category: string) => {
        router.push(`/products?category=${category}`);
    };

    const breadcrumbItems = [];
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
        breadcrumbItems.push({ label: categoryParam, href: `/products?category=${categoryParam}` });
    } else {
        breadcrumbItems.push({ label: 'All Products', href: '/products' });
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
                <Breadcrumb items={breadcrumbItems} />

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
                        {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}` : 'All Products'}
                    </h1>

                    {/* Category Pills */}
                    <div className="mb-8 overflow-x-auto hide-scrollbar">
                        <div className="flex items-center gap-3 pb-2">
                            <button
                                onClick={() => router.push('/products')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${!categoryParam
                                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategorySelect(category)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all capitalize whitespace-nowrap border ${categoryParam === category
                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 border-gray-900'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Controls & Search */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="w-full lg:max-w-md">
                            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 w-full">
                            <p className="text-gray-500 text-sm font-medium order-2 sm:order-1 lg:mr-auto lg:ml-6">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></span>
                                        Loading products...
                                    </span>
                                ) : (
                                    <span>Showing <span className="font-bold text-gray-900">{totalProducts}</span> results</span>
                                )}
                            </p>

                            <div className="flex items-center gap-3 order-1 sm:order-2">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden px-4 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    Filters
                                </button>
                                <SortDropdown value={sortBy} onChange={handleSortChange} />
                                <ViewToggle view={view} onViewChange={setView} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-16">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block h-full">
                        <FilterSidebar
                            onFilterChange={handleFilterChange}
                            categories={categories}
                            brands={brands}
                            tags={tags}
                        />
                    </div>

                    {/* Mobile Filters Modal */}
                    {showFilters && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                                onClick={() => setShowFilters(false)}
                            ></div>

                            {/* Drawer */}
                            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out h-full">
                                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-5 flex items-center justify-between z-10">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="w-8 h-8 rounded-full bg-gray-100/50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-900"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5 pb-20">
                                    <FilterSidebar
                                        onFilterChange={(newFilters) => {
                                            handleFilterChange(newFilters);
                                            // Optional: Don't close immediately on filter change for better UX
                                        }}
                                        categories={categories}
                                        brands={brands}
                                        tags={tags}
                                        isMobile={true}
                                    />
                                </div>
                                {/* Mobile Apply Button Footer */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-colors"
                                    >
                                        Show Results ({totalProducts})
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="w-full min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-5 w-full">
                                        <div className="aspect-square bg-gray-100 rounded-2xl mb-5 w-full animate-pulse"></div>
                                        <div className="px-1 space-y-3">
                                            <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse"></div>
                                            <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse mb-2"></div>
                                            <div className="flex justify-between items-center pt-2">
                                                <div className="h-8 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                                                <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : view === "grid" ? (
                            <ProductGrid products={products} onAddToCart={handleAddToCart} />
                        ) : (
                            <ProductList products={products} onAddToCart={handleAddToCart} />
                        )}

                        {!loading && totalPages > 1 && (
                            <div className="mt-16">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

// Wrapper with Suspense boundary for useSearchParams
export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
