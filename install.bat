@echo off
REM FoodHub - Quick Setup Script for Windows
REM This script will install all dependencies and start services

setlocal enabledelayedexpansion
set ROOT_DIR=%CD%

echo.
echo ========================================
echo FoodHub - Automatic Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Setting up User Service...
cd "%ROOT_DIR%\user-service"
call npm install --legacy-peer-deps
if errorlevel 1 goto error

echo [2/5] Setting up Restaurant Service...
cd "%ROOT_DIR%\restaurant-service"
call npm install --legacy-peer-deps
if errorlevel 1 goto error

echo [3/5] Setting up Order Service...
cd "%ROOT_DIR%\order-service"
call npm install --legacy-peer-deps
if errorlevel 1 goto error

echo [4/5] Setting up Payment Service...
cd "%ROOT_DIR%\payment-service"
call npm install --legacy-peer-deps
if errorlevel 1 goto error

echo [5/5] Setting up Frontend...
cd "%ROOT_DIR%\frontend"
call npm install --legacy-peer-deps
if errorlevel 1 goto error

echo.
echo ========================================
echo ✓ All dependencies installed successfully!
echo ========================================
echo.
echo To start the services, run start.bat
echo.
pause
goto end

:error
echo.
echo ERROR: Installation failed!
echo Please check the error messages above.
echo.
pause
exit /b 1

:end
endlocal
