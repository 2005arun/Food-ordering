# Food Ordering System (Zomato-like) - API Documentation

## Overview
Production-ready microservices-based food ordering platform with 4 independent services, React frontend, and NGINX load balancing.

---

## BASE URLS
- **Local Development**: `http://localhost` (via NGINX)
- **User Service**: `http://localhost:3001`
- **Restaurant Service**: `http://localhost:3002`
- **Order Service**: `http://localhost:3003`
- **Payment Service**: `http://localhost:3004`
- **Frontend**: `http://localhost:5173`

---

## 1. USER SERVICE APIs

### Auth Endpoints

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "64f5...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "64f5...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "userId": "64f5...",
    "email": "john@example.com"
  }
}
```

### Profile Endpoints

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "_id": "64f5...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "avatar": "https://...",
    "addresses": [...]
  }
}
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "avatar": "https://..."
}

Response (200): Updated user object
```

### Address Endpoints

#### Add Address
```
POST /api/users/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "isDefault": true
}

Response (201):
{
  "success": true,
  "message": "Address added successfully",
  "addresses": [...]
}
```

#### Get All Addresses
```
GET /api/users/addresses
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "addresses": [
    {
      "_id": "...",
      "type": "home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "isDefault": true
    }
  ]
}
```

#### Update Address
```
PUT /api/users/addresses/:addressId
Authorization: Bearer <token>
```

#### Delete Address
```
DELETE /api/users/addresses/:addressId
Authorization: Bearer <token>
```

---

## 2. RESTAURANT SERVICE APIs

### Restaurant Endpoints

#### Get All Restaurants
```
GET /api/restaurants?page=1&limit=10&cuisine=Indian&city=NYC&minRating=4&search=pizza

Query Parameters:
- page: int (default: 1)
- limit: int (default: 10, max: 100)
- cuisine: string (optional)
- city: string (optional)
- minRating: float (optional, 0-5)
- search: string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f5...",
      "name": "Pizza Palace",
      "description": "Best pizza in town",
      "image": "https://...",
      "cuisines": ["Italian", "Continental"],
      "address": {...},
      "rating": 4.5,
      "totalReviews": 245,
      "deliveryTime": 30,
      "minOrder": 200,
      "priceRange": "Medium",
      "isOpen": true
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Get Restaurant by ID
```
GET /api/restaurants/:id

Response (200):
{
  "success": true,
  "data": { ...restaurant object... }
}
```

### Menu Endpoints

#### Get Menu Items
```
GET /api/menus/restaurant/:restaurantId?category=Main%20Course&page=1&limit=20

Query Parameters:
- category: string (optional)
- page: int (default: 1)
- limit: int (default: 20, max: 100)

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f5...",
      "restaurantId": "64f5...",
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 350,
      "image": "https://...",
      "category": "Main Course",
      "isVeg": true,
      "spiceLevel": "Mild",
      "preparationTime": 15,
      "isAvailable": true,
      "rating": 4.6,
      "reviews": 128
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### Get Menu Item by ID
```
GET /api/menus/:id

Response (200):
{
  "success": true,
  "data": { ...menu item... }
}
```

---

## 3. ORDER SERVICE APIs

### Cart Endpoints

#### Get Cart
```
GET /api/carts/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "64f5...",
    "userId": "64f5...",
    "restaurantId": "64f5...",
    "restaurantName": "Pizza Palace",
    "items": [
      {
        "menuItemId": "64f5...",
        "name": "Margherita Pizza",
        "price": 350,
        "quantity": 2,
        "image": "https://..."
      }
    ],
    "subtotal": 700,
    "deliveryFee": 0,
    "tax": 35,
    "total": 735
  }
}
```

#### Add to Cart
```
POST /api/carts/:userId/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "64f5...",
  "restaurantName": "Pizza Palace",
  "menuItemId": "64f5...",
  "name": "Margherita Pizza",
  "price": 350,
  "quantity": 2,
  "image": "https://..."
}

Response (201): Updated cart object
```

#### Update Cart Item
```
PUT /api/carts/:userId/items/:menuItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}

Response (200): Updated cart object
```

#### Clear Cart
```
DELETE /api/carts/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Cart cleared"
}
```

### Order Endpoints

#### Get User Orders
```
GET /api/orders/user/:userId?page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f5...",
      "userId": "64f5...",
      "restaurantId": "64f5...",
      "restaurantName": "Pizza Palace",
      "status": "DELIVERED",
      "paymentStatus": "COMPLETED",
      "total": 735,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### Get Order by ID
```
GET /api/orders/:orderId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "64f5...",
    "userId": "64f5...",
    "restaurantName": "Pizza Palace",
    "items": [...],
    "status": "OUT_FOR_DELIVERY",
    "paymentStatus": "COMPLETED",
    "subtotal": 700,
    "deliveryFee": 0,
    "tax": 35,
    "total": 735,
    "deliveryAddress": {...},
    "estimatedDelivery": "2024-01-15T11:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Order
```
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "64f5...",
  "restaurantId": "64f5...",
  "restaurantName": "Pizza Palace",
  "items": [
    {
      "menuItemId": "64f5...",
      "name": "Margherita Pizza",
      "price": 350,
      "quantity": 2
    }
  ],
  "subtotal": 700,
  "deliveryFee": 0,
  "tax": 35,
  "total": 735,
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "specialInstructions": "Extra cheese please"
}

Response (201):
{
  "success": true,
  "message": "Order placed successfully",
  "data": { ...order object... }
}
```

#### Update Order Status
```
PUT /api/orders/:orderId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "CONFIRMED"
}

Status options: PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED

Response (200): Updated order object
```

#### Cancel Order
```
PUT /api/orders/:orderId/cancel
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Order cancelled",
  "data": { ...updated order... }
}
```

---

## 4. PAYMENT SERVICE APIs

#### Initiate Payment
```
POST /api/payments/initiate
Content-Type: application/json

{
  "orderId": "64f5...",
  "userId": "64f5...",
  "amount": 735,
  "paymentMethod": "CREDIT_CARD"
}

Response (201):
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "64f5...",
    "transactionId": "TXN_1234567890_ABC123",
    "amount": 735,
    "orderId": "64f5...",
    "paymentUrl": "https://payment-gateway.example.com/pay/TXN_1234567890_ABC123"
  }
}
```

#### Get Payment
```
GET /api/payments/:paymentId

Response (200):
{
  "success": true,
  "data": {
    "_id": "64f5...",
    "orderId": "64f5...",
    "userId": "64f5...",
    "amount": 735,
    "status": "COMPLETED",
    "transactionId": "TXN_1234567890_ABC123",
    "paymentMethod": "CREDIT_CARD"
  }
}
```

#### Process Payment
```
POST /api/payments/process
Content-Type: application/json

{
  "paymentId": "64f5...",
  "transactionId": "TXN_1234567890_ABC123",
  "status": "COMPLETED"
}

Response (200): Updated payment object
```

#### Refund Payment
```
POST /api/payments/:paymentId/refund

Response (200):
{
  "success": true,
  "message": "Refund processed successfully",
  "data": { ...payment object with status: REFUNDED... }
}
```

---

## Error Responses

All errors follow this format:

```
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "msg": "Validation message",
      "param": "field_name",
      "location": "body"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request / Validation Error
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

---

## Health Check Endpoints

All services expose a health check endpoint:

```
GET /health

Response (200):
{
  "status": "UP",
  "service": "service-name",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Health check URLs:
- User Service: `http://localhost:3001/health`
- Restaurant Service: `http://localhost:3002/health`
- Order Service: `http://localhost:3003/health`
- Payment Service: `http://localhost:3004/health`

---

## Order Status Flow

```
PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
                   ↓
                CANCELLED (can happen at any stage before delivery)
```

---

## Database Schemas

### User Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  addresses: [{
    _id: ObjectId,
    type: 'home' | 'work' | 'other',
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurant Collection
```
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  cuisines: [String],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    latitude: Number,
    longitude: Number
  },
  phone: String,
  email: String,
  rating: Number (0-5),
  totalReviews: Number,
  priceRange: 'Low' | 'Medium' | 'High',
  deliveryTime: Number (minutes),
  minOrder: Number,
  isOpen: Boolean,
  operatingHours: {
    open: String,
    close: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Collection
```
{
  _id: ObjectId,
  restaurantId: ObjectId,
  name: String,
  description: String,
  image: String,
  price: Number,
  category: String,
  isVeg: Boolean,
  spiceLevel: 'Mild' | 'Medium' | 'Spicy',
  preparationTime: Number (minutes),
  isAvailable: Boolean,
  rating: Number (0-5),
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```
{
  _id: ObjectId,
  userId: String,
  restaurantId: ObjectId,
  restaurantName: String,
  items: [{
    menuItemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  status: String,
  paymentStatus: String,
  paymentId: String,
  estimatedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Collection
```
{
  _id: ObjectId,
  orderId: String (unique),
  userId: String,
  amount: Number,
  paymentMethod: String,
  status: String,
  transactionId: String,
  transactionDate: Date,
  cardDetails: {
    last4: String,
    brand: String
  },
  errorMessage: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Example Usage Flow

1. **Sign Up**
   ```
   POST /api/auth/signup
   Get token and user info
   ```

2. **Browse Restaurants**
   ```
   GET /api/restaurants
   GET /api/restaurants/:id
   ```

3. **View Menu**
   ```
   GET /api/menus/restaurant/:restaurantId
   ```

4. **Add to Cart**
   ```
   POST /api/carts/:userId/add
   ```

5. **Checkout**
   ```
   POST /api/orders/create
   POST /api/payments/initiate
   POST /api/payments/process
   ```

6. **Track Order**
   ```
   GET /api/orders/:orderId
   ```

