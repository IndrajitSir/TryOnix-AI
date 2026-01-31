import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { ExternalServiceError } from '../utils/errors.js';

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

const uploadImage = async (filePath) => {
    try {
        logger.debug('Starting Cloudinary upload', { filePath });

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath, {
                folder: 'tryonix',
                timeout: config.cloudinary.uploadTimeout
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });

        // Remove file from local uploads after upload to cloudinary
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            logger.warn('Error deleting local file after upload', { error: error.message, filePath });
        }

        return result.secure_url;
    } catch (error) {
        logger.error('Cloudinary Upload Error:', { error: error.message });
        throw new ExternalServiceError('Image upload failed', {
            originalError: error.message
        });
    }
};

export {
    cloudinary,
    uploadImage
};
