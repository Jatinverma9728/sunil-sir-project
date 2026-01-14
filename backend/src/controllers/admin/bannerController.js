const Banner = require('../../models/Banner');

/**
 * @desc    Get all banners
 * @route   GET /api/admin/banners
 * @access  Private/Admin
 */
const getAllBanners = async (req, res) => {
    try {
        const { position, status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

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

        const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Banner.countDocuments(query);

        res.status(200).json({
            success: true,
            data: banners,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get single banner
 * @route   GET /api/admin/banners/:id
 * @access  Private/Admin
 */
const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Create banner
 * @route   POST /api/admin/banners
 * @access  Private/Admin
 */
const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update banner
 * @route   PUT /api/admin/banners/:id
 * @access  Private/Admin
 */
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete banner
 * @route   DELETE /api/admin/banners/:id
 * @access  Private/Admin
 */
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get active banners for public display
 * @route   GET /api/banners
 * @access  Public
 */
const getActiveBanners = async (req, res) => {
    try {
        const { position = 'hero' } = req.query;
        const now = new Date();

        const banners = await Banner.find({
            position,
            isActive: true,
            startDate: { $lte: now },
            $or: [{ endDate: null }, { endDate: { $gte: now } }]
        })
            .sort({ priority: -1 })
            .select('-clickCount -viewCount -createdAt -updatedAt');

        // Increment view count for all returned banners
        const bannerIds = banners.map(b => b._id);
        await Banner.updateMany(
            { _id: { $in: bannerIds } },
            { $inc: { viewCount: 1 } }
        );

        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Track banner click
 * @route   POST /api/banners/:id/click
 * @access  Public
 */
const trackBannerClick = async (req, res) => {
    try {
        await Banner.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    getActiveBanners,
    trackBannerClick
};
