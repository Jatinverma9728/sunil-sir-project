"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useOffers } from "@/lib/hooks/useOffers";
import ReviewSection from "@/components/products/ReviewSection";
import ImageZoom from "@/components/products/ImageZoom";
import { 
    ChevronRight, 
    Heart, 
    ShoppingBag, 
    Zap, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    CreditCard, 
    Star,
    Sparkles
} from "lucide-react";

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

interface ProductDetailClientProps {
    initialProduct?: Product | null;
}

export default function ProductDetailClient({ initialProduct = null }: ProductDetailClientProps) {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { getProductOffer } = useOffers();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(
        initialProduct ? { ...initialProduct, inStock: initialProduct.stock ? initialProduct.stock > 0 : true } : null
    );
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(!initialProduct);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [pincode, setPincode] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState<{ available: boolean; date: string } | null>(null);
    const [checkingDelivery, setCheckingDelivery] = useState(false);

    useEffect(() => {
        if (!productId) return;
        if (initialProduct) {
            fetchRelatedProducts(initialProduct.category);
            return;
        }
        fetchProduct();
    }, [productId, initialProduct?._id]);

    const fetchRelatedProducts = async (category: string) => {
        try {
            const { getProducts } = await import("@/lib/api/products");
            const relatedRes = await getProducts({
                category,
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
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    };

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const { getProduct: fetchProductAPI } = await import("@/lib/api/products");
            const response = await fetchProductAPI(productId);
            if (response.success && response.data) {
                const productData = {
                    ...response.data,
                    inStock: response.data.stock ? response.data.stock > 0 : true,
                };
                setProduct(productData);
                fetchRelatedProducts(response.data.category);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const activeOffer = product ? getProductOffer(product._id, product.category, product.price) : null;
    const finalPrice = activeOffer ? activeOffer.discountedPrice : (product?.price ?? 0);
    const displayOriginalPrice = activeOffer ? activeOffer.originalPrice : product?.originalPrice;

    const getRating = () => {
        if (!product?.rating) return { avg: 0, count: 0 };
        if (typeof product.rating === "number") return { avg: product.rating, count: product.reviews || 0 };
        return { avg: product.rating.average, count: product.rating.count };
    };

    const handleAddToCart = async () => {
        if (!product?.inStock) return;
        setAdding(true);
        const productForCart = {
            ...product,
            price: finalPrice,
            originalPrice: displayOriginalPrice || product.price,
        };
        addToCart(productForCart, quantity);
        await new Promise((r) => setTimeout(r, 500));
        setAdding(false);
    };

    const handleBuyNow = () => {
        if (!product?.inStock) return;
        const productForCart = {
            ...product,
            price: finalPrice,
            originalPrice: displayOriginalPrice || product.price,
        };
        addToCart(productForCart, quantity);
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
                                {[...Array(4)].map((_, i) => <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl" />)}
                            </div>
                            <div className="w-full lg:w-96 aspect-square bg-gray-100 rounded-2xl" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(8)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                        <span>← Back to Products</span>
                    </Link>
                </div>
            </div>
        );
    }

    const { avg, count } = getRating();
    const images = (product.images || []).map((img) => (typeof img === "string" ? img : img.url));
    const discount = displayOriginalPrice ? Math.round((1 - finalPrice / displayOriginalPrice) * 100) : 0;
    const savings = displayOriginalPrice ? displayOriginalPrice - finalPrice : 0;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <nav className="bg-slate-50 border-b border-slate-200" aria-label="Breadcrumb">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <ol className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-1">
                        <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                        <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                        <li><Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link></li>
                        <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                        <li>
                            <Link
                                href={
                                    product.category === 'laptops'
                                        ? '/refurbished-laptops'
                                        : ['iot', 'raspberry-pi', 'diy-kits', 'rfid', 'drone-kit', 'sensor', 'arduino', '3d-printer'].includes(product.category)
                                        ? '/iot'
                                        : ['computer-accessories', 'accessories', 'computers-hardware', 'laptop-computer-parts'].includes(product.category)
                                        ? '/computer-accessories'
                                        : `/products?category=${product.category}`
                                }
                                className="hover:text-blue-600 transition-colors capitalize"
                            >
                                {product.category === 'laptops'
                                    ? 'Refurbished Laptops'
                                    : ['iot', 'raspberry-pi', 'diy-kits', 'rfid', 'drone-kit', 'sensor', 'arduino', '3d-printer'].includes(product.category)
                                    ? 'IoT & Robotics'
                                    : ['computer-accessories', 'accessories', 'computers-hardware', 'laptop-computer-parts'].includes(product.category)
                                    ? 'Computer Accessories'
                                    : product.category}
                            </Link>
                        </li>
                        <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                        <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">{product.title.substring(0, 50)}</li>
                    </ol>
                </div>
            </nav>

            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-6 lg:gap-8">
                    {/* Left: Vertical Thumbnails */}
                    {images.length > 1 && (
                        <aside className="hidden lg:block" aria-label="Product image thumbnails">
                            <div className="flex flex-col gap-3 sticky top-6">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        onMouseEnter={() => setSelectedImage(i)}
                                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${selectedImage === i
                                            ? 'border-blue-600 shadow-md ring-2 ring-blue-100'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        aria-label={`View image ${i + 1} of ${images.length}`}
                                    >
                                        <img src={img} alt={`${product.title} - View ${i + 1}`} className="w-full h-full object-contain p-1" />
                                    </button>
                                ))}
                            </div>
                        </aside>
                    )}

                    {/* Center: Main Image */}
                    <div className="w-full lg:max-w-xl">
                        <div className="sticky top-6">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 relative shadow-xs">
                                <div className="aspect-square relative">
                                    {images.length > 0 ? (
                                        <>
                                            <div className="hidden lg:block w-full h-full">
                                                <ImageZoom
                                                    src={images[selectedImage]}
                                                    alt={`${product.title} - image ${selectedImage + 1}`}
                                                />
                                            </div>
                                            <div className="lg:hidden w-full h-full relative">
                                                <Image
                                                    src={images[selectedImage]}
                                                    alt={`${product.title} - image ${selectedImage + 1}`}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                    sizes="100vw"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7.5 12 3 4 7.5m16 0v9L12 21m8-13.5-8 4.5m0 9v-9m0 0L4 7.5m8 4.5-8-4.5m0 0v9L12 21" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Wishlist */}
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
                                        className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm border rounded-xl shadow-xs transition-all ${isInWishlist(product._id)
                                            ? 'text-rose-600 border-rose-200 bg-rose-50/70'
                                            : 'text-gray-400 border-slate-200 hover:border-rose-300 hover:text-rose-500'
                                            }`}
                                        aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-rose-600' : ''}`} />
                                    </button>

                                    {images.length > 1 && (
                                        <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                                            {selectedImage + 1} / {images.length}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2.5 mt-4 lg:hidden overflow-x-auto pb-2">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition ${selectedImage === i ? 'border-blue-600 shadow-sm' : 'border-slate-200'}`}
                                            aria-label={`View image ${i + 1}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || adding}
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm hover:shadow transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {adding ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                            <span>ADDING...</span>
                                        </span>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>ADD TO CART</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5" />
                                    <span>BUY NOW</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-5">
                        {product.brand && (
                            <div>
                                <Link href={`/products?brand=${product.brand}`} className="text-sm text-blue-600 hover:underline font-semibold tracking-wide">
                                    Visit {product.brand} Store
                                </Link>
                            </div>
                        )}

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {count > 0 && (
                            <div className="flex items-center gap-4 pb-5 border-b border-gray-200">
                                <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 text-sm font-bold rounded-lg shadow-xs">
                                    <span>{avg.toFixed(1)}</span>
                                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                                </div>
                                <span className="text-sm text-gray-600 font-medium">{count.toLocaleString()} Ratings & Reviews</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="pb-6 border-b border-gray-200">
                            {activeOffer && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 inline-flex items-center gap-1 shadow-xs rounded-lg">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        {activeOffer.offerName}
                                    </span>
                                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 inline-block shadow-xs rounded-lg">
                                        {discount}% OFF
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-2">
                                <span className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                    {"\u20B9"}{finalPrice.toLocaleString('en-IN')}
                                </span>
                                {displayOriginalPrice && displayOriginalPrice > finalPrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            {"\u20B9"}{displayOriginalPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-lg text-emerald-600 font-bold">
                                            {discount}% off
                                        </span>
                                    </>
                                )}
                            </div>
                            {savings > 0 && (
                                <p className="text-emerald-700 font-semibold text-sm">
                                    You Save: {"\u20B9"}{savings.toLocaleString('en-IN')} ({discount}%)
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2 font-medium">Inclusive of all taxes</p>
                        </div>

                        {/* Stock */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider text-gray-500">Availability</h2>
                            {product.inStock ? (
                                <div className="flex items-center gap-2 text-emerald-700">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="font-semibold text-sm">In Stock</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-rose-700">
                                    <div className="w-2.5 h-2.5 bg-rose-600 rounded-full"></div>
                                    <span className="font-semibold text-sm">Out of Stock</span>
                                </div>
                            )}
                            {product.stock && product.stock < 10 && product.inStock && (
                                <p className="text-amber-600 font-medium mt-2 text-sm">
                                    Only {product.stock} left in stock - order soon.
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="pb-6 border-b border-gray-200">
                            <label htmlFor="quantity" className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Quantity</label>
                            <select
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border border-slate-300 rounded-xl px-4 py-2.5 w-full lg:w-36 font-medium text-gray-800 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>Qty: {num}</option>
                                ))}
                            </select>
                        </div>

                        {/* Delivery */}
                        <div className="pb-6 border-b border-gray-200">
                            <h2 className="font-bold text-gray-500 mb-4 text-xs uppercase tracking-wider">Delivery Options</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) => {
                                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setDeliveryInfo(null);
                                    }}
                                    placeholder="Enter 6-digit Pincode"
                                    className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
                                    maxLength={6}
                                />
                                <button
                                    onClick={checkDelivery}
                                    disabled={pincode.length !== 6 || checkingDelivery}
                                    className="px-6 py-2.5 text-sm font-semibold text-blue-600 border border-slate-300 rounded-xl hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all shadow-xs"
                                >
                                    {checkingDelivery ? 'Checking...' : 'Check'}
                                </button>
                            </div>
                            {deliveryInfo && (
                                <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                                    <p className="font-semibold text-sm">Delivery by {deliveryInfo.date}</p>
                                    <p className="text-xs text-emerald-700 mt-1">if ordered today</p>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="pb-6 border-b border-gray-200">
                                <h2 className="font-bold text-gray-500 mb-4 text-xs uppercase tracking-wider">Key Features</h2>
                                <ul className="space-y-2.5 text-sm text-gray-700">
                                    {product.features.map((feature, i) => (
                                        <li key={i} className="flex gap-2.5 items-start">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span className="leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Policies */}
                        <div>
                            <h2 className="font-bold text-gray-500 mb-4 text-xs uppercase tracking-wider">Services & Policies</h2>
                            <ul className="space-y-3 text-sm text-gray-700">
                                {[
                                    { icon: RotateCcw, label: "7 Days Replacement", desc: "Hassle-free replacement for damaged or defective products" },
                                    { icon: CreditCard, label: "Cash on Delivery", desc: "Pay when you receive the product at your doorstep" },
                                    { icon: ShieldCheck, label: "Secure Payments", desc: "All transactions are encrypted and 100% secure" },
                                    { icon: Truck, label: "Free Shipping", desc: "No delivery charges on this product" },
                                ].map((item, i) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5 shrink-0">
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <span className="leading-snug"><strong>{item.label}:</strong> {item.desc}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {(product.sku || product.category) && (
                            <div className="pt-5 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                                {product.sku && <p><strong className="text-gray-700">SKU:</strong> {product.sku}</p>}
                                {product.category && <p><strong className="text-gray-700">Category:</strong> {product.category}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Full-Width Sections */}
                <div className="mt-12 space-y-6">
                    <section className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden" aria-labelledby="description-heading">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h2 id="description-heading" className="text-lg font-bold text-gray-900">Product Description</h2>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    </section>

                    {product.specifications && product.specifications.length > 0 && (
                        <section className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden" aria-labelledby="specs-heading">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                <h2 id="specs-heading" className="text-lg font-bold text-gray-900">Technical Specifications</h2>
                            </div>
                            <div className="px-4 sm:px-6 py-5 overflow-x-auto">
                                <table className="w-full min-w-[300px]">
                                    <tbody>
                                        {product.specifications.map((spec, i) => (
                                            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                                <th scope="row" className="py-3 pr-4 font-semibold text-gray-700 w-1/3 text-left text-sm">{spec.label}</th>
                                                <td className="py-3 text-gray-900 text-sm">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    <section className="rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden" aria-labelledby="reviews-heading">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h2 id="reviews-heading" className="text-lg font-bold text-gray-900">Customer Reviews</h2>
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
                    <section className="mt-12" aria-labelledby="related-heading">
                        <h2 id="related-heading" className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {relatedProducts.map((rp: any) => (
                                <article key={rp._id} className="rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all bg-white overflow-hidden flex flex-col">
                                    <Link href={`/products/${rp._id}`} className="block p-3 flex-1 flex flex-col">
                                        <div className="aspect-square mb-3 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                                            {rp.images?.[0] && (
                                                <img
                                                    src={typeof rp.images[0] === 'string' ? rp.images[0] : rp.images[0].url}
                                                    alt={rp.title}
                                                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                                                />
                                            )}
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">{rp.title}</h3>
                                        <div className="mt-auto flex items-baseline gap-2">
                                            <span className="font-bold text-gray-900 text-sm">{"\u20B9"}{rp.price.toLocaleString('en-IN')}</span>
                                            {rp.originalPrice && rp.originalPrice > rp.price && (
                                                <span className="text-xs text-emerald-600 font-semibold">{Math.round((1 - rp.price / rp.originalPrice) * 100)}% off</span>
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
