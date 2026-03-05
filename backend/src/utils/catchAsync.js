/**
 * Wrapper for async route controllers to pass errors to Express global errorHandler
 * Validates that next() is called with the error instead of silently failing or needing a try/catch block
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;
