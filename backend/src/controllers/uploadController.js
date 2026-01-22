const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const type = req.query.type || 'products';
        let folder = `flash-ecommerce/${type}`;

        const isVideo = file.mimetype.startsWith('video/');
        const isPDF = file.mimetype === 'application/pdf';

        const params = {
            folder: folder,
            public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            resource_type: isVideo ? 'video' : (isPDF ? 'raw' : 'image'), // vital for non-images
        };

        if (!isVideo && !isPDF) {
            params.allowed_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            params.transformation = [
                { width: 2000, height: 2000, crop: 'limit' },
                { quality: 'auto:good' }
            ];
        }

        return params;
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const allowedExtensions = /jpeg|jpg|png|gif|webp|pdf|mp4/;
    // Allowed mimetypes
    const allowedMimeTypes = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf|video\/mp4/;

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type! Allowed: Images, PDF, MP4'), false);
    }
};

// Multer upload configuration with Cloudinary
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size (accommodates videos)
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
        console.log('📤 Upload request received');
        console.log('Files count:', req.files ? req.files.length : 0);

        if (!req.files || req.files.length === 0) {
            console.log('❌ No files in request');
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        console.log('✅ Processing', req.files.length, 'files');

        // Cloudinary URLs are already available in req.files
        const urls = req.files.map((file, index) => {
            console.log(`📁 File ${index + 1}:`, {
                originalName: file.originalname,
                cloudinaryUrl: file.path,
                publicId: file.filename
            });

            return {
                url: file.path, // Cloudinary URL
                alt: file.originalname.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
                publicId: file.filename, // Cloudinary public ID for deletion
                cloudinaryUrl: file.path
            };
        });

        console.log('✅ All files uploaded to Cloudinary successfully!');
        console.log('🌐 URLs:', urls.map(u => u.url));

        res.status(200).json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully to Cloudinary`,
            data: urls,
            urls: urls.map(u => u.url) // Simple array of URLs for convenience
        });
    } catch (error) {
        console.error('❌ Cloudinary upload error:', error);
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
