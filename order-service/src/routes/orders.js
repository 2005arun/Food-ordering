const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const router = express.Router();

// Get user's orders
router.get('/user/:userId', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ userId: req.params.userId });
    const orders = await Order.find({ userId: req.params.userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
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

// Get order by ID
router.get('/:orderId', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Place order
router.post('/create', [
  body('userId').notEmpty(),
  body('restaurantId').notEmpty(),
  body('deliveryAddress.street').notEmpty().trim(),
  body('deliveryAddress.city').notEmpty().trim(),
  body('deliveryAddress.state').notEmpty().trim(),
  body('deliveryAddress.zipCode').notEmpty(),
  body('items').isArray({ min: 1 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      userId,
      restaurantId,
      restaurantName,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      specialInstructions
    } = req.body;

    // Calculate estimated delivery time (30-45 minutes)
    const estimatedDelivery = new Date(Date.now() + 35 * 60000);

    const order = new Order({
      userId,
      restaurantId,
      restaurantName,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      specialInstructions,
      estimatedDelivery,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    });

    await order.save();

    // Clear the cart
    await Cart.deleteOne({ userId });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.put('/:orderId/status', [
  body('status').isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Update payment status
router.put('/:orderId/payment', [
  body('paymentStatus').isIn(['PENDING', 'COMPLETED', 'FAILED']),
  body('paymentId').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { paymentStatus, paymentId } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        paymentStatus, 
        paymentId,
        status: paymentStatus === 'COMPLETED' ? 'CONFIRMED' : 'PENDING',
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Cancel order
router.put('/:orderId/cancel', async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'CANCELLED', updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
