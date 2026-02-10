# Backend Server Crash - Troubleshooting Guide

## Step 1: Check What Error Shows

In your terminal where you see `[nodemon] app crashed`, scroll up to see the actual error message. It should show something like:

```
Error: ...
    at ...
```

Copy that error and share it so I can help fix the specific issue.

## Step 2: Common Issues & Solutions

### Issue 1: MongoDB Not Running

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**: Start MongoDB
```bash
# Option 1: Start MongoDB service (Windows)
net start MongoDB

# Option 2: Run mongod directly
mongod

# Option 3: Use MongoDB Atlas (cloud - free tier)
# Update server/.env with Atlas connection string
```

### Issue 2: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**: Kill the process
```bash
taskkill /F /IM node.exe
```

### Issue 3: Missing Dependencies

**Error**: `Cannot find module '...'`

**Solution**: Reinstall dependencies
```bash
cd server
npm install
```

### Issue 4: Syntax Error in server.js

**Error**: `SyntaxError: ...`

**Solution**: Check server.js for typos or errors

## Step 3: Test Server Directly

Run the server without nodemon to see errors clearly:

```bash
cd server
node server.js
```

This will show the exact error without nodemon's auto-restart.

## Step 4: Check MongoDB Connection

Test if MongoDB is accessible:

```bash
# Try to connect
mongosh

# Or check if it's running
tasklist /FI "IMAGENAME eq mongod.exe"
```

## Step 5: Use Fallback - No MongoDB

If you can't get MongoDB running, temporarily remove the MongoDB requirement:

**Comment out MongoDB in server.js:**
```javascript
// mongoose.connect(MONGODB_URI)
// .then(() => {
//   console.log('Connected to MongoDB');
  
  // Start server directly without MongoDB
  const server = app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
  });
```

This lets you test the frontend without database functionality.

## What to Share

To get help, share:
1. The exact error message from the terminal
2. Output of: `node --version`
3. Output of: `npm --version`
4. Whether MongoDB is installed and running

## Quick Test Commands

```bash
# Test Node is working
node --version

# Test MongoDB is accessible
mongosh --eval "db.version()"

# Test backend dependencies are installed
cd server && npm list
```
