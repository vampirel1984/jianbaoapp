@echo off
echo ========================================
echo   🏺 Running Treasure App
echo ========================================
echo.

echo Make sure your Android emulator is running first!
echo.
echo [1/2] Starting Metro bundler...
echo (Keep this terminal open)
echo.

start "Metro Bundler" cmd /c "npm start"

echo.
echo Waiting 10 seconds for Metro to start...
timeout /t 10 /nobreak >nul

echo.
echo [2/2] Deploying app to emulator...
echo.

cmd /c "npm run android"

echo.
echo ========================================
echo Your app should now be running!
echo ========================================
echo.
echo Expected flow:
echo 1. 🏺 Ad screen with countdown (5 seconds)
echo 2. 📷 Main screen with image upload
echo 3. 🔍 Treasure identification results
echo.
pause
