import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { orderAPI, paymentAPI } from '../api/client';
import CartDrawer from '../components/CartDrawer';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items, total, restaurantId } = useSelector(state => state.cart);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter delivery address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order
      const orderResponse = await orderAPI.createOrder({
        userId: user.id,
        restaurantId,
        items,
        subtotal: total - (40 - Math.floor(total * 0.05)),
        deliveryFee: 40,
        tax: Math.floor(total * 0.05),
        total,
        deliveryAddress: {
          street: address,
          city: 'Your City',
          state: 'Your State',
          zipCode: '000000'
        }
      });

      const orderId = orderResponse.data.data._id;

      // Initiate payment
      const paymentResponse = await paymentAPI.initiatePayment({
        orderId,
        userId: user.id,
        amount: total,
        paymentMethod
      });

      // Process payment (simulate)
      await paymentAPI.processPayment({
        paymentId: paymentResponse.data.data.paymentId,
        transactionId: paymentResponse.data.data.transactionId,
        status: 'COMPLETED'
      });

      alert('Order placed successfully!');
      navigate(`/order-tracking/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Checkout</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING'].map(method => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        {method.replace('_', ' ')}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                >
                  {loading ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
