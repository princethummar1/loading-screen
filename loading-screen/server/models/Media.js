const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String, 
    required: true 
  },
  mimeType: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: String,
  mediumUrl: String,
  largeUrl: String,
  width: Number,
  height: Number,
  cloudinaryId: String
}, { timestamps: true });

// Virtual for formatted size
MediaSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
});

// Ensure virtuals are included in JSON
MediaSchema.set('toJSON', { virtuals: true });
MediaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Media', MediaSchema);
