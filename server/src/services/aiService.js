const axios = require('axios');
const https = require('https');

const generateTryOn = async (personImageUrl, clothImageUrl) => {
    console.log(`[AI Interaction] Generating Try-On for:`);
    console.log(`- Person: ${personImageUrl}`);
    console.log(`- Cloth: ${clothImageUrl}`);

    const agent = new https.Agent({  
        rejectUnauthorized: false  // only for dev/test
    });
    const prompt = "Virtual try-on. Place the uploaded clothing naturally on the person. Preserve body proportions, pose, and facial identity. Maintain the original background. Use realistic lighting, natural shadows, and cloth folds. High-quality fashion photography look.";

    const apiUrl = 'https://api.nanobanana.com/v1/tryon';

    const response = await axios.post(apiUrl, {
        image: personImageUrl,
        mask_image: clothImageUrl,
        prompt: prompt
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.NANO_API_KEY}`
        },
        httpsAgent: agent
    });
    return response.data.output_url;
};

module.exports = {
    generateTryOn
};
