const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');

const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({
        success: true,
        data: null,
        message: 'Cart is empty'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/:userId/add', [
  body('restaurantId').notEmpty(),
  body('menuItemId').notEmpty(),
  body('name').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('quantity').isInt({ min: 1 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId } = req.params;
    const { restaurantId, restaurantName, menuItemId, name, price, quantity, image, specialInstructions } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        restaurantId,
        restaurantName,
        items: [{
          menuItemId,
          name,
          price,
          quantity,
          image,
          specialInstructions
        }]
      });
    } else {
      // Check if item already exists
      const existingItem = cart.items.find(item => item.menuItemId.toString() === menuItemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          menuItemId,
          name,
          price,
          quantity,
          image,
          specialInstructions
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 200 ? 0 : 40;
    const tax = subtotal * 0.05; // 5% tax

    cart.subtotal = subtotal;
    cart.deliveryFee = deliveryFee;
    cart.tax = tax;
    cart.total = subtotal + deliveryFee + tax;
    cart.updatedAt = new Date();

    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
router.put('/:userId/items/:menuItemId', [
  body('quantity').isInt({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, menuItemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    const item = cart.items.find(item => item.menuItemId.toString() === menuItemId);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.menuItemId.toString() !== menuItemId);
    } else {
      item.quantity = quantity;
    }

    // Recalculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 200 ? 0 : 40;
    const tax = subtotal * 0.05;

    cart.subtotal = subtotal;
    cart.deliveryFee = deliveryFee;
    cart.tax = tax;
    cart.total = subtotal + deliveryFee + tax;
    cart.updatedAt = new Date();

    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.json({
        success: true,
        message: 'Cart cleared',
        data: null
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/:userId', async (req, res, next) => {
  try {
    await Cart.deleteOne({ userId: req.params.userId });

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
