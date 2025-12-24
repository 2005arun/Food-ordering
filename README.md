# FoodHub - Production-Ready Food Ordering System

A scalable, Zomato-like food ordering application built with microservices architecture, React frontend, MongoDB Atlas, and NGINX load balancing with auto-failover.

## 🎯 Features

### Frontend
- ✅ Modern React UI with Vite
- ✅ Responsive design with Tailwind CSS
- ✅ Redux Toolkit for state management
- ✅ Real-time cart updates
- ✅ Order tracking with live updates
- ✅ User authentication & profile management
- ✅ Advanced search & filtering
- ✅ Smooth animations & transitions

### Backend Microservices
- ✅ **User Service** (Port 3001): Auth, profiles, addresses
- ✅ **Restaurant Service** (Port 3002): Listings, menus, search
- ✅ **Order Service** (Port 3003): Cart, orders, tracking
- ✅ **Payment Service** (Port 3004): Payment processing, refunds

### Infrastructure
- ✅ NGINX Load Balancer with health checks
- ✅ Round-robin load balancing with failover
- ✅ Docker & Docker Compose for easy deployment
- ✅ MongoDB Atlas for cloud database
- ✅ JWT-based authentication
- ✅ Centralized error handling
- ✅ Health check endpoints on all services

---

## 📁 Project Structure

```
Food_ordering/
├── user-service/              # User auth & profile service
│   ├── src/
│   │   ├── models/User.js
│   │   ├── routes/auth.js
│   │   ├── routes/users.js
│   │   ├── middleware/auth.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── restaurant-service/        # Restaurant & menu service
│   ├── src/
│   │   ├── models/Restaurant.js
│   │   ├── models/MenuItem.js
│   │   ├── routes/restaurants.js
│   │   ├── routes/menus.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── order-service/             # Order & cart service
│   ├── src/
│   │   ├── models/Cart.js
│   │   ├── models/Order.js
│   │   ├── routes/carts.js
│   │   ├── routes/orders.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── payment-service/           # Payment service
│   ├── src/
│   │   ├── models/Payment.js
│   │   ├── routes/payments.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/                  # React Vite application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store
│   │   ├── api/              # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                     # NGINX configuration
│   ├── nginx.conf
│   └── Dockerfile
│
├── docs/                      # Documentation
│   ├── API_DOCUMENTATION.md   # Complete API reference
│   ├── SETUP_GUIDE.md         # Deployment & setup
│   └── ARCHITECTURE.md        # System architecture
│
├── docker-compose.yml         # Docker compose configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- MongoDB Atlas account & connection string
- Git

### 1. Clone Repository
```bash
cd d:\cpp_system_design\Food_ordering
```

### 2. Setup Environment
```bash
# Copy environment template
copy .env.example .env

# Edit .env with your MongoDB Atlas password
# Example:
# DB_PASSWORD=YourActualPassword123
# JWT_SECRET=your_secure_jwt_secret_key_min_32_chars
```

### 3. Start All Services with Docker Compose
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check service logs
docker-compose logs -f
```

### 4. Access Application
- **Frontend**: http://localhost (main entry point)
- **API Gateway**: http://localhost/api/*
- **API Direct**:
  - User Service: http://localhost:3001
  - Restaurant Service: http://localhost:3002
  - Order Service: http://localhost:3003
  - Payment Service: http://localhost:3004

### 5. Create Test Account
```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Get token from response, use in other requests
```

---

## 📚 Documentation

### API Documentation
Complete API reference with examples:
- [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
  - All 4 microservices endpoints
  - Request/response examples
  - Error codes & status
  - Database schemas

### Setup & Deployment
Detailed setup instructions:
- [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
  - Local development setup
  - Docker deployment
  - MongoDB Atlas configuration
  - Production checklist
  - Troubleshooting

### Architecture
System design & technical details:
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
  - Service architecture
  - Data flow diagrams
  - Load balancing strategy
  - Database optimization
  - Security architecture

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│     React Frontend (Vite + Redux)        │
│         http://localhost:5173            │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    NGINX Load Balancer (Port 80)         │
│  • Round-robin routing                  │
│  • Health check based failover          │
│  • API path-based routing               │
└────┬──────┬──────┬──────┬───────────────┘
     │      │      │      │
     ▼      ▼      ▼      ▼
  ┌──────────────────────────────────┐
  │     4 Microservices              │
  │ ┌─────────────────────────────┐ │
  │ │ User Service (3001)         │ │
  │ │ Restaurant Service (3002)   │ │
  │ │ Order Service (3003)        │ │
  │ │ Payment Service (3004)      │ │
  │ └─────────────────────────────┘ │
  └────┬────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│    MongoDB Atlas Cloud DB        │
│ (4 Separate Databases)          │
│ • user-db                       │
│ • restaurant-db                 │
│ • order-db                      │
│ • payment-db                    │
└──────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Backend
- **Node.js 18** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **NGINX** - Load balancer & reverse proxy
- **MongoDB Atlas** - Cloud database

---

## 📖 Microservices Details

### 1. User Service (Port 3001)
**Handles**: Authentication, user profiles, addresses

**Key APIs**:
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/addresses` - Add address

**Database**: `user-db`

### 2. Restaurant Service (Port 3002)
**Handles**: Restaurant listings, menus, search, filtering

**Key APIs**:
- `GET /api/restaurants` - List restaurants (searchable, filterable, paginated)
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/menus/restaurant/:restaurantId` - Get menu items
- `POST /api/menus` - Create menu item

**Database**: `restaurant-db`

### 3. Order Service (Port 3003)
**Handles**: Shopping cart, order management, tracking

**Key APIs**:
- `GET /api/carts/:userId` - Get cart
- `POST /api/carts/:userId/add` - Add item to cart
- `PUT /api/carts/:userId/items/:menuItemId` - Update quantity
- `POST /api/orders/create` - Place order
- `GET /api/orders/user/:userId` - Get orders
- `PUT /api/orders/:orderId/status` - Update status

**Database**: `order-db`

### 4. Payment Service (Port 3004)
**Handles**: Payment processing, status tracking, refunds

**Key APIs**:
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:paymentId` - Get payment status
- `POST /api/payments/:paymentId/refund` - Refund

**Database**: `payment-db`

---

## 💻 Local Development

### Option 1: With Docker Compose (Recommended)
```bash
docker-compose build
docker-compose up -d
```

### Option 2: Manual Setup

#### Start User Service
```bash
cd user-service
npm install
# Create .env with MongoDB connection string
npm run dev
```

#### Start Restaurant Service
```bash
cd restaurant-service
npm install
npm run dev
```

#### Start Order Service
```bash
cd order-service
npm install
npm run dev
```

#### Start Payment Service
```bash
cd payment-service
npm install
npm run dev
```

#### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Start NGINX (Windows)
Install NGINX and point to config file: `nginx/nginx.conf`

---

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  addresses: [{
    type: 'home' | 'work' | 'other',
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }]
}
```

### Restaurant
```javascript
{
  name: String,
  description: String,
  image: String,
  cuisines: [String],
  address: { street, city, state, zipCode, latitude, longitude },
  rating: Number (0-5),
  totalReviews: Number,
  deliveryTime: Number (minutes),
  minOrder: Number,
  priceRange: 'Low' | 'Medium' | 'High',
  isOpen: Boolean
}
```

### MenuItem
```javascript
{
  restaurantId: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  isVeg: Boolean,
  spiceLevel: 'Mild' | 'Medium' | 'Spicy',
  rating: Number (0-5),
  isAvailable: Boolean
}
```

### Order
```javascript
{
  userId: String,
  restaurantId: ObjectId,
  items: [{ menuItemId, name, price, quantity }],
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED',
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED',
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  deliveryAddress: { street, city, state, zipCode },
  estimatedDelivery: Date
}
```

### Payment
```javascript
{
  orderId: String (unique),
  userId: String,
  amount: Number,
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET',
  status: 'PENDING' | 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED',
  transactionId: String,
  transactionDate: Date
}
```

---

## 🔐 Security Features

- ✅ JWT-based authentication (7-day expiration)
- ✅ Password hashing with bcryptjs
- ✅ Input validation & sanitization
- ✅ CORS enabled for cross-origin requests
- ✅ Protected routes with middleware
- ✅ MongoDB Atlas IP whitelisting
- ✅ Error messages without sensitive data

---

## 📈 Performance Optimizations

- ✅ Database indexes on frequently queried fields
- ✅ Pagination for large datasets
- ✅ Connection pooling to MongoDB
- ✅ NGINX reverse proxy caching
- ✅ Health checks for automatic failover
- ✅ Least-conn load balancing algorithm
- ✅ Stateless services for horizontal scaling

---

## 🚀 Deployment

### Docker Compose (Local/Dev)
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Update environment variables securely
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS in NGINX
- [ ] Configure MongoDB Atlas for production
- [ ] Set up monitoring & logging
- [ ] Configure auto-scaling
- [ ] Enable backup strategies

---

## 🐛 Troubleshooting

### Services can't connect to MongoDB
1. Check MongoDB Atlas IP whitelist
2. Verify password in .env file
3. Ensure network connectivity

### Frontend can't reach APIs
1. Verify all services are running: `docker-compose ps`
2. Check NGINX logs: `docker-compose logs nginx`
3. Verify CORS settings

### NGINX returns 502 Bad Gateway
1. Check upstream services are healthy
2. Review NGINX config syntax
3. Check service health endpoints

---

## 📞 Support

### Documentation
- Full API docs: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- Setup guide: [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- Architecture: [ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Testing
Use these tools to test APIs:
- **Postman**: Import API collection
- **cURL**: Command line requests
- **Thunder Client**: VS Code extension
- **REST Client**: VS Code extension

---

## 📝 License

This project is part of a system design exercise.

---

## 🎓 Learning Resources

This system demonstrates:
- ✅ Microservices architecture
- ✅ API design & RESTful principles
- ✅ Database design & optimization
- ✅ Authentication & authorization
- ✅ Load balancing & failover
- ✅ Docker containerization
- ✅ React frontend development
- ✅ Full-stack development workflow

---

## 🔄 User Journey

1. **Sign Up / Login** → User Service (JWT token)
2. **Browse Restaurants** → Restaurant Service (search, filter)
3. **View Menu** → Restaurant Service (menu items by category)
4. **Add to Cart** → Order Service (local Redux state + API)
5. **Checkout** → Order Service (create order)
6. **Payment** → Payment Service (process payment)
7. **Order Tracking** → Order Service (status updates)

---

**Happy coding! 🚀**
#   F o o d - o r d e r i n g  
 