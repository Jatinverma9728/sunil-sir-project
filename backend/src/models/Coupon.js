const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [20, 'Coupon code cannot exceed 20 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
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
        default: 0 // Minimum cart value required
    },
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    applicableCategories: [{
        type: String
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
        default: null // Total usage limit
    },
    usedCount: {
        type: Number,
        default: 0
    },
    perUserLimit: {
        type: Number,
        default: 1 // How many times a single user can use
    },
    usedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        count: {
            type: Number,
            default: 1
        },
        usedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFirstOrderOnly: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual to check if coupon is currently valid
couponSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.isActive &&
        now >= this.startDate &&
        now <= this.endDate &&
        (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Generate random coupon code
couponSchema.statics.generateCode = function (length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Index for efficient querying
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
