const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Service = require('../models/Service');

// @route   GET /api/services/all
// @desc    Get all services with full data (admin)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const services = await Service.find();
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
});

// @route   GET /api/services
// @desc    Get all services (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().select('slug name heroDescription heroImage');
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
});

// @route   GET /api/services/:slug
// @desc    Get single service by slug (public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service'
    });
  }
});

// @route   PUT /api/services/:slug
// @desc    Update service content
// @access  Private
router.put('/:slug', protect, async (req, res) => {
  try {
    // Don't allow changing the slug
    const { slug, ...updateData } = req.body;

    const service = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service'
    });
  }
});

// @route   PUT /api/services/:slug/approach
// @desc    Update approach items order
// @access  Private
router.put('/:slug/approach', protect, async (req, res) => {
  try {
    const { approachItems } = req.body;

    const service = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      { approachItems },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Update approach error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating approach items'
    });
  }
});

// @route   PUT /api/services/:slug/cards
// @desc    Update service cards order
// @access  Private
router.put('/:slug/cards', protect, async (req, res) => {
  try {
    const { serviceCards } = req.body;

    const service = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      { serviceCards },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Update cards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service cards'
    });
  }
});

module.exports = router;
