const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  restaurantName: String,
  items: [{
    menuItemId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    },
    image: String,
    specialInstructions: String
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast lookups
cartSchema.index({ userId: 1 });
cartSchema.index({ restaurantId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
