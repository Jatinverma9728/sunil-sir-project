"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    toggleHelpful,
    canReviewProduct,
    Review,
    ReviewStats,
} from "@/lib/api/reviews";

interface ReviewSectionProps {
    productId: string;
    productRating?: { average: number; count: number };
}

export default function ReviewSection({ productId, productRating }: ReviewSectionProps) {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [canReview, setCanReview] = useState(false);
    const [cannotReviewReason, setCannotReviewReason] = useState<string | null>(null);
    const [reviewMessage, setReviewMessage] = useState<string | null>(null);
    const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: "",
        comment: "",
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId, page, sortBy, ratingFilter]);

    useEffect(() => {
        if (isAuthenticated) {
            checkCanReview();
        }
    }, [isAuthenticated, productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getProductReviews(productId, {
                page,
                limit: 5,
                sort: sortBy,
                ratingFilter,
            });
            setReviews(response.data);
            setStats(response.stats);
            setTotalPages(response.pages);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkCanReview = async () => {
        try {
            const response = await canReviewProduct(productId);
            setCanReview(response.canReview);
            setCannotReviewReason(response.reason || null);
            setReviewMessage((response as any).message || null);
            setIsVerifiedPurchase(response.isVerifiedPurchase || false);
        } catch (err) {
            console.error("Error checking review eligibility:", err);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.comment.trim()) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            if (editingReview) {
                // Update existing review
                await updateReview(editingReview._id, {
                    rating: formData.rating,
                    title: formData.title,
                    comment: formData.comment,
                });
            } else {
                // Create new review
                await createReview({
                    productId,
                    rating: formData.rating,
                    title: formData.title,
                    comment: formData.comment,
                });
            }

            // Reset form and refresh reviews
            setFormData({ rating: 5, title: "", comment: "" });
            setShowReviewForm(false);
            setEditingReview(null);
            setCanReview(false);
            fetchReviews();
        } catch (err: any) {
            setError(err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setFormData({
            rating: review.rating,
            title: review.title,
            comment: review.comment,
        });
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            setDeleting(true);
            await deleteReview(reviewId);
            setDeleteConfirm(null);
            setCanReview(true);
            fetchReviews();
        } catch (err: any) {
            console.error("Error deleting review:", err);
            alert(err.message || "Failed to delete review");
        } finally {
            setDeleting(false);
        }
    };

    const handleHelpful = async (reviewId: string) => {
        if (!isAuthenticated) {
            alert("Please login to mark reviews as helpful");
            return;
        }

        try {
            const response = await toggleHelpful(reviewId);
            setReviews(prev =>
                prev.map(r =>
                    r._id === reviewId
                        ? { ...r, helpfulCount: response.helpfulCount }
                        : r
                )
            );
        } catch (err) {
            console.error("Error toggling helpful:", err);
        }
    };

    const handleRatingFilterClick = (rating: number) => {
        if (ratingFilter === rating) {
            setRatingFilter(null); // Clear filter if clicking same rating
        } else {
            setRatingFilter(rating);
        }
        setPage(1); // Reset to first page
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
        if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
        return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
    };

    const isOwnReview = (review: Review) => {
        if (!user || !review.user) return false;
        // User from AuthContext has 'id', review.user from API has '_id'
        // Convert to strings for comparison (handles ObjectId vs string mismatch)
        const currentUserId = String((user as any).id || (user as any)._id || '');
        const reviewUserId = String(review.user._id || '');
        return currentUserId === reviewUserId && currentUserId !== '';
    };

    const avg = stats?.averageRating || productRating?.average || 0;
    const count = stats?.totalReviews || productRating?.count || 0;

    return (
        <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                {isAuthenticated && canReview ? (
                    <button
                        onClick={() => {
                            setEditingReview(null);
                            setFormData({ rating: 5, title: "", comment: "" });
                            setShowReviewForm(true);
                        }}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                    >
                        Write a Review
                    </button>
                ) : !isAuthenticated ? (
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Login to Review
                    </button>
                ) : cannotReviewReason === 'not_purchased' ? (
                    <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                        📦 Purchase this product to leave a review
                    </div>
                ) : cannotReviewReason === 'order_not_delivered' ? (
                    <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {reviewMessage || 'You can review after delivery'}
                    </div>
                ) : cannotReviewReason === 'already_reviewed' ? (
                    <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        You have reviewed this product
                    </div>
                ) : null}
            </div>

            {/* Review Form Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReviewForm(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingReview ? "Edit Your Review" : "Write a Review"}
                            </h3>
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isVerifiedPurchase && !editingReview && (
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-4">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Verified Purchase - Thank you for your order!
                            </div>
                        )}

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            {/* Animated Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                            className="p-1 transition-all duration-200 hover:scale-125"
                                        >
                                            <svg
                                                className={`w-10 h-10 transition-all duration-200 ${star <= (hoverRating || formData.rating)
                                                    ? "text-yellow-400 drop-shadow-md"
                                                    : "text-gray-200"
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {hoverRating || formData.rating} out of 5 stars
                                </p>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Summarize your experience"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                    maxLength={100}
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{formData.title.length}/100</p>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Share your experience with this product..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none"
                                    maxLength={2000}
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{formData.comment.length}/2000</p>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {submitting ? "Submitting..." : editingReview ? "Update Review" : "Submit Review"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-6 py-2.5 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
                        <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure you want to delete your review?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDeleteReview(deleteConfirm)}
                                disabled={deleting}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rating Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-8">
                    {/* Left: Big Rating */}
                    <div className="text-center sm:text-left sm:pr-8 sm:border-r sm:border-gray-100">
                        <div className="text-6xl font-bold text-gray-900">{avg.toFixed(1)}</div>
                        <div className="flex justify-center sm:justify-start mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(avg) ? "text-yellow-400" : "text-gray-200"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-500 mt-2">Based on {count} review{count !== 1 ? "s" : ""}</p>
                    </div>

                    {/* Right: Clickable Rating Bars */}
                    <div className="flex-1 space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const starCount = stats ? stats[`rating${star}` as keyof ReviewStats] as number : 0;
                            const percent = count > 0 ? Math.round((starCount / count) * 100) : 0;
                            const isActive = ratingFilter === star;
                            return (
                                <button
                                    key={star}
                                    onClick={() => handleRatingFilterClick(star)}
                                    className={`w-full flex items-center gap-3 p-2 -mx-2 rounded-lg transition-all ${isActive
                                        ? "bg-yellow-50 ring-2 ring-yellow-400"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-sm text-gray-600 w-6 font-medium">{star}</span>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isActive ? "bg-yellow-500" : "bg-yellow-400"}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-16 text-right">{starCount} ({percent}%)</span>
                                </button>
                            );
                        })}

                        {/* Clear Filter Button */}
                        {ratingFilter && (
                            <button
                                onClick={() => setRatingFilter(null)}
                                className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear {ratingFilter}-star filter
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sort Dropdown */}
            {(reviews.length > 0 || ratingFilter) && (
                <div className="flex justify-between items-center mb-4">
                    {ratingFilter && (
                        <p className="text-sm text-gray-600">
                            Showing {ratingFilter}-star reviews only
                        </p>
                    )}
                    <div className={ratingFilter ? "" : "ml-auto"}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                            <option value="helpful">Most Helpful</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Review List */}
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-32 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                            <div className="h-20 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-5xl mb-4">{ratingFilter ? "🔍" : "📝"}</p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {ratingFilter ? `No ${ratingFilter}-star Reviews` : "No Reviews Yet"}
                    </h3>
                    <p className="text-gray-500">
                        {ratingFilter
                            ? "Try removing the filter to see all reviews"
                            : "Be the first to review this product!"}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                        {review.user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-900">{review.user?.name || "User"}</span>
                                            {review.isVerifiedPurchase && (
                                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">{getTimeAgo(review.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit/Delete buttons for own reviews */}
                                {isOwnReview(review) && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Edit review"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(review._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete review"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                            <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>
                            <button
                                onClick={() => handleHelpful(review._id)}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
                            >
                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                Helpful ({review.helpfulCount})
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
