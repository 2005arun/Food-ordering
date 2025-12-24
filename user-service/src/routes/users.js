const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', protect, [
  body('name').optional().trim().escape(),
  body('phone').optional().trim(),
  body('avatar').optional().isURL()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, avatar, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
});

// Add address
router.post('/addresses', protect, [
  body('street').notEmpty().trim().escape(),
  body('city').notEmpty().trim().escape(),
  body('state').notEmpty().trim().escape(),
  body('zipCode').notEmpty().trim(),
  body('type').isIn(['home', 'work', 'other'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { street, city, state, zipCode, type, isDefault } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const newAddress = {
      type: type || 'other',
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || false
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
});

// Get all addresses
router.get('/addresses', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
});

// Update address
router.put('/addresses/:addressId', protect, async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, type, isDefault } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: 'Address not found' 
      });
    }

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.type = type || address.type;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
});

// Delete address
router.delete('/addresses/:addressId', protect, async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.addresses.id(addressId).deleteOne();
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
