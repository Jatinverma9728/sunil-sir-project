"use client";

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetKeys?: Array<string | number>;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors
 * Prevents the entire app from crashing when an error occurs
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // TODO: Log to error reporting service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    componentDidUpdate(prevProps: Props) {
        // Reset error boundary when resetKeys change
        if (this.state.hasError && prevProps.resetKeys !== this.props.resetKeys) {
            this.resetErrorBoundary();
        }
    }

    resetErrorBoundary = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <DefaultErrorFallback
                    error={this.state.error}
                    resetErrorBoundary={this.resetErrorBoundary}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
    error,
    resetErrorBoundary,
}: {
    error: Error | null;
    resetErrorBoundary: () => void;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600">
                        We're sorry for the inconvenience. An unexpected error occurred.
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && error && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm font-mono text-red-600 break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={resetErrorBoundary}
                        className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                        Go Home
                    </button>
                </div>

                <p className="text-sm text-gray-500 text-center mt-6">
                    If this problem persists, please{' '}
                    <a href="/contact" className="text-gray-900 hover:underline">
                        contact support
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

export default ErrorBoundary;
