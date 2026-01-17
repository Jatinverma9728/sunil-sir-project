"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import ReviewSection from "@/components/products/ReviewSection";

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
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [pincode, setPincode] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState<{ available: boolean; date: string } | null>(null);
    const [checkingDelivery, setCheckingDelivery] = useState(false);

    useEffect(() => {
        if (productId) fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const { getProduct: fetchProductAPI, getProducts } = await import("@/lib/api/products");
            const response = await fetchProductAPI(productId);
            if (response.success && response.data) {
                const productData = {
                    ...response.data,
                    inStock: response.data.stock ? response.data.stock > 0 : true,
                };
                setProduct(productData);

                const relatedRes = await getProducts({
                    category: response.data.category,
                    limit: 12
                });
                if (relatedRes.success && relatedRes.data) {
                    const transformedRelated = relatedRes.data
                        .filter((p: any) => p._id !== productId)
                        .slice(0, 6)
                        .map((p: any) => ({
                            ...p,
                            inStock: p.stock ? p.stock > 0 : true,
                        }));
                    setRelatedProducts(transformedRelated);
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRating = () => {
        if (!product?.rating) return { avg: 0, count: 0 };
        if (typeof product.rating === "number") return { avg: product.rating, count: product.reviews || 0 };
        return { avg: product.rating.average, count: product.rating.count };
    };

    const handleAddToCart = async () => {
        if (!product?.inStock) return;
        setAdding(true);
        addToCart(product, quantity);
        await new Promise((r) => setTimeout(r, 500));
        setAdding(false);
    };

    const handleBuyNow = () => {
        if (!product?.inStock) return;
        addToCart(product, quantity);
        router.push("/checkout");
    };

    const checkDelivery = async () => {
        if (pincode.length !== 6) return;
        setCheckingDelivery(true);
        await new Promise(r => setTimeout(r, 800));
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 3);
        setDeliveryInfo({
            available: true,
            date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
        });
        setCheckingDelivery(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-screen-2xl mx-auto px-4 py-6">
                    <div className="animate-pulse grid lg:grid-cols-[auto_1fr] gap-6">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">
                                {[...Array(4)].map((_, i) => <div key={i} className="w-16 h-16 bg-gray-100" />)}
                            </div>
                            <div className="w-full lg:w-96 aspect-square bg-gray-100" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(8)].map((_, i) => <div key={i} className="h-10 bg-gray-100" />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center max-w-md" role="alert">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <Link href="/products" className="text-blue-600 hover:underline font-medium">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const { avg, count } = getRating();
    const images = (product.images || []).map((img) => (typeof img === "string" ? img : img.url));
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const savings = product.originalPrice ? product.originalPrice - product.price : 0;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb Navigation */}
            <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <ol className="flex items-center gap-2 text-sm text-gray-600">
                        <li><Link href="/" className="hover:text-blue-600 hover:underline">Home</Link></li>
                        <li aria-hidden="true">›</li>
                        <li><Link href="/products" className="hover:text-blue-600 hover:underline">Products</Link></li>
                        <li aria-hidden="true">›</li>
                        <li><Link href={`/products?category=${product.category}`} className="hover:text-blue-600 hover:underline">{product.category}</Link></li>
                        <li aria-hidden="true">›</li>
                        <li className="text-gray-900 truncate" aria-current="page">{product.title.substring(0, 50)}</li>
                    </ol>
                </div>
            </nav>

            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid lg:grid-cols-[auto_minmax(400px,600px)_1fr] gap-3">
                    {/* Left: Vertical Thumbnails */}
                    {images.length > 1 && (
                        <aside className="hidden lg:block" aria-label="Product image thumbnails">
                            <div className="flex flex-col gap-3 sticky top-6">
                                {images.slice(0, 6).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        onMouseEnter={() => setSelectedImage(i)}
                                        className={`w-16 h-16 border-2 transition-all ${selectedImage === i
                                            ? 'border-blue-600 shadow-md'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        aria-label={`View image ${i + 1} of ${images.length}`}
                                        aria-current={selectedImage === i}
                                    >
                                        <img src={img} alt={`${product.title} - View ${i + 1}`} className="w-full h-full object-contain p-1" />
                                    </button>
                                ))}
                            </div>
                        </aside>
                    )}

                    {/* Center: Main Image */}
                    <div className="lg:max-w-xl">
                        <div className="sticky top-6">
                            <div className="bg-white border border-gray-200 p-6 lg:p-10 relative" role="img" aria-label="Main product image">
                                <div className="aspect-square relative">
                                    {images.length > 0 ? (
                                        <Image
                                            src={images[selectedImage]}
                                            alt={`${product.title} - Main product image ${selectedImage + 1} of ${images.length}`}
                                            fill
                                            className="object-contain"
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 600px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <span className="text-4xl text-gray-300" aria-label="No image available">📦</span>
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
                                        className={`absolute top-2 right-2 p-2.5 bg-white border transition ${isInWishlist(product._id)
                                            ? 'text-red-500 border-red-500'
                                            : 'text-gray-400 border-gray-300 hover:border-red-500 hover:text-red-500'
                                            }`}
                                        aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                                        aria-pressed={isInWishlist(product._id)}
                                    >
                                        <svg className="w-5 h-5" fill={isInWishlist(product._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    {/* Image Counter */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1" role="status" aria-live="polite">
                                            {selectedImage + 1} / {images.length}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2.5 mt-4 lg:hidden overflow-x-auto pb-2" role="list" aria-label="Product image thumbnails">
                                    {images.slice(0, 5).map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`flex-shrink-0 w-16 h-16 border-2 transition ${selectedImage === i ? 'border-blue-600' : 'border-gray-200'
                                                }`}
                                            aria-label={`View image ${i + 1}`}
                                            role="listitem"
                                        >
                                            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || adding}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label={adding ? "Adding to cart" : "Add to cart"}
                                >
                                    {adding ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            ADDING...
                                        </span>
                                    ) : 'ADD TO CART'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    aria-label="Buy now and proceed to checkout"
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-start-3 space-y-5">
                        {/* Brand */}
                        {product.brand && (
                            <div>
                                <Link href={`/products?brand=${product.brand}`} className="text-sm text-blue-600 hover:underline font-medium">
                                    Visit {product.brand} Store
                                </Link>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {/* Rating */}
                        {count > 0 && (
                            <div className="flex items-center gap-4 pb-5 border-b border-gray-200">
                                <div className="flex items-center gap-1 bg-green-700 text-white px-2.5 py-1.5 text-sm font-bold shadow-sm" role="img" aria-label={`Rated ${avg.toFixed(1)} out of 5 stars`}>
                                    <span>{avg.toFixed(1)}</span>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600">{count.toLocaleString()} Ratings</span>
                            </div>
                        )}

                        {/* Price Section */}
                        <div className="pb-6 border-b border-gray-200">
                            {discount > 0 && (
                                <div className="mb-3">
                                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 inline-block shadow-sm">
                                        Special Price
                                    </span>
                                </div>
                            )}
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-4xl font-semibold text-gray-900" aria-label={`Price: ${product.price} rupees`}>
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through" aria-label={`Original price: ${product.originalPrice} rupees`}>
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-lg text-green-600 font-semibold" aria-label={`${discount} percent discount`}>
                                            {discount}% off
                                        </span>
                                    </>
                                )}
                            </div>
                            {savings > 0 && (
                                <p className="text-green-700 font-semibold text-sm">
                                    You Save: ₹{savings.toLocaleString('en-IN')} ({discount}%)
                                </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
                        </div>

                        {/* Stock Status */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Availability</h2>
                            {product.inStock ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full" aria-hidden="true"></div>
                                    <span className="font-semibold">In Stock</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-700">
                                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full" aria-hidden="true"></div>
                                    <span className="font-semibold">Out of Stock</span>
                                </div>
                            )}
                            {product.stock && product.stock < 10 && product.inStock && (
                                <p className="text-orange-600 font-medium mt-2 text-sm" role="alert">
                                    ⚡ Only {product.stock} left - order soon!
                                </p>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="pb-6 border-b border-gray-200">
                            <label htmlFor="quantity" className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Quantity</label>
                            <select
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border border-gray-300 px-4 py-2.5 w-full lg:w-32 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                aria-label="Select quantity"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>Qty: {num}</option>
                                ))}
                            </select>
                        </div>

                        {/* Delivery */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Delivery Options</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="pincode"
                                    value={pincode}
                                    onChange={(e) => {
                                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setDeliveryInfo(null);
                                    }}
                                    placeholder="Enter Pincode"
                                    className="flex-1 border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    maxLength={6}
                                    aria-label="Enter 6-digit delivery pincode"
                                    aria-describedby="pincode-help"
                                />
                                <button
                                    onClick={checkDelivery}
                                    disabled={pincode.length !== 6 || checkingDelivery}
                                    className="px-6 py-2.5 text-sm font-semibold text-blue-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    aria-label="Check delivery availability"
                                >
                                    {checkingDelivery ? 'Checking...' : 'Check'}
                                </button>
                            </div>
                            <p id="pincode-help" className="text-xs text-gray-500 mt-1">Enter your area pincode to check delivery availability</p>
                            {deliveryInfo && (
                                <div className="mt-3 p-4 bg-green-50 border border-green-200 text-green-900" role="status" aria-live="polite">
                                    <p className="font-semibold flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Delivery by {deliveryInfo.date}
                                    </p>
                                    <p className="text-sm mt-1">if ordered today</p>
                                </div>
                            )}
                        </div>

                        {/* Available Offers */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Available Offers</h2>
                            <ul className="space-y-2.5 text-sm" role="list">
                                <li className="flex gap-2.5">
                                    <span className="text-green-600 font-bold flex-shrink-0" aria-hidden="true">•</span>
                                    <div>
                                        <strong>Bank Offer:</strong> 10% instant discount on SBI Credit Cards, up to ₹1,000 on orders above ₹5,000
                                    </div>
                                </li>
                                <li className="flex gap-2.5">
                                    <span className="text-green-600 font-bold flex-shrink-0" aria-hidden="true">•</span>
                                    <div>
                                        <strong>No Cost EMI:</strong> Available on orders above ₹3,000 for 3, 6, and 9 months
                                    </div>
                                </li>
                                <li className="flex gap-2.5">
                                    <span className="text-green-600 font-bold flex-shrink-0" aria-hidden="true">•</span>
                                    <div>
                                        <strong>New User Offer:</strong> Sign up and get ₹500 off on your first order above ₹2,000
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Product Highlights */}
                        {product.features && product.features.length > 0 && (
                            <div className="pb-6 border-b border-gray-200">
                                <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Key Features</h2>
                                <ul className="space-y-2 text-sm text-gray-700" role="list">
                                    {product.features.map((feature, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-gray-400 flex-shrink-0" aria-hidden="true">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Services & Policies */}
                        <div>
                            <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Services & Policies</h2>
                            <ul className="space-y-2.5 text-sm text-gray-700" role="list">
                                <li className="flex items-start gap-2.5">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>7 Days Replacement:</strong> Hassle-free replacement for damaged or defective products</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Cash on Delivery:</strong> Pay when you receive the product at your doorstep</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Secure Payments:</strong> All transactions are encrypted and 100% secure</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Free Shipping:</strong> No delivery charges on this product</span>
                                </li>
                            </ul>
                        </div>

                        {/* Additional Info */}
                        {(product.sku || product.category) && (
                            <div className="pt-5 border-t border-gray-200 text-sm text-gray-600">
                                {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
                                {product.category && <p className="mt-1"><strong>Category:</strong> {product.category}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Full-Width Sections */}
                <div className="mt-12 space-y-6">
                    {/* Description */}
                    <section className="border border-gray-300 shadow-sm bg-white" aria-labelledby="description-heading">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 id="description-heading" className="text-lg font-semibold text-gray-900">Product Description</h2>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    </section>

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                        <section className="border border-gray-300 shadow-sm bg-white" aria-labelledby="specifications-heading">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h2 id="specifications-heading" className="text-lg font-semibold text-gray-900">Technical Specifications</h2>
                            </div>
                            <div className="px-6 py-5">
                                <table className="w-full">
                                    <tbody>
                                        {product.specifications.map((spec, i) => (
                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                <th scope="row" className="py-3 pr-4 font-semibold text-gray-700 w-1/3 text-left">{spec.label}</th>
                                                <td className="py-3 text-gray-900">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Reviews */}
                    <section className="border border-gray-300 shadow-sm bg-white" aria-labelledby="reviews-heading">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 id="reviews-heading" className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                        </div>
                        <div className="px-6 py-5">
                            <ReviewSection
                                productId={productId}
                                productRating={typeof product.rating === 'object' ? product.rating : { average: product.rating || 0, count: 0 }}
                            />
                        </div>
                    </section>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12" aria-labelledby="related-products-heading">
                        <h2 id="related-products-heading" className="text-2xl font-semibold text-gray-900 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {relatedProducts.map((rp: any) => (
                                <article
                                    key={rp._id}
                                    className="border border-gray-200 hover:shadow-md transition bg-white"
                                >
                                    <Link href={`/products/${rp._id}`} className="block p-3">
                                        <div className="aspect-square mb-3 bg-gray-50">
                                            {rp.images?.[0] && (
                                                <img
                                                    src={typeof rp.images[0] === 'string' ? rp.images[0] : rp.images[0].url}
                                                    alt={rp.title}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            )}
                                        </div>
                                        <h3 className="text-sm text-gray-900 line-clamp-2 mb-2">
                                            {rp.title}
                                        </h3>
                                        {rp.rating && rp.rating.count > 0 && (
                                            <div className="inline-flex items-center gap-1 bg-green-700 text-white text-xs px-1.5 py-0.5 mb-2">
                                                <span>{rp.rating.average.toFixed(1)}</span>
                                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-semibold text-gray-900">₹{rp.price.toLocaleString('en-IN')}</span>
                                            {rp.originalPrice && rp.originalPrice > rp.price && (
                                                <>
                                                    <span className="text-xs text-gray-400 line-through">₹{rp.originalPrice.toLocaleString('en-IN')}</span>
                                                    <span className="text-xs text-green-600">{Math.round((1 - rp.price / rp.originalPrice) * 100)}% off</span>
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
