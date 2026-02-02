# Google Colab Setup Guide

Follow these steps to deploy the TryOnix AI Backend on Google Colab.

## 1. Create a new Colab Notebook
Go to [Colab](https://colab.research.google.com/) and create a new Python 3 notebook.

## 2. Environment Setup
Run this in the first cell:
```python
# Install dependencies
!pip install diffusers transformers accelerate safetensors torch torchvision fastapi uvicorn python-dotenv requests pillow pyngrok

# Mount Google Drive (Optional for persistent cache)
from google.colab import drive
drive.mount('/content/drive')

# Environment Variables (Replace with your actual keys)
import os
os.environ["HUGGINGFACE_HUB_TOKEN"] = "your_hf_token_here"
os.environ["NGROK_AUTH_TOKEN"] = "your_ngrok_auth_token_here"
```

## 3. Server Script
Copy the contents of `python_service/colab_server.py` into a cell and run it.

## 4. integration in Express
Update your `.env` in the Express server:
```env
AI_SERVICE_URL=https://your-ngrok-url.ngrok-free.app
```

### Axios Usage Example (already implemented in `aiService.js`)
```javascript
import axios from 'axios';

// To generate text-to-image
const res = await axios.post('https://your-ngrok-url.ngrok-free.app/generate', {
  prompt: "A stylish jacket"
});

// To perform virtual try-on
const resTryOn = await axios.post('https://your-ngrok-url.ngrok-free.app/tryon', {
  prompt: "Red silk shirt",
  image: "data:image/png;base64,..." // or URL
});
```
