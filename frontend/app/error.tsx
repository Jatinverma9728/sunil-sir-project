"use client";

import PageErrorBoundary from '@/components/error/PageErrorBoundary';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return <PageErrorBoundary error={error} reset={reset} />;
}
