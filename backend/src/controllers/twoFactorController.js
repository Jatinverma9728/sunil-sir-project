const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, send2FAEnabledNotification } = require('../utils/email');

/**
 * Generate backup codes
 */
const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
};

/**
 * @desc    Enable 2FA - Step 1: Send OTP
 * @route   POST /api/auth/2fa/enable
 * @access  Private
 */
const enable2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.twoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: '2FA is already enabled',
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Save OTP
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.otpPurpose = '2fa-setup';
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        // Send OTP
        try {
            await sendOTPEmail(user.email, otp, user.name);
            console.log(`✅ 2FA setup OTP sent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Failed to send 2FA OTP:', emailError);
            console.log('2FA Setup OTP:', otp);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Enter it to enable 2FA',
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });
    } catch (error) {
        console.error('Enable 2FA error:', error);
        res.status(500).json({
            success: false,
            message: 'Error enabling 2FA',
        });
    }
};

/**
 * @desc    Enable 2FA - Step 2: Verify OTP
 * @route   POST /api/auth/2fa/verify-setup
 * @access  Private
 */
const verify2FASetup = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide OTP',
            });
        }

        const user = await User.findById(req.user.id);

        // Verify OTP
        if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new one',
            });
        }

        if (user.otpPurpose !== '2fa-setup') {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (user.otp !== hashedOtp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Generate backup codes
        const backupCodes = generateBackupCodes();
        const hashedBackupCodes = await Promise.all(
            backupCodes.map(code => bcrypt.hash(code, 10))
        );

        // Enable 2FA
        user.twoFactorEnabled = true;
        user.backupCodes = hashedBackupCodes;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpPurpose = null;
        await user.save({ validateBeforeSave: false });

        // Send notification email
        try {
            await send2FAEnabledNotification(user.email, user.name, backupCodes);
        } catch (emailError) {
            console.error('Failed to send 2FA notification:', emailError);
        }

        res.status(200).json({
            success: true,
            message: '2FA enabled successfully',
            backupCodes, // Show once, then user must save them
        });
    } catch (error) {
        console.error('Verify 2FA setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying 2FA setup',
        });
    }
};

/**
 * @desc    Disable 2FA
 * @route   POST /api/auth/2fa/disable
 * @access  Private
 */
const disable2FA = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your password to disable 2FA',
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        if (!user.twoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: '2FA is not enabled',
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password',
            });
        }

        // Disable 2FA
        user.twoFactorEnabled = false;
        user.backupCodes = [];
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: '2FA disabled successfully',
        });
    } catch (error) {
        console.error('Disable 2FA error:', error);
        res.status(500).json({
            success: false,
            message: 'Error disabling 2FA',
        });
    }
};

/**
 * @desc    Verify 2FA code during login
 * @route   POST /api/auth/2fa/verify-login
 * @access  Public
 */
const verify2FALogin = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check OTP
        if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please login again',
            });
        }

        if (user.otpPurpose !== '2fa-login') {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (user.otp !== hashedOtp) {
            // Check backup codes
            let backupCodeUsed = false;
            for (let i = 0; i < user.backupCodes.length; i++) {
                const isMatch = await bcrypt.compare(otp, user.backupCodes[i]);
                if (isMatch) {
                    // Remove used backup code
                    user.backupCodes.splice(i, 1);
                    backupCodeUsed = true;
                    break;
                }
            }

            if (!backupCodeUsed) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid OTP or backup code',
                });
            }
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpPurpose = null;
        await user.save({ validateBeforeSave: false });

        // Generate JWT token
        const { generateToken } = require('../utils/token');
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Verify 2FA login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying 2FA',
        });
    }
};

/**
 * @desc    Get 2FA status
 * @route   GET /api/auth/2fa/status
 * @access  Private
 */
const get2FAStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                twoFactorEnabled: user.twoFactorEnabled,
                backupCodesCount: user.backupCodes?.length || 0,
            },
        });
    } catch (error) {
        console.error('Get 2FA status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting 2FA status',
        });
    }
};

module.exports = {
    enable2FA,
    verify2FASetup,
    disable2FA,
    verify2FALogin,
    get2FAStatus,
};