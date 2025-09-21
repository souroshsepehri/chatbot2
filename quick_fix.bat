@echo off
echo ========================================
echo    QUICK FIX - Kill and Restart
echo ========================================
echo.

echo Killing all existing processes...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting Backend...
cd /d C:\chatbot2\backend
start "Backend" cmd /k "python app.py"
cd /d C:\chatbot2

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
cd /d C:\chatbot2\frontend
start "Frontend" cmd /k "npm run dev"
cd /d C:\chatbot2

echo Waiting 10 seconds...
timeout /t 10 /nobreak >nul

echo Opening Admin Panel...
start http://localhost:3000/admin

echo Done! Check the server windows for any errors.
pause
