const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');

// ═══════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════

// @route   GET /api/projects
// @desc    Get all visible projects (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { industry, tag, featured, type } = req.query;

    const filter = { visible: true };
    if (industry) filter.industry = industry;
    if (tag) filter.tags = tag;
    if (featured === 'true') filter.featured = true;
    if (type) filter.type = type;

    const projects = await Project.find(filter).sort({ order: 1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// @route   GET /api/projects/featured
// @desc    Get featured projects only (public)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { visible: true, featured: true };
    if (type) filter.type = type;

    const projects = await Project.find(filter).sort({ order: 1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured projects'
    });
  }
});

// @route   GET /api/projects/slug/:slug
// @desc    Get single project by slug (for frontend detail page)
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, visible: true });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
});

// ═══════════════════════════════════════════════
// ADMIN ROUTES (protected)
// ═══════════════════════════════════════════════

// @route   GET /api/projects/all
// @desc    Get all projects including hidden (admin)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Get highest order number
    const lastProject = await Project.findOne().sort({ order: -1 });
    const order = lastProject ? lastProject.order + 1 : 0;

    const project = new Project({
      ...req.body,
      order
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project'
    });
  }
});

// @route   PUT /api/projects/reorder
// @desc    Bulk update project orders
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
      Project.updateOne({ _id: item.id }, { order: item.order })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Order updated'
    });
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    // Fields that are allowed to be updated
    const updatableFields = [
      'name', 'description', 'industry', 'location', 'type',
      'tags', 'images', 'accent', 'visible', 'featured',
      'heroHeadline', 'heroSubtext', 'services', 'sections',
      'results', 'liveUrl', 'metaTitle', 'metaDescription', 'year', 'order',
      'topVideoUrl', 'galleryCards', 'contentBlocks', 'marqueeCards',
      'fullBleedImages', 'outcomeLabel', 'outcomeDescription',
      'outcomeLiveUrl', 'outcomeBgColor', 'outcomeImage', 'outcomeImageAlt'
    ];

    // Build the $set payload from only allowed fields
    const updates = {};
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Generate slug if name is being updated
    if (updates.name) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: false }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating project'
    });
  }
});


// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project'
    });
  }
});

// @route   PUT /api/projects/:id/visibility
// @desc    Toggle project visibility
// @access  Private
router.put('/:id/visibility', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.visible = !project.visible;
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling visibility'
    });
  }
});

// @route   PUT /api/projects/:id/featured
// @desc    Toggle project featured on homepage
// @access  Private
router.put('/:id/featured', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling featured'
    });
  }
});

module.exports = router;
