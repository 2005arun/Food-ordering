# Food Ordering System - Setup & Deployment Guide

## Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local development without Docker)
- MongoDB Atlas account with connection string
- Git

---

## Quick Start with Docker

### 1. Clone/Setup Project
```bash
cd d:\cpp_system_design\Food_ordering
```

### 2. Create `.env` file
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env and add your MongoDB Atlas password
# Replace <your_mongodb_atlas_password> with actual password
# Example:
# DB_PASSWORD=YourPasswordHere123!
# JWT_SECRET=your_super_secure_jwt_secret_min_32_chars
```

### 3. Build and Start All Services
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Application
- **Frontend**: http://localhost (via NGINX load balancer)
- **Frontend (Direct)**: http://localhost:5173
- **API**: http://localhost/api/*

### 5. Verify Services are Running
```bash
# Health checks
curl http://localhost/health/user
curl http://localhost/health/restaurant
curl http://localhost/health/order
curl http://localhost/health/payment
```

---

## Local Development Setup (Without Docker)

### Setup User Service
```bash
cd user-service
copy .env.example .env

# Edit .env with MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://arunramamoorthi05_db_user:<password>@cluster0.t8x2gng.mongodb.net/user-db?appName=Cluster0

npm install
npm run dev  # or: npm start
```

### Setup Restaurant Service
```bash
cd restaurant-service
copy .env.example .env
npm install
npm run dev
```

### Setup Order Service
```bash
cd order-service
copy .env.example .env
npm install
npm run dev
```

### Setup Payment Service
```bash
cd payment-service
copy .env.example .env
npm install
npm run dev
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Setup NGINX (Windows)
If not using Docker, install NGINX manually and configure:
```
# Place nginx/nginx.conf in NGINX conf directory
# Update upstream servers to point to localhost:3001-3004
```

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster

### 2. Create Databases
NGINX will route to single cluster with 4 databases:
- user-db
- restaurant-db
- order-db
- payment-db

### 3. Get Connection String
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

### 4. Whitelist IP Addresses
In MongoDB Atlas → Network Access:
- For local testing: Add `0.0.0.0/0` (not recommended for production)
- For production: Add your server IPs
- Docker containers: Add container network IPs

### 5. Update Environment Variables
```bash
# In .env file:
DB_PASSWORD=your_password_here
```

---

## Database Initialization

### Create Sample Data

#### Signup User
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Create Sample Restaurants
```bash
curl -X POST http://localhost:3002/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "image": "https://via.placeholder.com/300",
    "cuisines": ["Italian", "Continental"],
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "phone": "555-1234",
    "email": "pizza@example.com",
    "rating": 4.5,
    "totalReviews": 245,
    "deliveryTime": 30,
    "minOrder": 200,
    "priceRange": "Medium",
    "isOpen": true
  }'
```

#### Create Menu Items
```bash
curl -X POST http://localhost:3002/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "<restaurant_id>",
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato and mozzarella",
    "image": "https://via.placeholder.com/200",
    "price": 350,
    "category": "Main Course",
    "isVeg": true,
    "spiceLevel": "Mild",
    "preparationTime": 15,
    "isAvailable": true,
    "rating": 4.6,
    "reviews": 128
  }'
```

---

## Deployment Checklist

### Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set DB_PASSWORD securely
- [ ] Use HTTPS in production (add SSL to NGINX)
- [ ] Enable MongoDB Atlas IP whitelisting
- [ ] Add authentication to NGINX endpoints
- [ ] Set NODE_ENV=production

### Performance
- [ ] Configure NGINX caching
- [ ] Enable gzip compression in NGINX
- [ ] Set up proper logging
- [ ] Configure MongoDB indexes
- [ ] Use connection pooling

### Monitoring
- [ ] Set up health check monitoring
- [ ] Configure error logging
- [ ] Monitor service metrics
- [ ] Set up alerts for service failures

### Scaling
- [ ] Run multiple instances of each service
- [ ] Update NGINX upstream config for multiple instances
- [ ] Use load balancer for failover
- [ ] Scale MongoDB Atlas tier as needed

---

## Common Issues & Solutions

### Issue: Services can't connect to MongoDB
**Solution:**
1. Check MongoDB Atlas IP whitelist includes your IP
2. Verify connection string in .env
3. Ensure password doesn't have special characters (or URL encode them)
4. Check network connectivity: `ping cluster0.t8x2gng.mongodb.net`

### Issue: Frontend can't reach backend APIs
**Solution:**
1. Ensure all services are running: `docker-compose ps`
2. Check NGINX is routing correctly: `curl http://localhost/health/user`
3. Verify CORS settings in backend services
4. Check browser console for detailed errors

### Issue: Docker build fails
**Solution:**
1. Clear Docker cache: `docker-compose build --no-cache`
2. Ensure sufficient disk space
3. Check Docker daemon is running
4. Verify Dockerfile syntax

### Issue: NGINX returns 502 Bad Gateway
**Solution:**
1. Check upstream services are running
2. Verify NGINX config syntax: `docker-compose logs nginx`
3. Check service health endpoints
4. Verify service ports match config

---

## Monitoring & Health Checks

### Check Service Health
```bash
# User Service
curl http://localhost:3001/health

# Restaurant Service
curl http://localhost:3002/health

# Order Service
curl http://localhost:3003/health

# Payment Service
curl http://localhost:3004/health

# Via NGINX
curl http://localhost/health/user
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service

# Follow and filter
docker-compose logs -f user-service | grep "error"
```

### Container Metrics
```bash
# CPU, Memory, Network
docker stats

# Detailed info
docker-compose stats
```

---

## Backup & Recovery

### Backup MongoDB Data
```bash
# Using MongoDB Atlas dashboard
# Automated backups are included with Atlas subscription

# Manual export via mongo shell
mongoexport --uri="mongodb+srv://..." --collection=restaurants --out=restaurants.json
```

### Restore Data
```bash
# If data is lost, MongoDB Atlas backups can be restored from dashboard
# Or use mongoimport to restore from JSON
mongoimport --uri="mongodb+srv://..." --collection=restaurants --file=restaurants.json
```

---

## Stopping Services

```bash
# Stop all services (data persists)
docker-compose down

# Stop and remove all data
docker-compose down -v

# Stop specific service
docker-compose stop user-service

# Restart specific service
docker-compose restart user-service
```

---

## Production Deployment

### Using Docker Compose
```bash
# Build optimized images
docker-compose build --no-cache

# Deploy with specific env file
docker-compose --env-file .env.production up -d

# Use resource limits
# Add to docker-compose.yml:
# services:
#   user-service:
#     deploy:
#       resources:
#         limits:
#           cpus: '0.5'
#           memory: 512M
```

### Using Kubernetes
```bash
# Create deployments for each service
# Create services for inter-service communication
# Configure ingress for NGINX

# Example deployment manifest provided in ./k8s folder
```

### Using AWS ECS
```bash
# Create ECS task definitions
# Create ECS services with load balancer
# Configure RDS for MongoDB (consider AWS DocumentDB alternative)
```

---

## Performance Tips

1. **Connection Pooling**: MongoDB driver maintains pool automatically
2. **Caching**: Implement Redis for session/cache layer
3. **Database Indexes**: Already configured in models
4. **API Rate Limiting**: Add express-rate-limit middleware
5. **Compression**: Enable gzip in NGINX
6. **CDN**: Use CloudFlare for frontend assets
7. **Auto-scaling**: Set up based on CPU/memory metrics

---

## Support & Debugging

### Enable Debug Logging
```bash
# In each service, add to server.js:
process.env.DEBUG='*'
# or specific:
process.env.DEBUG='express:*'
```

### API Testing Tools
- **Postman**: Import API collection from docs folder
- **cURL**: Command line testing
- **Thunder Client**: VS Code extension
- **REST Client**: VS Code extension

### Database Debugging
```bash
# MongoDB Atlas console provides query analysis
# Can view slow queries, indexes, performance
# Use MongoDB Compass for local/remote connections
```

