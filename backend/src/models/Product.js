const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide product title'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            min: [0, 'Original price cannot be negative'],
            default: null,
        },
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            trim: true,
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                alt: {
                    type: String,
                    default: '',
                },
            },
        ],
        specs: {
            type: Map,
            of: String,
            default: {},
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: [String],
        brand: {
            type: String,
            trim: true,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        // Enhanced Specifications
        specifications: {
            type: Map,
            of: String,
            default: {},
        },
        // Policies
        policies: {
            returnPolicy: {
                type: String,
                default: '',
                maxlength: [1000, 'Return policy cannot exceed 1000 characters'],
            },
            shippingPolicy: {
                type: String,
                default: '',
                maxlength: [1000, 'Shipping policy cannot exceed 1000 characters'],
            },
            cancellationPolicy: {
                type: String,
                default: '',
                maxlength: [1000, 'Cancellation policy cannot exceed 1000 characters'],
            },
        },
        // Warranty Information
        warranty: {
            duration: {
                type: String,
                default: '',
                trim: true,
            },
            type: {
                type: String,
                enum: ['', 'manufacturer', 'seller', 'extended', 'none'],
                default: '',
            },
            details: {
                type: String,
                default: '',
                maxlength: [500, 'Warranty details cannot exceed 500 characters'],
            },
        },
        // External Links
        externalLinks: {
            userManual: {
                type: String,
                default: '',
                trim: true,
            },
            supportUrl: {
                type: String,
                default: '',
                trim: true,
            },
            videoUrl: {
                type: String,
                default: '',
                trim: true,
            },
            manufacturerWebsite: {
                type: String,
                default: '',
                trim: true,
            },
        },
        // Additional Resources
        additionalResources: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },
                url: {
                    type: String,
                    required: true,
                    trim: true,
                },
                type: {
                    type: String,
                    enum: ['pdf', 'video', 'article', 'download', 'other'],
                    default: 'other',
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1 });

// Virtual for in stock status
productSchema.virtual('inStock').get(function () {
    return this.stock > 0;
});

// Method to update rating
productSchema.methods.updateRating = function (newRating, newCount) {
    this.rating.average = newRating;
    this.rating.count = newCount;
    return this.save();
};

// Static method for search
productSchema.statics.search = function (query) {
    return this.find({ $text: { $search: query } });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
