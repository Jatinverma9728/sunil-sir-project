/**
 * Empty state component for wishlist
 * Displays when user has no items in their wishlist
 */
import Link from "next/link";

export default function WishlistEmpty() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-12 h-12 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Your Wishlist is Empty
                </h2>
                <p className="text-gray-600 mb-8">
                    Start adding products you love to your wishlist. They'll be saved here for later!
                </p>

                {/* CTA Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Browse Products
                </Link>

                {/* Additional info */}
                <p className="text-sm text-gray-500 mt-8">
                    💡 Tip: Click the heart icon on any product to add it to your wishlist
                </p>
            </div>
        </div>
    );
}
