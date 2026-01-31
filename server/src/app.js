// Load config first to ensure env vars are present
import config from './config/index.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Utilities and Middleware
import logger from './utils/logger.js';
import connectDB from './utils/db.js';
import requestLogger from './middlewares/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';
import { NotFoundError } from './utils/errors.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import tryOnRoutes from './routes/tryOnRoutes.js';

// Initialize Express
const app = express();

// Database Connection
connectDB();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(cors(config.cors));

// Rate Limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/tryon', limiter); // Apply stricter limits to AI endpoints

// Performance Middleware
app.use(compression());

// Logging Middleware
app.use(requestLogger);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.send('TryOnix API is running...');
});

// Routes
app.use('/auth', authRoutes);
app.use('/tryon', tryOnRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(new NotFoundError(`Not found - ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
});

// Graceful Shutdown
const gracefulShutdown = () => {
    logger.info('Received kill signal, shutting down gracefully');
    server.close(() => {
        logger.info('Closed out remaining connections');
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });

    // Force close after 10s
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
