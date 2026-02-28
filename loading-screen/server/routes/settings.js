const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Settings = require('../models/Settings');

// @route   GET /api/settings
// @desc    Get all settings as key-value object (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getAllSettings();
    
    // Remove sensitive settings from public response
    delete settings.adminPasswordHash;
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings'
    });
  }
});

// @route   GET /api/settings/:key
// @desc    Get single setting by key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    // Protect sensitive settings
    if (req.params.key === 'adminPasswordHash') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const value = await Settings.getSetting(req.params.key);
    
    if (value === null) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      key: req.params.key,
      value
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching setting'
    });
  }
});

// @route   PUT /api/settings/:key
// @desc    Update single setting
// @access  Private
router.put('/:key', protect, async (req, res) => {
  try {
    const { value } = req.body;

    // Protect sensitive settings
    if (req.params.key === 'adminPasswordHash') {
      return res.status(403).json({
        success: false,
        message: 'Use /api/auth/change-password to change password'
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }

    const setting = await Settings.setSetting(req.params.key, value);

    res.json({
      success: true,
      key: setting.key,
      value: setting.value
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting'
    });
  }
});

// @route   PUT /api/settings
// @desc    Bulk update multiple settings
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings object'
      });
    }

    // Protect sensitive settings
    if (updates.adminPasswordHash) {
      delete updates.adminPasswordHash;
    }

    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const setting = await Settings.setSetting(key, value);
      results.push({ key: setting.key, value: setting.value });
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings'
    });
  }
});

// @route   DELETE /api/settings/:key
// @desc    Delete a setting
// @access  Private
router.delete('/:key', protect, async (req, res) => {
  try {
    // Protect sensitive settings
    if (req.params.key === 'adminPasswordHash') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin password'
      });
    }

    const result = await Settings.findOneAndDelete({ key: req.params.key });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      message: 'Setting deleted'
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting setting'
    });
  }
});

module.exports = router;
