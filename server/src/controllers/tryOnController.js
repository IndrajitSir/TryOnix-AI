const TryOn = require('../models/TryOn');
const User = require('../models/User');
const { uploadImage } = require('../utils/cloudinary');
const { generateTryOn } = require('../services/aiService');

// @desc    Upload images and generate try-on
// @route   POST /tryon
// @access  Private
const createTryOn = async (req, res) => {
    try {
        if (!req.files || !req.files['personImage'] || !req.files['clothImage']) {
            return res.status(400).json({ message: 'Please upload both person and cloth images' });
        }

        // 1. Upload images to Cloudinary
        const personImageFile = req.files['personImage'][0];
        const clothImageFile = req.files['clothImage'][0];

        const personImageUrl = await uploadImage(personImageFile.path);
        const clothImageUrl = await uploadImage(clothImageFile.path);

        // 2. Call AI Service
        const resultImageUrl = await generateTryOn(personImageUrl, clothImageUrl);

        // 3. Save to Database
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

        res.status(201).json(tryOn);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during Try-On generation' });
    }
};

// @desc    Get user try-on history
// @route   GET /tryon/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const history = await TryOn.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete try-on entry
// @route   DELETE /tryon/:id
// @access  Private
const deleteTryOn = async (req, res) => {
    try {
        const tryOn = await TryOn.findById(req.params.id);

        if (!tryOn) {
            return res.status(404).json({ message: 'Try-On not found' });
        }

        // Check user
        if (tryOn.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await convertToModelDelete(tryOn); // Mongoose 8+ might differ, ensure remove() or deleteOne()
        // await TryOn.deleteOne({ _id: req.params.id }); is safer
        await TryOn.deleteOne({ _id: req.params.id });

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createTryOn,
    getHistory,
    deleteTryOn
};
