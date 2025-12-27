"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/api/products";
import { Product } from "@/lib/api/products";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (params.id) {
            loadProduct(params.id as string);
        }
    }, [params.id]);

    const loadProduct = async (id: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await getProduct(id);
            setProduct(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        setIsAdding(true);
        addToCart(product, quantity);

        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && (!product || newQuantity <= product.stock)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || "Product not found"}</p>
                    <Button onClick={() => router.push("/products")}>Back to Products</Button>
                </div>
            </div>
        );
    }

    const images = product.images?.length > 0
        ? product.images
        : [{ url: 'https://via.placeholder.com/600', alt: product.title }];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" onClick={() => router.push("/products")} className="mb-6">
                    ← Back to Products
                </Button>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Images */}
                        <div>
                            <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                                <Image
                                    src={images[selectedImage].url}
                                    alt={images[selectedImage].alt || product.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                                    ? "border-blue-600"
                                                    : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={image.alt || `${product.title} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-4">
                                {product.brand && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</span>
                                )}
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    {product.title}
                                </h1>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating.average)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-blue-600">
                                    {formatCurrency(product.price)}
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.inStock ? (
                                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                        In Stock ({product.stock} available)
                                    </span>
                                ) : (
                                    <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.inStock && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full mb-4"
                                disabled={!product.inStock || isAdding}
                                onClick={handleAddToCart}
                            >
                                {isAdding ? "Added to Cart!" : "Add to Cart"}
                            </Button>

                            {/* Description */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                <h2 className="font-semibold text-lg mb-3">Description</h2>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>

                            {/* Specifications */}
                            {product.specs && Object.keys(product.specs).length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                    <h2 className="font-semibold text-lg mb-3">Specifications</h2>
                                    <dl className="space-y-2">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <div key={key} className="flex">
                                                <dt className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                                                    {key}:
                                                </dt>
                                                <dd className="text-gray-600 dark:text-gray-400 w-2/3">{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
