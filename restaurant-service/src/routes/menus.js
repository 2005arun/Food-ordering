const express = require('express');
const { body, query, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get menu items for a restaurant
router.get('/restaurant/:restaurantId', [
  query('category').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    let filter = { restaurantId: req.params.restaurantId, isAvailable: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const total = await MenuItem.countDocuments(filter);
    const items = await MenuItem.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: items,
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

// Get single menu item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Menu item not found' 
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
});

// Create menu item
router.post('/', [
  body('restaurantId').notEmpty(),
  body('name').notEmpty().trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('category').isIn(['Appetizers', 'Main Course', 'Bread', 'Desserts', 'Beverages', 'Sides'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const item = new MenuItem(req.body);
    await item.save();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
});

// Update menu item
router.put('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Menu item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
});

// Delete menu item
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Menu item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Seed menu items (for development/testing)
router.post('/seed', async (req, res, next) => {
  try {
    req.setTimeout(60000);
    console.log('Starting menu items seed...');

    const Restaurant = require('../models/Restaurant');
    const restaurants = await Restaurant.find({});

    if (restaurants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please seed restaurants first'
      });
    }

    // Add menu items with valid categories only
    const item1 = new MenuItem({
      restaurantId: restaurants[0]._id,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato and cheese',
      price: 250,
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
      image: 'https://via.placeholder.com/200?text=Margherita'
    });

    const item2 = new MenuItem({
      restaurantId: restaurants[0]._id,
      name: 'Garlic Bread',
      description: 'Crispy bread with garlic butter',
      price: 150,
      category: 'Bread',
      isVeg: true,
      isAvailable: true,
      image: 'https://via.placeholder.com/200?text=Garlic+Bread'
    });

    const item3 = new MenuItem({
      restaurantId: restaurants[1]._id,
      name: 'Butter Chicken',
      description: 'Tender chicken in creamy tomato sauce',
      price: 350,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      image: 'https://via.placeholder.com/200?text=Butter+Chicken'
    });

    const item4 = new MenuItem({
      restaurantId: restaurants[1]._id,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese with spices',
      price: 280,
      category: 'Appetizers',
      isVeg: true,
      isAvailable: true,
      image: 'https://via.placeholder.com/200?text=Paneer+Tikka'
    });

    await item1.save();
    await item2.save();
    await item3.save();
    await item4.save();

    console.log('✅ Menu items seeded');

    res.json({
      success: true,
      message: '✅ 4 menu items added!',
      data: [item1, item2, item3, item4]
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
