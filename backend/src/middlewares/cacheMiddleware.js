const { cache } = require('../utils/lruCache');

/**
 * Generate a canonical cache key from the request URL, sorting query parameters
 * for consistent cache hits regardless of query param order.
 * @param {import('express').Request} req
 * @returns {string}
 */
const getCanonicalCacheKey = (req) => {
    const url = new URL(req.originalUrl || req.url, 'http://localhost');
    const sortedParams = Array.from(url.searchParams.entries()).sort(([a], [b]) => a.localeCompare(b));
    const searchString = new URLSearchParams(sortedParams).toString();
    return `${req.baseUrl || ''}${url.pathname}${searchString ? '?' + searchString : ''}`;
};

/**
 * Express middleware for sub-millisecond route caching with LRU eviction and tag invalidation.
 * @param {object} options
 * @param {number} [options.ttl=300] - TTL in seconds (default: 5 minutes)
 * @param {string[]|Function} [options.tags=[]] - Categorical tags for bulk invalidation
 */
const cacheMiddleware = (options = {}) => {
    const { ttl = 300, tags = [] } = options;

    return (req, res, next) => {
        // Only cache safe GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Bypass cache if request specifies no-cache
        if (req.headers['cache-control'] === 'no-cache') {
            res.setHeader('X-Cache', 'BYPASS');
            return next();
        }

        const cacheKey = getCanonicalCacheKey(req);
        const cachedData = cache.get(cacheKey);

        if (cachedData !== null) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cachedData);
        }

        // Cache MISS: Intercept response to store payload
        res.setHeader('X-Cache', 'MISS');
        const originalJson = res.json.bind(res);

        res.json = (body) => {
            // Only cache successful 200 responses
            if (res.statusCode === 200 && body && body.success !== false) {
                const resolvedTags = typeof tags === 'function' ? tags(req) : tags;
                cache.set(cacheKey, body, ttl, resolvedTags);
            }
            return originalJson(body);
        };

        next();
    };
};

/**
 * Helper to invalidate one or more cache tags from any controller
 * @param {string|string[]} tags
 */
const invalidateCacheTags = (tags) => {
    return cache.invalidateTags(tags);
};

module.exports = {
    cacheMiddleware,
    invalidateCacheTags,
    cacheInstance: cache
};
