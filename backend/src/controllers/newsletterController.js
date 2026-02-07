const Newsletter = require('../models/Newsletter');

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        // Check if already subscribed
        const existingSubscriber = await Newsletter.findOne({ email });

        if (existingSubscriber) {
            if (existingSubscriber.isSubscribed) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already subscribed to our newsletter'
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isSubscribed = true;
                await existingSubscriber.save();
                return res.status(200).json({
                    success: true,
                    message: 'Welcome back! You have successfully resubscribed to our newsletter.'
                });
            }
        }

        // Create new subscription
        await Newsletter.create({ email });

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);

        // Handle duplicate key error (race condition)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed to our newsletter'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during subscription',
            error: error.message
        });
    }
};

module.exports = {
    subscribe
};
