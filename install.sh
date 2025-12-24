#!/bin/bash
# FoodHub - Quick Start Script (macOS/Linux)

echo ""
echo "========================================="
echo "  FoodHub - Installation & Startup"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[1/5] Installing User Service dependencies..."
cd "$ROOT_DIR/user-service"
npm install --legacy-peer-deps || exit 1

echo ""
echo "[2/5] Installing Restaurant Service dependencies..."
cd "$ROOT_DIR/restaurant-service"
npm install --legacy-peer-deps || exit 1

echo ""
echo "[3/5] Installing Order Service dependencies..."
cd "$ROOT_DIR/order-service"
npm install --legacy-peer-deps || exit 1

echo ""
echo "[4/5] Installing Payment Service dependencies..."
cd "$ROOT_DIR/payment-service"
npm install --legacy-peer-deps || exit 1

echo ""
echo "[5/5] Installing Frontend dependencies..."
cd "$ROOT_DIR/frontend"
npm install --legacy-peer-deps || exit 1

echo ""
echo "========================================="
echo "✓ All dependencies installed successfully!"
echo "========================================="
echo ""
echo "To start services, run: ./start.sh"
echo ""
