const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  cuisines: [{
    type: String,
    enum: ['Indian', 'Chinese', 'Fast Food', 'Italian', 'Continental', 'North Indian', 'South Indian', 'Desserts', 'Beverages']
  }],
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
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  priceRange: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  deliveryTime: {
    type: Number,
    default: 30 // in minutes
  },
  minOrder: {
    type: Number,
    default: 0
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    open: String,
    close: String
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

// Indexes for fast queries
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ cuisines: 1 });
restaurantSchema.index({ city: 1 });
restaurantSchema.index({ rating: -1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
