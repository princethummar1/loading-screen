const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const FAQ = require('../models/FAQ');

// @route   GET /api/faqs
// @desc    Get all FAQs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });

    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs'
    });
  }
});

// @route   POST /api/faqs
// @desc    Create new FAQ
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const lastFAQ = await FAQ.findOne().sort({ order: -1 });
    const order = lastFAQ ? lastFAQ.order + 1 : 0;

    const faq = new FAQ({
      ...req.body,
      order
    });

    await faq.save();

    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating FAQ'
    });
  }
});

// @route   PUT /api/faqs/reorder
// @desc    Bulk update FAQ orders
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
      FAQ.updateOne({ _id: item.id }, { order: item.order })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Order updated'
    });
  } catch (error) {
    console.error('Reorder FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering FAQs'
    });
  }
});

// @route   PUT /api/faqs/:id
// @desc    Update FAQ
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating FAQ'
    });
  }
});

// @route   DELETE /api/faqs/:id
// @desc    Delete FAQ
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.json({
      success: true,
      message: 'FAQ deleted'
    });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting FAQ'
    });
  }
});

module.exports = router;
