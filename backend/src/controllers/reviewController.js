const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'newest'; // newest, oldest, highest, lowest, helpful
        const ratingFilter = req.query.rating ? parseInt(req.query.rating) : null;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        // Build sort query
        let sortQuery = {};
        switch (sort) {
            case 'oldest':
                sortQuery = { createdAt: 1 };
                break;
            case 'highest':
                sortQuery = { rating: -1, createdAt: -1 };
                break;
            case 'lowest':
                sortQuery = { rating: 1, createdAt: -1 };
                break;
            case 'helpful':
                sortQuery = { helpfulCount: -1, createdAt: -1 };
                break;
            default: // newest
                sortQuery = { createdAt: -1 };
        }

        // Build filter query
        const filterQuery = { product: productId, isApproved: true };
        if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
            filterQuery.rating = ratingFilter;
        }

        // Fetch reviews
        const reviews = await Review.find(filterQuery)
            .populate('user', 'name avatar')
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(filterQuery);

        // Calculate rating stats
        const stats = await Review.calculateProductRating(new mongoose.Types.ObjectId(productId));

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            stats: stats || {
                averageRating: 0,
                totalReviews: 0,
                rating5: 0,
                rating4: 0,
                rating3: 0,
                rating2: 0,
                rating1: 0,
            },
            data: reviews,
        });
    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message,
        });
    }
};

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private (authenticated users only)
 */
const createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment, images } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!productId || !rating || !title || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide productId, rating, title, and comment',
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product',
            });
        }

        // Check if user has purchased this product (REQUIRED for review)
        const hasOrdered = await Order.findOne({
            user: userId,
            'orderItems.product': productId,
            orderStatus: 'delivered',
        });

        // Only allow reviews from verified purchasers
        if (!hasOrdered) {
            return res.status(403).json({
                success: false,
                message: 'You can only review products you have purchased and received',
            });
        }

        // Create review (all reviews are now verified purchases)
        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            title,
            comment,
            images: images || [],
            isVerifiedPurchase: true, // Always true since only purchasers can review
        });

        // Populate user info
        await review.populate('user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review,
        });
    } catch (error) {
        console.error('Create review error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message,
        });
    }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private (review owner only)
 */
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, title, comment, images } = req.body;
        const userId = req.user._id;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check ownership
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review',
            });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (title) review.title = title;
        if (comment) review.comment = comment;
        if (images) review.images = images;

        await review.save();
        await review.populate('user', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review,
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (review owner or admin)
 */
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check ownership or admin
        if (review.user.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review',
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message,
        });
    }
};

/**
 * @desc    Mark review as helpful
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if user already voted
        const hasVoted = review.helpfulVotes.some(
            (vote) => vote.user.toString() === userId.toString()
        );

        if (hasVoted) {
            // Remove vote
            review.helpfulVotes = review.helpfulVotes.filter(
                (vote) => vote.user.toString() !== userId.toString()
            );
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
            // Add vote
            review.helpfulVotes.push({ user: userId });
            review.helpfulCount += 1;
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: hasVoted ? 'Helpful vote removed' : 'Marked as helpful',
            helpfulCount: review.helpfulCount,
            hasVoted: !hasVoted,
        });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating helpful status',
            error: error.message,
        });
    }
};

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
const getMyReviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ user: userId })
            .populate('product', 'title images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: reviews,
        });
    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message,
        });
    }
};

/**
 * @desc    Check if user can review a product
 * @route   GET /api/reviews/can-review/:productId
 * @access  Private
 */
const canReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        // Check if already reviewed
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(200).json({
                success: true,
                canReview: false,
                reason: 'already_reviewed',
                existingReview,
            });
        }

        // Check if user has purchased this product with delivered status
        const deliveredOrder = await Order.findOne({
            user: userId,
            'orderItems.product': productId,
            orderStatus: 'delivered',
        });

        // If delivered, user can review
        if (deliveredOrder) {
            return res.status(200).json({
                success: true,
                canReview: true,
                isVerifiedPurchase: true,
            });
        }

        // Check if user has any pending/processing/shipped order for this product
        const pendingOrder = await Order.findOne({
            user: userId,
            'orderItems.product': productId,
            orderStatus: { $in: ['pending', 'processing', 'shipped'] },
        });

        if (pendingOrder) {
            const statusMessages = {
                pending: 'Your order is pending. You can review after delivery.',
                processing: 'Your order is being processed. You can review after delivery.',
                shipped: 'Your order is on the way! You can review after delivery.',
            };
            return res.status(200).json({
                success: true,
                canReview: false,
                reason: 'order_not_delivered',
                orderStatus: pendingOrder.orderStatus,
                message: statusMessages[pendingOrder.orderStatus] || 'You can review after your order is delivered.',
            });
        }

        // User hasn't purchased this product at all
        res.status(200).json({
            success: true,
            canReview: false,
            reason: 'not_purchased',
            message: 'You can only review products you have purchased.',
        });
    } catch (error) {
        console.error('Can review check error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking review eligibility',
            error: error.message,
        });
    }
};

module.exports = {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    getMyReviews,
    canReview,
};
