import User from '../models/User.js';

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

export default checkTryOnLimit;
