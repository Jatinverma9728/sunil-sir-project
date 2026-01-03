const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateToken } = require('../utils/token');

/**
 * Configure Google OAuth 2.0 Strategy
 * This allows users to authenticate using their Google account
 */
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Extract user information from Google profile
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const avatar = profile.photos[0]?.value || null;
                const googleId = profile.id;

                // Check if user already exists with this Google ID
                let user = await User.findOne({ googleId });

                if (user) {
                    // User exists with this Google ID - update profile if needed
                    if (user.avatar !== avatar) {
                        user.avatar = avatar;
                        await user.save({ validateBeforeSave: false });
                    }
                    return done(null, user);
                }

                // Check if user exists with this email (for account linking)
                user = await User.findOne({ email });

                if (user) {
                    // User exists with email but not linked to Google
                    // Link the Google account to existing user
                    user.googleId = googleId;
                    user.authProvider = 'google'; // Update provider
                    if (!user.avatar) user.avatar = avatar;
                    user.isEmailVerified = true; // Google verifies emails
                    await user.save({ validateBeforeSave: false });
                    return done(null, user);
                }

                // Create new user with Google OAuth
                user = await User.create({
                    name,
                    email,
                    googleId,
                    authProvider: 'google',
                    avatar,
                    isEmailVerified: true, // Google already verified the email
                    // Password is not set for OAuth users
                });

                return done(null, user);
            } catch (error) {
                console.error('Google OAuth error:', error);
                return done(error, null);
            }
        }
    )
);

/**
 * Serialize user for session (not used with JWT but required by Passport)
 */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/**
 * Deserialize user from session (not used with JWT but required by Passport)
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
