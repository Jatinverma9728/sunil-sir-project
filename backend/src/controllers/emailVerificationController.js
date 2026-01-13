const User = require('../models/User');
const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/email');

/**
 * @desc    Send email verification OTP
 * @route   POST /api/auth/send-verification-email
 * @access  Private
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

        // Rate limiting: Allow new OTP every 2 minutes
        if (user.lastOTPSent && Date.now() - user.lastOTPSent < 2 * 60 * 1000) {
            const waitTime = Math.ceil((2 * 60 * 1000 - (Date.now() - user.lastOTPSent)) / 1000);
            return res.status(429).json({
                success: false,
                message: `Please wait ${waitTime} seconds before requesting another verification code`,
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP for security
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Save OTP data
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.otpPurpose = 'email-verification';
        user.otpAttempts = 0;
        user.lastOTPSent = Date.now();
        await user.save({ validateBeforeSave: false });

        // Send OTP via email
        try {
            await sendOTPEmail(user.email, otp, user.name);
            console.log(`✅ Email verification OTP sent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Failed to send verification email:', emailError.message);
            // Log OTP to console as fallback
            console.log('='.repeat(50));
            console.log('EMAIL VERIFICATION OTP (Email failed - fallback)');
            console.log('='.repeat(50));
            console.log('Email:', user.email);
            console.log('OTP:', otp);
            console.log('Expires in: 10 minutes');
            console.log('='.repeat(50));
        }

        res.status(200).json({
            success: true,
            message: 'Verification code has been sent to your email. Valid for 10 minutes',
            // In development, include OTP for testing
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });
    } catch (error) {
        console.error('Send verification email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending verification email',
        });
    }
};

/**
 * @desc    Verify email with OTP
 * @route   POST /api/auth/verify-email
 * @access  Private
 */
const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the verification code',
            });
        }

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

        // Check OTP attempts (max 5)
        if (user.otpAttempts >= 5) {
            return res.status(429).json({
                success: false,
                message: 'Too many failed attempts. Please request a new verification code',
            });
        }

        // Check OTP expiry
        if (!user.otpExpires || Date.now() > user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new one',
            });
        }

        // Check OTP purpose
        if (user.otpPurpose !== 'email-verification') {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code. Please request a new one',
            });
        }

        // Verify OTP
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (user.otp !== hashedOtp) {
            // Increment attempts
            user.otpAttempts += 1;
            await user.save({ validateBeforeSave: false });

            return res.status(400).json({
                success: false,
                message: `Invalid verification code. ${5 - user.otpAttempts} attempts remaining`,
            });
        }

        // OTP verified! Mark email as verified
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpPurpose = null;
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! Your account is now fully activated',
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email',
        });
    }
};

/**
 * @desc    Resend email verification OTP
 * @route   POST /api/auth/resend-verification-email
 * @access  Private
 */
const resendVerificationEmail = async (req, res) => {
    // Reuse same logic as sendVerificationEmail
    return sendVerificationEmail(req, res);
};

module.exports = {
    sendVerificationEmail,
    verifyEmail,
    resendVerificationEmail,
};
