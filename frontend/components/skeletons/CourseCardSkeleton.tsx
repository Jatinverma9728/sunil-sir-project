/**
 * Reusable skeleton component for course cards
 * Provides visual feedback during course data loading
 */
export function CourseCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Thumbnail skeleton */}
            <div className="relative h-48 bg-gray-100 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
                {/* Category badge */}
                <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-5 w-4/5 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Instructor and stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Price and enroll button */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-7 w-20 bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-28 bg-gray-100 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}

/**
 * Grid of course card skeletons
 */
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <CourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
