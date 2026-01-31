import TryOn from '../models/TryOn.js';
import User from '../models/User.js';
import { uploadImage } from '../utils/cloudinary.js';
import { generateImage } from '../services/aiService.js';
import logger from '../utils/logger.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors.js';
import fs from 'fs';
import path from 'path';

// Helper to delete local files
const deleteLocalFiles = (files) => {
    if (!files) return;

    const fileArray = Array.isArray(files) ? files : Object.values(files).flat();

    fileArray.forEach(file => {
        if (file && file.path) {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (err) {
                logger.error('Failed to clear temporary file', { path: file.path, error: err.message });
            }
        }
    });
};

// @desc    Upload images and generate try-on
// @route   POST /tryon
// @access  Private
const createTryOn = async (req, res, next) => {
    try {
        logger.info('Received try-on request', { userId: req.user.id });

        if (!req.files || !req.files['personImage'] || !req.files['clothImage']) {
            throw new ValidationError('Please upload both person and cloth images');
        }

        const personImageFile = req.files['personImage'][0];
        const clothImageFile = req.files['clothImage'][0];

        // 1. Upload images to Cloudinary
        let personImageUrl, clothImageUrl;
        try {
            logger.debug('Uploading images to Cloudinary');
            const results = await Promise.all([
                uploadImage(personImageFile.path),
                uploadImage(clothImageFile.path)
            ]);
            personImageUrl = results[0];
            clothImageUrl = results[1];
        } catch (error) {
            // Clean up files if cloudinary upload fails
            deleteLocalFiles(req.files);
            throw error;
        }

        // 2. Call AI Service (Generate Image)
        logger.debug('Calling AI service');

        // Construct prompt using the URL references
        const prompt = `A realistic photo of a person wearing specific clothing. 
        Person reference image: ${personImageUrl}
        Clothing reference image: ${clothImageUrl}
        Generate a high-quality, photorealistic image of the person wearing the cloth.`;

        // Call service with centralized fallback logic
        const result = await generateImage(prompt);

        if (!result.success) {
            return res.status(503).json({
                success: false,
                message: result.error,
                details: result.details
            });
        }

        logger.info(`Generated image using model: ${result.model}`);

        // 3. Process Result (Base64 -> Temp File -> Cloudinary)
        const tempFileName = `gen-${Date.now()}.png`;
        const tempPath = path.join('uploads', tempFileName);

        // Convert Base64 directly to Buffer
        const buffer = Buffer.from(result.image, 'base64');
        fs.writeFileSync(tempPath, buffer);

        const resultImageUrl = await uploadImage(tempPath);

        // Clean up temp generated file
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        // 4. Save to Database
        const tryOn = await TryOn.create({
            userId: req.user.id,
            personImageUrl,
            clothImageUrl,
            resultImageUrl
        });

        // Update User count
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { tryOnCount: 1 },
            lastTryOnDate: new Date()
        });

        logger.info('Try-on generated successfully', { tryOnId: tryOn._id });
        res.status(201).json(tryOn);

    } catch (error) {
        // Ensure local files (inputs) are cleaned up on any error
        if (req.files) {
            deleteLocalFiles(req.files);
        }
        next(error);
    }
};

// @desc    Get user try-on history
// @route   GET /tryon/history
// @access  Private
const getHistory = async (req, res, next) => {
    try {
        const history = await TryOn.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete try-on entry
// @route   DELETE /tryon/:id
// @access  Private
const deleteTryOn = async (req, res, next) => {
    try {
        const tryOn = await TryOn.findById(req.params.id);

        if (!tryOn) {
            throw new NotFoundError('Try-On not found');
        }

        // Check user
        if (tryOn.userId.toString() !== req.user.id) {
            throw new AuthorizationError('User not authorized');
        }

        await TryOn.deleteOne({ _id: req.params.id });

        logger.info('Try-on deleted', { tryOnId: req.params.id, userId: req.user.id });
        res.status(200).json({ id: req.params.id, message: 'Try-on deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export {
    createTryOn,
    getHistory,
    deleteTryOn
};
