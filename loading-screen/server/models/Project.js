const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },

  // Type badge: 'case-study' or 'project'
  type: {
    type: String,
    enum: ['case-study', 'project'],
    default: 'project'
  },

  // Tags (array of strings)
  tags: [{
    type: String,
    trim: true
  }],

  // Images (array of URLs)
  images: [{
    type: String
  }],

  // Accent color for frontend rendering
  accent: {
    type: String,
    default: '#6d28d9'
  },

  // Settings
  visible: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },

  // ─── Case Study Detail Page fields ───
  heroHeadline: {
    type: String,
    default: ''
  },
  heroSubtext: {
    type: String,
    default: ''
  },

  services: [{
    type: String
  }],

  // Sections (flexible content blocks for detail page)
  sections: [
    {
      type: {
        type: String,
        enum: ['text', 'image', 'gallery', 'video', 'stats', 'quote'],
      },
      heading: { type: String },
      body: { type: String },
      mediaUrl: { type: String },
      stats: [
        {
          label: { type: String },
          value: { type: String },
        }
      ],
      quote: { type: String },
      author: { type: String },
    }
  ],

  // Results / outcomes shown on detail page
  results: [
    {
      metric: { type: String },
      value: { type: String },
    }
  ],

  // ─── Dynamic Case Study Enhancements ───
  topVideoUrl: {
    type: String,
    default: ''
  },
  marqueeCards: [
    {
      cardType: {
        type: String,
        enum: ['standard', 'product', 'security', 'testimonial', 'stats', 'dashboard', 'image', 'video'],
        default: 'standard'
      },
      label: { type: String },
      heading: { type: String },
      body: { type: String },
      mediaUrl: { type: String },
      ctaText: { type: String },
      ctaLink: { type: String },
      // Optional stat values if we want specific custom stats inside a card
      stats: [
        {
          label: { type: String },
          value: { type: String },
        }
      ]
    }
  ],

  // External link
  liveUrl: {
    type: String,
    default: ''
  },

  // SEO
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },

  // Year & ordering
  year: {
    type: Number
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Auto-generate slug from name before save
ProjectSchema.pre('save', function (next) {
  if (this.isModified('name') && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
