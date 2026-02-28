const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['web-development', 'ai-automation', 'full-stack']
  },
  name: { 
    type: String, 
    required: true 
  },
  heroDescription: { 
    type: String, 
    required: true 
  },
  heroImage: { 
    type: String, 
    required: true 
  },
  statementText: { 
    type: String, 
    required: true 
  },
  statementImage: { 
    type: String, 
    required: true 
  },
  visionTitle: { 
    type: String, 
    required: true 
  },
  visionQuote: { 
    type: String, 
    required: true 
  },
  visionPara1: { 
    type: String, 
    required: true 
  },
  visionPara2: { 
    type: String, 
    required: true 
  },
  visionImage: { 
    type: String, 
    required: true 
  },
  approachItems: [{
    num: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  serviceCards: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
