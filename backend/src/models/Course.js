const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide lesson title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide lesson description'],
    },
    videoUrl: {
        type: String,
        required: [true, 'Please provide video URL'],
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Please provide lesson duration'],
    },
    order: {
        type: Number,
        required: true,
        default: 0,
    },
    resources: [
        {
            title: String,
            url: String,
            type: {
                type: String,
                enum: ['pdf', 'video', 'link', 'file'],
            },
        },
    ],
    isFree: {
        type: Boolean,
        default: false,
    },
});

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide course title'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide course description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide course price'],
            min: [0, 'Price cannot be negative'],
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Course must have an instructor'],
        },
        category: {
            type: String,
            required: [true, 'Please provide course category'],
            enum: {
                values: [
                    'programming',
                    'design',
                    'business',
                    'marketing',
                    'photography',
                    'music',
                    'health',
                    'personal-development',
                    'other',
                ],
                message: '{VALUE} is not a valid category',
            },
        },
        level: {
            type: String,
            required: [true, 'Please provide course level'],
            enum: ['beginner', 'intermediate', 'advanced'],
        },
        thumbnail: {
            type: String,
            required: [true, 'Please provide course thumbnail'],
        },
        images: [
            {
                url: String,
                alt: String,
            },
        ],
        lessons: [lessonSchema],
        requirements: [String],
        whatYouWillLearn: [String],
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
        enrolledStudents: {
            type: Number,
            default: 0,
            min: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        tags: [String],
        language: {
            type: String,
            default: 'English',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, price: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ instructor: 1 });

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function () {
    return this.lessons.reduce((total, lesson) => total + lesson.duration, 0);
});

// Virtual for lesson count
courseSchema.virtual('lessonCount').get(function () {
    return this.lessons.length;
});

// Method to add lesson
courseSchema.methods.addLesson = function (lessonData) {
    this.lessons.push(lessonData);
    return this.save();
};

// Method to remove lesson
courseSchema.methods.removeLesson = function (lessonId) {
    this.lessons.id(lessonId).remove();
    return this.save();
};

// Static method to get popular courses
courseSchema.statics.getPopularCourses = function (limit = 10) {
    return this.find({ isPublished: true })
        .sort({ enrolledStudents: -1 })
        .limit(limit);
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
