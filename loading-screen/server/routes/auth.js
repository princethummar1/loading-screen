const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { protect, generateToken } = require('../middleware/auth');
const Settings = require('../models/Settings');

// @route   POST /api/auth/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if email matches admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get stored password hash from Settings
    let storedHash = await Settings.getSetting('adminPasswordHash');

    // If no hash exists, create one from ADMIN_PASSWORD env var (first run)
    if (!storedHash) {
      const salt = await bcrypt.genSalt(10);
      storedHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      await Settings.setSetting('adminPasswordHash', storedHash);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, storedHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(email);

    res.json({
      success: true,
      token,
      email,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin user info
// @access  Private
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }
  });
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    // Verify current password
    const storedHash = await Settings.getSetting('adminPasswordHash');
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password and store
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await Settings.setSetting('adminPasswordHash', newHash);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
