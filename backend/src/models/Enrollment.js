const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        // Contact details for learner communication
        contactDetails: {
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
            phone: {
                type: String,
                trim: true,
            },
        },
        // Payment details
        paymentDetails: {
            orderId: String,
            paymentId: String,
            amount: Number,
            currency: {
                type: String,
                default: 'INR',
            },
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed', 'refunded'],
                default: 'pending',
            },
            paidAt: Date,
        },
        progress: [
            {
                lessonId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                completed: {
                    type: Boolean,
                    default: false,
                },
                completedAt: Date,
            },
        ],
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: Date,
        certificateIssued: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure user can only enroll once per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to mark lesson as complete
enrollmentSchema.methods.markLessonComplete = function (lessonId) {
    const existingProgress = this.progress.find(
        (p) => p.lessonId.toString() === lessonId.toString()
    );

    if (existingProgress) {
        existingProgress.completed = true;
        existingProgress.completedAt = new Date();
    } else {
        this.progress.push({
            lessonId,
            completed: true,
            completedAt: new Date(),
        });
    }

    return this.save();
};

// Method to get completion percentage
enrollmentSchema.methods.getCompletionPercentage = async function () {
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course);

    if (!course || course.lessons.length === 0) return 0;

    const completedLessons = this.progress.filter((p) => p.completed).length;
    return (completedLessons / course.lessons.length) * 100;
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
