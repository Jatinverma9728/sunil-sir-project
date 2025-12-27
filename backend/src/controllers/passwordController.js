const User = require('../models/User');
const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/email');

/**
 * @desc    Request password reset with OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address',
                code: 'EMAIL_REQUIRED'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists for security
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, an OTP has been sent',
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP for security
        const crypto = require('crypto');
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Save hashed OTP and expiry (10 minutes)
        user.resetPasswordToken = hashedOtp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp, user.name);
            console.log(`✅ OTP email sent to ${email}`);
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
            code: 'SERVER_ERROR',
        });
    }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password',
                code: 'PASSWORD_REQUIRED'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
                code: 'PASSWORD_TOO_SHORT'
            });
        }

        // Hash token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token',
                code: 'INVALID_TOKEN'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Reset login attempts if any
        user.loginAttempts = 0;
        user.lockUntil = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            code: 'SERVER_ERROR',
        });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
};
