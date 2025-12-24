import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { menuItemId, name, price, quantity, image, restaurantId, restaurantName } = action.payload;
      
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        // Clear cart if switching restaurants
        state.items = [];
        state.restaurantId = restaurantId;
        state.restaurantName = restaurantName;
      }

      const existingItem = state.items.find(item => item.menuItemId === menuItemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ menuItemId, name, price, quantity, image });
      }

      calculateTotals(state);
    },
    updateCartItem: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      
      if (quantity === 0) {
        state.items = state.items.filter(item => item.menuItemId !== menuItemId);
      } else {
        const item = state.items.find(item => item.menuItemId === menuItemId);
        if (item) {
          item.quantity = quantity;
        }
      }

      calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.menuItemId !== action.payload);
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.tax = 0;
      state.total = 0;
    },
    setCart: (state, action) => {
      if (action.payload) {
        state.items = action.payload.items;
        state.restaurantId = action.payload.restaurantId;
        state.restaurantName = action.payload.restaurantName;
        state.subtotal = action.payload.subtotal;
        state.deliveryFee = action.payload.deliveryFee;
        state.tax = action.payload.tax;
        state.total = action.payload.total;
      }
    }
  }
});

function calculateTotals(state) {
  state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  state.deliveryFee = state.subtotal > 200 ? 0 : 40;
  state.tax = state.subtotal * 0.05;
  state.total = state.subtotal + state.deliveryFee + state.tax;
}

export const { addToCart, updateCartItem, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
