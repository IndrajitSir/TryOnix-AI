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

## Post-Deployment Verification

1. Check logs to ensure server started correctly.
2. Hit the health check endpoint: `https://your-app.com/health`.
   - Should return `{"status": "UP", ...}`.
