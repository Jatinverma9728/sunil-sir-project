"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useRouter } from "next/navigation";
import ReviewSection from "@/components/products/ReviewSection";
import { JsonLd, generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    stock?: number;
    rating?: number | { average: number; count: number };
    reviews?: number;
    inStock: boolean;
    images?: Array<{ url: string; alt?: string }> | string[];
    specifications?: Array<{ label: string; value: string }>;
    features?: string[];
    sku?: string;
    tags?: string[];
    brand?: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

    useEffect(() => {
        if (productId) fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const { getProduct: fetchProductAPI } = await import("@/lib/api/products");
            const response = await fetchProductAPI(productId);
            if (response.success && response.data) {
                setProduct({
                    ...response.data,
                    inStock: response.data.stock ? response.data.stock > 0 : true,
                });
            } else {
                setProduct(getMockProduct());
            }
        } catch {
            setProduct(getMockProduct());
        } finally {
            setLoading(false);
        }
    };

    const getMockProduct = (): Product => ({
        _id: productId,
        title: "Premium Wireless Headphones",
        description: "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers and professionals alike. The sleek design combines form and function, delivering an immersive audio experience whether you're working, traveling, or relaxing at home.",
        price: 299.00,
        originalPrice: 399.00,
        category: "Electronics",
        stock: 25,
        rating: { average: 4.8, count: 245 },
        inStock: true,
        sku: "WH-PRO-2024",
        brand: "AudioMax",
        tags: ["Wireless", "Noise Cancellation", "Premium"],
        images: [],
        specifications: [
            { label: "Brand", value: "AudioMax" },
            { label: "Connectivity", value: "Bluetooth 5.3" },
            { label: "Battery Life", value: "40 Hours" },
            { label: "Weight", value: "280g" },
            { label: "Driver Size", value: "40mm" },
            { label: "Frequency Response", value: "20Hz - 20kHz" },
        ],
        features: [
            "Active Noise Cancellation",
            "40-Hour Battery Life",
            "Premium Memory Foam Cushions",
            "Multi-Device Connectivity"
        ],
    });

    const getRating = () => {
        if (!product?.rating) return { avg: 4.8, count: 245 };
        if (typeof product.rating === "number") return { avg: product.rating, count: product.reviews || 0 };
        return { avg: product.rating.average, count: product.rating.count };
    };

    const handleAddToCart = async () => {
        if (!product?.inStock) return;
        setAdding(true);
        addToCart(product, quantity);
        await new Promise((r) => setTimeout(r, 400));
        setAdding(false);
    };

    const handleBuyNow = () => {
        if (!product?.inStock) return;
        addToCart(product, quantity);
        router.push("/checkout");
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="aspect-[4/3] bg-white rounded-[2rem] animate-pulse" />
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-5 space-y-8 lg:py-8">
                            <div className="h-4 w-32 bg-white rounded-full animate-pulse" />
                            <div className="h-12 w-full bg-white rounded-2xl animate-pulse" />
                            <div className="h-6 w-48 bg-white rounded-full animate-pulse" />
                            <div className="h-14 w-40 bg-white rounded-2xl animate-pulse" />
                            <div className="h-32 bg-white rounded-2xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!product) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">Product Not Found</h1>
                    <p className="text-gray-400 mb-10 text-lg">The product you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 transition-all duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const { avg, count } = getRating();
    const images = (product.images || []).map((img) => (typeof img === "string" ? img : img.url));
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Minimal Breadcrumb */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
                <nav className="flex items-center gap-3 text-sm text-gray-400">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span className="text-gray-200">—</span>
                    <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
                    <span className="text-gray-200">—</span>
                    <span className="text-gray-600">{product.category}</span>
                </nav>
            </div>

            {/* Main Product Section */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column - Image Gallery */}
                    <div className="lg:col-span-7">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] bg-white rounded-[2rem] overflow-hidden mb-6 group shadow-sm">
                            {images.length > 0 ? (
                                <Image
                                    src={images[selectedImage]}
                                    alt={product.title}
                                    width={1200}
                                    height={900}
                                    priority
                                    unoptimized
                                    className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                                    <div className="text-center">
                                        <span className="text-[120px] opacity-20">📦</span>
                                    </div>
                                </div>
                            )}

                            {/* Discount Badge */}
                            {discount > 0 && (
                                <div className="absolute top-8 left-8 bg-gray-900 text-white text-xs font-medium tracking-wide uppercase px-5 py-2.5 rounded-full">
                                    Save {discount}%
                                </div>
                            )}

                            {/* Wishlist Button */}
                            <button
                                onClick={() => product && toggleWishlist({
                                    _id: product._id,
                                    title: product.title,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    category: product.category,
                                    images: product.images as Array<{ url: string; alt?: string }>,
                                    inStock: product.inStock,
                                })}
                                className={`absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${product && isInWishlist(product._id)
                                    ? "bg-red-50 text-red-500"
                                    : "bg-white/80 backdrop-blur text-gray-400 hover:text-gray-600 hover:bg-white"
                                    }`}
                            >
                                <svg className="w-5 h-5" fill={product && isInWishlist(product._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.slice(0, 4).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square bg-white rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === i
                                            ? "ring-2 ring-gray-900 ring-offset-4"
                                            : "opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain p-4" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="lg:col-span-5 lg:py-4">
                        {/* Brand & Category */}
                        <div className="flex items-center gap-4 mb-6">
                            {product.brand && (
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em]">{product.brand}</span>
                            )}
                            <span className="text-gray-200">|</span>
                            <span className="text-xs text-gray-400 uppercase tracking-[0.15em]">{product.category}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-[2.75rem] font-light text-gray-900 mb-8 leading-tight tracking-tight">
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(avg) ? "text-amber-400" : "text-gray-200"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{avg.toFixed(1)} ({count} reviews)</span>
                        </div>

                        {/* Price Block */}
                        <div className="bg-white rounded-2xl p-6 mb-8">
                            <div className="flex items-end gap-4 mb-3">
                                <span className="text-4xl font-light text-gray-900">${product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through pb-1">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                            {discount > 0 && (
                                <p className="text-sm text-green-600 font-medium">You save ${(product.originalPrice! - product.price).toFixed(2)}</p>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
                            <span className="text-sm text-gray-500">
                                {product.inStock ? `In Stock · ${product.stock || 'Available'} units` : "Currently Unavailable"}
                            </span>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-6 mb-10">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-6">
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Qty</span>
                                <div className="flex items-center bg-white rounded-full overflow-hidden border border-gray-100">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="w-14 text-center text-lg font-light text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || adding}
                                    className="h-16 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    {adding ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Adding
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Add to Bag
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                    className="h-16 bg-white text-gray-900 text-sm font-medium tracking-wide uppercase rounded-full border border-gray-200 hover:border-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-100">
                            {[
                                { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", label: "Free Shipping" },
                                { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Secure Checkout" },
                                { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "Easy Returns" },
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-500">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* SKU & Tags */}
                        {product.sku && (
                            <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                                SKU: {product.sku}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white mt-8">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                    {/* Tab Navigation */}
                    <div className="flex gap-12 border-b border-gray-100">
                        {[
                            { id: 'description', label: 'Description' },
                            { id: 'specifications', label: 'Specifications' },
                            { id: 'reviews', label: `Reviews (${count})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`py-6 text-sm font-medium tracking-wide uppercase transition-colors relative ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="py-16">
                        {activeTab === 'description' && (
                            <div className="max-w-3xl">
                                <p className="text-lg text-gray-600 leading-relaxed mb-10">
                                    {product.description}
                                </p>

                                {/* Features */}
                                {product.features && product.features.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-6">Key Features</h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {product.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-4 py-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'specifications' && product.specifications && (
                            <div className="max-w-2xl">
                                <div className="divide-y divide-gray-100">
                                    {product.specifications.map((spec, i) => (
                                        <div key={i} className="flex items-center justify-between py-5">
                                            <span className="text-gray-500">{spec.label}</span>
                                            <span className="text-gray-900 font-medium">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewSection
                                productId={productId}
                                productRating={typeof product.rating === 'object' ? product.rating : { average: product.rating || 0, count: 0 }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Tags Section */}
            {product.tags && product.tags.length > 0 && (
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm text-gray-400">Related:</span>
                        {product.tags.map((tag, i) => (
                            <Link
                                key={i}
                                href={`/products?tag=${tag}`}
                                className="px-5 py-2 bg-white text-gray-600 text-sm rounded-full border border-gray-100 hover:border-gray-300 transition-colors"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
