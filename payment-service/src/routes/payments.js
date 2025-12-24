const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const Payment = require('../models/Payment');

const router = express.Router();

// Initiate payment
router.post('/initiate', [
  body('orderId').notEmpty(),
  body('userId').notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('paymentMethod').isIn(['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { orderId, userId, amount, paymentMethod, cardDetails } = req.body;

    // Check if payment already exists
    let payment = await Payment.findOne({ orderId });
    if (payment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment already initiated for this order' 
      });
    }

    // Create new payment record
    payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod,
      cardDetails,
      status: 'INITIATED'
    });

    await payment.save();

    // Simulate payment processing
    // In production, integrate with actual payment gateway (Razorpay, Stripe, etc.)
    const transactionId = generateTransactionId();

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        paymentId: payment._id,
        transactionId,
        amount,
        orderId,
        paymentUrl: `https://payment-gateway.example.com/pay/${transactionId}`
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get payment by ID
router.get('/:paymentId', async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// Get payment by order ID
router.get('/order/:orderId', async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// Process payment (simulate payment gateway callback)
router.post('/process', [
  body('paymentId').notEmpty(),
  body('transactionId').notEmpty(),
  body('status').isIn(['COMPLETED', 'FAILED'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { paymentId, transactionId, status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { 
        status: status === 'COMPLETED' ? 'PROCESSING' : 'FAILED',
        transactionId,
        transactionDate: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    // Update order payment status
    try {
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.orderId}/payment`,
        {
          paymentStatus: status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
          paymentId: payment._id.toString()
        }
      );
    } catch (error) {
      console.log('Could not update order service:', error.message);
    }

    // Complete payment status after processing
    payment.status = 'COMPLETED';
    await payment.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// Refund payment
router.post('/:paymentId/refund', async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      { 
        status: 'REFUNDED',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to generate transaction ID
function generateTransactionId() {
  return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = router;
