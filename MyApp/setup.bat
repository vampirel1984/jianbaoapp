@echo off
echo ========================================
echo   🏺 鉴宝大师 - Treasure App Setup
echo ========================================
echo.
echo Simple treasure identification app with:
echo - Ad screen before main app
echo - Image upload from camera/gallery  
echo - AI-powered antique identification
echo.

echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/2] Setup complete!
echo.
echo Available commands:
echo   npm start        - Start Metro bundler
echo   npm run android  - Run on Android device/emulator
echo   npm run ios      - Run on iOS device/simulator
echo.
echo To run the app:
echo 1. Start an Android emulator or connect Android device
echo 2. Open a new terminal and run: npm run android
echo 3. The app will show an ad screen first, then the main app
echo.
echo Press any key to exit...
pause >nul
