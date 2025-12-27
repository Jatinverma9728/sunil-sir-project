const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * @desc    Get all courses with filtering
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        let query = { isPublished: true };

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Level filter
        if (req.query.level) {
            query.level = req.query.level;
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Search
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Sorting
        let sort = {};
        if (req.query.sort === 'price-asc') sort.price = 1;
        else if (req.query.sort === 'price-desc') sort.price = -1;
        else if (req.query.sort === 'rating') sort['rating.average'] = -1;
        else if (req.query.sort === 'popular') sort.enrolledStudents = -1;
        else sort.createdAt = -1;

        const courses = await Course.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('instructor', 'name email')
            .select('-lessons'); // Don't send lessons in list view

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            count: courses.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: courses,
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate(
            'instructor',
            'name email avatar'
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // If user is not enrolled, hide non-free lesson content
        let courseData = course.toObject();

        if (req.user) {
            const enrollment = await Enrollment.findOne({
                user: req.user._id,
                course: course._id,
            });

            if (!enrollment) {
                // User not enrolled, hide paid lessons
                courseData.lessons = courseData.lessons.map((lesson) => ({
                    _id: lesson._id,
                    title: lesson.title,
                    description: lesson.description,
                    duration: lesson.duration,
                    order: lesson.order,
                    isFree: lesson.isFree,
                    // Only show video URL for free lessons
                    videoUrl: lesson.isFree ? lesson.videoUrl : null,
                }));
            }
        } else {
            // Not logged in, only show free lesson previews
            courseData.lessons = courseData.lessons.map((lesson) => ({
                _id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                duration: lesson.duration,
                order: lesson.order,
                isFree: lesson.isFree,
                videoUrl: lesson.isFree ? lesson.videoUrl : null,
            }));
        }

        res.status(200).json({
            success: true,
            data: courseData,
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message,
        });
    }
};

/**
 * @desc    Purchase/Enroll in course
 * @route   POST /api/courses/:id/purchase
 * @access  Private
 */
const purchaseCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        if (!course.isPublished) {
            return res.status(400).json({
                success: false,
                message: 'This course is not available for enrollment',
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user._id,
            course: course._id,
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course',
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            user: req.user._id,
            course: course._id,
        });

        // Increment enrolled students count
        course.enrolledStudents += 1;
        await course.save();

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: enrollment,
        });
    } catch (error) {
        console.error('Purchase course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error enrolling in course',
            error: error.message,
        });
    }
};

/**
 * @desc    Get user's enrolled courses
 * @route   GET /api/courses/my-courses
 * @access  Private
 */
const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'name email' },
            })
            .sort({ enrolledAt: -1 });

        const coursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                const progress = await enrollment.getCompletionPercentage();
                return {
                    ...enrollment.toObject(),
                    completionPercentage: progress,
                };
            })
        );

        res.status(200).json({
            success: true,
            count: coursesWithProgress.length,
            data: coursesWithProgress,
        });
    } catch (error) {
        console.error('Get my courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching enrolled courses',
            error: error.message,
        });
    }
};

/**
 * @desc    Get course categories
 * @route   GET /api/courses/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
    try {
        const categories = [
            'programming',
            'design',
            'business',
            'marketing',
            'photography',
            'music',
            'health',
            'personal-development',
            'other',
        ];

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message,
        });
    }
};

module.exports = {
    getCourses,
    getCourse,
    purchaseCourse,
    getMyCourses,
    getCategories,
};
