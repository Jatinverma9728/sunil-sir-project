const Product = require('../models/Product');

/**
 * @desc    Get all products with pagination and filtering
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Search by text
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // In stock filter
        if (req.query.inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // Featured filter
        if (req.query.featured === 'true') {
            query.isFeatured = true;
        }

        // Active products only
        query.isActive = true;

        // Sorting
        let sort = {};
        if (req.query.sort) {
            const sortBy = req.query.sort;
            if (sortBy === 'price-asc') sort.price = 1;
            else if (sortBy === 'price-desc') sort.price = -1;
            else if (sortBy === 'rating') sort['rating.average'] = -1;
            else if (sortBy === 'newest') sort.createdAt = -1;
            else sort.createdAt = -1;
        } else {
            sort.createdAt = -1; // Default: newest first
        }

        // Execute query
        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-__v');

        // Get total count for pagination
        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            count: products.length, // This is the count of products on the current page
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                limit: limit,
                total: total, // This is the total count of all products matching the query
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message,
        });
    }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
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
        } = req.body;

        // Validate required fields
        if (!title || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, price, and category',
            });
        }

        // Create product
        const product = await Product.create({
            title,
            description,
            price,
            category,
            stock: stock || 0,
            images: images || [],
            specs: specs || {},
            tags: tags || [],
            brand,
            sku,
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message,
        });
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
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

        // Update fields
        const allowedUpdates = [
            'title',
            'description',
            'price',
            'category',
            'stock',
            'images',
            'specs',
            'tags',
            'brand',
            'sku',
            'isActive',
            'isFeatured',
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

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
 * @desc    Delete product
 * @route   DELETE /api/products/:id
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
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
    try {
        const Category = require('../models/Category');

        // Fetch all active categories from database, sorted by name
        const categories = await Category.find({ isActive: true })
            .sort({ name: 1 })
            .select('name slug icon description productCount');

        // Return category data with slugs for backward compatibility
        const categoryData = categories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            description: cat.description,
            productCount: cat.productCount
        }));

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categoryData,
            // Also provide just slugs array for simple filtering
            slugs: categories.map(c => c.slug),
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
};
