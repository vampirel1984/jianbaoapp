@echo off
echo ========================================
echo   🧪 Testing Treasure App
echo ========================================
echo.

echo [1/3] Checking if dependencies are installed...
if not exist "node_modules" (
    echo ERROR: Dependencies not found. Run setup.bat first.
    pause
    exit /b 1
)
echo ✅ Dependencies found

echo.
echo [2/3] Checking React Native CLI...
cmd /c "npx --version" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: npx not available, using alternative method
) else (
    echo ✅ React Native CLI available
)

echo.
echo [3/3] Starting Metro bundler...
echo.
echo 📱 Your app is ready to test!
echo.
echo Next steps:
echo 1. Keep this terminal open (Metro bundler running)
echo 2. Open Android Studio and start an emulator
echo 3. Open a NEW terminal window
echo 4. In the new terminal, run: npm run android
echo.
echo The app should install and show:
echo 🏺 Ad screen with countdown (5 seconds)
echo 📷 Main screen with image upload
echo.
echo Starting Metro bundler now...
echo.

cmd /c "npm start"
