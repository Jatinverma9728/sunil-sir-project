const User = require('../models/User');
const crypto = require('crypto');
const { sendOTPEmail, sendPasswordResetConfirmation } = require('../utils/email');

/**
 * @desc    Request password reset with OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;

        if (!rawEmail) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address',
            });
        }

        const email = rawEmail.toLowerCase();

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address',
            });
        }

        // Rate limiting: Allow new OTP every 2 minutes
        if (user.lastOTPSent && Date.now() - user.lastOTPSent < 2 * 60 * 1000) { // 2 minutes
            const waitTime = Math.ceil((2 * 60 * 1000 - (Date.now() - user.lastOTPSent)) / 1000);
            return res.status(429).json({
                success: false,
                message: `Please wait ${waitTime} seconds before requesting another OTP`,
            });
        }

        // Generate 6-digit OTP securely
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Hash OTP for security
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Save OTP data
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.otpPurpose = 'password-reset';
        user.otpAttempts = 0;
        user.lastOTPSent = Date.now();
        await user.save({ validateBeforeSave: false });

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp, user.name);
            console.log(`✅ Password reset OTP sent to ${email}`);
        } catch (emailError) {
            console.error('❌ Failed to send OTP email:', emailError.message);
            // Log OTP to console as fallback
            console.log('='.repeat(50));
            console.log('PASSWORD RESET OTP (Email failed - fallback)');
            console.log('='.repeat(50));
            console.log('Email:', email);
            console.log('OTP:', otp);
            console.log('Expires in: 10 minutes');
            console.log('='.repeat(50));
        }

        res.status(200).json({
            success: true,
            message: 'A 6-digit OTP has been sent to your email. Valid for 10 minutes',
            // In development, send the OTP (remove in production)
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset request',
        });
    }
};

/**
 * @desc    Verify OTP for password reset
 * @route   POST /api/auth/verify-reset-otp
 * @access  Public
 */
// @desc    Verify OTP for password reset
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or OTP',
            });
        }

        // Check OTP attempts (max 5)
        if (user.otpAttempts >= 5) {
            return res.status(429).json({
                success: false,
                message: 'Too many failed attempts. Please request a new OTP',
            });
        }

        // Check OTP expiry
        if (!user.otpExpires || Date.now() > user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one',
            });
        }

        // Check OTP purpose
        if (user.otpPurpose !== 'password-reset') {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
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
                message: `Invalid OTP. ${5 - user.otpAttempts} attempts remaining`,
            });
        }

        // OTP verified! Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpPurpose = undefined;
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken, // Frontend will use this to reset password
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP',
        });
    }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide reset token and new password',
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters',
            });
        }

        // Hash token
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.loginAttempts = 0;
        user.lockUntil = undefined;

        await user.save();

        // Send confirmation email
        try {
            await sendPasswordResetConfirmation(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
        });
    }
};

module.exports = {
    forgotPassword,
    verifyResetOTP,
    resetPassword,
};
