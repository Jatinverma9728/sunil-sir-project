const Course = require('../../models/Course');
const Enrollment = require('../../models/Enrollment');

/**
 * @desc    Create new course (Admin/Instructor)
 * @route   POST /api/admin/courses
 * @access  Private/Admin
 */
const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            category,
            level,
            thumbnail,
            images,
            lessons,
            requirements,
            whatYouWillLearn,
            tags,
            language,
        } = req.body;

        if (!title || !description || !price || !category || !level || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        const course = await Course.create({
            title,
            description,
            price,
            instructor: req.user._id,
            category,
            level,
            thumbnail,
            images: images || [],
            lessons: lessons || [],
            requirements: requirements || [],
            whatYouWillLearn: whatYouWillLearn || [],
            tags: tags || [],
            language: language || 'English',
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message,
        });
    }
};

/**
 * @desc    Update course (Admin/Instructor)
 * @route   PUT /api/admin/courses/:id
 * @access  Private/Admin
 */
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const allowedUpdates = [
            'title',
            'description',
            'price',
            'category',
            'level',
            'thumbnail',
            'images',
            'lessons',
            'requirements',
            'whatYouWillLearn',
            'tags',
            'language',
            'isPublished',
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                course[field] = req.body[field];
            }
        });

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course,
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating course',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete course (Admin)
 * @route   DELETE /api/admin/courses/:id
 * @access  Private/Admin
 */
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Delete associated enrollments
        await Enrollment.deleteMany({ course: course._id });

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Course and associated enrollments deleted successfully',
            data: {},
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting course',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all courses (Admin view)
 * @route   GET /api/admin/courses
 * @access  Private/Admin
 */
const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.isPublished !== undefined) {
            query.isPublished = req.query.isPublished === 'true';
        }

        const courses = await Course.find(query)
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            count: courses.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total
            },
            data: courses,
        });
    } catch (error) {
        console.error('Get all courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message,
        });
    }
};

/**
 * @desc    Get course statistics (Admin)
 * @route   GET /api/admin/courses/stats
 * @access  Private/Admin
 */
const getCourseStats = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const totalEnrollments = await Enrollment.countDocuments();

        const topCourses = await Course.find({ isPublished: true })
            .sort({ enrolledStudents: -1 })
            .limit(5)
            .select('title enrolledStudents rating');

        res.status(200).json({
            success: true,
            data: {
                totalCourses,
                publishedCourses,
                totalEnrollments,
                topCourses,
            },
        });
    } catch (error) {
        console.error('Get course stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching course statistics',
            error: error.message,
        });
    }
};

module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseStats,
};
