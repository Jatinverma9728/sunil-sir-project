const User = require('../models/User');
const { generateToken } = require('../utils/token');

// Input sanitization helper
const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        // Sanitize inputs
        const name = sanitizeInput(req.body.name);
        const email = sanitizeInput(req.body.email)?.toLowerCase();
        const password = req.body.password; // Don't sanitize password

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message?.includes('Password must') ? error.message : 'Error registering user',
            // Only show detailed error in development
            ...(process.env.NODE_ENV === 'development' && { error: error.message }),
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password',
                code: 'MISSING_CREDENTIALS'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
                code: 'INVALID_EMAIL'
            });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No account found with this email address',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
            return res.status(423).json({
                success: false,
                message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${lockTimeRemaining} minutes`,
                code: 'ACCOUNT_LOCKED',
                lockTimeRemaining
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();

            const attemptsLeft = Math.max(0, 5 - (user.loginAttempts + 1));
            const message = attemptsLeft > 0
                ? `Incorrect password. ${attemptsLeft} attempts remaining before account lock`
                : 'Incorrect password. Account has been locked for 15 minutes due to too many failed attempts';

            return res.status(401).json({
                success: false,
                message,
                code: 'INVALID_PASSWORD',
                attemptsLeft
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0 || user.lockUntil) {
            await user.resetLoginAttempts();
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate OTP for 2FA
            const crypto = require('crypto');
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

            // Save OTP
            user.otp = hashedOtp;
            user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
            user.otpPurpose = '2fa-login';
            user.otpAttempts = 0;
            await user.save({ validateBeforeSave: false });

            // Send OTP
            const { sendOTPEmail } = require('../utils/email');
            try {
                await sendOTPEmail(user.email, otp, user.name);
                console.log(`✅ 2FA login OTP sent to ${user.email}`);
            } catch (emailError) {
                console.error('❌ Failed to send 2FA OTP:', emailError);
                console.log('2FA Login OTP:', otp);
            }

            return res.status(200).json({
                success: true,
                requires2FA: true,
                message: 'Please enter the verification code sent to your email',
                email: user.email,
                ...(process.env.NODE_ENV === 'development' && { otp }),
            });
        }

        // Generate token with dynamic expiry based on remember me
        const tokenExpiry = rememberMe ? '30d' : '7d';
        const token = generateToken(user._id, tokenExpiry);

        // Set HttpOnly cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
        };

        res.cookie('auth_token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Login successful! Welcome back',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again',
            code: 'SERVER_ERROR',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        // User is already attached by auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    phone: user.phone,
                    address: user.address,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update fields
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.address) {
            user.address = {
                ...user.address,
                ...req.body.address
            };
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                },
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = async (req, res) => {
    try {
        // User is attached by Passport strategy
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }

        // Generate JWT token (30 days for OAuth users)
        const token = generateToken(user._id, '30d');

        // Redirect to frontend callback page with token
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    googleCallback,
};
