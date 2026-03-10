const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { sendOTPEmail } = require('../utils/email');
const crypto = require('crypto');

/**
 * @desc    Send verification email (OTP) to user
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Create verification record
    await EmailVerification.create({
      user: user._id,
      email: user.email,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email synchronously for serverless
    try {
      await sendOTPEmail(user.email, otp, user.name);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email: ' + error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent successfully',
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
 * @desc    Verify email with OTP
 * @route   POST /api/verification/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification OTP are required',
      });
    }

    // Hash the OTP to find the record
    const hashedToken = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Find verification record
    const verification = await EmailVerification.findOne({
      email: email.toLowerCase(),
      tokenHash: hashedToken,
      isUsed: false,
    });

    if (!verification) {
      console.log(`[Email Verification Debug] Failed lookup for ${email.toLowerCase()}`);
      console.log(`[Email Verification Debug] Looked for hash: ${hashedToken}`);

      // Let's see what is actually in the DB for this email
      const allForEmail = await EmailVerification.find({ email: email.toLowerCase() });
      console.log(`[Email Verification Debug] Found ${allForEmail.length} total records for this email.`);
      if (allForEmail.length > 0) {
        console.log(`[Email Verification Debug] Most recent DB hash: ${allForEmail[allForEmail.length - 1].tokenHash}`);
        console.log(`[Email Verification Debug] Was it used?: ${allForEmail[allForEmail.length - 1].isUsed}`);
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid or missing verification OTP',
      });
    }

    // Check if OTP is expired
    if (verification.isTokenExpired()) {
      return res.status(400).json({
        success: false,
        message: 'Verification OTP has expired',
        expiredAt: verification.expiresAt,
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
 * @desc    Resend verification email (OTP)
 * @route   POST /api/verification/resend-verification-email
 * @access  Public
 */
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[Email Verification] Client requested resend for email: '${email}'`);

    if (!email) {
      console.log(`[Email Verification] Failed: No email provided in body.`);
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`[Email Verification] Failed: No account found for ${email}.`);
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Create new verification record
    await EmailVerification.create({
      user: user._id,
      email: user.email,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email synchronously for serverless
    console.log(`[Email Verification] Generated OTP and saved to DB. Sending to: ${user.email}`);

    try {
      await sendOTPEmail(user.email, otp, user.name);
      console.log(`[Email Verification] OTP email dispatched successfully to: ${user.email}`);
    } catch (error) {
      console.error('[Email Verification] Failed to dispatch OTP email:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email: ' + error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent successfully',
      data: {
        email: user.email,
        expiresIn: '24 hours',
      },
    });
  } catch (error) {
    console.error('[Email Verification] Resend verification email error:', error);
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
  verifyOTP,
  resendVerificationEmail,
  getVerificationStatus,
};
