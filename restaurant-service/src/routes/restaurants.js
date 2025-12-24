const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Get all restaurants with filters and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('cuisine').optional().trim(),
  query('city').optional().trim(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }).toFloat(),
  query('search').optional().trim()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    let filter = { isOpen: true };

    if (req.query.cuisine) {
      filter.cuisines = req.query.cuisine;
    }
    if (req.query.city) {
      filter['address.city'] = req.query.city;
    }
    if (req.query.minRating) {
      filter.rating = { $gte: req.query.minRating };
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const total = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

// Create restaurant (Admin only - for demo)
router.post('/', [
  body('name').notEmpty().trim().escape(),
  body('cuisines').isArray(),
  body('phone').notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('address.street').notEmpty().trim().escape(),
  body('address.city').notEmpty().trim().escape(),
  body('address.state').notEmpty().trim().escape(),
  body('address.zipCode').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const restaurant = new Restaurant(req.body);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

// Update restaurant
router.put('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

// Seed restaurants (for development/testing)
router.post('/seed', async (req, res, next) => {
  try {
    req.setTimeout(60000); // 60 seconds
    console.log('Starting restaurant seed...');

    // Drop all indexes first to avoid conflicts
    try {
      await Restaurant.collection.dropIndexes();
      console.log('Dropped old indexes');
    } catch (err) {
      console.log('No indexes to drop or already dropped');
    }

    // Recreate indexes
    try {
      await Restaurant.collection.createIndex({ name: 'text', description: 'text' });
      await Restaurant.collection.createIndex({ cuisines: 1 });
      await Restaurant.collection.createIndex({ city: 1 });
      await Restaurant.collection.createIndex({ rating: -1 });
      console.log('Recreated indexes');
    } catch (err) {
      console.log('Could not recreate indexes:', err.message);
    }

    // Just create 2 simple restaurants
    const restaurant1 = new Restaurant({
      name: 'Pizza Palace',
      description: 'Delicious Italian pizzas',
      cuisines: ['Italian'],
      rating: 4.5,
      deliveryTime: 30,
      deliveryFee: 50,
      image: 'https://via.placeholder.com/300x200?text=Pizza+Palace',
      address: {
        street: '123 Main St',
        city: 'Mumbai',
        postalCode: '400001'
      },
      isOpen: true
    });

    const restaurant2 = new Restaurant({
      name: 'Taj Indian Kitchen',
      description: 'Authentic Indian cuisine',
      cuisines: ['Indian'],
      rating: 4.7,
      deliveryTime: 35,
      deliveryFee: 40,
      image: 'https://via.placeholder.com/300x200?text=Taj+Kitchen',
      address: {
        street: '456 Food Lane',
        city: 'Mumbai',
        postalCode: '400002'
      },
      isOpen: true
    });

    await restaurant1.save();
    await restaurant2.save();

    console.log('✅ 2 restaurants seeded successfully');

    res.json({
      success: true,
      message: '✅ 2 restaurants added! Add more manually via the form.',
      data: [restaurant1, restaurant2]
    });
  } catch (error) {
    console.error('Seed error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error: ' + error.message
    });
  }
});

module.exports = router;
