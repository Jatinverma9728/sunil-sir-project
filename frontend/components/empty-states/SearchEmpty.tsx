/**
 * Empty state component for search results
 * Displays when no products match the search query
 */
import Link from "next/link";

interface SearchEmptyProps {
    query?: string;
}

export default function SearchEmpty({ query }: SearchEmptyProps) {
    return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    No Results Found
                </h2>
                <p className="text-gray-600 mb-2">
                    {query ? (
                        <>
                            We couldn't find any products matching{" "}
                            <span className="font-medium text-gray-900">"{query}"</span>
                        </>
                    ) : (
                        "We couldn't find any products matching your filters"
                    )}
                </p>
                <p className="text-gray-500 text-sm mb-8">
                    Try adjusting your search or filters to find what you're looking for
                </p>

                {/* Suggestions */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <p className="font-medium text-gray-900 mb-3">Suggestions:</p>
                    <ul className="text-left space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            Check your spelling
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            Try more general keywords
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            Remove some filters
                        </li>
                    </ul>
                </div>

                {/* CTA Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                    View All Products
                </Link>
            </div>
        </div>
    );
}
