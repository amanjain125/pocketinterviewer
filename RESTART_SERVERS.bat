@echo off
echo ========================================
echo Restarting Pocket Interviewer Servers
echo ========================================
echo.

echo Killing any existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo Starting Backend Server...
cd /d "%~dp0server"
start "Backend Server" cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
cd /d "%~dp0app"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Restarting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Both servers should open in new windows.
echo Press any key to close this window...
pause > nul
