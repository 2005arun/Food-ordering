import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { setUser } from './store/authSlice';
import { userAPI } from './api/client';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import RestaurantDetails from './pages/RestaurantDetails';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Verify token on app load
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await userAPI.verifyToken();
          dispatch(setUser(response.data.user));
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
    };

    verifyAuth();
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/restaurant/:restaurantId"
          element={isAuthenticated ? <RestaurantDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/order-tracking/:orderId"
          element={isAuthenticated ? <OrderTracking /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
