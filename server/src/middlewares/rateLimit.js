const User = require('../models/User');

const checkTryOnLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const today = new Date();
        const lastDate = user.lastTryOnDate ? new Date(user.lastTryOnDate) : new Date(0);

        // Reset count if it's a new day
        if (lastDate.getDate() !== today.getDate() ||
            lastDate.getMonth() !== today.getMonth() ||
            lastDate.getFullYear() !== today.getFullYear()) {

            user.tryOnCount = 0;
            // We don't save yet, will save on successful try-on or update here
            // Better to update here to be safe or just let the controller handle increment
            // But we need to reset if logic says so.
            // Let's reset count in DB here if needed, or just attach flag.
            // Simplest: Check. If allowed, next(). The Controller increments.
            // Wait, if we don't reset in DB, the controller sees old high count?

            // Logic:
            // 1. If new day, reset count to 0. Save user.
            // 2. If count >= 3, error.

            user.tryOnCount = 0;
            user.lastTryOnDate = today; // Mark today as visited
            await user.save();
        }

        if (user.tryOnCount >= 3) {
            return res.status(429).json({ message: 'Daily limit reached (3 try-ons per day). Please try again tomorrow.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error checking limits' });
    }
};

module.exports = checkTryOnLimit;
