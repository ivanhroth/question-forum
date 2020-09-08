
const { validationResult } = require('express-validator');

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch();

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((err)=> err.msg);
        const error = Error('bad request');

        error.errors = errors;
        error.status = 400;
        error.title = 'Bad Request';
        return next(error);
    }
    next();
}

module.exports = { asyncHandler, handleValidationErrors };
