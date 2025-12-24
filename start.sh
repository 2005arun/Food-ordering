#!/bin/bash

# Food Ordering System - Quick Start Script (Linux/Mac)

echo ""
echo "==================================="
echo "  FoodHub - Quick Start Script"
echo "==================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    echo "Please install Docker from https://www.docker.com"
    exit 1
fi

echo "[1/5] Creating .env file from template..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Please edit .env file with your MongoDB Atlas password"
    echo ""
    cat .env
    echo ""
    echo "!! IMPORTANT !! Edit .env and replace the placeholder with your actual MongoDB password"
    read -p "Press enter to continue..."
else
    echo ".env file already exists, skipping..."
fi

echo ""
echo "[2/5] Building Docker images..."
docker-compose build
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build images"
    exit 1
fi

echo ""
echo "[3/5] Starting services..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start services"
    exit 1
fi

echo ""
echo "[4/5] Waiting for services to start (30 seconds)..."
sleep 30

echo ""
echo "[5/5] Verifying services..."
echo ""

services=("user-service:3001" "restaurant-service:3002" "order-service:3003" "payment-service:3004")

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    echo "Checking $name..."
    if curl -s http://localhost:$port/health > /dev/null; then
        echo "  ✓ Service is running"
    else
        echo "  ✗ Service may not be ready yet"
    fi
done

echo ""
echo "==================================="
echo "  Services Started Successfully!"
echo "==================================="
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost"
echo "  API: http://localhost/api/*"
echo ""
echo "Services (direct access):"
echo "  User Service: http://localhost:3001"
echo "  Restaurant Service: http://localhost:3002"
echo "  Order Service: http://localhost:3003"
echo "  Payment Service: http://localhost:3004"
echo ""
echo "View logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services:"
echo "  docker-compose down"
echo ""
