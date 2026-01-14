const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Offer name is required'],
        trim: true,
        maxlength: [100, 'Offer name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    type: {
        type: String,
        enum: ['flash_sale', 'category_sale', 'product_offer', 'bundle_deal', 'buy_x_get_y', 'min_purchase'],
        required: [true, 'Offer type is required']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Discount type is required']
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative']
    },
    maxDiscount: {
        type: Number,
        default: null // Maximum discount cap for percentage discounts
    },
    minPurchase: {
        type: Number,
        default: 0 // Minimum cart value to apply offer
    },
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    applicableCategories: [{
        type: String // Category slugs
    }],
    excludedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    priority: {
        type: Number,
        default: 0 // Higher priority offers are applied first
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isStackable: {
        type: Boolean,
        default: false // Can this offer be combined with others?
    }
}, {
    timestamps: true
});

// Virtual to check if offer is currently valid
offerSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.isActive &&
        now >= this.startDate &&
        now <= this.endDate &&
        (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Index for efficient querying
offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Offer', offerSchema);
