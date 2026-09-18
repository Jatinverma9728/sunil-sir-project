import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const failureRate = new Rate('failed_requests');
const reqDuration = new Trend('api_latency', true);

export const options = {
    stages: [
        { duration: '5s', target: 50 },   // Warmup to 50 VUs
        { duration: '15s', target: 100 }, // 100 VUs
        { duration: '15s', target: 200 }, // 200 VUs
        { duration: '10s', target: 300 }, // 300 VUs (extreme saturation test)
        { duration: '5s', target: 0 },    // Cooldown
    ],
    thresholds: {
        failed_requests: ['rate<0.01'], // < 1% errors
        api_latency: ['p(95)<100'],     // 95% of requests under 100ms
        api_latency: ['p(50)<10'],      // Median under 10ms
    },
};

const BASE_URL = 'http://localhost:5000';

const ENDPOINTS = [
    '/health',
    '/api/products?page=1&limit=12',
    '/api/products/categories',
    '/api/courses',
    '/api/banners',
    '/api/announcements',
    '/api/offers',
];

export default function () {
    // Pick an endpoint randomly or cycle through
    const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    const res = http.get(`${BASE_URL}${endpoint}`);
    reqDuration.add(res.timings.duration);

    const ok = check(res, {
        'status is 200': (r) => r.status === 200,
        'has timing header': (r) => r.headers['X-Response-Time'] !== undefined,
    });
    failureRate.add(!ok);
}
