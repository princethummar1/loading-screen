const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['INSIGHTS', 'AI', 'NEWS', 'WEB DESIGN', 'RESOURCES']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  readTime: {
    type: String,
    default: '5 min'
  },
  author: {
    type: String,
    default: 'Kyurex Team'
  },
  authorImage: {
    type: String,
    default: ''
  },
  heroImage: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  featuredNewsTop: {
    type: Boolean,
    default: false
  },
  featuredNewsOther: {
    type: Boolean,
    default: false
  },
  featuredAbout: {
    type: Boolean,
    default: false
  },
  outline: [{
    id: { type: String, required: true },
    label: { type: String, required: true }
  }],
  content: [{
    type: {
      type: String,
      required: true,
      enum: ['paragraph', 'heading', 'subheading', 'quote', 'list', 'image', 'code']
    },
    text: String,
    id: String,
    outlineId: String,
    level: String,
    listType: String,
    items: [String],
    author: String,
    src: String,
    alt: String,
    caption: String,
    language: String,
    code: String
  }],
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'published'],
    index: true
  },
  order: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    ogImage: String
  }
}, { timestamps: true });

// Generate slug from title if not provided
ArticleSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
