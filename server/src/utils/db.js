import mongoose from 'mongoose';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', { error: err.message });
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        // Graceful shutdown handled in app.js via process signals, 
        // but good to have safety here if needed.

    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`, { stack: error.stack });
        process.exit(1);
    }
};

export default connectDB;
