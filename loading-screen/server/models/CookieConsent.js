const mongoose = require('mongoose');

const CookieConsentSchema = new mongoose.Schema({
  decision: {
    type: String,
    enum: ['accepted', 'rejected', 'custom'],
    required: true,
    index: true
  },
  preferences: {
    essential: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    personalization: { type: Boolean, default: false }
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Index for efficient stats queries
CookieConsentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CookieConsent', CookieConsentSchema);
