import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../api/client';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStatusIndex = statusSteps.indexOf(order?.status);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>

          <div className="mb-8">
            <p className="text-gray-600 mb-2">Order ID: {order._id}</p>
            <p className="text-gray-600">Restaurant: {order.restaurantName}</p>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      index <= currentStatusIndex
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center text-gray-600 whitespace-nowrap">
                    {step.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-200">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t pt-6">
            <h2 className="font-bold text-lg mb-4">Order Items</h2>
            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-700">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-orange-600">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-2">Delivery Address</h3>
              <p className="text-gray-700">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
