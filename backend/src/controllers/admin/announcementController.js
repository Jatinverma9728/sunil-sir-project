const Announcement = require('../../models/Announcement');

/**
 * @desc    Get all announcements
 * @route   GET /api/admin/announcements
 * @access  Private/Admin
 */
const getAllAnnouncements = async (req, res) => {
    try {
        const { type, status, position, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        if (type) query.type = type;
        if (position) query.position = position;

        const now = new Date();
        if (status === 'active') {
            query.isActive = true;
            query.startDate = { $lte: now };
            query.$or = [{ endDate: null }, { endDate: { $gte: now } }];
        } else if (status === 'scheduled') {
            query.startDate = { $gt: now };
        } else if (status === 'expired') {
            query.endDate = { $lt: now, $ne: null };
        }

        const announcements = await Announcement.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Announcement.countDocuments(query);

        res.status(200).json({
            success: true,
            data: announcements,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get single announcement
 * @route   GET /api/admin/announcements/:id
 * @access  Private/Admin
 */
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Create announcement
 * @route   POST /api/admin/announcements
 * @access  Private/Admin
 */
const createAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update announcement
 * @route   PUT /api/admin/announcements/:id
 * @access  Private/Admin
 */
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete announcement
 * @route   DELETE /api/admin/announcements/:id
 * @access  Private/Admin
 */
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get active announcements for public display
 * @route   GET /api/announcements
 * @access  Public
 */
const getActiveAnnouncements = async (req, res) => {
    try {
        const { position = 'top', page } = req.query;
        const now = new Date();

        let query = {
            position,
            isActive: true,
            startDate: { $lte: now },
            $or: [{ endDate: null }, { endDate: { $gte: now } }]
        };

        // If page is specified, filter by showOnPages
        if (page) {
            query.$or = [
                { showOnPages: { $size: 0 } },
                { showOnPages: page }
            ];
        }

        const announcements = await Announcement.find(query)
            .sort({ priority: -1 })
            .select('-dismissedBy -createdAt -updatedAt');

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Dismiss announcement for user
 * @route   POST /api/announcements/:id/dismiss
 * @access  Private
 */
const dismissAnnouncement = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (userId) {
            await Announcement.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { dismissedBy: userId } }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getActiveAnnouncements,
    dismissAnnouncement
};
