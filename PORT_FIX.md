# Quick Fix for "Port Already in Use" Error

## The Problem
You're seeing: `Port 5000 is already in use`

This happens because a Node.js server is already running on port 5000.

## Quick Solution

### Option 1: Kill All Node Processes (Cleanest)

Run this command in your terminal:
```bash
taskkill /F /IM node.exe
```

Then restart both servers:
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd app
npm run dev
```

### Option 2: Use the Restart Script

Double-click: **`RESTART_SERVERS.bat`**

This automatically kills old processes and starts fresh servers.

### Option 3: Use a Different Port

Edit `server/.env` and change:
```
PORT=5000
```
To:
```
PORT=5001
```

Then update frontend to use the new port in `app/.env.local`:
```
VITE_API_URL=http://localhost:5001
```

## How to Avoid This

Only run **ONE** instance of the backend server at a time. If you see terminal windows with Node running, close them before starting again.

## Current Status

Run this to check what's using port 5000:
```bash
netstat -ano | findstr :5000
```

If you see output, a process is using that port.
