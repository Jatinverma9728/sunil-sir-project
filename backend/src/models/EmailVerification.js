const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * EmailVerification Schema
 * Stores verification tokens for new user email verification
 * Each token expires after 24 hours
 */

const emailVerificationSchema = new mongoose.Schema(
  {
    // Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Email to verify
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Plain token removed for security
    // Use tokenHash for lookup

    // Hashed token (for secure storage)
    tokenHash: {
      type: String,
      required: true,
      select: false, // Don't return by default
    },

    // Token expiration (24 hours)
    expiresAt: {
      type: Date,
      required: true,
      index: true, // For cleanup queries
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },

    // Usage tracking
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },

    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for efficient queries
 */
emailVerificationSchema.index({ user: 1, email: 1 });
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

/**
 * Static method: Generate verification token
 */
emailVerificationSchema.statics.generateToken = function () {
  // Generate a random 32-byte token
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};

/**
 * Instance method: Hash token for storage
 */
emailVerificationSchema.methods.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Instance method: Verify token (check hash)
 */
emailVerificationSchema.methods.verifyToken = function (token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken === this.tokenHash;
};

/**
 * Instance method: Check if token is expired
 */
emailVerificationSchema.methods.isTokenExpired = function () {
  return new Date() > this.expiresAt;
};

/**
 * Instance method: Mark token as used
 */
emailVerificationSchema.methods.markAsUsed = function () {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

/**
 * Static method: Clean up expired tokens (run via cron job)
 */
emailVerificationSchema.statics.cleanupExpiredTokens = async function () {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
    isUsed: false,
  });
};

/**
 * Static method: Get active verification for user
 */
emailVerificationSchema.statics.getActiveVerification = async function (
  userId
) {
  return this.findOne({
    user: userId,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });
};

const EmailVerification =
  mongoose.models.EmailVerification ||
  mongoose.model('EmailVerification', emailVerificationSchema);

module.exports = EmailVerification;
