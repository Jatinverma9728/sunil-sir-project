const AdminSession = require('../../models/AdminSession');
const User = require('../../models/User');

// @desc    Get current session status (Active/Locked)
// @route   GET /api/admin/auth/status
// @access  Protected (Admin)
exports.getSessionStatus = async (req, res) => {
    try {
        const session = await AdminSession.findOne({ user: req.user._id });

        if (!session) {
            // If no session exists but user has valid JWT (middleware passed), create one
            await AdminSession.create({
                user: req.user._id,
                lastActivity: new Date(),
                isLocked: false,
                ipAddress: req.ip,
                deviceInfo: req.headers['user-agent']
            });
            return res.json({ success: true, status: 'active' });
        }

        // Logic handled in middleware updates activity, so here we just return state
        // If middleware flagged it as locked, accessing this route (if protected) might trigger 423?
        // Actually, we want 'status' endpoint to be accessible even if locked, so valid 'Token' is enough.
        // We will configure middleware to allow 'status' and 'unlock' routes even if locked.

        res.json({
            success: true,
            data: {
                status: session.isLocked ? 'locked' : 'active',
                lastActivity: session.lastActivity
            }
        });
    } catch (error) {
        console.error('Session status error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Unlock session with password
// @route   POST /api/admin/auth/unlock
// @access  Protected (Admin) - Allowed when locked
exports.unlockSession = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        // Verify password
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Unlock session
        const session = await AdminSession.findOne({ user: req.user._id });
        if (session) {
            session.isLocked = false;
            session.lastActivity = new Date();
            await session.save();
        }

        res.json({ success: true, message: 'Session unlocked' });
    } catch (error) {
        console.error('Unlock session error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Logout admin (Destroy Session)
// @route   POST /api/admin/auth/logout
// @access  Protected (Admin)
exports.logout = async (req, res) => {
    try {
        await AdminSession.findOneAndDelete({ user: req.user._id });
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Manually Lock Session
// @route   POST /api/admin/auth/lock
// @access  Protected (Admin)
exports.lockSession = async (req, res) => {
    try {
        let session = await AdminSession.findOne({ user: req.user._id });

        if (!session) {
            // Create if missing
            session = new AdminSession({ user: req.user._id });
        }

        session.isLocked = true;
        await session.save();

        res.json({ success: true, message: 'Session locked' });
    } catch (error) {
        console.error('Lock error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
