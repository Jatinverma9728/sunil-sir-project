const Product = require('../../models/Product');

/**
 * @desc    Create new product (Admin)
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            category,
            stock,
            images,
            specs,
            tags,
            brand,
            sku,
            isFeatured,
        } = req.body;

        if (!title || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, price, and category',
            });
        }

        // Build product data, excluding empty optional fields
        const productData = {
            title,
            description,
            price,
            category,
            stock: stock || 0,
            images: images || [],
            specs: specs || {},
            tags: tags || [],
            isFeatured: isFeatured || false,
        };

        // Only add brand if not empty
        if (brand && brand.trim()) {
            productData.brand = brand.trim();
        }

        // Only add sku if not empty - avoid duplicate key errors
        if (sku && sku.trim()) {
            productData.sku = sku.trim();
        }

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        console.error('Create product error:', error);
        // Provide more detailed error message for validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
                error: error.message,
            });
        }
        // Handle duplicate key errors (e.g., duplicate SKU)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A product with this SKU already exists',
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message,
        });
    }
};

/**
 * @desc    Update product (Admin)
 * @route   PUT /api/admin/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const allowedUpdates = [
            'title',
            'description',
            'price',
            'category',
            'stock',
            'images',
            'specs',
            'tags',
            'isActive',
            'isFeatured',
        ];

        // Handle standard fields
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        // Handle brand - only set if not empty, otherwise unset
        if (req.body.brand !== undefined) {
            if (req.body.brand && req.body.brand.trim()) {
                product.brand = req.body.brand.trim();
            } else {
                product.brand = undefined;
            }
        }

        // Handle SKU - only set if not empty, otherwise unset to avoid duplicate key errors
        if (req.body.sku !== undefined) {
            if (req.body.sku && req.body.sku.trim()) {
                product.sku = req.body.sku.trim();
            } else {
                product.sku = undefined;
            }
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete product (Admin)
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: {},
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all products (Admin view with unpublished)
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products,
        });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message,
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
};
