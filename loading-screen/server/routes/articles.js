const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateBody, sanitizeBody, schemas } = require('../middleware/validate');
const Article = require('../models/Article');

// @route   GET /api/articles
// @desc    Get all published articles (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .sort({ order: 1, date: -1 })
      .select('-content'); // Exclude content for list view
    
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles'
    });
  }
});

// @route   GET /api/articles/all
// @desc    Get all articles including drafts (admin)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const { status, category } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const articles = await Article.find(filter)
      .sort({ order: 1, date: -1 });
    
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Get all articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles'
    });
  }
});

// @route   GET /api/articles/:identifier
// @desc    Get single article by slug or id
// @access  Public
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is a MongoDB ObjectId (24 hex chars)
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(identifier);
    
    const article = isObjectId 
      ? await Article.findById(identifier)
      : await Article.findOne({ slug: identifier });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Get related articles (same category, excluding current)
    const related = await Article.find({
      status: 'published',
      category: article.category,
      _id: { $ne: article._id }
    })
      .limit(3)
      .select('-content');

    res.json({
      success: true,
      data: article,
      related
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article'
    });
  }
});

// @route   GET /api/articles/:identifier/related
// @desc    Get related articles for an article
// @access  Public
router.get('/:identifier/related', async (req, res) => {
  try {
    const { identifier } = req.params;
    const limit = parseInt(req.query.limit) || 3;
    
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(identifier);
    
    const article = isObjectId 
      ? await Article.findById(identifier)
      : await Article.findOne({ slug: identifier });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const related = await Article.find({
      status: 'published',
      category: article.category,
      _id: { $ne: article._id }
    })
      .limit(limit)
      .select('-content')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: related
    });
  } catch (error) {
    console.error('Get related articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching related articles'
    });
  }
});

// @route   POST /api/articles
// @desc    Create new article
// @access  Private
router.post('/', protect, sanitizeBody, validateBody(schemas.article), async (req, res) => {
  try {
    // Get highest order number
    const lastArticle = await Article.findOne().sort({ order: -1 });
    const order = lastArticle ? lastArticle.order + 1 : 0;

    const article = new Article({
      ...req.body,
      order
    });

    await article.save();

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Create article error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An article with this slug already exists',
        errors: { slug: 'This slug is already taken' }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating article'
    });
  }
});

// @route   PUT /api/articles/reorder
// @desc    Bulk update article orders
// @access  Private
// IMPORTANT: This route must be BEFORE /:id to prevent Express matching 'reorder' as an ObjectId
router.put('/reorder', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid items array'
      });
    }

    // Update each article's order
    const updates = items.map(item => 
      Article.updateOne({ _id: item.id }, { order: item.order })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Order updated'
    });
  } catch (error) {
    console.error('Reorder articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering articles'
    });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Private
router.put('/:id', protect, sanitizeBody, validateBody(schemas.article), async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Update article error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An article with this slug already exists',
        errors: { slug: 'This slug is already taken' }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating article'
    });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Delete article
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article'
    });
  }
});

// @route   POST /api/articles/:id/publish
// @desc    Toggle article publish status
// @access  Private
router.post('/:id/publish', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    article.status = article.status === 'published' ? 'draft' : 'published';
    await article.save();

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling publish status'
    });
  }
});

module.exports = router;
