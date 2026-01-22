const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: function () {
                // Password is only required for local authentication
                return this.authProvider === 'local';
            },
            minlength: [8, 'Password must be at least 8 characters'],
            validate: {
                validator: function (v) {
                    // Skip validation for OAuth users
                    if (this.authProvider !== 'local') return true;
                    // Require at least: 1 uppercase, 1 lowercase, 1 number, 1 special char
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
                },
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
            },
            select: false, // Don't return password by default
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        avatar: {
            type: String,
            default: null,
        },

        // Email Verification
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,

        // OTP (for password reset only)
        otp: String, // Hashed OTP
        otpExpires: Date,
        otpAttempts: {
            type: Number,
            default: 0,
        },
        lastOTPSent: Date,

        phone: {
            type: String,
            default: '',
        },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zipCode: { type: String, default: '' },
            country: { type: String, default: '' },
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: Date,
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified and exists (skip for OAuth users)
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // OAuth users don't have passwords
        if (!this.password) {
            throw new Error('This account uses OAuth authentication. Please sign in with Google.');
        }
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Method to get user without sensitive fields
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.loginAttempts;
    delete user.lockUntil;
    delete user.otp;
    delete user.otpExpires;
    delete user.otpAttempts;
    delete user.lastOTPSent;
    return user;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    return resetToken;
};

// Check if account is locked
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
userSchema.methods.incLoginAttempts = async function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = 5;
    const lockTime = 15 * 60 * 1000; // 15 min

    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }

    return await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
    return await this.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
