const Offer = require('../../models/Offer');
const Product = require('../../models/Product');

/**
 * @desc    Get all offers
 * @route   GET /api/admin/offers
 * @access  Private/Admin
 */
const getAllOffers = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        if (type) query.type = type;

        if (status === 'active') {
            const now = new Date();
            query.isActive = true;
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
        } else if (status === 'scheduled') {
            query.startDate = { $gt: new Date() };
        } else if (status === 'expired') {
            query.endDate = { $lt: new Date() };
        }

        const offers = await Offer.find(query)
            .populate('applicableProducts', 'title images price')
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Offer.countDocuments(query);

        res.status(200).json({
            success: true,
            data: offers,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get single offer
 * @route   GET /api/admin/offers/:id
 * @access  Private/Admin
 */
const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
            .populate('applicableProducts', 'title images price');

        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Create offer
 * @route   POST /api/admin/offers
 * @access  Private/Admin
 */
const createOffer = async (req, res) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json({ success: true, data: offer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update offer
 * @route   PUT /api/admin/offers/:id
 * @access  Private/Admin
 */
const updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete offer
 * @route   DELETE /api/admin/offers/:id
 * @access  Private/Admin
 */
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);

        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        res.status(200).json({ success: true, message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get active offers for products/categories
 * @route   GET /api/offers/active
 * @access  Public
 */
const getActiveOffers = async (req, res) => {
    try {
        const now = new Date();

        const offers = await Offer.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
            $or: [
                { usageLimit: null },
                { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
            ]
        })
            .populate('applicableProducts', 'title images price')
            .sort({ priority: -1 });

        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    getActiveOffers
};
