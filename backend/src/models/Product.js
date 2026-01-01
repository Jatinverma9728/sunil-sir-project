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
