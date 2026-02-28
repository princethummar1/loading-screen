const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed file types configuration
const ALLOWED_TYPES = {
  'image/jpeg': { extensions: ['.jpg', '.jpeg'], magicBytes: ['ffd8ff'] },
  'image/png': { extensions: ['.png'], magicBytes: ['89504e47'] },
  'image/webp': { extensions: ['.webp'], magicBytes: ['52494646'] },
  'image/gif': { extensions: ['.gif'], magicBytes: ['47494638'] }
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp prefix
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 50);
    cb(null, `${timestamp}-${randomSuffix}-${basename}${ext}`);
  }
});

// File filter - only allow specific image types
const fileFilter = (req, file, cb) => {
  const typeConfig = ALLOWED_TYPES[file.mimetype];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!typeConfig) {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
    return;
  }
  
  // Verify extension matches mime type
  if (!typeConfig.extensions.includes(ext)) {
    cb(new Error(`File extension ${ext} does not match mime type ${file.mimetype}.`), false);
    return;
  }
  
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Export middleware functions
const uploadSingle = upload.single('image');
const uploadMultiple = upload.array('images', 5);

// Wrapper to handle multer errors gracefully
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum is 5 files.'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

module.exports = {
  uploadSingle: handleUpload(uploadSingle),
  uploadMultiple: handleUpload(uploadMultiple),
  uploadsDir
};
