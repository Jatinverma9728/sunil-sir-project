const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { generateToken } = require('../utils/token');
const { sendVerificationEmail } = require('../utils/email');
const crypto = require('crypto');

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
            isEmailVerified: false, // Default to unverified
        });

        // Generate token
        // Generate token
        const token = generateToken(user._id);

        // Generate verification OTP
        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenHash = crypto
            .createHash('sha256')
            .update(verificationOTP)
            .digest('hex');

        // Create verification record
        await EmailVerification.create({
            user: user._id,
            email: user.email,
            tokenHash,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        // Send verification OTP asynchronously
        console.log('📧 Sending verification OTP to:', user.email);
        const { sendOTPEmail } = require('../utils/email');
        sendOTPEmail(user.email, verificationOTP, user.name)
            .then(() => console.log('✅ Verification OTP sent successfully to:', user.email))
            .catch((emailError) => {
                console.error('❌ Failed to send verification OTP:', emailError.message);
                console.error('Error details:', emailError);
            });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                    phone: user.phone,
                    phone: user.phone,
                    addresses: user.addresses, // Updated
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

        // Allow login without email verification (verification may be required for specific actions like checkout)

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

        // Generate token with dynamic expiry based on remember me
        const tokenExpiry = rememberMe ? '30d' : '7d';
        const token = generateToken(user._id, tokenExpiry);

        // Set HttpOnly cookie (false to allow frontend access for Authorization header if needed, but true is safer)
        const cookieOptions = {
            httpOnly: false, // Must be false so frontend can read it for Bearer token
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Lax for localhost dev
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
                    phone: user.phone,
                    addresses: user.addresses, // Updated
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
        // Address update removed from here - use specific address endpoints

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



/**
 * @desc    Add new address
 * @route   POST /api/auth/profile/address
 * @access  Private
 */
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { fullName, phone, street, city, state, zipCode, country, type, isDefault } = req.body;

        const newAddress = {
            fullName,
            phone,
            street,
            city,
            state,
            zipCode,
            country,
            type,
            isDefault: isDefault || false
        };

        if (isDefault) {
            // Unset other default addresses
            user.addresses.forEach(addr => addr.isDefault = false);
        } else if (user.addresses.length === 0) {
            // First address is default by default
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address added successfully',
            data: user.addresses
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding address',
            error: error.message
        });
    }
};

/**
 * @desc    Update address
 * @route   PUT /api/auth/profile/address/:id
 * @access  Private
 */
const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const addressId = req.params.id;
        const updates = req.body;

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        if (updates.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // Apply updates
        Object.keys(updates).forEach(key => {
            if (key !== '_id') { // Prevent ID update
                user.addresses[addressIndex][key] = updates[key];
            }
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: user.addresses
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating address',
            error: error.message
        });
    }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/auth/profile/address/:id
 * @access  Private
 */
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const addressId = req.params.id;

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        const wasDefault = user.addresses[addressIndex].isDefault;
        user.addresses.splice(addressIndex, 1);

        // If we deleted default and there are other addresses, make the first one default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: user.addresses
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting address',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    googleCallback,
    addAddress,
    updateAddress,
    deleteAddress
};
