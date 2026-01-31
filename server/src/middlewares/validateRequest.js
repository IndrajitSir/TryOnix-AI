import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Request Validation Middleware
 */

/**
 * Validation Schemas
 */
const schemas = {
    // Parsing helpers
    objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),

    // Try-On related schemas
    tryOn: {
        create: Joi.object({
            // Files are handled by Multer
        }),

        idParam: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
                'string.pattern.base': 'Invalid ID format'
            })
        })
    },

    // Auth related schemas
    auth: {
        register: Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        }),
        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
};

/**
 * Middleware factory for Joi validation
 * @param {Object} schema - Joi schema object
 * @param {String} property - Request property to validate (body, query, params)
 */
const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        // If validation depends on file uploads being present
        if (property === 'files' && (!req.files || Object.keys(req.files).length === 0)) {
            return next();
        }

        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const message = error.details.map(detail => detail.message).join(', ');
            const metadata = {
                details: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            };

            return next(new ValidationError(message, metadata));
        }

        // Replace request data with validated (and stripped) data
        req[property] = value;
        next();
    };
};

export {
    validateRequest,
    schemas
};
