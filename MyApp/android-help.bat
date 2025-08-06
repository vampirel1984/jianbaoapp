@echo off
echo ========================================
echo   📱 Android Emulator Setup Help
echo ========================================
echo.

echo To set up an Android emulator:
echo.
echo 1. In Android Studio Welcome Screen:
echo    - Click "More Actions" (bottom of screen)
echo    - Select "AVD Manager"
echo.
echo 2. Create Virtual Device:
echo    - Click "Create Virtual Device"  
echo    - Choose "Phone" category
echo    - Select "Pixel 6" or "Pixel 4"
echo    - Click "Next"
echo.
echo 3. Choose System Image:
echo    - Select API 33 or API 34
echo    - Download if needed
echo    - Click "Next"
echo.
echo 4. Finish Setup:
echo    - Name: "TreasureApp_Test"
echo    - Click "Finish"
echo.
echo 5. Start Emulator:
echo    - Click the ▶️ play button
echo    - Wait for boot (2-3 minutes first time)
echo.
echo 6. Test Your App:
echo    - Terminal 1: npm start
echo    - Terminal 2: npm run android
echo.
echo Your app should show:
echo 🏺 Ad screen → 📷 Main screen → 🔍 Results
echo.
echo ========================================
echo Alternative: Use your Android phone!
echo ========================================
echo.
echo If you have an Android phone:
echo 1. Enable Developer Options
echo 2. Enable USB Debugging  
echo 3. Connect via USB
echo 4. Run: npm run android
echo.
pause
