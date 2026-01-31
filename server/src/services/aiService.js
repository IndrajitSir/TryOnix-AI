import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const generateImage = async (prompt, options = {}) => {
    // Ensure URL is correctly formatted
    const baseUrl = config.aiServiceUrl || 'http://localhost:8000';
    const url = `${baseUrl.replace(/\/$/, '')}/generate-image`;

    // Check if prompt contains image URLs (rudimentary parsing or just pass through)
    // The previous implementation constructed a long prompt string with URLs. 
    // The Python backend might need 'image_url' explicitly if we want it to load the image.
    // However, the controller passes a single "prompt" string containing the URLs. 
    // We will extract image URL if present for better handling in Python if needed, 
    // or just pass prompt as is. 
    // For now, pass prompt as is, and let Python side handle it (or just T2I).

    // Parse options from controller (it passes a single prompt usually)
    // But controller calls: generateImageWithFallback(prompt)

    try {
        logger.debug(`Calling Python Backend at ${url} with prompt: ${prompt.substring(0, 50)}...`);

        const payload = {
            prompt,
            num_inference_steps: options.num_inference_steps || 25,
            guidance_scale: options.guidance_scale || 7.5
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
