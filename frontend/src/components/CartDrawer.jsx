import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../store/cartSlice';

export default function Cart() {
  const { items, subtotal, deliveryFee, tax, total } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (menuItemId, quantity) => {
    dispatch(updateCartItem({ menuItemId, quantity }));
  };

  const handleRemove = (menuItemId) => {
    dispatch(removeFromCart(menuItemId));
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
        {items.map(item => (
          <div key={item.menuItemId} className="flex items-center gap-4 pb-4 border-b">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <p className="text-gray-600">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
              >
                +
              </button>
            </div>
            <span className="font-semibold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
            <button
              onClick={() => handleRemove(item.menuItemId)}
              className="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery:</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax:</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total:</span>
          <span className="text-orange-600">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
