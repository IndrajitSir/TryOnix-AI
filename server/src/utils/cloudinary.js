const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'tryonix',
        });
        // Remove file from local uploads after upload to cloudinary
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.log('Error deleting local file:', error);
        }
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Image upload failed');
    }
};

module.exports = {
    cloudinary,
    uploadImage
};
