const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CookieConsent = require('../models/CookieConsent');

// @route   POST /api/consent
// @desc    Save cookie consent (public - no auth)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { decision, preferences } = req.body;

    // Validate decision
    if (!decision || !['accepted', 'rejected', 'custom'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid decision value'
      });
    }

    // Validate preferences
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Preferences object required'
      });
    }

    // Get IP and user agent
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Create consent record
    const consent = await CookieConsent.create({
      decision,
      preferences: {
        essential: true, // Always true
        analytics: !!preferences.analytics,
        marketing: !!preferences.marketing,
        personalization: !!preferences.personalization
      },
      savedAt: new Date(),
      ip: ip.replace(/^::ffff:/, ''), // Clean IPv6 prefix
      userAgent: userAgent.substring(0, 500) // Limit length
    });

    res.status(201).json({
      success: true
    });
  } catch (error) {
    console.error('Save consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving consent'
    });
  }
});

// @route   GET /api/consent/stats
// @desc    Get consent statistics (protected - admin only)
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // Get total count
    const total = await CookieConsent.countDocuments();

    // Get breakdown by decision
    const decisionAggregation = await CookieConsent.aggregate([
      {
        $group: {
          _id: '$decision',
          count: { $sum: 1 }
        }
      }
    ]);

    const breakdown = {
      accepted: 0,
      rejected: 0,
      custom: 0
    };

    decisionAggregation.forEach(item => {
      if (breakdown.hasOwnProperty(item._id)) {
        breakdown[item._id] = item.count;
      }
    });

    // Calculate percentages
    const percentages = {
      accepted: total > 0 ? `${Math.round((breakdown.accepted / total) * 100)}%` : '0%',
      rejected: total > 0 ? `${Math.round((breakdown.rejected / total) * 100)}%` : '0%',
      custom: total > 0 ? `${Math.round((breakdown.custom / total) * 100)}%` : '0%'
    };

    // Get category stats
    const categoryAggregation = await CookieConsent.aggregate([
      {
        $group: {
          _id: null,
          analyticsEnabled: {
            $sum: { $cond: ['$preferences.analytics', 1, 0] }
          },
          marketingEnabled: {
            $sum: { $cond: ['$preferences.marketing', 1, 0] }
          },
          personalizationEnabled: {
            $sum: { $cond: ['$preferences.personalization', 1, 0] }
          }
        }
      }
    ]);

    const catStats = categoryAggregation[0] || {
      analyticsEnabled: 0,
      marketingEnabled: 0,
      personalizationEnabled: 0
    };

    const categoryStats = {
      analytics: {
        enabled: catStats.analyticsEnabled,
        disabled: total - catStats.analyticsEnabled
      },
      marketing: {
        enabled: catStats.marketingEnabled,
        disabled: total - catStats.marketingEnabled
      },
      personalization: {
        enabled: catStats.personalizationEnabled,
        disabled: total - catStats.personalizationEnabled
      }
    };

    // Get recent consents (last 10)
    const recentConsents = await CookieConsent.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('decision preferences createdAt ip')
      .lean();

    // Mask IPs for privacy
    const maskedConsents = recentConsents.map(c => ({
      ...c,
      ip: c.ip ? c.ip.replace(/\.\d+$/, '.***') : 'N/A'
    }));

    res.json({
      success: true,
      data: {
        total,
        breakdown,
        percentages,
        categoryStats,
        recentConsents: maskedConsents
      }
    });
  } catch (error) {
    console.error('Get consent stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consent stats'
    });
  }
});

module.exports = router;
