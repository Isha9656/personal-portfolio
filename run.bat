@echo off
title Isha Kakadiya - Portfolio CMS & Admin Dashboard
color 0B
cls

echo.
echo ================================================================
echo       ISHA KAKADIYA  -  Portfolio + Secured CMS Dashboard
echo ================================================================
echo.
echo Available Routes:
echo   • Live Portfolio : http://localhost:5173/
echo   • Admin Login    : http://localhost:5173/login
echo   • Admin Panel    : http://localhost:5173/admin
echo.
echo Security & Access:
echo   • Admin panel is strictly protected with Google Authentication.
echo.
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking dependencies (node_modules)...
if not exist "node_modules\" (
    echo node_modules directory missing. Running npm install...
    call npm install
) else (
    echo Dependencies verified. OK.
)
echo.

echo [2/3] Checking environment configuration (.env)...
if not exist ".env" (
    echo [WARNING] .env configuration file not found!
) else (
    echo .env configuration file found. OK.
)
echo.

echo [3/3] Launching Vite development server...
start http://localhost:5173/
call npm run dev

pause

