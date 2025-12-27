const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload, uploadImages, uploadImage, deleteImage } = require('../controllers/uploadController');

// Multiple images upload - Admin only
router.post('/images', protect, authorize('admin'), upload.array('images', 10), uploadImages);

// Single image upload - Any authenticated user
router.post('/image', protect, upload.single('image'), uploadImage);

// Delete image - Admin only
router.delete('/:filename', protect, authorize('admin'), deleteImage);

module.exports = router;
