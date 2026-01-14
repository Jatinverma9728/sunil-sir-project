const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Banner title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: [200, 'Subtitle cannot exceed 200 characters']
    },
    image: {
        type: String,
        required: [true, 'Banner image is required']
    },
    mobileImage: {
        type: String,
        default: null // Optional mobile-specific image
    },
    link: {
        type: String,
        default: null
    },
    buttonText: {
        type: String,
        default: 'Shop Now',
        maxlength: [30, 'Button text cannot exceed 30 characters']
    },
    buttonLink: {
        type: String,
        default: null
    },
    position: {
        type: String,
        enum: ['hero', 'sidebar', 'popup', 'footer', 'category'],
        default: 'hero'
    },
    backgroundColor: {
        type: String,
        default: '#000000'
    },
    textColor: {
        type: String,
        default: '#ffffff'
    },
    overlay: {
        type: Boolean,
        default: true
    },
    overlayOpacity: {
        type: Number,
        default: 0.3,
        min: 0,
        max: 1
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null // null means no expiry
    },
    priority: {
        type: Number,
        default: 0 // Higher priority = shows first in carousel
    },
    isActive: {
        type: Boolean,
        default: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Virtual to check if banner is currently valid
bannerSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.isActive &&
        now >= this.startDate &&
        (this.endDate === null || now <= this.endDate);
});

// Index for efficient querying
bannerSchema.index({ isActive: 1, position: 1, priority: -1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
