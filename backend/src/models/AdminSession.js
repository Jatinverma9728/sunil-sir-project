const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // We can store a token hash if we want to support multiple devices in the future,
    // but for now we enforce one lock state per admin user for strict security.
    tokenHash: {
        type: String,
        select: false
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    deviceInfo: {
        type: String, // User Agent
        default: 'Unknown'
    },
    ipAddress: String
}, {
    timestamps: true
});

// Auto-delete sessions that are inactive for 24 hours
adminSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('AdminSession', adminSessionSchema);
