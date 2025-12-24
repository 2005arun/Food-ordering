# FoodHub - Quick Reference Guide

## 🚀 Getting Started in 60 Seconds

### Step 1: Setup Environment (2 min)
```bash
cd d:\cpp_system_design\Food_ordering
copy .env.example .env
# Edit .env with your MongoDB password
```

### Step 2: Start Services (2 min)
```bash
docker-compose build
docker-compose up -d
```

### Step 3: Access Application (1 min)
- Open browser: `http://localhost`
- Sign up or test with test account
- Browse restaurants, add items, checkout

---

## 📱 User Interface Flow

```
┌─────────────────────────────────┐
│   Landing Page / Home           │
│  ┌─────────────────────────────┐│
│  │ Login    Sign Up    Search  ││
│  │ Restaurants Grid            ││
│  │ • Filter by cuisine         ││
│  │ • Sort by rating            ││
│  │ • Search by name            ││
│  └─────────────────────────────┘│
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Restaurant Details            │
│  ┌─────────────────────────────┐│
│  │ Restaurant Image & Info     ││
│  │ Menu Items Grid             ││
│  │ ┌─────────┬─────────┐       ││
│  │ │Item 1   │Item 2   │       ││
│  │ │Add Cart │Add Cart │       ││
│  │ └─────────┴─────────┘       ││
│  │         Cart Summary         ││
│  │  Subtotal: ₹XXX             ││
│  │  Delivery: ₹XXX             ││
│  │  Tax:      ₹XXX             ││
│  │  Total:    ₹XXX             ││
│  └─────────────────────────────┘│
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Checkout Page                 │
│  ┌─────────────────────────────┐│
│  │ Delivery Address            ││
│  │ [Text Area for address]     ││
│  │                             ││
│  │ Payment Method              ││
│  │ ○ Credit Card               ││
│  │ ○ UPI                       ││
│  │ ○ Net Banking               ││
│  │                             ││
│  │ [Place Order Button]        ││
│  └─────────────────────────────┘│
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Order Tracking                │
│  ┌─────────────────────────────┐│
│  │ ① ── ② ── ③ ── ④ ── ⑤      ││
│  │ Pending Confirmed Preparing ││
│  │         Ready  Delivery      ││
│  │                             ││
│  │ Order Items & Details       ││
│  │ Estimated Delivery: 35 min  ││
│  │ Delivery Address            ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

## 🔧 API Quick Reference

### Authentication
```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

### Restaurants
```bash
# List restaurants
curl http://localhost:3002/api/restaurants?cuisine=Indian&minRating=4

# Get restaurant details
curl http://localhost:3002/api/restaurants/{restaurantId}

# Get menu items
curl http://localhost:3002/api/menus/restaurant/{restaurantId}
```

### Orders
```bash
# Create order
curl -X POST http://localhost:3003/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{...order data...}'

# Get order details
curl http://localhost:3003/api/orders/{orderId}

# Update order status
curl -X PUT http://localhost:3003/api/orders/{orderId}/status \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED"}'
```

### Payments
```bash
# Initiate payment
curl -X POST http://localhost:3004/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{"orderId":"...","amount":500}'

# Process payment
curl -X POST http://localhost:3004/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{"paymentId":"...","status":"COMPLETED"}'
```

---

## 📊 Service Ports & URLs

| Service | Port | Health Check |
|---------|------|--------------|
| Frontend | 5173 | - |
| User Service | 3001 | http://localhost:3001/health |
| Restaurant Service | 3002 | http://localhost:3002/health |
| Order Service | 3003 | http://localhost:3003/health |
| Payment Service | 3004 | http://localhost:3004/health |
| NGINX Load Balancer | 80 | http://localhost |

---

## 🗂️ Project Structure Quick Guide

```
Service → Models → Routes → Server
  ↓         ↓         ↓        ↓
 
User    → User.js → auth.js → server.js
Service   (Schema)  users.js   (Express app)
  ↓
.env    → MongoDB Atlas user-db
(Config)

Restaurant → Restaurant.js → restaurants.js → server.js
Service      MenuItem.js      menus.js
  ↓
.env → MongoDB Atlas restaurant-db

Order    → Cart.js → carts.js → server.js
Service    Order.js  orders.js
  ↓
.env → MongoDB Atlas order-db

Payment  → Payment.js → payments.js → server.js
Service
  ↓
.env → MongoDB Atlas payment-db

Frontend → Redux → Components → Pages → App.jsx → index.html
  ↓         ↓        ↓          ↓
Auth     Store   Header     Home
Cart     Slices  MenuItem   Checkout
         authSlice CartCard  OrderTracking
         cartSlice
```

---

## 🔑 Key Files Cheat Sheet

### Must Edit Files
- `.env` - Add MongoDB password

### Important Config Files
- `docker-compose.yml` - Service orchestration
- `nginx/nginx.conf` - Load balancer config
- `vite.config.js` - Frontend build config

### Important API Files
- `user-service/src/routes/auth.js` - Authentication
- `restaurant-service/src/routes/restaurants.js` - Restaurant listing
- `order-service/src/routes/orders.js` - Order management
- `payment-service/src/routes/payments.js` - Payment processing

### Important Frontend Files
- `frontend/src/App.jsx` - Main app routing
- `frontend/src/store/store.js` - Redux configuration
- `frontend/src/api/client.js` - API integration

---

## 💡 Common Tasks

### Create Sample Data

#### Create Restaurant
```bash
curl -X POST http://localhost:3002/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "cuisines": ["Italian"],
    "phone": "555-1234",
    "email": "pizza@test.com",
    "address": {
      "street": "123 Main St",
      "city": "NYC",
      "state": "NY",
      "zipCode": "10001"
    },
    "deliveryTime": 30,
    "minOrder": 200
  }'
```

#### Create Menu Item
```bash
curl -X POST http://localhost:3002/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "<restaurant_id>",
    "name": "Margherita Pizza",
    "price": 350,
    "category": "Main Course"
  }'
```

---

## 🐛 Debugging Tips

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service

# Filter by keyword
docker-compose logs -f user-service | grep "error"
```

### Check Service Health
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

### Test NGINX Routing
```bash
curl http://localhost/api/restaurants
curl -i http://localhost/health/user
```

### Database Connection
```bash
# Connection string format
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name
```

---

## 🆘 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Port 80 already in use" | Stop other services, or change port in docker-compose |
| "MongoDB connection failed" | Check .env password, verify IP whitelist in Atlas |
| "Frontend can't reach API" | Verify all services are running: `docker-compose ps` |
| "NGINX 502 error" | Check service health: `curl localhost:3001/health` |
| "Build fails" | Clear cache: `docker-compose build --no-cache` |

---

## 📈 Scaling Checklist

To scale for production:

- [ ] Update MongoDB Atlas tier from free to paid
- [ ] Enable MongoDB backups
- [ ] Set up HTTPS in NGINX
- [ ] Configure MongoDB IP whitelist properly
- [ ] Set strong JWT_SECRET (32+ chars)
- [ ] Enable auto-scaling for service replicas
- [ ] Set up monitoring & alerting
- [ ] Configure CDN for static assets
- [ ] Enable database read replicas
- [ ] Set up automated backups

---

## 📖 Documentation Map

```
IMPLEMENTATION_SUMMARY.md
    ├─ Overview & Features
    ├─ What Was Built
    └─ How to Run

README.md
    ├─ Quick Start
    ├─ Tech Stack
    ├─ Features List
    └─ User Journey

docs/API_DOCUMENTATION.md
    ├─ All 47 Endpoints
    ├─ Request/Response Examples
    ├─ Error Codes
    └─ Database Schemas

docs/SETUP_GUIDE.md
    ├─ Installation
    ├─ Local Development
    ├─ Production Deployment
    ├─ Troubleshooting
    └─ Monitoring

docs/ARCHITECTURE.md
    ├─ System Design
    ├─ Data Flows
    ├─ Service Details
    ├─ Load Balancing
    └─ Security
```

---

## ⏱️ Timeline

- **Setup**: 5 minutes (docker-compose up)
- **First Test**: 30 seconds (open http://localhost)
- **Full Learning**: 2-3 hours
- **Customization**: Depends on features

---

## 💰 Costs

**Free Resources**:
- ✅ Docker Desktop (free)
- ✅ Node.js (free)
- ✅ Visual Studio Code (free)
- ✅ MongoDB Atlas free tier (500MB storage)

**Paid When Ready**:
- MongoDB Atlas paid tier (when storage exceeds 500MB)
- Cloud hosting (AWS, GCP, Azure) - optional

---

## 🎯 What To Do Next

1. **Understand the Architecture**
   - Read IMPLEMENTATION_SUMMARY.md
   - Review ARCHITECTURE.md

2. **Get It Running**
   - Edit .env with MongoDB password
   - Run `docker-compose up -d`
   - Open http://localhost

3. **Test the APIs**
   - Use API_DOCUMENTATION.md
   - Test with Postman or cURL

4. **Explore the Code**
   - Start with frontend/src/App.jsx
   - Review service routes
   - Check database schemas

5. **Customize**
   - Add features
   - Change styling
   - Extend functionality

---

## 🎓 Learning Path

```
1. Frontend → 2. API Integration → 3. Microservices → 4. Database → 5. DevOps
React        Axios              Architecture     MongoDB     Docker
Redux        Error Handling     Services         Indexing    Compose
Routing      State Mgmt         Communication    Schemas     NGINX
```

---

**You're all set! Start with `docker-compose up -d` and open http://localhost 🚀**
