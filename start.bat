@echo off
REM Food Ordering System - Quick Start Script (Windows)

setlocal enabledelayedexpansion

echo.
echo ===================================
echo  FoodHub - Quick Start
echo ===================================
echo.

REM Get the directory where this script is located
set ROOT_DIR=%~dp0

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install from https://nodejs.org/
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version

echo.
echo This script will start all 5 services in separate windows:
echo   - User Service (Port 3001)
echo   - Restaurant Service (Port 3002)  
echo   - Order Service (Port 3003)
echo   - Payment Service (Port 3004)
echo   - Frontend (Port 5173)
echo.
echo Press any key to continue...
pause

REM Start services in new windows
echo [1/5] Starting User Service...
cd /d "%ROOT_DIR%user-service"
start "FoodHub - User Service" cmd /k "npm start"
timeout /t 2 /nobreak

echo [2/5] Starting Restaurant Service...
cd /d "%ROOT_DIR%restaurant-service"
start "FoodHub - Restaurant Service" cmd /k "npm start"
timeout /t 2 /nobreak

echo [3/5] Starting Order Service...
cd /d "%ROOT_DIR%order-service"
start "FoodHub - Order Service" cmd /k "npm start"
timeout /t 2 /nobreak

echo [4/5] Starting Payment Service...
cd /d "%ROOT_DIR%payment-service"
start "FoodHub - Payment Service" cmd /k "npm start"
timeout /t 2 /nobreak

echo [5/5] Starting Frontend...
cd /d "%ROOT_DIR%frontend"
start "FoodHub - Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo ✓ All services started!
echo ========================================
echo.
echo Services will open in separate windows.
echo.
echo Frontend URL: http://localhost:5173
echo.
echo To stop services, close the individual windows or:
echo   - Press Ctrl+C in each terminal
echo.
echo If services fail to start, run: install.bat
echo.
pause
endlocal

)

echo.
echo [2/5] Building Docker images...
call docker-compose build
if errorlevel 1 (
    echo ERROR: Failed to build images
    pause
    exit /b 1
)

echo.
echo [3/5] Starting services...
call docker-compose up -d
if errorlevel 1 (
    echo ERROR: Failed to start services
    pause
    exit /b 1
)

echo.
echo [4/5] Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak

echo.
echo [5/5] Verifying services...
echo.

setlocal enabledelayedexpansion

set services[0]=user-service:3001
set services[1]=restaurant-service:3002
set services[2]=order-service:3003
set services[3]=payment-service:3004

for /L %%i in (0,1,3) do (
    set service=!services[%%i]!
    echo Checking !service!...
    curl -s http://localhost/!service:*=health! >nul
    if errorlevel 1 (
        echo   WARNING: Service may not be ready yet
    ) else (
        echo   OK: Service is running
    )
)

echo.
echo ===================================
echo  Services Started Successfully!
echo ===================================
echo.
echo Access the application at:
echo   Frontend: http://localhost
echo   API: http://localhost/api/*
echo.
echo Services (direct access):
echo   User Service: http://localhost:3001
echo   Restaurant Service: http://localhost:3002
echo   Order Service: http://localhost:3003
echo   Payment Service: http://localhost:3004
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo Stop services:
echo   docker-compose down
echo.
pause
