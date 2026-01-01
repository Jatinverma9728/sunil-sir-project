const Category = require('../../models/Category');
const Product = require('../../models/Product');

/**
 * @desc    Get all categories
 * @route   GET /api/admin/categories
 * @access  Private/Admin
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
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

/**
 * @desc    Create new category
 * @route   POST /api/admin/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
    try {
        const { name, icon, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide category name',
            });
        }

        // Check if category already exists
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists',
            });
        }

        const category = await Category.create({
            name: name.trim(),
            slug,
            icon: icon || '📦',
            description: description || '',
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        console.error('Create category error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message,
        });
    }
};

/**
 * @desc    Update category
 * @route   PUT /api/admin/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        const { name, icon, description, isActive } = req.body;

        // If name is being updated, check for duplicates
        if (name && name !== category.name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const existingCategory = await Category.findOne({ slug, _id: { $ne: req.params.id } });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists',
                });
            }

            category.name = name.trim();
            category.slug = slug;
        }

        if (icon !== undefined) category.icon = icon;
        if (description !== undefined) category.description = description;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/admin/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has products
        const productCount = await Product.countDocuments({ category: category.slug });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${productCount} product(s) are using this category. Please reassign products first.`,
                productCount,
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message,
        });
    }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/admin/categories/:id
 * @access  Private/Admin
 */
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Get product count
        const productCount = await Product.countDocuments({ category: category.slug });
        const categoryData = category.toObject();
        categoryData.productCount = productCount;

        res.status(200).json({
            success: true,
            data: categoryData,
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message,
        });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
};
