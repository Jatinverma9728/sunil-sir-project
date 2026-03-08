import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in';

    // Base static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/shipping`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    try {
        // Attempt to fetch dynamic products
        // We wrap this in try-catch so the build doesn't fail if the API is down
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        // Fetch Products
        const productsRes = await fetch(`${apiUrl}/products?limit=1000`);
        if (productsRes.ok) {
            const { data: products } = await productsRes.json();
            if (Array.isArray(products)) {
                const productRoutes = products.map((product) => ({
                    url: `${baseUrl}/products/${product._id}`,
                    lastModified: new Date(product.updatedAt || new Date()),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
                routes.push(...productRoutes);
            }
        }

        // Fetch Courses
        const coursesRes = await fetch(`${apiUrl}/courses?limit=1000`);
        if (coursesRes.ok) {
            const { data: courses } = await coursesRes.json();
            if (Array.isArray(courses)) {
                const courseRoutes = courses.map((course) => ({
                    url: `${baseUrl}/courses/${course._id}`,
                    lastModified: new Date(course.updatedAt || new Date()),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
                routes.push(...courseRoutes);
            }
        }
    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);
    }

    return routes;
}
