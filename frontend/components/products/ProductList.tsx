import Link from "next/link";
import Image from "next/image";

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
}

interface ProductListProps {
    products: Product[];
    onAddToCart: (productId: string) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="text-8xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {products.map((product) => (
                <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all p-6"
                >
                    <div className="flex gap-6">
                        {/* Product Image */}
                        <Link href={`/products/${product._id}`} className="flex-shrink-0">
                            <div className="relative w-48 h-48 bg-gray-50 rounded-xl overflow-hidden group">
                                {product.images?.[0]?.url ? (
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.images[0].alt || product.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">📱</span>
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col">
                            <Link href={`/products/${product._id}`}>
                                {product.brand && (
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.brand}</p>
                                )}
                                <h3 className="font-bold text-gray-900 text-xl mb-2 hover:text-gray-700">
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                    {product.description || "No description available"}
                                </p>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {"★".repeat(Math.floor(product.rating?.average || 0))}
                                    {"☆".repeat(5 - Math.floor(product.rating?.average || 0))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating?.average?.toFixed(1) || "0.0"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({product.rating?.count || 0} reviews)
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-sm text-gray-600 capitalize">
                                    Category: <span className="font-medium">{product.category}</span>
                                </span>
                                <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                                </span>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{product.price}
                                </span>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                        ❤️ Wishlist
                                    </button>
                                    <button
                                        onClick={() => onAddToCart(product._id)}
                                        disabled={product.stock === 0}
                                        className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
