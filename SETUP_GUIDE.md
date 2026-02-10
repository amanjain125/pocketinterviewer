# Pocket Interviewer Quick Start Guide

## Automatic Setup (Recommended)

### Option 1: Double-click the setup script
1. Double-click `START_ALL.bat`
2. Wait for dependencies to install (this may take a few minutes)
3. Both servers will start automatically
4. Open your browser to the URL shown in the frontend terminal (usually http://localhost:5173)

## Manual Setup

### Backend
```bash
cd server
npm install
npm start
```

### Frontend (in a new terminal)
```bash
cd app
npm install
npm run dev
```

## Requirements

### MongoDB
The application requires MongoDB to be running. You have two options:

**Option 1: Local MongoDB**
- Install MongoDB Community Server from https://www.mongodb.com/try/download/community
- Start MongoDB service

**Option 2: MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `server/.env` with your connection string:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

### Ollama (for AI Features)
For the panel interviewer AI features to work:

1. Install Ollama from https://ollama.ai
2. Run: `ollama pull llama3.2:3b`
3. Make sure Ollama is running (it runs on port 11434)

## Accessing the Application

1. **Frontend**: http://localhost:5173 (or URL shown in terminal)
2. **Backend API**: http://localhost:5000

## Testing the Panel Interviewer

1. Create an account or log in
2. Your account needs to be on the "Full" plan to access Panel Mode
3. Go to Dashboard → Panel Interviewer
4. Start the interview and use your microphone to answer questions

## Troubleshooting

### Port Already in Use
If you get a port conflict error:
- **Backend**: Change `PORT=5000` to `PORT=5001` in `server/.env`
- **Frontend**: The Vite dev server will automatically use the next available port

### MongoDB Connection Failed
- Ensure MongoDB is running locally, or
- Use MongoDB Atlas and update the connection string in `server/.env`

### Microphone Not Working
- Ensure your browser has microphone permissions
- Use Chrome or Edge (best support for Web Speech API)
- Check that your microphone is not being used by another application

### Ollama Not Responding
- Make sure Ollama is installed and running
- Verify it's accessible at http://localhost:11434
- If not using AI features, the app will use fallback questions
