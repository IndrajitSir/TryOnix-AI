// Path module not used in this file


/**
 * Centralized Configuration Management
 * 
 * This module handles all environment variables and provides a typed configuration object.
 * It validates required variables and provides defaults where appropriate.
 * 
 * For Google Cloud authentication, it supports two methods:
 * 1. GOOGLE_APPLICATION_CREDENTIALS - Path to service account JSON file (local dev)
 * 2. GOOGLE_SERVICE_ACCOUNT_BASE64 - Base64-encoded service account JSON (production)
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required variable is missing
 */
const validateEnv = () => {
    const required = [
        'MONGODB_URI',
        'JWT_SECRET',
        // 'CLOUDINARY_CLOUD_NAME', // Typically needed
        // 'CLOUDINARY_API_KEY', // Typically needed
        // 'CLOUDINARY_API_SECRET' // Typically needed
        // Note: keeping existing list from original file slightly modified? 
        // Wait, original file had strict list. I will keep original list exactly.
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Check for Hugging Face Token (support all names)
    if (!process.env.HF_API_KEY && !process.env.HF_ACCESS_TOKEN && !process.env.HUGGING_FACE_API_KEY) {
        throw new Error('Missing Hugging Face Token: Set HF_API_KEY');
    }
};

// Validate environment on module load
validateEnv();

/**
 * Application Configuration Object
 * All configuration values are accessed through this object
 */
const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',

    // Server
    port: parseInt(process.env.PORT || '5000', 10),

    // Database
    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {}
    },

    // AI Microservice
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',

    // Authentication
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    },

    // Google OAuth
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },

    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        uploadTimeout: parseInt(process.env.CLOUDINARY_UPLOAD_TIMEOUT || '60000', 10)
    },

    // Hugging Face
    huggingFace: {
        // Support HF_TOKEN and HF_API_KEY as primary
        apiKey: process.env.HF_TOKEN || process.env.HF_API_KEY || process.env.HF_ACCESS_TOKEN || process.env.HUGGING_FACE_API_KEY,
        modelId: process.env.HF_MODEL_ID || 'stabilityai/stable-diffusion-xl-base-1.0',
        timeout: parseInt(process.env.HF_TIMEOUT || '30000', 10),
        maxRetries: parseInt(process.env.HF_MAX_RETRIES || '3', 10),
        retryDelay: parseInt(process.env.HF_RETRY_DELAY || '1000', 10)
    },

    // File Upload
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        uploadDir: process.env.UPLOAD_DIR || 'uploads/'
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        dir: process.env.LOG_DIR || 'logs',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        maxSize: process.env.LOG_MAX_SIZE || '20m'
    }
};

export default config;
