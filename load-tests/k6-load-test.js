import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom Metrics
const failureRate = new Rate('failed_requests');
const apiDuration = new Trend('api_req_duration', true);
const frontendDuration = new Trend('frontend_req_duration', true);

// Configuration & Ramping Stages
export const options = {
    stages: [
        { duration: '10s', target: 20 },  // Stage 1: Warmup to 20 VUs
        { duration: '20s', target: 50 },  // Stage 2: Ramp up to 50 VUs (Peak normal load)
        { duration: '20s', target: 100 }, // Stage 3: Surge to 100 VUs (High stress load)
        { duration: '15s', target: 150 }, // Stage 4: Spike to 150 VUs (Extreme traffic spike)
        { duration: '10s', target: 0 },   // Stage 5: Cooldown to 0 VUs
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'],       // Overall failure rate must be under 5%
        http_req_duration: ['p(95)<1500'],    // 95% of requests should respond in under 1.5s
        'api_req_duration': ['p(95)<500'],    // 95% of API requests should respond in under 500ms
        'api_req_duration': ['p(50)<50'],     // Median API request should be sub-50ms (cached)
    },
};

const BASE_API_URL = 'http://localhost:5000';
const BASE_FRONTEND_URL = 'http://localhost:3000';

export default function () {
    // -------------------------------------------------------------
    // GROUP 1: PUBLIC BACKEND API (Cached & Dynamic Endpoints)
    // -------------------------------------------------------------
    group('Backend API Endpoints', function () {
        // 1. Health & Diagnostics
        {
            const res = http.get(`${BASE_API_URL}/health`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Health status is 200': (r) => r.status === 200,
                'Health has X-Response-Time header': (r) => r.headers['X-Response-Time'] !== undefined,
            });
            failureRate.add(!ok);
        }

        // 2. Product Catalog (Cached after warm-up)
        {
            const res = http.get(`${BASE_API_URL}/api/products?page=1&limit=12`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Products status is 200': (r) => r.status === 200,
                'Products has X-Cache header': (r) => r.headers['X-Cache'] !== undefined,
            });
            failureRate.add(!ok);
        }

        // 3. Product Categories (Cached: 900s TTL)
        {
            const res = http.get(`${BASE_API_URL}/api/products/categories`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Categories status is 200': (r) => r.status === 200,
                'Categories has X-Cache header': (r) => r.headers['X-Cache'] !== undefined,
            });
            failureRate.add(!ok);
        }

        // 4. Courses Catalog (Cached: 120s TTL)
        {
            const res = http.get(`${BASE_API_URL}/api/courses`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Courses status is 200': (r) => r.status === 200,
                'Courses has X-Cache header': (r) => r.headers['X-Cache'] !== undefined,
            });
            failureRate.add(!ok);
        }

        // 5. Promotional Banners (Cached: 300s TTL)
        {
            const res = http.get(`${BASE_API_URL}/api/banners`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Banners status is 200': (r) => r.status === 200,
                'Banners has X-Cache header': (r) => r.headers['X-Cache'] !== undefined,
            });
            failureRate.add(!ok);
        }

        // 6. Announcements (Cached: 300s TTL)
        {
            const res = http.get(`${BASE_API_URL}/api/announcements`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Announcements status is 200': (r) => r.status === 200,
            });
            failureRate.add(!ok);
        }

        // 7. Active Offers (Cached: 300s TTL)
        {
            const res = http.get(`${BASE_API_URL}/api/offers`);
            apiDuration.add(res.timings.duration);
            const ok = check(res, {
                'Offers status is 200': (r) => r.status === 200,
            });
            failureRate.add(!ok);
        }
    });

    // -------------------------------------------------------------
    // GROUP 2: FRONTEND PAGES (Next.js SSR & Static HTML)
    // -------------------------------------------------------------
    group('Frontend Web Pages', function () {
        // 1. Home Page
        {
            const res = http.get(`${BASE_FRONTEND_URL}/`);
            frontendDuration.add(res.timings.duration);
            const ok = check(res, {
                'Frontend Home status is 200': (r) => r.status === 200,
            });
            failureRate.add(!ok);
        }

        // 2. Refurbished Laptops Vertical Catalog
        {
            const res = http.get(`${BASE_FRONTEND_URL}/refurbished-laptops`);
            frontendDuration.add(res.timings.duration);
            const ok = check(res, {
                'Frontend Laptops status is 200': (r) => r.status === 200,
            });
            failureRate.add(!ok);
        }

        // 3. Courses Vertical Catalog
        {
            const res = http.get(`${BASE_FRONTEND_URL}/courses`);
            frontendDuration.add(res.timings.duration);
            const ok = check(res, {
                'Frontend Courses status is 200': (r) => r.status === 200,
            });
            failureRate.add(!ok);
        }
    });

    // Virtual user think-time between simulated actions (0.5s to 1s)
    sleep(0.5);
}
