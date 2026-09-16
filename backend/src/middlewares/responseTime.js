/**
 * High-Resolution Response Time Middleware
 * Calculates request-to-response duration in milliseconds with sub-millisecond precision
 * and attaches the `X-Response-Time` header.
 */
const responseTime = (req, res, next) => {
    const start = process.hrtime.bigint();

    // Hook into writeHead to ensure header is set before response headers are flushed
    const originalWriteHead = res.writeHead;
    res.writeHead = function (...args) {
        const end = process.hrtime.bigint();
        const durationNs = end - start;
        const durationMs = (Number(durationNs) / 1e6).toFixed(2);
        res.setHeader('X-Response-Time', `${durationMs}ms`);
        return originalWriteHead.apply(this, args);
    };

    next();
};

module.exports = responseTime;
