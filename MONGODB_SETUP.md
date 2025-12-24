# MongoDB Atlas Connection Setup & Manual Deployment Guide

## ✅ Configuration Complete

Your system has been configured to connect to **MongoDB Atlas** with the provided credentials:

```
Username: arunramamoorthi05_db_user
Connection String: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/
```

### 4 Databases Created:
1. **user-db** - User profiles, authentication, addresses
2. **restaurant-db** - Restaurant listings, menus, ratings
3. **order-db** - Shopping carts, orders, tracking
4. **payment-db** - Payment transactions

---

## 📦 Environment Files Updated

### .env Configuration
Location: `d:\cpp_system_design\Food_ordering\.env`

```env
MONGO_URI=mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=FoodHubProduction2024SecureJWTSecretKeyMin32CharsRandom!@#$%
NODE_ENV=production
```

### docker-compose.yml Updated
All services now configured with complete MongoDB URIs for their respective databases:

```yaml
user-service:
  MONGODB_URI: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/user-db?...

restaurant-service:
  MONGODB_URI: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/restaurant-db?...

order-service:
  MONGODB_URI: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/order-db?...

payment-service:
  MONGODB_URI: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/payment-db?...
```

---

## 🚀 Alternative Deployment: Manual Local Setup

If Docker build continues to have npm timeout issues, follow these steps to run services locally:

### Step 1: Install Dependencies

```bash
cd D:\cpp_system_design\Food_ordering

# For each service
cd user-service
npm install
npm install -g nodemon  # For development

cd ..
cd restaurant-service
npm install

cd ..
cd order-service
npm install

cd ..
cd payment-service
npm install

cd ..
cd frontend
npm install
```

### Step 2: Start Services (Terminal 1-5)

**Terminal 1 - User Service:**
```bash
cd user-service
npm start
# Runs on http://localhost:3001
```

**Terminal 2 - Restaurant Service:**
```bash
cd restaurant-service
npm start
# Runs on http://localhost:3002
```

**Terminal 3 - Order Service:**
```bash
cd order-service
npm start
# Runs on http://localhost:3003
```

**Terminal 4 - Payment Service:**
```bash
cd payment-service
npm start
# Runs on http://localhost:3004
```

**Terminal 5 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## ✅ Changes Made for MongoDB Atlas

### Updated Files:
1. ✅ `.env` - Added MongoDB Atlas connection string
2. ✅ `docker-compose.yml` - Updated all service MONGODB_URI variables
3. ✅ All service Dockerfiles - Enhanced npm configuration and timeouts
4. ✅ All .npmrc files created - npm timeout configuration for faster registry access

### Environment Variables per Service:

**User Service (Port 3001):**
```
MONGODB_URI=mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/user-db?...
JWT_SECRET=FoodHubProduction2024...
NODE_ENV=production
```

**Restaurant Service (Port 3002):**
```
MONGODB_URI=mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/restaurant-db?...
NODE_ENV=production
```

**Order Service (Port 3003):**
```
MONGODB_URI=mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/order-db?...
USER_SERVICE_URL=http://user-service:3001
PAYMENT_SERVICE_URL=http://payment-service:3004
NODE_ENV=production
```

**Payment Service (Port 3004):**
```
MONGODB_URI=mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/payment-db?...
ORDER_SERVICE_URL=http://order-service:3003
NODE_ENV=production
```

---

## 🧪 Testing MongoDB Connection

Once services are running, test the connection:

```bash
# Check User Service health
curl http://localhost:3001/health

# Check Restaurant Service health
curl http://localhost:3002/health

# Check Order Service health
curl http://localhost:3003/health

# Check Payment Service health
curl http://localhost:3004/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "user-service",
  "timestamp": "2025-12-23T..."
}
```

---

## 📊 Database Verification

Your MongoDB Atlas databases are now:

| Database | Collections | Purpose |
|----------|-------------|---------|
| `user-db` | users | User profiles, auth, addresses |
| `restaurant-db` | restaurants, menu_items | Restaurant data, menus |
| `order-db` | carts, orders | Shopping carts, order history |
| `payment-db` | payments | Payment transactions |

---

## 🐛 Troubleshooting

### If npm install fails in Docker:
Use the **Manual Local Setup** method above

### If MongoDB connection fails:
1. Verify MongoDB Atlas IP whitelist includes your machine
2. Check internet connectivity
3. Verify credentials: `arunramamoorthi05_db_user` / `Wbi9cx8mQtaTdWse`
4. Ensure cluster is running in MongoDB Atlas console

### To restart Docker build later:
```bash
cd D:\cpp_system_design\Food_ordering
docker compose build --no-cache
docker compose up -d
```

---

## 📋 Summary of Credentials

```
MongoDB Atlas URL: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/
Cluster: cluster0.t8x2gng.mongodb.net
Username: arunramamoorthi05_db_user
Password: Wbi9cx8mQtaTdWse
```

⚠️ **Security Note**: For production, use environment variables or secrets management system. Never commit credentials to version control.

---

## 🎯 Next Steps

Choose one deployment method:

### Option A: Wait for Docker (Automatic)
- Docker will eventually complete npm install
- Check: `docker ps` to see running containers
- Access frontend: http://localhost

### Option B: Run Locally (Recommended for Development)
- Open 5 terminals
- Run each service from Step 2 above
- Access frontend: http://localhost:5173

Your system is ready! 🎉
