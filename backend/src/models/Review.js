const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        title: {
            type: String,
            required: [true, 'Review title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            trim: true,
            maxlength: [2000, 'Comment cannot exceed 2000 characters'],
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpfulVotes: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        }],
        helpfulCount: {
            type: Number,
            default: 0,
        },
        images: [{
            url: {
                type: String,
            },
            alt: {
                type: String,
                default: '',
            },
        }],
        isApproved: {
            type: Boolean,
            default: true, // Auto-approve reviews, can be changed to false for moderation
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for fetching product reviews
reviewSchema.index({ product: 1, createdAt: -1 });

// Index for user's reviews
reviewSchema.index({ user: 1, createdAt: -1 });

// Virtual for time ago
reviewSchema.virtual('timeAgo').get(function () {
    const now = new Date();
    const diff = now - this.createdAt;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
});

// Static method to calculate product rating stats
reviewSchema.statics.calculateProductRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
            },
        },
    ]);

    if (stats.length > 0) {
        const Product = mongoose.model('Product');
        await Product.findByIdAndUpdate(productId, {
            'rating.average': Math.round(stats[0].averageRating * 10) / 10,
            'rating.count': stats[0].totalReviews,
        });
        return stats[0];
    } else {
        const Product = mongoose.model('Product');
        await Product.findByIdAndUpdate(productId, {
            'rating.average': 0,
            'rating.count': 0,
        });
        return null;
    }
};

// Update product rating after saving a review
reviewSchema.post('save', async function () {
    await this.constructor.calculateProductRating(this.product);
});

// Update product rating after deleting a review
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
    await this.constructor.calculateProductRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
