/**
 * Skeleton loader for order items in the orders list
 */
export function OrderSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
            </div>

            {/* Order items */}
            <div className="space-y-3 mb-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        </div>
    );
}

/**
 * List of order skeletons
 */
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <OrderSkeleton key={index} />
            ))}
        </div>
    );
}
