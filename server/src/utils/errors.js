/**
 * Custom Error Classes
 * ...
 */

/**
 * Base Application Error
 * All custom errors extend from this class
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, metadata = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.metadata = metadata;
        this.isOperational = true; // Distinguishes operational errors from programming errors

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error (400)
 * Used for request validation failures
 */
export class ValidationError extends AppError {
    constructor(message, metadata = {}) {
        super(message, 400, metadata);
    }
}

/**
 * Authentication Error (401)
 * Used for authentication failures
 */
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', metadata = {}) {
        super(message, 401, metadata);
    }
}

/**
 * Authorization Error (403)
 * Used for authorization/permission failures
 */
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied', metadata = {}) {
        super(message, 403, metadata);
    }
}

/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', metadata = {}) {
        super(message, 404, metadata);
    }
}

/**
 * AI Service Error (503)
 * Used for AI/ML service failures (Vertex AI, etc.)
 */
export class AIServiceError extends AppError {
    constructor(message, metadata = {}) {
        super(message, 503, metadata);
    }
}

/**
 * External Service Error (502)
 * Used for third-party service failures (Cloudinary, etc.)
 */
export class ExternalServiceError extends AppError {
    constructor(message, metadata = {}) {
        super(message, 502, metadata);
    }
}

/**
 * Database Error (500)
 * Used for database operation failures
 */
export class DatabaseError extends AppError {
    constructor(message, metadata = {}) {
        super(message, 500, metadata);
    }
}

/**
 * Rate Limit Error (429)
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests', metadata = {}) {
        super(message, 429, metadata);
    }
}

/**
 * File Upload Error (400)
 * Used for file upload failures
 */
export class FileUploadError extends AppError {
    constructor(message, metadata = {}) {
        super(message, 400, metadata);
    }
}
