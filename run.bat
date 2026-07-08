@echo off
title Isha Kakadiya — Portfolio CMS
color 0F
cls

echo.
echo  =============================================================
echo         ISHA KAKADIYA  ^|  Portfolio + CMS Admin Dashboard
echo  =============================================================
echo.
echo  Routes available after startup:
echo    Portfolio   ^>  http://localhost:5173/
echo    Admin Login ^>  http://localhost:5173/login
echo    Admin Panel ^>  http://localhost:5173/admin   (auth required)
echo.
echo  =============================================================
echo.

cd /d "%~dp0"

:: ── Step 1: Install dependencies if missing ─────────────────────
echo  [1/3] Checking dependencies...
if not exist "node_modules\" (
    echo        node_modules not found — running npm install...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  [ERROR] npm install failed. Please verify Node.js is installed.
        echo          Download: https://nodejs.org
        echo.
        pause
        exit /b 1
    )
    echo        Dependencies installed successfully.
) else (
    echo        node_modules OK.
)
echo.

:: ── Step 2: Check for .env file ──────────────────────────────────
echo  [2/3] Checking environment configuration...
if not exist ".env" (
    echo.
    echo  [WARNING] .env file not found!
    echo.
    echo  Firebase and Cloudinary will not work without a .env file.
    echo  Create one at: %~dp0.env
    echo.
    echo  Required variables:
    echo    VITE_FIREBASE_API_KEY=
    echo    VITE_FIREBASE_AUTH_DOMAIN=
    echo    VITE_FIREBASE_PROJECT_ID=
    echo    VITE_FIREBASE_STORAGE_BUCKET=
    echo    VITE_FIREBASE_MESSAGING_SENDER_ID=
    echo    VITE_FIREBASE_APP_ID=
    echo    VITE_ADMIN_EMAIL=
    echo    VITE_CLOUDINARY_CLOUD_NAME=
    echo    VITE_CLOUDINARY_UPLOAD_PRESET=
    echo.
    echo  The portfolio will still run using local Data.json as fallback.
    echo.
    timeout /t 4 /nobreak >nul
) else (
    echo        .env file found.
)
echo.

:: ── Step 3: Launch dev server + open browser ─────────────────────
echo  [3/3] Starting Vite dev server...
echo        Press Ctrl+C to stop.
echo.

start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173/"

call npm run dev
if errorlevel 1 (
    echo.
    echo  [ERROR] Dev server stopped unexpectedly.
    echo          Check the output above for details.
    echo.
    pause
)
