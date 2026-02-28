const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  quote: { 
    type: String, 
    required: true 
  },
  authorName: { 
    type: String, 
    required: true 
  },
  authorCompany: { 
    type: String, 
    required: true 
  },
  authorImage: { 
    type: String, 
    required: true 
  },
  pages: [{ 
    type: String, 
    enum: ['contact', 'portfolio', 'services', 'about', 'home'] 
  }],
  visible: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
