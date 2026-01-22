const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { sendVerificationEmail: sendVerificationEmailUtil, sendResendVerificationEmail } = require('../utils/email');
const crypto = require('crypto');

/**
 * @desc    Send verification email to user
 * @route   POST /api/verification/send-verification-email
 * @access  Protected
 */
const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Delete any existing unverified tokens
    await EmailVerification.deleteMany({
      user: user._id,
      isUsed: false,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Create verification record
    const verification = await EmailVerification.create({
      user: user._id,
      email: user.email,
      token,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await sendVerificationEmailUtil(user.email, verificationLink, user.name);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        email: user.email,
        expiresIn: '24 hours',
      },
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Verify email with token
 * @route   GET /api/verification/verify/:token
 * @access  Public
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Find verification record
    const verification = await EmailVerification.findOne({
      token,
      isUsed: false,
    }).select('+tokenHash');

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }

    // Check if token is expired
    if (verification.isTokenExpired()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired',
        expiredAt: verification.expiresAt,
      });
    }

    // Verify token hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    if (hashedToken !== verification.tokenHash) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }

    // Find user and update verification status
    const user = await User.findById(verification.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    await user.save();

    // Mark verification token as used
    await verification.markAsUsed();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: user.email,
        verified: true,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Resend verification email
 * @route   POST /api/verification/resend-verification-email
 * @access  Protected
 */
const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Check rate limiting (max 3 resends per hour)
    const recentVerifications = await EmailVerification.countDocuments({
      user: user._id,
      isUsed: false,
      createdAt: {
        $gt: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    });

    if (recentVerifications >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many verification email requests. Please try again later.',
      });
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Create new verification record
    await EmailVerification.create({
      user: user._id,
      email: user.email,
      token,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await sendResendVerificationEmail(user.email, verificationLink, user.name);

    res.status(200).json({
      success: true,
      message: 'Verification email resent successfully',
      data: {
        email: user.email,
        expiresIn: '24 hours',
      },
    });
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending verification email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get verification status
 * @route   GET /api/verification/status
 * @access  Protected
 */
const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isEmailVerified email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isEmailVerified: user.isEmailVerified,
        email: user.email,
        lastVerificationEmail: null, // Could track this if needed
      },
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting verification status',
    });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
  getVerificationStatus,
};
