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

  // ─── Gallery Cards (Bento Section) ───
  // Each entry can optionally replace the default card widget with a custom image
  galleryCards: [
    {
      slot: {
        type: Number, // 0–6 maps to card positions
        min: 0,
        max: 6,
      },
      useImage: {
        type: Boolean,
        default: false,
      },
      imageUrl: {
        type: String,
        default: '',
      },
      imageAlt: {
        type: String,
        default: '',
      },
    }
  ],

  // ─── Dynamic Case Study Enhancements ───
  topVideoUrl: {
    type: String,
    default: ''
  },

  // ─── Content Blocks (Flexible page sections after marquee) ───
  contentBlocks: [
    {
      type: {
        type: String,
        enum: ['text-image-right', 'image-text-right', 'text-full', 'image-full', 'quote', 'stats'],
        required: true,
      },
      order: { type: Number, default: 0 },
      bgColor: { type: String, default: '#0a0a0a' },
      textColor: { type: String, default: '#ffffff' },
      label: { type: String, default: '' },
      heading: { type: String, default: '' },
      headingSize: {
        type: String,
        enum: ['large', 'medium', 'small'],
        default: 'large',
      },
      body: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      imageAlt: { type: String, default: '' },
      imageFit: {
        type: String,
        enum: ['cover', 'contain'],
        default: 'cover',
      },
      quote: { type: String, default: '' },
      quoteAuthor: { type: String, default: '' },
      stats: [
        {
          value: { type: String },
          label: { type: String },
        }
      ],
      splitRatio: {
        type: String,
        enum: ['50-50', '60-40', '40-60'],
        default: '50-50',
      },
    }
  ],

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

  // ─── Full Bleed & Outcome Section ───
  fullBleedImages: [{
    type: String
  }],

  outcomeLabel: {
    type: String,
    default: 'OUTCOME'
  },
  outcomeDescription: {
    type: String,
    default: ''
  },
  outcomeLiveUrl: {
    type: String,
    default: ''
  },
  outcomeBgColor: {
    type: String,
    default: '#0a0a0a'
  },
  outcomeImage: {
    type: String,
    default: ''
  },
  outcomeImageAlt: {
    type: String,
    default: 'Project outcome'
  },

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
