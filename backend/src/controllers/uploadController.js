const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/products', 'uploads/courses', 'uploads/users'];
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.query.type || 'products';
        let uploadPath = path.join(__dirname, '../../uploads/products');

        if (type === 'courses') {
            uploadPath = path.join(__dirname, '../../uploads/courses');
        } else if (type === 'users') {
            uploadPath = path.join(__dirname, '../../uploads/users');
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
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

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 10 // Max 10 files at once
    },
    fileFilter: fileFilter
});

/**
 * @desc    Upload multiple images
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

        const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
        const type = req.query.type || 'products';

        const urls = req.files.map(file => ({
            url: `${baseUrl}/uploads/${type}/${file.filename}`,
            alt: file.originalname.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
            filename: file.filename
        }));

        res.status(200).json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully`,
            data: urls,
            urls: urls.map(u => u.url) // Simple array of URLs for convenience
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
        });
    }
};

/**
 * @desc    Upload single image
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

        const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
        const type = req.query.type || 'products';
        const url = `${baseUrl}/uploads/${type}/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: url,
            data: {
                url: url,
                alt: req.file.originalname.replace(/\.[^/.]+$/, ''),
                filename: req.file.filename
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};

/**
 * @desc    Delete an uploaded image
 * @route   DELETE /api/upload/:filename
 * @access  Private/Admin
 */
const deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const type = req.query.type || 'products';
        const filePath = path.join(__dirname, '../../uploads', type, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file',
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
