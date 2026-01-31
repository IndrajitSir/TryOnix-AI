# Deployment Guide

This guide covers deploying the TryOnix Server to various cloud providers.

## Pre-Deployment Checklist

1. **Environment Variables**: Ensure you have all variables from `.env.example`.
2. **Hugging Face Token**: Ensure you have a valid token with read permissions.

## Deploying to Railway (Recommended)

1. Create a new project on Railway.
2. Connect your GitHub repository.
3. Set the Environment Variables in Railway dashboard.
   - copy/paste all values from your local `.env`.
   - Setup `HF_ACCESS_TOKEN`.
4. Railway will automatically detect `package.json` and deploy.

## Deploying to Heroku

1. Install Heroku CLI.
2. Login and create app:
   ```bash
   heroku login
   heroku create tryonix-server
   ```
3. Set Environment Variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set HF_ACCESS_TOKEN="your_token"
   # ... set other variables
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

## Deploying to Google Cloud Run

1. Build container:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/tryonix-server
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy tryonix-server \
     --image gcr.io/PROJECT-ID/tryonix-server \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,...
   ```

## Deploying Python AI Service (Render/Railway/Vultr)

1. **Environment Variables**: Add `HUGGINGFACE_HUB_TOKEN`.
2. **Build Command**: `pip install -r requirements.txt`.
3. **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`.

## Post-Deployment Verification

1. **Check logs** to ensure servers started correctly.
2. **Hit the health check endpoints**:
   - Node: `https://your-node-app.com/health`
   - Python: `https://your-python-app.com/health`
3. **Update `BACKEND_URL`**: Ensure the Node.js server's environment variable `BACKEND_URL` points to your deployed Python service.
4. **Update `VITE_API_URL`**: Ensure the Frontend point to your deployed Node.js service.
