const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide category name'],
            trim: true,
            maxlength: [50, 'Category name cannot be more than 50 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        icon: {
            type: String,
            default: '📦',
            trim: true,
        },
        description: {
            type: String,
            maxlength: [200, 'Description cannot be more than 200 characters'],
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        productCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster lookups
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

// Method to generate slug from name
categorySchema.pre('validate', function (next) {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
