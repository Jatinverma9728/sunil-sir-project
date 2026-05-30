"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, type Product } from "@/lib/api/products";

const queryTerms = [
    "refurbished laptop",
    "second hand laptop",
    "used laptop",
    "renewed laptop",
    "computer accessories",
    "keyboard mouse",
];

const conditionTerms = ["refurbished", "second hand", "used", "renewed"];
const laptopTerms = ["laptop", "notebook"];
const accessoryTerms = ["accessory", "accessories", "keyboard", "mouse", "monitor", "adapter", "charger", "ssd", "ram", "cable"];

const categoryLinks = [
    {
        title: "Refurbished laptops",
        description: "Tested laptops for work, study, and business use.",
        href: "/products?search=refurbished%20laptop",
        tone: "bg-blue-50 border-blue-100 text-blue-700",
    },
    {
        title: "Second hand laptops",
        description: "Budget friendly machines with practical specs.",
        href: "/products?search=second%20hand%20laptop",
        tone: "bg-emerald-50 border-emerald-100 text-emerald-700",
    },
    {
        title: "Computer accessories",
        description: "Keyboards, mice, chargers, storage, and desk essentials.",
        href: "/products?search=computer%20accessories",
        tone: "bg-slate-50 border-slate-200 text-slate-700",
    },
];

const productScore = (product: Product) => {
    const text = [
        product.title,
        product.description,
        product.category,
        product.brand,
        ...(product.tags || []),
    ].filter(Boolean).join(" ").toLowerCase();

    const hasCondition = conditionTerms.some((term) => text.includes(term));
    const hasLaptop = laptopTerms.some((term) => text.includes(term));
    const laptopScore = hasCondition && hasLaptop ? 6 : hasCondition ? 3 : 0;
    const accessoryScore = accessoryTerms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);

    return laptopScore + accessoryScore;
};

export default function RefurbishedSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const responses = await Promise.all([
                    getProducts({ limit: 60 }),
                    ...queryTerms.map((search) => getProducts({ search, limit: 12 })),
                ]);

                const merged = new Map<string, Product>();
                responses.forEach((response) => {
                    if (!response.success || !response.data) return;
                    response.data.forEach((product) => merged.set(product._id, product));
                });

                const curated = Array.from(merged.values())
                    .map((product) => ({ product, score: productScore(product) }))
                    .filter(({ score }) => score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 8)
                    .map(({ product }) => product);

                if (!cancelled) setProducts(curated);
            } catch (error) {
                console.error("Error fetching refurbished products:", error);
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    const hasProducts = products.length > 0;
    const visibleProducts = useMemo(() => products.slice(0, 4), [products]);

    return (
        <section className="bg-white py-14 md:py-16">
            <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-semibold uppercase text-[var(--primary-electric)]">Pre-owned tech</p>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Refurbished laptops and accessories</h2>
                        <p className="mt-3 text-base leading-relaxed text-gray-600">
                            Reliable laptops and computer essentials for students, offices, and everyday productivity.
                        </p>
                    </div>
                    <Link
                        href="/products?search=refurbished%20laptop"
                        className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-electric)]"
                    >
                        Browse collection
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="h-[390px] animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
                        ))}
                    </div>
                ) : hasProducts ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {visibleProducts.map((product, index) => (
                            <ProductCard key={product._id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {categoryLinks.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`rounded-lg border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${item.tone}`}
                            >
                                <h3 className="text-lg font-bold">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {hasProducts && (
                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                        {categoryLinks.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[var(--primary-electric)] hover:bg-white hover:text-[var(--primary-electric)]"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
