const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Logo = require('../models/Logo');

// @route   GET /api/logos
// @desc    Get all logos (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const logos = await Logo.find().sort({ order: 1 });

    res.json({
      success: true,
      count: logos.length,
      data: logos
    });
  } catch (error) {
    console.error('Get logos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logos'
    });
  }
});

// @route   POST /api/logos
// @desc    Create new logo
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const lastLogo = await Logo.findOne().sort({ order: -1 });
    const order = lastLogo ? lastLogo.order + 1 : 0;

    const logo = new Logo({
      ...req.body,
      order
    });

    await logo.save();

    res.status(201).json({
      success: true,
      data: logo
    });
  } catch (error) {
    console.error('Create logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating logo'
    });
  }
});

// @route   PUT /api/logos/reorder
// @desc    Bulk update logo orders
// @access  Private
// IMPORTANT: Must be BEFORE /:id to prevent Express matching 'reorder' as an ObjectId
router.put('/reorder', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid items array'
      });
    }

    const updates = items.map(item =>
      Logo.updateOne({ _id: item.id }, { order: item.order })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Order updated'
    });
  } catch (error) {
    console.error('Reorder logos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering logos'
    });
  }
});

// @route   PUT /api/logos/:id
// @desc    Update logo
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const logo = await Logo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: 'Logo not found'
      });
    }

    res.json({
      success: true,
      data: logo
    });
  } catch (error) {
    console.error('Update logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating logo'
    });
  }
});

// @route   DELETE /api/logos/:id
// @desc    Delete logo
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const logo = await Logo.findByIdAndDelete(req.params.id);

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: 'Logo not found'
      });
    }

    res.json({
      success: true,
      message: 'Logo deleted'
    });
  } catch (error) {
    console.error('Delete logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting logo'
    });
  }
});

module.exports = router;
