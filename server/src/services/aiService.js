import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const generateImage = async (prompt, personImage = null, clothingImage = null, options = {}) => {
    // Ensure URL is correctly formatted
    const baseUrl = config.aiServiceUrl || 'http://localhost:8000';
    const url = `${baseUrl.replace(/\/$/, '')}/generate-image`;

    try {
        logger.debug(`Calling Python Backend at ${url}`);

        const payload = {
            prompt,
            person_image: personImage,
            clothing_image: clothingImage,
            model_type: options.modelType || (clothingImage ? 'vto' : 'flux'),
            num_inference_steps: options.num_inference_steps || 25,
            guidance_scale: options.guidance_scale || 7.5,
            strength: options.strength || 0.75
        };

        // Use timeout to prevent hanging
        const response = await axios.post(url, payload, {
            timeout: 120000 // 2 minutes for FLUX
        });

        if (response.data && response.data.image) {
            // Return base64 string directly
            return {
                success: true,
                image: response.data.image, // Base64 string
                model: "FLUX.2-klein-9B"
            };
        }

        throw new Error('Invalid response format from Python backend');

    } catch (error) {
        const msg = error.response?.data?.detail || error.message;
        logger.error(`Python backend failed: ${msg}`);
        return {
            success: false,
            error: `Image generation failed: ${msg}`,
            details: [{ message: msg }]
        };
    }
};

export { generateImage };
