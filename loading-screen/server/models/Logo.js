const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  logoUrl: { 
    type: String, 
    required: true 
  },
  order: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Logo', LogoSchema);
