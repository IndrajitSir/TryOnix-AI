import multer from 'multer';
import path from 'path';
import os from 'os';
import config from '../config/index.js';
import { FileUploadError } from '../utils/errors.js';

const isVercel = process.env.VERCEL === '1';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use /tmp on Vercel, otherwise 'uploads/'
        const uploadPath = isVercel ? os.tmpdir() : 'uploads/';
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const checkFileType = (file, cb) => {
    // Basic extension check
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new FileUploadError('Images only! Allowed formats: jpeg, jpg, png, webp'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: {
        fileSize: config.upload.maxFileSize, // Limit from config
        files: 2 // Max 2 files for our use case (person + cloth)
    }
});

export default upload;
