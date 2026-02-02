import os
import torch
import base64
import logging
import requests
import uvicorn
from io import BytesIO
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from PIL import Image
from diffusers import FluxPipeline, AutoPipelineForImage2Image
from pyngrok import ngrok
from dotenv import load_dotenv

# Try to load .env if it exists
load_dotenv()

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ColabAI")

app = FastAPI(title="TryOnix Colab Backend")

# Model Configuration
FLUX_MODEL_ID = "black-forest-labs/FLUX.2-klein-9B"
HF_TOKEN = os.getenv("HUGGINGFACE_HUB_TOKEN")

# Global variables for models
pipe_flux = None
pipe_vto = None

device = "cuda" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.bfloat16 if device == "cuda" else torch.float32

def load_flux_pipeline():
    global pipe_flux
    if pipe_flux is None:
        logger.info(f"Loading FLUX pipeline: {FLUX_MODEL_ID} on {device}...")
        if not HF_TOKEN:
            raise ValueError("HUGGINGFACE_HUB_TOKEN is missing!")
        pipe_flux = FluxPipeline.from_pretrained(
            FLUX_MODEL_ID,
            torch_dtype=torch_dtype,
            token=HF_TOKEN,
            use_safetensors=True
        )
        pipe_flux.to(device)
        logger.info("FLUX Pipeline loaded successfully.")
    return pipe_flux

def load_vto_pipeline():
    global pipe_vto
    if pipe_vto is None:
        # Using a general I2I pipeline or a specialized VTO model if provided
        # For this requirement, we use AutoPipelineForImage2Image
        logger.info(f"Loading VTO (I2I) pipeline on {device}...")
        pipe_vto = AutoPipelineForImage2Image.from_pretrained(
            "stabilityai/stable-diffusion-xl-refiner-1.0", # Fallback or specialized
            torch_dtype=torch_dtype,
            token=HF_TOKEN,
            use_safetensors=True
        )
        pipe_vto.to(device)
        logger.info("VTO Pipeline loaded successfully.")
    return pipe_vto

class GenerateRequest(BaseModel):
    prompt: str
    num_inference_steps: int = 4 # Optimized for Klein-9B which is often distilled
    guidance_scale: float = 3.5

class TryOnRequest(BaseModel):
    prompt: str
    image: str  # URL or Base64
    strength: float = 0.75
    num_inference_steps: int = 25

def process_image(image_input: str):
    try:
        if image_input.startswith("http"):
            response = requests.get(image_input, timeout=10)
            return Image.open(BytesIO(response.content)).convert("RGB")
        elif "base64," in image_input:
            _, encoded = image_input.split("base64,", 1)
            data = base64.b64decode(encoded)
            return Image.open(BytesIO(data)).convert("RGB")
        else:
            # Assume raw base64
            data = base64.b64decode(image_input)
            return Image.open(BytesIO(data)).convert("RGB")
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        raise HTTPException(status_code=400, detail="Invalid image format or URL")

@app.post("/generate")
async def generate(request: GenerateRequest):
    try:
        pipeline = load_flux_pipeline()
        logger.info(f"Generating image with prompt: {request.prompt}")
        
        image = pipeline(
            prompt=request.prompt,
            num_inference_steps=request.num_inference_steps,
            guidance_scale=request.guidance_scale
        ).images[0]
        
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {"image": img_str}
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tryon")
async def tryon(request: TryOnRequest):
    try:
        pipeline = load_vto_pipeline()
        init_image = process_image(request.image)
        
        logger.info(f"Running Try-On with prompt: {request.prompt}")
        
        image = pipeline(
            prompt=request.prompt,
            image=init_image,
            strength=request.strength,
            num_inference_steps=request.num_inference_steps
        ).images[0]
        
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {"image": img_str}
    except Exception as e:
        logger.error(f"Try-On failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "TryOnix AI Backend is running"}

if __name__ == "__main__":
    # Integration with ngrok (requires NGROK_AUTH_TOKEN env var)
    NGROK_TOKEN = os.getenv("NGROK_AUTH_TOKEN")
    if NGROK_TOKEN:
        ngrok.set_auth_token(NGROK_TOKEN)
        public_url = ngrok.connect(8000).public_url
        print(f"\n\n * Public URL: {public_url} *\n\n")
    else:
        print("\n\n WARNING: NGROK_AUTH_TOKEN not found. Server only accessible locally. \n\n")
        
    uvicorn.run(app, host="0.0.0.0", port=8000)
