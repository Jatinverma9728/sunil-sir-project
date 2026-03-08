import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found - North Tech Hub",
    description: "Sorry, we couldn't find the page you're looking for. Browse our electronics or courses at North Tech Hub.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <p className="text-[10rem] font-black text-gray-100 select-none leading-none">404</p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Oops! Page Not Found
                </h1>
                <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                {/* Quick Links */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                    <a href="/" className="group flex flex-col items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-slate-900 hover:bg-slate-900 transition-all duration-200">
                        <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-semibold text-gray-700 group-hover:text-white transition-colors">Home</span>
                    </a>
                    <a href="/products" className="group flex flex-col items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-slate-900 hover:bg-slate-900 transition-all duration-200">
                        <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="font-semibold text-gray-700 group-hover:text-white transition-colors">Shop</span>
                    </a>
                    <a href="/courses" className="group flex flex-col items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-slate-900 hover:bg-slate-900 transition-all duration-200">
                        <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="font-semibold text-gray-700 group-hover:text-white transition-colors">Courses</span>
                    </a>
                </div>

                <a href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </a>
            </div>
        </div>
    );
}
