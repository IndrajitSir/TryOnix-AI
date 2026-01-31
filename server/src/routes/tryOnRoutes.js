import express from 'express';
import { createTryOn, getHistory, deleteTryOn } from '../controllers/tryOnController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest, schemas } from '../middlewares/validateRequest.js';
import upload from '../middlewares/uploadMiddleware.js';
import checkTryOnLimit from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/',
    protect,
    checkTryOnLimit,
    upload.fields([{ name: 'personImage', maxCount: 1 }, { name: 'clothImage', maxCount: 1 }]),
    validateRequest(schemas.tryOn.create, 'body'),
    createTryOn
);

router.get('/history', protect, getHistory);

router.delete('/:id',
    protect,
    validateRequest(schemas.tryOn.idParam, 'params'),
    deleteTryOn
);

export default router;
