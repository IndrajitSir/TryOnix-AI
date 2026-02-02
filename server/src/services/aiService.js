import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Calls the AI backend (Google Colab / Local) for image generation or try-on
 * @param {string} prompt - Text description
 * @param {string|null} personImage - Initial image URL or Base64 (optional)
 * @param {string|null} clothingImage - Reference clothing image (optional)
 * @param {object} options - Generation parameters
 */
const generateImage = async (prompt, personImage = null, clothingImage = null, options = {}) => {
    const baseUrl = config.aiServiceUrl || 'http://localhost:8000';

    // Choose endpoint based on whether an initial image is provided
    const isTryOn = !!personImage;
    const endpoint = isTryOn ? '/tryon' : '/generate';
    const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;

    try {
        logger.debug(`Calling AI Backend (${isTryOn ? 'Try-On' : 'Generate'}) at ${url}`);

        let payload;
        if (isTryOn) {
            payload = {
                prompt: prompt,
                image: personImage,
                strength: options.strength || 0.75,
                num_inference_steps: options.num_inference_steps || 25
            };
        } else {
            payload = {
                prompt: prompt,
                num_inference_steps: options.num_inference_steps || 4, // Klein-9B default
                guidance_scale: options.guidance_scale || 3.5
            };
        }

        const response = await axios.post(url, payload, {
            timeout: 300000 // 5 minutes (AI can be slow)
        });

        if (response.data && response.data.image) {
            return {
                success: true,
                image: response.data.image,
                model: isTryOn ? "AutoPipelineForImage2Image" : "FLUX.2-klein-9B"
            };
        }

        throw new Error('Invalid response format from AI backend');

    } catch (error) {
        const msg = error.response?.data?.detail || error.message;
        logger.error(`AI backend failed: ${msg}`);
        return {
            success: false,
            error: `Image generation failed: ${msg}`,
            details: [{ message: msg }]
        };
    }
};

export { generateImage };
