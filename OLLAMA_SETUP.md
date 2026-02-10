# Steps to Get Ollama Working for Panel Interviewer

## Quick Fix Guide

### Step 1: Check if Ollama is Running

Open a new terminal and run:
```bash
curl http://localhost:11434/api/version
```

**If you get an error**: Ollama is not running. Continue to Step 2.
**If you get a response**: Ollama is running! Skip to Step 3.

---

### Step 2: Install and Start Ollama

#### Install Ollama (if not installed)
1. Go to https://ollama.ai  
2. Download and install Ollama for Windows
3. Restart your terminal after installation

#### Start Ollama Server
Open a new terminal and run:
```bash
ollama serve
```

**Keep this terminal window open!** Ollama needs to stay running.

---

### Step 3: Download the AI Model

In another terminal, run:
```bash
ollama pull llama3.2:3b
```

This downloads the AI model (about 2GB). Wait for it to complete.

---

### Step 4: Test Ollama

```bash
curl http://localhost:11434/api/generate -d "{\"model\":\"llama3.2:3b\",\"prompt\":\"Hi\",\"stream\":false}"
```

You should get a JSON response with AI-generated text.

---

### Step 5: Apply the Improved Feedback Code

I've created an improved version in `IMPROVED_FEEDBACK.js`. To use it:

1. Open `app/src/sections/PanelPage.tsx`
2. Find the `endPanelInterview` function (around line 296)
3. Replace the entire function with the code from `IMPROVED_FEEDBACK.js`
4. Save the file
5. The frontend will automatically reload

---

### Step 6: Test Panel Interviewer

1. Go to http://localhost:5173
2. Start a panel interview
3. Answer some questions
4. Click "End Interview"
5. **Open browser console (F12)** - you'll see detailed logs:
   - `📤 Sending request to Ollama...`
   - `📥 Ollama response received:`
   - `✅ Successfully parsed AI feedback:`

If you see errors in console, they'll tell you exactly what's wrong!

---

## Quick Testing Script

Run this to verify everything:

```bash
# Test 1: Is Ollama running?
curl http://localhost:11434/api/version

# Test 2: Can it generate?
curl http://localhost:11434/api/generate -d "{\"model\":\"llama3.2:3b\",\"prompt\":\"Say hello\",\"stream\":false}"

# If both work, Ollama is ready!
```

---

## Troubleshooting

### "Connection Refused" Error
- Ollama is not running
- Solution: Run `ollama serve` in a terminal

### "Model not found" Error  
- Model not downloaded
- Solution: Run `ollama pull llama3.2:3b`

### "Still getting fallback feedback"
- Check browser console (F12) for errors
- Make sure you applied the improved code from `IMPROVED_FEEDBACK.js`
- Verify Ollama is responding: `curl http://localhost:11434/api/version`

### Feedback is Generic/Random
- The old code might still be running
- Hard refresh the browser: `Ctrl + Shift + R`
- Check console for the new log messages (📤📥✅)

---

##  What the Improved Code Does

1. **Better Logging**: Shows exactly what's being sent/received
2. **Specific Prompts**: Asks Ollama to analyze YOUR actual answers
3. **Clear Errors**: If Ollama fails, you get helpful instructions
4. **Proper Parsing**: Better JSON extraction from Ollama's response

Check the browser console to see what's actually happening!
