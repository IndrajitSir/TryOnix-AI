import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

/**
 * Centralized Error Handler Middleware
 */

/**
 * Handles Mongoose validation errors
 */
const handleMongooseValidationError = (err) => {
    const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
    }));

    return {
        statusCode: 400,
        message: 'Validation failed',
        errors
    };
};

/**
 * Handles Mongoose duplicate key errors
 */
const handleMongooseDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyPattern)[0];
    return {
        statusCode: 409,
        message: `${field} already exists`,
        errors: [{ field, message: 'This value is already in use' }]
    };
};

/**
 * Handles Mongoose cast errors (invalid ObjectId, etc.)
 */
const handleMongooseCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid ${err.path}: ${err.value}`,
        errors: [{ field: err.path, message: 'Invalid value' }]
    };
};

/**
 * Handles Multer file upload errors
 */
const handleMulterError = (err) => {
    const messages = {
        LIMIT_FILE_SIZE: 'File size exceeds the maximum limit',
        LIMIT_FILE_COUNT: 'Too many files uploaded',
        LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
        LIMIT_PART_COUNT: 'Too many parts in the multipart request'
    };

    return {
        statusCode: 400,
        message: messages[err.code] || 'File upload error',
        errors: [{ field: err.field, message: messages[err.code] || err.message }]
    };
};

/**
 * Handles JWT errors
 */
const handleJWTError = (err) => {
    const messages = {
        JsonWebTokenError: 'Invalid token',
        TokenExpiredError: 'Token has expired',
        NotBeforeError: 'Token not active yet'
    };

    return {
        statusCode: 401,
        message: messages[err.name] || 'Authentication failed',
        errors: [{ message: messages[err.name] || err.message }]
    };
};

/**
 * Main error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Log the error
    logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id
    });

    // Handle specific error types
    if (err.name === 'ValidationError' && err.errors) {
        // Mongoose validation error
        const handled = handleMongooseValidationError(err);
        error.statusCode = handled.statusCode;
        error.message = handled.message;
        error.errors = handled.errors;
    } else if (err.code === 11000) {
        // Mongoose duplicate key error
        const handled = handleMongooseDuplicateKeyError(err);
        error.statusCode = handled.statusCode;
        error.message = handled.message;
        error.errors = handled.errors;
    } else if (err.name === 'CastError') {
        // Mongoose cast error
        const handled = handleMongooseCastError(err);
        error.statusCode = handled.statusCode;
        error.message = handled.message;
        error.errors = handled.errors;
    } else if (err.name && err.name.startsWith('Multer')) {
        // Multer error
        const handled = handleMulterError(err);
        error.statusCode = handled.statusCode;
        error.message = handled.message;
        error.errors = handled.errors;
    } else if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err.name)) {
        // JWT error
        const handled = handleJWTError(err);
        error.statusCode = handled.statusCode;
        error.message = handled.message;
        error.errors = handled.errors;
    }

    // Default status code
    const statusCode = error.statusCode || 500;

    // Build response object
    const response = {
        success: false,
        message: error.message || 'Internal server error',
        ...(error.errors && { errors: error.errors }),
        ...(error.metadata && { metadata: error.metadata })
    };

    // In development, include stack trace
    if (process.env.NODE_ENV !== 'production') {
        response.stack = error.stack;
    }

    // Send response
    res.status(statusCode).json(response);
};

export default errorHandler;
