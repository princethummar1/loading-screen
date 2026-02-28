// Admin configuration and environment variables
// Centralized config for easy management

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000,
  },
  
  // Application info
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Kyurex',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Media/Upload settings
  media: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
    uploadPath: '/uploads',
  },
  
  // Editor settings
  editor: {
    autosaveInterval: 30000, // 30 seconds
    maxContentBlocks: 50,
    maxTitleLength: 200,
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  
  // Date/time formatting
  dateFormats: {
    display: 'MMM dd, yyyy',
    input: 'yyyy-MM-dd',
    timestamp: 'MMM dd, yyyy HH:mm',
  },
};

// Helper to check if we're in development mode
export const isDev = () => config.app.environment === 'development';

// Helper to check if we're in production mode
export const isProd = () => config.app.environment === 'production';

// API URL builder
export const apiUrl = (path) => {
  const base = config.api.baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// Media URL builder
export const mediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return apiUrl(path);
};

export default config;
