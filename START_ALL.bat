@echo off
echo ========================================
echo Pocket Interviewer - Complete Setup
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd /d "%~dp0server"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Frontend Dependencies...
cd /d "%~dp0app"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Now starting the servers...
echo.

echo Starting Backend Server...
cd /d "%~dp0server"
start "Backend Server" cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
cd /d "%~dp0app"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 (or check the terminal)
echo.
echo Press any key to exit this window...
pause > nul
