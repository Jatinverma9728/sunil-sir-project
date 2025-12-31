/**
 * Reusable skeleton component for product cards
 * Provides visual feedback during loading state
 */
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Image skeleton */}
            <div className="relative h-64 bg-gray-100 m-4 rounded-2xl animate-pulse" />

            {/* Content skeleton */}
            <div className="px-5 pb-6 space-y-3">
                {/* Category */}
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Price and button */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="w-11 h-11 bg-gray-100 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}

/**
 * Grid of product card skeletons
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
