const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Testimonial = require('../models/Testimonial');

// @route   GET /api/testimonials
// @desc    Get all visible testimonials (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;

    const filter = { visible: true };
    if (page) {
      filter.pages = page;
    }

    const testimonials = await Testimonial.find(filter).sort({ order: 1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// @route   GET /api/testimonials/all
// @desc    Get all testimonials including hidden (admin)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// @route   POST /api/testimonials
// @desc    Create new testimonial
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const lastTestimonial = await Testimonial.findOne().sort({ order: -1 });
    const order = lastTestimonial ? lastTestimonial.order + 1 : 0;

    const testimonial = new Testimonial({
      ...req.body,
      order
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial'
    });
  }
});

// @route   PUT /api/testimonials/reorder
// @desc    Bulk update testimonial orders
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
      Testimonial.updateOne({ _id: item.id }, { order: item.order })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Order updated'
    });
  } catch (error) {
    console.error('Reorder testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering testimonials'
    });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial'
    });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial'
    });
  }
});

module.exports = router;
