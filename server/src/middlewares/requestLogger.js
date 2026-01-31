import morgan from 'morgan';
import logger from '../utils/logger.js';

/**
 * HTTP Request Logger Middleware
 * 
 * Integrates Morgan with Winston for HTTP request logging.
 */

// Create custom token for user ID
morgan.token('user-id', (req) => {
    return req.user?.id || 'anonymous';
});

// Create custom token for request body size
morgan.token('body-size', (req) => {
    return req.headers['content-length'] || '0';
});

// Define format based on environment
const format = process.env.NODE_ENV === 'production'
    ? ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
    : ':method :url :status :response-time ms - :res[content-length] bytes - User: :user-id';

// Create Morgan middleware with Winston stream
const requestLogger = morgan(format, {
    stream: logger.stream,
    // Skip logging for health check endpoint
    skip: (req, res) => req.url === '/health'
});

export default requestLogger;
