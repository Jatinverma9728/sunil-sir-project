import ProductsClient, { type Product } from "./products-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

interface ProductsResponse {
    success?: boolean;
    data?: Product[];
    pagination?: {
        total?: number;
        totalPages?: number;
    };
    total?: number;
    count?: number;
    pages?: number;
}

async function getInitialProducts(): Promise<ProductsResponse> {
    try {
        const res = await fetch(`${API_URL}/products?page=1&limit=12&sort=popular`, {
            next: { revalidate: 1800 },
        });
        if (!res.ok) return { data: [] };

        const data = await res.json();
        if (!data.success || !Array.isArray(data.data)) return { data: [] };

        return data;
    } catch {
        return { data: [] };
    }
}

function productImage(product: Product): string | undefined {
    const image = product.images?.[0];
    return image?.url;
}

export default async function ProductsPage() {
    const initialData = await getInitialProducts();
    const products = initialData.data || [];
    const pagination = initialData.pagination || {
        total: initialData.total || initialData.count || products.length,
        totalPages: initialData.pages || 1,
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Electronics and Tech Gadgets India",
        url: `${SITE_URL}/products`,
        description: "Browse electronics, refurbished laptops, accessories, IoT kits, developer tools, and tech gadgets from North Tech Hub in India.",
        isPartOf: {
            "@type": "WebSite",
            name: "North Tech Hub",
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/products/${product._id}`,
                name: product.title,
                image: productImage(product),
            })),
        },
    };

    return (
        <>
            <script
                id="products-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <ProductsClient initialProducts={products} initialPagination={pagination} />
        </>
    );
}
