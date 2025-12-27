"use client";

import { useState, useEffect } from "react";
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

export default function ProductsPage() {
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
                setCategories(response.data);
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
                setTotalProducts(response.count || 0);

                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
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

    const breadcrumbItems = [];
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
        breadcrumbItems.push({ label: categoryParam, href: `/products?category=${categoryParam}` });
    } else {
        breadcrumbItems.push({ label: 'All Products', href: '/products' });
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                <Breadcrumb items={breadcrumbItems} />

                {/* Premium Header */}
                <div className="mb-12">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
                        {categoryParam ? 'Category' : 'Browse'}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight mb-8">
                        {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}` : 'All Products'}
                    </h1>

                    <div className="mb-8">
                        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-gray-500">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></span>
                                    Loading...
                                </span>
                            ) : (
                                <span><span className="font-semibold text-gray-900">{totalProducts}</span> products found</span>
                            )}
                        </p>
                        <div className="flex items-center gap-4">
                            <SortDropdown value={sortBy} onChange={handleSortChange} />
                            <ViewToggle view={view} onViewChange={setView} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-10">
                    <FilterSidebar
                        onFilterChange={handleFilterChange}
                        categories={categories}
                        brands={brands}
                        tags={tags}
                    />

                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl border border-gray-100 p-4 animate-pulse">
                                        <div className="h-64 bg-gradient-to-b from-gray-100 to-gray-50 rounded-2xl mb-4"></div>
                                        <div className="px-1">
                                            <div className="h-3 bg-gray-100 rounded w-20 mb-3"></div>
                                            <div className="h-5 bg-gray-100 rounded w-full mb-2"></div>
                                            <div className="h-5 bg-gray-100 rounded w-3/4 mb-4"></div>
                                            <div className="flex justify-between items-center">
                                                <div className="h-6 bg-gray-100 rounded w-20"></div>
                                                <div className="h-11 w-11 bg-gray-100 rounded-full"></div>
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
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}