import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const RESTAURANT_BASE_URL = 'http://localhost:3002';
const ORDER_BASE_URL = 'http://localhost:3003';
const PAYMENT_BASE_URL = 'http://localhost:3004';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Helper function to set auth headers
const getHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
});

// User Service APIs
export const userAPI = {
  signup: (data) => axios.post(`${API_BASE_URL}/api/auth/signup`, data),
  login: (data) => axios.post(`${API_BASE_URL}/api/auth/login`, data),
  verifyToken: () => axios.get(`${API_BASE_URL}/api/auth/verify`, { headers: getHeaders() }),
  getProfile: () => axios.get(`${API_BASE_URL}/api/users/profile`, { headers: getHeaders() }),
  updateProfile: (data) => axios.put(`${API_BASE_URL}/api/users/profile`, data, { headers: getHeaders() }),
  getAddresses: () => axios.get(`${API_BASE_URL}/api/users/addresses`, { headers: getHeaders() }),
  addAddress: (data) => axios.post(`${API_BASE_URL}/api/users/addresses`, data, { headers: getHeaders() }),
  updateAddress: (addressId, data) => axios.put(`${API_BASE_URL}/api/users/addresses/${addressId}`, data, { headers: getHeaders() }),
  deleteAddress: (addressId) => axios.delete(`${API_BASE_URL}/api/users/addresses/${addressId}`, { headers: getHeaders() })
};

// Restaurant Service APIs
export const restaurantAPI = {
  getRestaurants: (params) => axios.get(`${RESTAURANT_BASE_URL}/api/restaurants`, { params }),
  getRestaurantById: (id) => axios.get(`${RESTAURANT_BASE_URL}/api/restaurants/${id}`),
  getMenuItems: (restaurantId, params) => axios.get(`${RESTAURANT_BASE_URL}/api/menus/restaurant/${restaurantId}`, { params }),
  getMenuItem: (id) => axios.get(`${RESTAURANT_BASE_URL}/api/menus/${id}`)
};

// Order Service APIs
export const orderAPI = {
  getCart: (userId) => axios.get(`${ORDER_BASE_URL}/api/carts/${userId}`),
  addToCart: (userId, data) => axios.post(`${ORDER_BASE_URL}/api/carts/${userId}/add`, data),
  updateCartItem: (userId, menuItemId, data) => axios.put(`${ORDER_BASE_URL}/api/carts/${userId}/items/${menuItemId}`, data),
  clearCart: (userId) => axios.delete(`${ORDER_BASE_URL}/api/carts/${userId}`),
  getOrders: (userId, params) => axios.get(`${ORDER_BASE_URL}/api/orders/user/${userId}`, { params }),
  getOrderById: (orderId) => axios.get(`${ORDER_BASE_URL}/api/orders/${orderId}`),
  createOrder: (data) => axios.post(`${ORDER_BASE_URL}/api/orders/create`, data),
  updateOrderStatus: (orderId, data) => axios.put(`${ORDER_BASE_URL}/api/orders/${orderId}/status`, data),
  cancelOrder: (orderId) => axios.put(`${ORDER_BASE_URL}/api/orders/${orderId}/cancel`, {})
};

// Payment Service APIs
export const paymentAPI = {
  initiatePayment: (data) => axios.post(`${PAYMENT_BASE_URL}/api/payments/initiate`, data),
  getPayment: (paymentId) => axios.get(`${PAYMENT_BASE_URL}/api/payments/${paymentId}`),
  getPaymentByOrderId: (orderId) => axios.get(`${PAYMENT_BASE_URL}/api/payments/order/${orderId}`),
  processPayment: (data) => axios.post(`${PAYMENT_BASE_URL}/api/payments/process`, data),
  refundPayment: (paymentId) => axios.post(`${PAYMENT_BASE_URL}/api/payments/${paymentId}/refund`, {})
};

// Health check
export const healthCheck = async (serviceUrl) => {
  try {
    await axios.get(`${serviceUrl}/health`);
    return true;
  } catch {
    return false;
  }
};
