import type { Metadata } from "next";
import LaptopsClient from "./laptops-client";
import type { Product } from "@/lib/api/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

export const metadata: Metadata = {
    title: "Certified Refurbished Laptops India | 1-Year Warranty | North Tech Hub",
    description: "Shop Grade A+ certified refurbished laptops in India. Lenovo ThinkPads, Dell Latitudes, HP EliteBooks, and Apple MacBooks with 32-point inspection, 1-Year warranty, and fast shipping.",
    keywords: [
        "refurbished laptops India",
        "second hand laptops",
        "used ThinkPad T480s",
        "Dell Latitude refurbished",
        "HP EliteBook refurbished",
        "certified refurbished laptops",
        "cheap gaming laptop India",
        "business laptop under 25000",
        "North Tech Hub laptops"
    ],
    openGraph: {
        title: "Certified Refurbished Laptops India | North Tech Hub",
        description: "Grade A+ tested laptops with 1-Year comprehensive warranty and 7-Day replacement.",
        url: `${SITE_URL}/refurbished-laptops`,
        type: "website"
    }
};

async function getInitialLaptops(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products?category=laptops&limit=30`, {
            next: { revalidate: 1800 },
        });
        if (!res.ok) return [];

        const data = await res.json();
        if (!data.success || !Array.isArray(data.data)) return [];

        return data.data;
    } catch {
        return [];
    }
}

export default async function RefurbishedLaptopsPage() {
    const laptops = await getInitialLaptops();

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Certified Refurbished Laptops in India",
        url: `${SITE_URL}/refurbished-laptops`,
        description: "Browse Grade A+ certified refurbished laptops from Lenovo ThinkPad, Dell, HP, and Apple with 1-year warranty and free shipping across India.",
        isPartOf: {
            "@type": "WebSite",
            name: "North Tech Hub",
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: laptops.map((laptop, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/products/${laptop._id}`,
                name: laptop.title,
                image: laptop.images?.[0]?.url,
            })),
        },
    };

    return (
        <>
            <script
                id="laptops-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <LaptopsClient initialProducts={laptops} totalCount={laptops.length} />
        </>
    );
}
