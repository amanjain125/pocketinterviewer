# ⚠️ Manual Fix Required: PDF Features

The automated installation of the PDF parsing library (`pdfjs-dist`) is taking too long or failing in the background. You need to run this manually to fix the "Failed to resolve import" error.

## Steps to Fix

1.  **Open a new terminal** in VS Code (Terminal > New Terminal).
2.  **Navigate to the app folder**:
    ```bash
    cd app
    ```
3.  **Install the missing package**:
    ```bash
    npm install pdfjs-dist@3.11.174
    ```
4.  **Restart the Development Server**:
    - Go to your running server terminal.
    - Press `Ctrl+C` to stop it.
    - Run `npm run dev` again.

## Verification
Once the server restarts, try uploading a PDF resume again. The error should be gone!
