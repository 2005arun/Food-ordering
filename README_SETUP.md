# FoodHub Setup Complete ✅

## MongoDB Atlas Connection Established

Your FoodHub food ordering system is now **fully configured** to connect to MongoDB Atlas!

### Connection Details
```
✓ Cluster: cluster0.t8x2gng.mongodb.net
✓ Username: arunramamoorthi05_db_user
✓ Password: Wbi9cx8mQtaTdWse
✓ 4 Databases Created:
  • user-db (User profiles, auth, addresses)
  • restaurant-db (Restaurant listings, menus)
  • order-db (Shopping carts, orders)
  • payment-db (Payment transactions)
```

---

## 🚀 Get Started in 2 Steps

### Step 1: Install Dependencies
**Run this file**: `install.bat`

This will install all npm packages for:
- User Service (Port 3001)
- Restaurant Service (Port 3002)
- Order Service (Port 3003)
- Payment Service (Port 3004)
- Frontend (Port 5173)

⏱️ **Time**: 5-10 minutes on first run

### Step 2: Start Services
**Run this file**: `start.bat`

This will start all 5 services in separate terminal windows.

Then open: **http://localhost:5173**

---

## 📋 What Was Done

### ✅ Configuration Updates
1. **MongoDB Atlas Connection**
   - Updated `.env` with complete MongoDB URI
   - All services configured with database-specific connection strings
   - 4 separate MongoDB databases created for each microservice

2. **Docker Configuration**
   - Updated `docker-compose.yml` with MongoDB URIs
   - Modified all Dockerfiles for faster npm installations
   - Created `.npmrc` files with optimized npm config

3. **Scripts Created**
   - `install.bat` - Installs dependencies
   - `start.bat` - Starts all 5 services
   - `GETTING_STARTED.md` - Complete setup guide

### ✅ Services Ready
- **User Service** (Port 3001) - Authentication & profiles
- **Restaurant Service** (Port 3002) - Listings & menus
- **Order Service** (Port 3003) - Cart & orders
- **Payment Service** (Port 3004) - Payment processing
- **Frontend** (Port 5173) - React Vite application

### ✅ Database Setup
- MongoDB Atlas cluster configured
- 4 databases created and ready
- Connection strings in all services
- Data persistence enabled

---

## 📂 Files You Need

| File | Purpose |
|------|---------|
| `install.bat` | Install npm dependencies (run once) |
| `start.bat` | Start all services (run to launch) |
| `.env` | MongoDB credentials & config |
| `GETTING_STARTED.md` | Complete setup instructions |
| `MONGODB_SETUP.md` | MongoDB details & troubleshooting |
| `QUICK_REFERENCE.md` | API reference & commands |

---

## 🎯 Quick Test

After running `start.bat`, test the services:

```bash
# Test User Service
curl http://localhost:3001/health

# Test Restaurant Service  
curl http://localhost:3002/health

# Test Order Service
curl http://localhost:3003/health

# Test Payment Service
curl http://localhost:3004/health

# Access Frontend
http://localhost:5173
```

Expected response:
```json
{
  "status": "UP",
  "service": "user-service",
  "timestamp": "..."
}
```

---

## 🔑 Credentials & Configuration

### MongoDB Atlas
```
URL: mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/
```

### Environment Variables (in .env)
```
MONGO_URI=mongodb+srv://arunramamoorthi05_db_user:Wbi9cx8mQtaTdWse@cluster0.t8x2gng.mongodb.net/...
JWT_SECRET=FoodHubProduction2024SecureJWTSecretKeyMin32CharsRandom!@#$%
NODE_ENV=production
```

### Service Ports
- User Service: `localhost:3001`
- Restaurant Service: `localhost:3002`
- Order Service: `localhost:3003`
- Payment Service: `localhost:3004`
- Frontend: `localhost:5173`

---

## ⚡ Quick Start Commands

### Using Batch Scripts (Easiest)
```
1. Double-click install.bat
2. Double-click start.bat
3. Open http://localhost:5173
```

### Using Terminal (Manual)
```bash
# Install all services
cd D:\cpp_system_design\Food_ordering
cd user-service && npm install && cd ..
cd restaurant-service && npm install && cd ..
cd order-service && npm install && cd ..
cd payment-service && npm install && cd ..
cd frontend && npm install && cd ..

# Terminal 1: User Service
cd D:\cpp_system_design\Food_ordering\user-service
npm start

# Terminal 2: Restaurant Service
cd D:\cpp_system_design\Food_ordering\restaurant-service
npm start

# Terminal 3: Order Service
cd D:\cpp_system_design\Food_ordering\order-service
npm start

# Terminal 4: Payment Service
cd D:\cpp_system_design\Food_ordering\payment-service
npm start

# Terminal 5: Frontend
cd D:\cpp_system_design\Food_ordering\frontend
npm run dev
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (5173)           │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐    ┌───▼──┐    ┌───▼──┐
    │ 3001 │    │ 3002 │    │ 3003 │
    │User  │    │Rest. │    │Order │
    │Svc   │    │Svc   │    │Svc   │
    └───┬──┘    └──────┘    └──┬───┘
        │                      │
        └──────────┬───────────┘
                   │
              ┌────▼────┐
              │ 3004    │
              │Payment  │
              │Svc      │
              └────┬────┘
                   │
        ┌──────────▼──────────┐
        │  MongoDB Atlas      │
        │  user-db            │
        │  restaurant-db      │
        │  order-db           │
        │  payment-db         │
        └─────────────────────┘
```

---

## 📱 User Journey

1. **Signup** → User Service
2. **Browse Restaurants** → Restaurant Service
3. **View Menu** → Restaurant Service
4. **Add to Cart** → Order Service
5. **Place Order** → Order Service → Payment Service → Order Service
6. **Track Order** → Order Service
7. **Make Payment** → Payment Service

---

## 🔒 Security Reminders

⚠️ **Current Setup**: Development mode with hardcoded credentials

🔒 **For Production**:
- Use environment variables for secrets
- Enable HTTPS
- Use strong JWT secrets
- Enable MongoDB IP whitelist
- Implement rate limiting
- Add API authentication
- Enable database backups

---

## 🆘 Troubleshooting

### Installation Issues
1. Make sure Node.js 18+ is installed
2. Run `install.bat` as Administrator
3. If npm fails, use: `npm install --legacy-peer-deps`

### Service Won't Start
1. Check all ports (3001-3004, 5173) are available
2. Try in different terminal/PowerShell window
3. Check MongoDB connection: `MONGO_URI` in .env

### MongoDB Connection Error
1. Verify internet connection
2. Check MongoDB Atlas cluster is running
3. Verify credentials in .env file
4. Add your IP to MongoDB Atlas IP whitelist

### Frontend Can't Connect
1. Verify backend services are running
2. Check browser console for errors
3. Verify API URLs in `frontend/src/api/client.js`

---

## 📖 Documentation Files

| File | Description |
|------|-------------|
| `GETTING_STARTED.md` | Complete setup guide (read first!) |
| `MONGODB_SETUP.md` | MongoDB Atlas configuration details |
| `QUICK_REFERENCE.md` | API endpoints & commands reference |
| `API_DOCUMENTATION.md` | Detailed API documentation |
| `ARCHITECTURE.md` | System design & data flows |
| `README.md` | Project overview |

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas credentials in `.env`
- [ ] `install.bat` completed successfully
- [ ] All 5 services started via `start.bat`
- [ ] Health check endpoints return 200 status
- [ ] Frontend loads at http://localhost:5173
- [ ] Can sign up and create account
- [ ] Can browse restaurants
- [ ] Can add items to cart
- [ ] Can place orders

---

## 🎉 You're Ready!

Your FoodHub system is fully configured and ready to use!

### Next Steps:
1. **Run `install.bat`** to install dependencies
2. **Run `start.bat`** to start services
3. **Visit http://localhost:5173** to access the app
4. **Sign up** and start ordering food!

---

## 📞 Quick Help

**Can't install?** → Read `GETTING_STARTED.md`

**API questions?** → Check `API_DOCUMENTATION.md`

**MongoDB issues?** → See `MONGODB_SETUP.md`

**Architecture details?** → Read `ARCHITECTURE.md`

**Quick reference?** → Check `QUICK_REFERENCE.md`

---

**Happy ordering! 🍕🍔🍜**

For more details, open `GETTING_STARTED.md` in the same folder.
