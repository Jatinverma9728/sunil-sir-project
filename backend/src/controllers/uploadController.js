const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const type = req.query.type || 'products';

        return {
            folder: `flash-ecommerce/${type}`, // Organize by type in Cloudinary
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
                { width: 2000, height: 2000, crop: 'limit' }, // Max dimensions
                { quality: 'auto:good' } // Automatic quality optimization
            ],
            public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}` // Unique filename
        };
    }
});

// File filter (same as before)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer upload configuration with Cloudinary
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 10 // Max 10 files at once
    },
    fileFilter: fileFilter
});

/**
 * @desc    Upload multiple images to Cloudinary
 * @route   POST /api/upload/images
 * @access  Private/Admin
 */
const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        // Cloudinary URLs are already available in req.files
        const urls = req.files.map(file => ({
            url: file.path, // Cloudinary URL
            alt: file.originalname.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
            publicId: file.filename, // Cloudinary public ID for deletion
            cloudinaryUrl: file.path
        }));

        res.status(200).json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully to Cloudinary`,
            data: urls,
            urls: urls.map(u => u.url) // Simple array of URLs for convenience
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading files to Cloudinary',
            error: error.message
        });
    }
};

/**
 * @desc    Upload single image to Cloudinary
 * @route   POST /api/upload/image
 * @access  Private
 */
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const url = req.file.path; // Cloudinary URL

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully to Cloudinary',
            url: url,
            data: {
                url: url,
                alt: req.file.originalname.replace(/\.[^/.]+$/, ''),
                publicId: req.file.filename, // For deletion later
                cloudinaryUrl: url
            }
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file to Cloudinary',
            error: error.message
        });
    }
};

/**
 * @desc    Delete an image from Cloudinary
 * @route   DELETE /api/upload/:publicId
 * @access  Private/Admin
 */
const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params;

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok' || result.result === 'not found') {
            return res.status(200).json({
                success: true,
                message: 'File deleted successfully from Cloudinary',
                result: result
            });
        }

        res.status(400).json({
            success: false,
            message: 'Failed to delete file from Cloudinary',
            result: result
        });
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file from Cloudinary',
            error: error.message
        });
    }
};

module.exports = {
    upload,
    uploadImages,
    uploadImage,
    deleteImage
};
