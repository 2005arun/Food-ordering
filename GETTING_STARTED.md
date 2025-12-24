# FoodHub - Complete Setup Instructions

## ✅ System Status

Your FoodHub food ordering system has been **fully configured** with MongoDB Atlas connection!

### MongoDB Atlas Configuration
- **Cluster**: cluster0.t8x2gng.mongodb.net
- **Username**: arunramamoorthi05_db_user  
- **Password**: Wbi9cx8mQtaTdWse
- **4 Databases**: user-db, restaurant-db, order-db, payment-db

---

## 🚀 Quick Start (Recommended)

### Step 1: Install Dependencies (One-time)

Double-click `install.bat` in the `Food_ordering` folder.

This will install npm packages for all services:
```
✓ User Service (3001)
✓ Restaurant Service (3002)
✓ Order Service (3003)
✓ Payment Service (3004)
✓ Frontend (5173)
```

**Wait time**: 5-10 minutes on first install

### Step 2: Start All Services

Double-click `start.bat` in the `Food_ordering` folder.

This will open **5 new terminal windows** with all services running:
```
Terminal 1: User Service        - localhost:3001
Terminal 2: Restaurant Service  - localhost:3002
Terminal 3: Order Service       - localhost:3003
Terminal 4: Payment Service     - localhost:3004
Terminal 5: Frontend            - localhost:5173
```

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You'll see the FoodHub home page with restaurants!

---

## 📋 Full Manual Setup (If Batch Scripts Don't Work)

### Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- npm or yarn package manager
- MongoDB Atlas account (already set up for you!)

### Install All Services

Open **PowerShell** or **Command Prompt** as Administrator:

```bash
cd D:\cpp_system_design\Food_ordering

# User Service
cd user-service
npm install --legacy-peer-deps
cd ..

# Restaurant Service
cd restaurant-service
npm install --legacy-peer-deps
cd ..

# Order Service
cd order-service
npm install --legacy-peer-deps
cd ..

# Payment Service
cd payment-service
npm install --legacy-peer-deps
cd ..

# Frontend
cd frontend
npm install --legacy-peer-deps
cd ..
```

### Start Services (Open 5 separate terminals)

**Terminal 1 - User Service**:
```bash
cd D:\cpp_system_design\Food_ordering\user-service
npm start
```

**Terminal 2 - Restaurant Service**:
```bash
cd D:\cpp_system_design\Food_ordering\restaurant-service
npm start
```

**Terminal 3 - Order Service**:
```bash
cd D:\cpp_system_design\Food_ordering\order-service
npm start
```

**Terminal 4 - Payment Service**:
```bash
cd D:\cpp_system_design\Food_ordering\payment-service
npm start
```

**Terminal 5 - Frontend**:
```bash
cd D:\cpp_system_design\Food_ordering\frontend
npm run dev
```

---

## ✅ Verify Installation

Check if all services are running by opening these URLs:

```
http://localhost:3001/health    → User Service
http://localhost:3002/health    → Restaurant Service
http://localhost:3003/health    → Order Service
http://localhost:3004/health    → Payment Service
http://localhost:5173           → Frontend
```

Expected response for health endpoints:
```json
{
  "status": "UP",
  "service": "user-service",
  "timestamp": "2025-12-23T..."
}
```

---

## 🧪 First Time Usage

### 1. Sign Up
- Click "Sign Up" on the home page
- Enter name, email, password
- Create your account

### 2. Add Delivery Address
- Go to Profile → Addresses
- Add your delivery address

### 3. Browse Restaurants
- Home page shows all restaurants
- Filter by cuisine or rating
- Click restaurant card to view menu

### 4. Order Food
- Select items and quantities
- Click "Add to Cart"
- Go to checkout
- Confirm delivery address
- Select payment method
- Place order

### 5. Track Order
- Click "My Orders"
- See real-time order status
- Estimated delivery time

---

## 📊 API Endpoints Reference

### User Service (3001)
```
POST   /api/auth/signup           - Create account
POST   /api/auth/login            - Login
GET    /api/users/profile         - Get user profile
PUT    /api/users/profile         - Update profile
POST   /api/users/addresses       - Add address
GET    /api/users/addresses       - List addresses
```

### Restaurant Service (3002)
```
GET    /api/restaurants           - List restaurants
GET    /api/restaurants/:id       - Get restaurant details
GET    /api/restaurants/search    - Search restaurants
GET    /api/menus/:restaurantId   - Get menu items
```

### Order Service (3003)
```
POST   /api/carts/add             - Add item to cart
GET    /api/carts                 - Get cart contents
DELETE /api/carts/items/:itemId   - Remove from cart
POST   /api/orders/create         - Place order
GET    /api/orders                - Get user orders
GET    /api/orders/:id            - Get order details
```

### Payment Service (3004)
```
POST   /api/payments/initiate     - Start payment
POST   /api/payments/process      - Process payment
GET    /api/payments/:id          - Get payment details
```

---

## 🔧 Troubleshooting

### npm install fails
**Solution**: Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### Port already in use
**Solution**: Change port in .env file:
```env
PORT=3005  # Change 3001 to 3005, etc.
```

### MongoDB connection fails
**Solution**: Check:
1. Internet connection is working
2. MongoDB Atlas IP whitelist (add your IP)
3. Credentials are correct in .env
4. Cluster is running in MongoDB Atlas console

### Services won't start
**Solution**: 
1. Check Node.js is installed: `node --version`
2. Delete `node_modules` folder
3. Run `npm install --legacy-peer-deps` again
4. Check error messages in terminal

### Frontend shows "Cannot connect to API"
**Solution**:
1. Verify all backend services are running (check health endpoints)
2. Check `frontend/src/api/client.js` has correct URLs
3. Check CORS is enabled in backend services

---

## 📦 Directory Structure

```
Food_ordering/
├── user-service/              - Auth & profiles (Port 3001)
│   ├── src/
│   │   ├── server.js          - Express app entry
│   │   ├── routes/
│   │   │   ├── auth.js        - Authentication endpoints
│   │   │   └── users.js       - User profile endpoints
│   │   └── models/
│   │       └── User.js        - MongoDB schema
│   └── package.json
│
├── restaurant-service/        - Restaurants & menus (Port 3002)
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── restaurants.js
│   │   │   └── menus.js
│   │   └── models/
│   │       ├── Restaurant.js
│   │       └── MenuItem.js
│   └── package.json
│
├── order-service/             - Carts & orders (Port 3003)
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── carts.js
│   │   │   └── orders.js
│   │   └── models/
│   │       ├── Cart.js
│   │       └── Order.js
│   └── package.json
│
├── payment-service/           - Payments (Port 3004)
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   └── payments.js
│   │   └── models/
│   │       └── Payment.js
│   └── package.json
│
├── frontend/                  - React Vite (Port 5173)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/             - Redux state
│   │   └── api/
│   │       └── client.js      - API configuration
│   ├── package.json
│   └── vite.config.js
│
├── .env                       - Environment variables
├── .env.example               - Template
├── install.bat                - Install dependencies script
├── start.bat                  - Start all services script
├── docker-compose.yml         - Docker orchestration (alternative)
└── README.md                  - Project documentation
```

---

## 🌐 Service Communication

```
Frontend (React) at localhost:5173
    ↓
Calls API at localhost:3001-3004

├── User Service (3001)
│   └─→ MongoDB: user-db
│
├── Restaurant Service (3002)
│   └─→ MongoDB: restaurant-db
│
├── Order Service (3003)
│   ├─→ MongoDB: order-db
│   └─→ Calls User Service & Payment Service
│
└── Payment Service (3004)
    ├─→ MongoDB: payment-db
    └─→ Calls Order Service
```

---

## 🔐 Security Notes

**Current Setup** (Development):
- Credentials hardcoded in .env
- JWT secret is plain text
- No HTTPS

**For Production**:
```
✓ Use environment variables
✓ Use strong JWT secret (32+ characters)
✓ Enable HTTPS
✓ Use MongoDB Atlas IP whitelist
✓ Implement rate limiting
✓ Add API authentication keys
✓ Enable database backups
✓ Use secrets management system
```

---

## 📞 Support

### If something doesn't work:

1. **Check logs**: Look at terminal output for error messages
2. **Verify ports**: Make sure ports 3001-3004, 5173 are available
3. **Restart services**: Stop (Ctrl+C) and start again
4. **Clear cache**: Delete node_modules and package-lock.json, reinstall
5. **Check network**: Ensure internet connection for MongoDB Atlas

### Common Issues:

| Issue | Solution |
|-------|----------|
| `EADDRINUSE: Port already in use` | Change PORT in .env or kill process using port |
| `MongoDB connection timeout` | Check internet, verify credentials in .env |
| `Module not found` | Run `npm install --legacy-peer-deps` |
| `CORS error` | Check backend service health endpoints |
| `npm ERR! peer` | Use `npm install --legacy-peer-deps` |

---

## 🎉 You're All Set!

Your FoodHub system is ready to use!

**Next steps**:
1. Run `install.bat` to install dependencies
2. Run `start.bat` to start all services
3. Open http://localhost:5173 in your browser
4. Sign up and start ordering!

---

**Questions?** Check the other documentation files:
- `MONGODB_SETUP.md` - MongoDB Atlas configuration details
- `QUICK_REFERENCE.md` - API reference and quick commands
- `API_DOCUMENTATION.md` - Complete API documentation
- `ARCHITECTURE.md` - System architecture details

Enjoy using FoodHub! 🍕🍔🍜
