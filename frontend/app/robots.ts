import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://northtechhub.in';

    // Pages that no bot (including AI) should index
    const disallowedPaths = [
        '/checkout/',
        '/api/',
        '/dashboard/',
        '/account/',
        '/orders/',
        '/admin/',
        '/my-courses/',
        '/profile/',
        '/*?*sort=*',
        '/*?*filter=*',
    ];

    return {
        rules: [
            // ─── Standard Search Engines ────────────────────────────────
            {
                userAgent: '*',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── OpenAI / ChatGPT ────────────────────────────────────────
            // Allows ChatGPT to learn about products and courses
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: disallowedPaths,
            },
            // ChatGPT browsing plugin
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: disallowedPaths,
            },
            // OpenAI's research crawler
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Google Gemini / Bard ────────────────────────────────────
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: disallowedPaths,
            },
            // Google Vertex AI
            {
                userAgent: 'Googlebot-Extended',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Anthropic / Claude ──────────────────────────────────────
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: disallowedPaths,
            },
            {
                userAgent: 'Claude-Web',
                allow: '/',
                disallow: disallowedPaths,
            },
            {
                userAgent: 'anthropic-ai',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Perplexity AI ───────────────────────────────────────────
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Meta AI ─────────────────────────────────────────────────
            {
                userAgent: 'meta-externalagent',
                allow: '/',
                disallow: disallowedPaths,
            },
            {
                userAgent: 'FacebookBot',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Microsoft Copilot / Bing AI ─────────────────────────────
            {
                userAgent: 'bingbot',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── You.com ─────────────────────────────────────────────────
            {
                userAgent: 'YouBot',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Cohere AI ───────────────────────────────────────────────
            {
                userAgent: 'cohere-ai',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Common Crawl (used by many AI training pipelines) ───────
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Apple AI (Siri / Apple Intelligence) ────────────────────
            {
                userAgent: 'Applebot',
                allow: '/',
                disallow: disallowedPaths,
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
                disallow: disallowedPaths,
            },

            // ─── Bytedance / Doubao AI ───────────────────────────────────
            {
                userAgent: 'Bytespider',
                allow: '/',
                disallow: disallowedPaths,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

