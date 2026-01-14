const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Announcement message is required'],
        trim: true,
        maxlength: [200, 'Message cannot exceed 200 characters']
    },
    type: {
        type: String,
        enum: ['info', 'sale', 'promo', 'warning', 'shipping', 'new'],
        default: 'info'
    },
    icon: {
        type: String,
        default: null // Emoji or icon name
    },
    link: {
        type: String,
        default: null
    },
    linkText: {
        type: String,
        default: 'Learn More',
        maxlength: [30, 'Link text cannot exceed 30 characters']
    },
    backgroundColor: {
        type: String,
        default: '#000000'
    },
    textColor: {
        type: String,
        default: '#ffffff'
    },
    position: {
        type: String,
        enum: ['top', 'bottom'],
        default: 'top'
    },
    isCloseable: {
        type: Boolean,
        default: true
    },
    isScrolling: {
        type: Boolean,
        default: false // Marquee effect
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    priority: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    showOnPages: [{
        type: String // Specific pages to show on, empty = all pages
    }],
    dismissedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Virtual to check if announcement is currently valid
announcementSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.isActive &&
        now >= this.startDate &&
        (this.endDate === null || now <= this.endDate);
});

// Index for efficient querying
announcementSchema.index({ isActive: 1, position: 1, priority: -1 });
announcementSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
