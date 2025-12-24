# Food Ordering System - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│                  (React Frontend - Vite)                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              NGINX Load Balancer (Port 80)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Round-robin routing                                │   │
│  │ • Health check based failover                        │   │
│  │ • API path-based routing                            │   │
│  │ • Upstream servers with max_fails configuration     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        ▼            ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ User    │  │Restaurant│ │ Order   │  │Payment  │
   │Service  │  │Service   │ │Service  │  │Service  │
   │:3001    │  │:3002     │ │:3003    │  │:3004    │
   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │            │
        └────────────┼────────────┴────────────┘
                     │
            ┌────────▼────────┐
            │   MongoDB Atlas  │
            │   (Single Cluster)
            │  4 Separate DBs  │
            │                  │
            │ • user-db        │
            │ • restaurant-db  │
            │ • order-db       │
            │ • payment-db     │
            └──────────────────┘
```

---

## Detailed Service Architecture

### 1. User Service (Port 3001)
**Purpose**: Authentication, authorization, and user profile management

**Key Features**:
- JWT-based authentication
- User registration & login
- Profile management
- Address management
- Password hashing with bcryptjs

**Key Endpoints**:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/addresses` - Add address

**Database**:
- MongoDB Collection: `users`
- Indexes: `email` (unique), compound indexes for fast lookups

**Middleware**:
- `protect`: JWT verification middleware
- Express validation for input sanitization

---

### 2. Restaurant Service (Port 3002)
**Purpose**: Restaurant listing, menu management, search, filtering

**Key Features**:
- Full-text search on restaurant names & cuisines
- Filtering by cuisine, location, rating
- Menu item management
- Pagination for large datasets
- Category-based menu organization

**Key Endpoints**:
- `GET /api/restaurants` - List with filters & pagination
- `GET /api/restaurants/:id` - Get specific restaurant
- `POST /api/restaurants` - Create restaurant
- `GET /api/menus/restaurant/:restaurantId` - Get menu
- `GET /api/menus/:id` - Get menu item

**Database**:
- Collections: `restaurants`, `menuitems`
- Indexes: Text index on restaurant name/description, cuisine array, city, rating

**Performance**:
- Pagination prevents large result sets
- Indexed queries for fast filtering
- Separate collection for menu items to optimize queries

---

### 3. Order Service (Port 3003)
**Purpose**: Cart management and order lifecycle

**Key Features**:
- Shopping cart management
- Order creation with validation
- Order status tracking
- Order history with pagination
- Automatic cart clearing after order
- Real-time total calculation

**Key Endpoints**:
- `GET /api/carts/:userId` - Get cart
- `POST /api/carts/:userId/add` - Add to cart
- `PUT /api/carts/:userId/items/:menuItemId` - Update quantity
- `DELETE /api/carts/:userId` - Clear cart
- `POST /api/orders/create` - Place order
- `GET /api/orders/user/:userId` - Order history
- `GET /api/orders/:orderId` - Order details
- `PUT /api/orders/:orderId/status` - Update status

**Database**:
- Collections: `carts`, `orders`
- Indexes: userId, restaurantId, status, createdAt

**Status Flow**:
```
PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
          ↓
        (Can be CANCELLED at any stage)
```

**Cart Logic**:
- Subtotal = sum of (price × quantity)
- Delivery Fee = 0 if subtotal > 200, else 40
- Tax = 5% of subtotal
- Total = subtotal + delivery + tax

---

### 4. Payment Service (Port 3004)
**Purpose**: Payment processing and status tracking

**Key Features**:
- Payment initiation and processing
- Multiple payment method support
- Transaction ID generation
- Order service callback integration
- Refund capability

**Key Endpoints**:
- `POST /api/payments/initiate` - Start payment
- `GET /api/payments/:paymentId` - Get payment details
- `GET /api/payments/order/:orderId` - Get by order
- `POST /api/payments/process` - Process payment
- `POST /api/payments/:paymentId/refund` - Refund

**Database**:
- Collection: `payments`
- Indexes: orderId (unique), userId, status

**Payment Methods**:
- CREDIT_CARD
- DEBIT_CARD
- UPI
- NET_BANKING
- WALLET

**Integration Points**:
- Calls Order Service to update payment status
- Triggered after successful payment
- Supports webhook-based callbacks

---

## Data Flow Diagrams

### User Registration Flow
```
1. Client submits signup form
   ↓
2. POST /api/auth/signup (User Service)
   ↓
3. Validate input (email format, password length)
   ↓
4. Check if user exists
   ↓
5. Hash password with bcrypt
   ↓
6. Save to MongoDB Atlas user-db
   ↓
7. Generate JWT token
   ↓
8. Return token + user info
```

### Order Placement Flow
```
1. User adds items to cart (local Redux state)
   ↓
2. User proceeds to checkout
   ↓
3. POST /api/orders/create (Order Service)
   ↓
4. Save order to MongoDB
   ↓
5. POST /api/payments/initiate (Payment Service)
   ↓
6. Generate transaction ID & payment URL
   ↓
7. POST /api/payments/process (simulate gateway)
   ↓
8. PUT /api/orders/:orderId/payment (update order)
   ↓
9. DELETE /api/carts/:userId (clear cart)
   ↓
10. Redirect to order tracking page
```

### Order Tracking Flow
```
1. GET /api/orders/:orderId (Order Service)
   ↓
2. Return order with current status
   ↓
3. Frontend displays status timeline
   ↓
4. Auto-refresh every 5 seconds (REST polling)
   ↓
5. When status changes, UI updates
```

---

## API Communication Patterns

### Service-to-Service Communication
All services communicate via REST APIs:

**Example**: Order Service → Payment Service
```javascript
// order-service/routes/orders.js
const response = await axios.post(
  `${process.env.PAYMENT_SERVICE_URL}/api/payments/initiate`,
  paymentData
);
```

### Error Handling
Centralized error middleware in each service:
```javascript
// All services
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});
```

### Request Validation
Express-validator for input validation:
```javascript
[
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
]
```

---

## Load Balancing Strategy

### NGINX Configuration
```nginx
upstream user_service {
    least_conn;  # Use least connections algorithm
    server user-service:3001 max_fails=3 fail_timeout=30s;
    server user-service-backup:3001 backup;
}
```

**Load Balancing Features**:
- **least_conn**: Routes to server with fewest connections
- **max_fails=3**: Mark server down after 3 failures
- **fail_timeout=30s**: Try failed server again after 30s
- **backup**: Fallback server if primary fails
- **Health checks**: Implicit via TCP connection attempts

### Failover Mechanism
```
1. Client request arrives at NGINX
   ↓
2. NGINX picks upstream server (least_conn)
   ↓
3. If connection fails, increment fail_count
   ↓
4. If fail_count >= max_fails, mark server "down"
   ↓
5. Route to backup or next healthy server
   ↓
6. After fail_timeout (30s), retry failed server
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Routing**: React Router v6

### Redux Store Structure
```
{
  auth: {
    user: { id, name, email },
    token: JWT_TOKEN,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: null
  },
  cart: {
    items: [{ menuItemId, name, price, quantity, image }],
    restaurantId: String,
    restaurantName: String,
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    total: Number
  }
}
```

### Key Components
- **Header**: Navigation, cart badge, auth links
- **RestaurantCard**: Restaurant display with rating
- **MenuItem**: Item with add-to-cart functionality
- **CartDrawer**: Order summary with totals
- **Pages**: Home, Login, Signup, RestaurantDetails, Checkout, OrderTracking

---

## Database Optimization

### Indexing Strategy

**User-db Indexes**:
```javascript
userSchema.index({ email: 1 });  // For login queries
```

**Restaurant-db Indexes**:
```javascript
restaurantSchema.index({ name: 'text', description: 'text', cuisines: 1 });
restaurantSchema.index({ city: 1 });
restaurantSchema.index({ rating: -1 });

menuItemSchema.index({ restaurantId: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ name: 'text' });
```

**Order-db Indexes**:
```javascript
orderSchema.index({ userId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
```

**Payment-db Indexes**:
```javascript
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
```

### Query Optimization
- Pagination limits result sets (default: 10-20 items)
- Sorted by relevant fields (rating, createdAt)
- Full-text search on restaurant names
- Compound queries use indexed fields

---

## Security Architecture

### Authentication
- **JWT Tokens** for stateless authentication
- **Bearer Token** in Authorization header
- **Token Expiration** (7 days)
- **bcryptjs** for password hashing

### Authorization
- Middleware verifies JWT on protected routes
- User context extracted from token
- Service-level permission checks

### Input Validation
- Express-validator on all endpoints
- Sanitization to prevent XSS
- Email format validation
- Password strength requirements

### CORS Configuration
```javascript
app.use(cors());  // Allow all origins (configure for production)
```

### HTTPS (Production)
- Configure SSL certificates in NGINX
- Redirect HTTP to HTTPS
- Set secure cookies

---

## Scalability Considerations

### Horizontal Scaling
```
Multiple instances of each service:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│User Service 1│  │User Service 2│  │User Service 3│
└─────────────┘  └─────────────┘  └─────────────┘
        ↓              ↓                ↓
      NGINX (round-robin/least_conn)
```

### Vertical Scaling
- Increase container resources (CPU, memory)
- MongoDB Atlas cluster upgrades
- Connection pool size configuration

### Caching Strategy (Future)
- Redis for session storage
- API response caching for restaurant data
- Database query result caching

### Database Scaling
- MongoDB Atlas auto-sharding for large datasets
- Read replicas for reporting queries
- Connection pooling configuration
- Query optimization with proper indexes

---

## Deployment Architecture

### Docker Compose (Local/Dev)
All services run in containers with shared network

### Docker Swarm / Kubernetes (Production)
- Service replicas across multiple nodes
- Service discovery
- Automatic failover
- Rolling updates

### Environment Variables
Each service reads from `.env`:
```
PORT=XXXX
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
SERVICE_URLS=...
NODE_ENV=production
```

---

## Monitoring & Logging

### Health Checks
```
/health endpoints expose:
- Service status (UP/DOWN)
- Service name
- Timestamp
```

### Logging
- Winston/Morgan in production
- Structured logs with timestamps
- Error tracking and alerting
- Performance metrics

### Metrics Collection (Optional)
- Prometheus for metrics
- Grafana for dashboards
- CPU, Memory, Network metrics
- Request latency tracking

