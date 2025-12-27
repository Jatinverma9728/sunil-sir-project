"use client";

import { useState } from "react";
import Image from "next/image";

interface Specification {
    label: string;
    value: string;
}

interface Review {
    _id?: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    verified?: boolean;
    images?: string[];
}

interface SpecificationsTabsProps {
    description: string;
    specifications: Specification[];
    reviews?: Review[];
    averageRating?: number;
    totalReviews?: number;
}

export default function SpecificationsTabs({
    description,
    specifications,
    reviews = [],
    averageRating = 4.8,
    totalReviews = 245,
}: SpecificationsTabsProps) {
    const [activeTab, setActiveTab] = useState<"description" | "info" | "review">("description");
    const [sortBy, setSortBy] = useState("newest");

    const tabs = [
        { id: "description", label: "Description" },
        { id: "info", label: "Additional Information" },
        { id: "review", label: "Review" },
    ] as const;

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : (star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1);
        return { star, count, percentage };
    });

    return (
        <div className="mt-16">
            {/* Tab Headers */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-sm font-medium transition-colors relative ${
                            activeTab === tab.id
                                ? "text-[#2D5A27]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D5A27]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {/* Description Tab */}
                {activeTab === "description" && (
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {description || "No description available for this product."}
                        </p>
                    </div>
                )}

                {/* Additional Information Tab */}
                {activeTab === "info" && (
                    <div className="max-w-2xl">
                        {specifications.length > 0 ? (
                            <table className="w-full">
                                <tbody>
                                    {specifications.map((spec, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3 pr-4 text-sm font-medium text-gray-900 w-1/3">
                                                {spec.label}
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">
                                                {spec.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No additional information available.</p>
                        )}
                    </div>
                )}

                {/* Review Tab */}
                {activeTab === "review" && (
                    <div>
                        {/* Rating Summary */}
                        <div className="flex items-start gap-12 mb-10">
                            {/* Average Rating */}
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                                <div className="text-sm text-gray-500 mt-1">out of 5</div>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">({totalReviews} Reviews)</div>
                            </div>

                            {/* Rating Bars */}
                            <div className="flex-1 space-y-2">
                                {ratingDistribution.map(({ star, percentage }) => (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 w-12">{star} Star</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Review List Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Review List</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    Showing 1-{Math.min(reviews.length || 3, 10)} of {totalReviews} results
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-sm border-0 text-gray-700 font-medium focus:ring-0 cursor-pointer"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="highest">Highest Rating</option>
                                        <option value="lowest">Lowest Rating</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Review Items */}
                        <div className="space-y-6">
                            {(reviews.length > 0 ? reviews : [
                                { userName: "Kristin Watson", rating: 5, comment: "Absolutely love this product! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "1 month ago", verified: true, images: [] },
                                { userName: "Jenny Wilson", rating: 5, comment: "Perfect for my skincare routine! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "2 month ago", verified: true, images: [] },
                                { userName: "Darlene Robertson", rating: 4, comment: "Great quality product, highly recommend!", date: "2 month ago", verified: true, images: [] },
                            ]).map((review, index) => (
                                <div key={index} className="pb-6 border-b border-gray-100 last:border-0">
                                    {/* Review Header */}
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                            <span className="text-lg font-medium text-gray-600">
                                                {review.userName.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900">{review.userName}</h4>
                                                {review.verified && (
                                                    <span className="text-xs text-gray-500">(Verified)</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">{review.date}</div>
                                        </div>
                                    </div>

                                    {/* Review Title & Content */}
                                    <div className="ml-14">
                                        <p className="font-medium text-gray-900 mb-1">
                                            {review.comment.split('.')[0]}!
                                        </p>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {review.comment}
                                        </p>

                                        {/* Review Images */}
                                        {review.images && review.images.length > 0 && (
                                            <div className="flex gap-2 mb-3">
                                                {review.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                        <Image src={img} alt="Review" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Star Rating */}
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="text-sm text-gray-500 ml-1">{review.rating}.0</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
