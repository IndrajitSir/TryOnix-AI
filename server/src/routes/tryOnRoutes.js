const express = require('express');
const router = express.Router();
const { createTryOn, getHistory, deleteTryOn } = require('../controllers/tryOnController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const checkTryOnLimit = require('../middlewares/rateLimit');

router.post('/', protect, checkTryOnLimit, upload.fields([{ name: 'personImage', maxCount: 1 }, { name: 'clothImage', maxCount: 1 }]), createTryOn);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteTryOn);

module.exports = router;
