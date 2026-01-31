import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from '../config/index.js'; // Ensure .js extension for local files

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Winston Logger Configuration
 * 
 * ...
 */

// Define log format for console (development)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;

        // Add metadata if present
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }

        return msg;
    })
);

// Define log format for files (production)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../', config.logging.dir);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Configure transports
const transports = [];

// Console transport (always enabled)
transports.push(
    new winston.transports.Console({
        format: consoleFormat,
        level: config.logging.level
    })
);

// File transports (daily rotation)
if (config.isProduction || process.env.ENABLE_FILE_LOGGING === 'true') {
    // Combined logs (all levels)
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: config.logging.maxFiles,
            maxSize: config.logging.maxSize,
            format: fileFormat,
            level: 'info'
        })
    );

    // Error logs (errors only)
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: config.logging.maxFiles,
            maxSize: config.logging.maxSize,
            format: fileFormat,
            level: 'error'
        })
    );
}

// Create the logger
const logger = winston.createLogger({
    level: config.logging.level,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false
});

/**
 * Stream for Morgan HTTP logger integration
 * Writes HTTP logs to Winston
 */
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', {
        promise,
        reason: reason instanceof Error ? reason.message : reason,
        stack: reason instanceof Error ? reason.stack : undefined
    });
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
        message: error.message,
        stack: error.stack
    });

    // Give logger time to write before exiting
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

export default logger;
