@echo off
echo ========================================
echo   📱 Android Emulator Command Line Setup
echo ========================================
echo.

echo [1/4] Looking for Android SDK...
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
if not exist "%ANDROID_HOME%" (
    set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
)
if not exist "%ANDROID_HOME%" (
    echo ERROR: Android SDK not found. Please install Android Studio first.
    echo Expected location: %LOCALAPPDATA%\Android\Sdk
    pause
    exit /b 1
)
echo ✅ Android SDK found at: %ANDROID_HOME%

echo.
echo [2/4] Setting up environment...
set PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%PATH%

echo.
echo [3/4] Checking available system images...
echo Available emulators:
"%ANDROID_HOME%\emulator\emulator" -list-avds

echo.
echo [4/4] Creating emulator if none exist...
echo.
echo Commands to create emulator manually:
echo.
echo 1. Install system image:
echo    "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager" "system-images;android-33;google_apis;x86_64"
echo.
echo 2. Create AVD:
echo    "%ANDROID_HOME%\cmdline-tools\latest\bin\avdmanager" create avd -n TreasureApp -k "system-images;android-33;google_apis;x86_64"
echo.
echo 3. Start emulator:
echo    "%ANDROID_HOME%\emulator\emulator" -avd TreasureApp
echo.

echo ========================================
echo   Alternative: Try Android Studio GUI
echo ========================================
echo.
echo In Android Studio:
echo 1. Create any new project (Empty Activity)
echo 2. Wait for it to load completely
echo 3. Look for "Tools" menu → "Device Manager"
echo 4. Or look for phone/device icon in toolbar
echo.
pause
