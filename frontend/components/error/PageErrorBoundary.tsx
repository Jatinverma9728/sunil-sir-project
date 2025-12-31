"use client";

import Link from 'next/link';

/**
 * Page-level error boundary fallback
 * Optimized for page-specific errors
 */
export default function PageErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-medium text-gray-900 mb-3">
                    Something went wrong
                </h1>
                <p className="text-gray-600 mb-8">
                    We apologize for the inconvenience. The page encountered an error.
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-left">
                        <p className="text-sm font-mono text-red-700 break-words">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-600 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors inline-block"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Support Link */}
                <p className="text-sm text-gray-500 mt-8">
                    Need help?{' '}
                    <Link href="/contact" className="text-gray-900 hover:underline font-medium">
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    );
}
