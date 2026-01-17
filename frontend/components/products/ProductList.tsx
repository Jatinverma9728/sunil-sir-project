import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/api/products";

interface ProductListProps {
    products: Product[];
    onAddToCart: (productId: string) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="text-8xl mb-4 grayscale opacity-20">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {products.map((product) => {
                const images = product.images?.map(img => img.url) || ((product as any).image ? [(product as any).image] : []);
                const rating = typeof product.rating === 'object' ? product.rating.average : (product.rating || 0);
                const reviewCount = typeof product.rating === 'object' ? product.rating.count : ((product as any).reviews || 0);

                return (
                    <div
                        key={product._id}
                        className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 p-6 group"
                    >
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* Product Image */}
                            <Link href={`/products/${product._id}`} className="flex-shrink-0 mx-auto md:mx-0">
                                <div className="relative w-full md:w-56 h-56 bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center p-4">
                                    {images.length > 0 ? (
                                        <Image
                                            src={images[0]}
                                            alt={product.title}
                                            fill
                                            className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-4xl opacity-20">📦</div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                                            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col">
                                <div className="mb-4">
                                    <Link href={`/products/${product._id}`}>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {product.brand && (
                                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-full">
                                                    {product.brand}
                                                </span>
                                            )}
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-xl md:text-2xl mb-2 hover:text-indigo-600 transition-colors leading-tight">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-500 line-clamp-2 text-sm md:text-base leading-relaxed">
                                            {product.description || "No description available"}
                                        </p>
                                    </Link>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-bold text-amber-900">{rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-sm text-gray-400 font-medium">
                                        {reviewCount} reviews
                                    </span>
                                </div>

                                {/* Price and Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ₹{product.price.toFixed(2)}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-400 line-through font-medium">
                                                ₹{product.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-600 flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            Wishlist
                                        </button>
                                        <button
                                            onClick={() => onAddToCart(product._id)}
                                            disabled={product.stock === 0}
                                            className="flex-1 sm:flex-none px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
