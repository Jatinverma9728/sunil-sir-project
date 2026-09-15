import type { Metadata } from "next";
import AccessoriesClient from "./accessories-client";
import type { Product } from "@/lib/api/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

export const metadata: Metadata = {
    title: "Computer Accessories, Keyboards & Docks India | North Tech Hub",
    description: "Shop premium mechanical keyboards, ergonomic mice, USB-C docks, 65W GaN fast chargers, NVMe enclosures, and laptop risers with 1-Year warranty across India.",
    keywords: [
        "computer accessories India",
        "mechanical keyboards",
        "ergonomic mouse",
        "USB-C multiport hub",
        "GaN fast charger",
        "NVMe SSD enclosure",
        "laptop stand aluminum",
        "North Tech Hub accessories"
    ],
    openGraph: {
        title: "Computer Accessories & Peripherals | North Tech Hub",
        description: "Premium mechanical keyboards, ergonomic mice, docks, and chargers with 1-Year warranty.",
        url: `${SITE_URL}/computer-accessories`,
        type: "website"
    }
};

async function getInitialAccessories(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products?category=computer-accessories,accessories,computers-hardware,laptop-computer-parts&limit=40`, {
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

export default async function ComputerAccessoriesPage() {
    const products = await getInitialAccessories();

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Computer Accessories & Peripherals India",
        url: `${SITE_URL}/computer-accessories`,
        description: "Browse computer accessories, mechanical keyboards, precision mice, and hubs at North Tech Hub.",
        isPartOf: {
            "@type": "WebSite",
            name: "North Tech Hub",
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/products/${item._id}`,
                name: item.title,
                image: item.images?.[0]?.url,
            })),
        },
    };

    return (
        <>
            <script
                id="accessories-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <AccessoriesClient initialProducts={products} totalCount={products.length} />
        </>
    );
}
