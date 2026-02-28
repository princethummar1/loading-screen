const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, uploadsDir } = require('../middleware/upload');
const Media = require('../models/Media');

// @route   GET /api/media
// @desc    Get all media (paginated)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const filter = {};
    if (search) {
      filter.originalName = { $regex: search, $options: 'i' };
    }

    const total = await Media.countDocuments(filter);
    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      count: media.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: media
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media'
    });
  }
});

// @route   POST /api/media/upload
// @desc    Upload single image
// @access  Private
router.post('/upload', protect, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;

    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url
    });

    await media.save();

    res.status(201).json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up file if DB save failed
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

// @route   POST /api/media/upload-multiple
// @desc    Upload multiple images
// @access  Private
router.post('/upload-multiple', protect, uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const mediaItems = [];

    for (const file of req.files) {
      const url = `${baseUrl}/uploads/${file.filename}`;

      const media = new Media({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url
      });

      await media.save();
      mediaItems.push(media);
    }

    res.status(201).json({
      success: true,
      count: mediaItems.length,
      data: mediaItems
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});

// @route   DELETE /api/media/:id
// @desc    Delete media file and DB record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete physical file
    const filePath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    await Media.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Media deleted'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting media'
    });
  }
});

// @route   GET /api/media/:id
// @desc    Get single media by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media'
    });
  }
});

module.exports = router;
