# TryOnix - AI Virtual Try-On Platform

TryOnix is a full-stack web application that allows users to generate realistic virtual try-on images using AI. Users can upload their photo and a clothing item to see how it looks on them.

## Features

- **User Authentication**: Secure Sign Up & Login (Email/Password + Google OAuth).
- **Virtual Try-On**: Upload person and cloth images to generate a virtual try-on result.
- **Dashboard**: Interactive drag-and-drop interface with real-time previews.
- **History**: View and manage past generated try-ons.
- **Rate Limiting**: Free users are limited to 3 try-ons per day.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, Lucas React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Storage**: Cloudinary
- **AI**: Integration structure for Google Image Generation API

## Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or Atlas URI)
- Cloudinary Account
- Google Cloud Console Project (for OAuth and Vision API)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd TryOnix
```

### 2. Backend Setup
Navigate to the server directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tryonix
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_API_KEY=your_google_api_key_for_ai_service
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory:
```bash
cd ../client
npm install
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure

```
TryOnix/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Application pages
│   │   └── utils/          # API utilities
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth, Upload, RateLimit
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI service integration
│   │   └── utils/          # DB, Cloudinary utils
```

## AI Integration Note
The AI service is currently mocked (`server/src/services/aiService.js`) to return the uploaded person image after a delay. To enable real AI processing, uncomment the API call section in that file and provide valid Google Cloud credentials.

## License
MIT
