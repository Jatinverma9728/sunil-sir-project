// "use client";

// import { useState, useEffect } from "react";
// import { getProducts, getCategories, ProductFilters } from "@/lib/api/products";
// import { Product } from "@/lib/api/products";
// import ProductCard from "@/components/shop/ProductCard";
// import Button from "@/components/ui/Button";

// export default function ProductsPage() {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [categories, setCategories] = useState<string[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [filters, setFilters] = useState<ProductFilters>({
//         page: 1,
//         limit: 12,
//         category: "",
//         sort: "newest",
//     });

//     const [pagination, setPagination] = useState({
//         total: 0,
//         pages: 0,
//         currentPage: 1,
//     });

//     // Load categories on mount
//     useEffect(() => {
//         loadCategories();
//     }, []);

//     // Load products when filters change
//     useEffect(() => {
//         loadProducts();
//     }, [filters]);

//     const loadCategories = async () => {
//         try {
//             const response = await getCategories();
//             setCategories(response.data);
//         } catch (err: any) {
//             console.error("Failed to load categories:", err);
//         }
//     };

//     const loadProducts = async () => {
//         setLoading(true);
//         setError("");

//         try {
//             const response = await getProducts(filters);
//             setProducts(response.data);
//             setPagination({
//                 total: response.total,
//                 pages: response.pages,
//                 currentPage: response.page,
//             });
//         } catch (err: any) {
//             setError(err.message || "Failed to load products");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCategoryChange = (category: string) => {
//         setFilters({
//             ...filters,
//             category: category === filters.category ? "" : category,
//             page: 1,
//         });
//     };

//     const handleSortChange = (sort: ProductFilters["sort"]) => {
//         setFilters({
//             ...filters,
//             sort,
//             page: 1,
//         });
//     };

//     const handlePageChange = (page: number) => {
//         setFilters({
//             ...filters,
//             page,
//         });
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//             {/* Header */}
//             <div className="bg-white dark:bg-gray-800 shadow-sm">
//                 <div className="container mx-auto px-4 py-8">
//                     <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                         Products
//                     </h1>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Discover our collection of quality products
//                     </p>
//                 </div>
//             </div>

//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Filters Sidebar */}
//                     <aside className="lg:w-64 shrink-0">
//                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
//                             <h2 className="font-semibold text-lg mb-4">Filters</h2>

//                             {/* Categories */}
//                             <div className="mb-6">
//                                 <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
//                                     Category
//                                 </h3>
//                                 <div className="space-y-2">
//                                     {categories.map((category) => (
//                                         <button
//                                             key={category}
//                                             onClick={() => handleCategoryChange(category)}
//                                             className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === category
//                                                     ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
//                                                     : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
//                                                 }`}
//                                         >
//                                             {category.charAt(0).toUpperCase() + category.slice(1)}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Sort */}
//                             <div>
//                                 <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
//                                     Sort By
//                                 </h3>
//                                 <select
//                                     value={filters.sort}
//                                     onChange={(e) => handleSortChange(e.target.value as ProductFilters["sort"])}
//                                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                                 >
//                                     <option value="newest">Newest First</option>
//                                     <option value="price-asc">Price: Low to High</option>
//                                     <option value="price-desc">Price: High to Low</option>
//                                     <option value="rating">Highest Rated</option>
//                                 </select>
//                             </div>

//                             {/* Clear Filters */}
//                             {filters.category && (
//                                 <button
//                                     onClick={() => setFilters({ ...filters, category: "", page: 1 })}
//                                     className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                                 >
//                                     Clear Filters
//                                 </button>
//                             )}
//                         </div>
//                     </aside>

//                     {/* Products Grid */}
//                     <main className="flex-1">
//                         {error && (
//                             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
//                                 <p className="text-red-600 dark:text-red-400">{error}</p>
//                             </div>
//                         )}

//                         {loading ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {[...Array(6)].map((_, i) => (
//                                     <div
//                                         key={i}
//                                         className="bg-white dark:bg-gray-800 rounded-lg h-96 animate-pulse"
//                                     />
//                                 ))}
//                             </div>
//                         ) : products.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-600 dark:text-gray-400 text-lg">
//                                     No products found
//                                 </p>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="flex justify-between items-center mb-6">
//                                     <p className="text-gray-600 dark:text-gray-400">
//                                         Showing {products.length} of {pagination.total} products
//                                     </p>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                                     {products.map((product) => (
//                                         <ProductCard key={product._id} product={product} />
//                                     ))}
//                                 </div>

//                                 {/* Pagination */}
//                                 {pagination.pages > 1 && (
//                                     <div className="flex justify-center gap-2">
//                                         <Button
//                                             variant="outline"
//                                             onClick={() => handlePageChange(pagination.currentPage - 1)}
//                                             disabled={pagination.currentPage === 1}
//                                         >
//                                             Previous
//                                         </Button>

//                                         {[...Array(pagination.pages)].map((_, i) => {
//                                             const page = i + 1;
//                                             if (
//                                                 page === 1 ||
//                                                 page === pagination.pages ||
//                                                 Math.abs(page - pagination.currentPage) <= 1
//                                             ) {
//                                                 return (
//                                                     <Button
//                                                         key={page}
//                                                         variant={page === pagination.currentPage ? "primary" : "outline"}
//                                                         onClick={() => handlePageChange(page)}
//                                                     >
//                                                         {page}
//                                                     </Button>
//                                                 );
//                                             } else if (Math.abs(page - pagination.currentPage) === 2) {
//                                                 return <span key={page} className="px-2">...</span>;
//                                             }
//                                             return null;
//                                         })}

//                                         <Button
//                                             variant="outline"
//                                             onClick={() => handlePageChange(pagination.currentPage + 1)}
//                                             disabled={pagination.currentPage === pagination.pages}
//                                         >
//                                             Next
//                                         </Button>
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </main>
//                 </div>
//             </div>
//         </div>
//     );
// }
