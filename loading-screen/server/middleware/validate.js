/**
 * Request validation middleware
 * Provides reusable validation functions for API routes
 */

// Validation helper functions
const isString = (val) => typeof val === 'string';
const isNumber = (val) => typeof val === 'number' && !isNaN(val);
const isBoolean = (val) => typeof val === 'boolean';
const isArray = (val) => Array.isArray(val);
const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);
const isEmail = (val) => isString(val) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isSlug = (val) => isString(val) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val);
const isURL = (val) => {
  if (!isString(val)) return false;
  try {
    new URL(val);
    return true;
  } catch {
    return val.startsWith('/'); // Allow relative paths
  }
};

// Validation schema types
const types = {
  string: { check: isString, message: 'must be a string' },
  number: { check: isNumber, message: 'must be a number' },
  boolean: { check: isBoolean, message: 'must be a boolean' },
  array: { check: isArray, message: 'must be an array' },
  object: { check: isObject, message: 'must be an object' },
  email: { check: isEmail, message: 'must be a valid email' },
  slug: { check: isSlug, message: 'must be a valid slug (lowercase, no spaces)' },
  url: { check: isURL, message: 'must be a valid URL' }
};

/**
 * Validate request body against a schema
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 * 
 * Schema format:
 * {
 *   fieldName: { type: 'string', required: true, minLength: 1, maxLength: 100 },
 *   email: { type: 'email', required: true },
 *   tags: { type: 'array', items: 'string' },
 *   count: { type: 'number', min: 0, max: 100 }
 * }
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const errors = {};
    const body = req.body || {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];
      const fieldErrors = [];

      // Check required
      if (rules.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field} is required`);
        errors[field] = fieldErrors[0];
        continue;
      }

      // Skip validation if field is not provided and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Check type
      if (rules.type && types[rules.type]) {
        if (!types[rules.type].check(value)) {
          fieldErrors.push(`${field} ${types[rules.type].message}`);
        }
      }

      // String validations
      if (rules.type === 'string' && isString(value)) {
        if (rules.minLength && value.length < rules.minLength) {
          fieldErrors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          fieldErrors.push(`${field} must be at most ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          fieldErrors.push(rules.patternMessage || `${field} has an invalid format`);
        }
        if (rules.enum && !rules.enum.includes(value)) {
          fieldErrors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }

      // Number validations
      if (rules.type === 'number' && isNumber(value)) {
        if (rules.min !== undefined && value < rules.min) {
          fieldErrors.push(`${field} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          fieldErrors.push(`${field} must be at most ${rules.max}`);
        }
      }

      // Array validations
      if (rules.type === 'array' && isArray(value)) {
        if (rules.minItems && value.length < rules.minItems) {
          fieldErrors.push(`${field} must have at least ${rules.minItems} items`);
        }
        if (rules.maxItems && value.length > rules.maxItems) {
          fieldErrors.push(`${field} must have at most ${rules.maxItems} items`);
        }
        if (rules.items && types[rules.items]) {
          const invalidItems = value.filter(item => !types[rules.items].check(item));
          if (invalidItems.length > 0) {
            fieldErrors.push(`${field} items ${types[rules.items].message}`);
          }
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors[0];
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;

    if (!objectIdRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

/**
 * Sanitize request body - trim strings, remove empty strings from arrays
 */
const sanitizeBody = (req, res, next) => {
  const sanitize = (obj) => {
    if (isString(obj)) {
      return obj.trim();
    }
    if (isArray(obj)) {
      return obj.map(sanitize).filter(item => item !== '');
    }
    if (isObject(obj)) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitize(req.body);
  next();
};

// Common validation schemas
const schemas = {
  article: {
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    slug: { type: 'slug', required: true },
    category: { type: 'string', required: true },
    status: { type: 'string' },
    // heroImage is optional - not all articles have hero images
    content: { type: 'array' },
    // outline items are objects {id, label}, not strings - do not validate items type
    outline: { type: 'array' },
    featuredNewsTop: { type: 'boolean' },
    featuredNewsOther: { type: 'boolean' },
    featuredAbout: { type: 'boolean' }
  },
  project: {
    name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
    description: { type: 'string', maxLength: 1000 },
    industry: { type: 'string' },
    tags: { type: 'array', items: 'string' },
    images: { type: 'array', items: 'string' }
  },
  testimonial: {
    name: { type: 'string', required: true, minLength: 1, maxLength: 100 },
    company: { type: 'string', maxLength: 100 },
    quote: { type: 'string', required: true, minLength: 10, maxLength: 500 }
  },
  faq: {
    question: { type: 'string', required: true, minLength: 5, maxLength: 300 },
    answer: { type: 'string', required: true, minLength: 10, maxLength: 2000 }
  }
};

module.exports = {
  validateBody,
  validateObjectId,
  sanitizeBody,
  schemas
};
