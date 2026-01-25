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
            .populate({
                path: 'instructor',
                select: 'name email',
                // Fallback for missing instructors
                match: {},
            })
            .select('-lessons') // Don't send lessons in list view
            .lean(); // Use lean for better performance

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
        console.error('Get courses error:', error.message);
        console.error('Full error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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
 * @desc    Initiate course purchase - creates Razorpay order for paid courses
 * @route   POST /api/courses/:id/purchase
 * @access  Private
 */
const purchaseCourse = async (req, res) => {
    try {
        const { contactDetails } = req.body;
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

        // Check if already enrolled with completed payment
        const existingEnrollment = await Enrollment.findOne({
            user: req.user._id,
            course: course._id,
            'paymentDetails.status': 'completed',
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course',
            });
        }

        // Free course - enroll directly
        if (course.price === 0) {
            const enrollment = await Enrollment.create({
                user: req.user._id,
                course: course._id,
                contactDetails: contactDetails || {},
                paymentDetails: {
                    status: 'completed',
                    amount: 0,
                    paidAt: new Date(),
                },
            });

            course.enrolledStudents += 1;
            await course.save();

            return res.status(201).json({
                success: true,
                message: 'Successfully enrolled in free course',
                data: { enrollment, isFree: true },
            });
        }

        // Paid course - create Razorpay order
        const { createRazorpayOrder } = require('../utils/payment');

        const order = await createRazorpayOrder(course.price, 'INR', {
            receipt: `course_${course._id}_${Date.now()}`,
            notes: {
                courseId: course._id.toString(),
                userId: req.user._id.toString(),
                courseTitle: course.title,
                // Store contact details in notes for reference
                contactName: contactDetails?.name || '',
                contactEmail: contactDetails?.email || '',
                contactPhone: contactDetails?.phone || '',
            }
        });

        // Store pending enrollment with contact details
        // This will be updated when payment is verified
        await Enrollment.findOneAndUpdate(
            { user: req.user._id, course: course._id },
            {
                user: req.user._id,
                course: course._id,
                contactDetails: contactDetails || {},
                paymentDetails: {
                    orderId: order.id,
                    amount: course.price,
                    status: 'pending',
                },
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Payment order created',
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                courseId: course._id,
                courseTitle: course.title,
                keyId: process.env.RAZORPAY_KEY_ID,
            },
        });
    } catch (error) {
        console.error('Purchase course error:', error);
        res.status(500).json({
            success: false,
            message: 'Error initiating course purchase',
            error: error.message,
        });
    }
};

/**
 * @desc    Verify course payment and enroll
 * @route   POST /api/courses/:id/verify-payment
 * @access  Private
 */
const verifyCoursePurchase = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Verify payment signature
        const { verifyRazorpaySignature } = require('../utils/payment');
        const isValid = verifyRazorpaySignature({
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Check for existing enrollment
        let enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: course._id,
        });

        if (enrollment) {
            // If already paid and completed, return success
            if (enrollment.paymentDetails?.status === 'completed') {
                return res.status(200).json({
                    success: true,
                    message: 'Already enrolled',
                    data: enrollment,
                });
            }

            // If pending, update it
            enrollment.paymentDetails = {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: course.price,
                status: 'completed',
                paidAt: new Date(),
            };
            enrollment.completedAt = null; // Reset completion if re-enrolling? No, keep it.
            // Ensure progress array exists
            if (!enrollment.progress) enrollment.progress = [];

            await enrollment.save();

            // Increment for updated enrollment too (since it wasn't counted when pending)
            course.enrolledStudents += 1;
            await course.save();
        } else {
            // Create new enrollment (should rarely happen if purchase flow was followed)
            enrollment = await Enrollment.create({
                user: req.user._id,
                course: course._id,
                contactDetails: {}, // Should have been set in purchase step but fallback here
                paymentDetails: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    amount: course.price,
                    status: 'completed',
                    paidAt: new Date(),
                },
                progress: [],
            });

            course.enrolledStudents += 1;
            await course.save();
        }

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: enrollment,
        });
    } catch (error) {
        console.error('Verify course purchase error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying course purchase',
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

/**
 * @desc    Mark a lesson as complete
 * @route   POST /api/courses/:id/lessons/:lessonId/complete
 * @access  Private
 */
const markLessonComplete = async (req, res) => {
    try {
        const { id: courseId, lessonId } = req.params;

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: courseId,
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course',
            });
        }

        // Verify lesson exists in course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const lessonExists = course.lessons.some(l => l._id.toString() === lessonId);
        if (!lessonExists) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found in this course',
            });
        }

        // Mark lesson as complete
        await enrollment.markLessonComplete(lessonId);

        // Calculate updated progress
        const completionPercentage = await enrollment.getCompletionPercentage();

        // Check if all lessons completed
        if (completionPercentage === 100 && !enrollment.completedAt) {
            enrollment.completedAt = new Date();
            await enrollment.save();
        }

        res.status(200).json({
            success: true,
            message: 'Lesson marked as complete',
            data: {
                lessonId,
                completionPercentage,
                isCoursCompleted: completionPercentage === 100,
            },
        });
    } catch (error) {
        console.error('Mark lesson complete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking lesson as complete',
            error: error.message,
        });
    }
};

/**
 * @desc    Get enrollment progress for a specific course
 * @route   GET /api/courses/:id/progress
 * @access  Private
 */
const getEnrollmentProgress = async (req, res) => {
    try {
        const courseId = req.params.id;

        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: courseId,
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'You are not enrolled in this course',
            });
        }

        const course = await Course.findById(courseId).populate('instructor', 'name email');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const completionPercentage = await enrollment.getCompletionPercentage();

        // Map lessons with completion status
        const lessonsWithProgress = course.lessons.map(lesson => {
            const progress = enrollment.progress.find(
                p => p.lessonId.toString() === lesson._id.toString()
            );
            return {
                _id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration,
                order: lesson.order,
                isFree: lesson.isFree,
                resources: lesson.resources,
                isCompleted: progress?.completed || false,
                completedAt: progress?.completedAt || null,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                course: {
                    _id: course._id,
                    title: course.title,
                    instructor: course.instructor,
                    thumbnail: course.thumbnail,
                    totalLessons: course.lessons.length,
                    totalDuration: course.totalDuration,
                },
                lessons: lessonsWithProgress,
                progress: {
                    completedLessons: enrollment.progress.filter(p => p.completed).length,
                    totalLessons: course.lessons.length,
                    completionPercentage,
                    enrolledAt: enrollment.enrolledAt,
                    completedAt: enrollment.completedAt,
                },
            },
        });
    } catch (error) {
        console.error('Get enrollment progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress',
            error: error.message,
        });
    }
};

module.exports = {
    getCourses,
    getCourse,
    purchaseCourse,
    verifyCoursePurchase,
    getMyCourses,
    getCategories,
    markLessonComplete,
    getEnrollmentProgress,
};
