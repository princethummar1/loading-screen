// Centralized Admin API Service
// All admin panel API calls go through here

import { config, apiUrl } from './config';

// Get auth token from localStorage — key must match AdminLogin.jsx which stores as 'kyurex_admin_token'
const getToken = () => localStorage.getItem('kyurex_admin_token');

// Base API call with auth
async function apiCall(endpoint, options = {}) {
  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ===== Auth API =====
export const authAPI = {
  login: (email, password) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verify: () => apiCall('/api/auth/verify'),
};

// ===== Articles API =====
export const articlesAPI = {
  getAll: () => apiCall('/api/articles/all'),
  getPublished: () => apiCall('/api/articles'),
  getOne: (id) => apiCall(`/api/articles/${id}`),
  create: (data) =>
    apiCall('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/api/articles/${id}`, { method: 'DELETE' }),
  reorder: (items) =>
    apiCall('/api/articles/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
};

// ===== Projects API =====
export const projectsAPI = {
  getAll: () => apiCall('/api/projects/all'),
  getPublished: () => apiCall('/api/projects'),
  getOne: (id) => apiCall(`/api/projects/${id}`),
  create: (data) =>
    apiCall('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/api/projects/${id}`, { method: 'DELETE' }),
  reorder: (items) =>
    apiCall('/api/projects/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
};

// ===== Services API =====
export const servicesAPI = {
  getAll: () => apiCall('/api/services/all'),
  getPublished: () => apiCall('/api/services'),
  getOne: (slug) => apiCall(`/api/services/${slug}`),
  create: (data) =>
    apiCall('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (slug, data) =>
    apiCall(`/api/services/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (slug) =>
    apiCall(`/api/services/${slug}`, { method: 'DELETE' }),
};

// ===== Testimonials API =====
export const testimonialsAPI = {
  getAll: () => apiCall('/api/testimonials/all'),
  getPublished: () => apiCall('/api/testimonials'),
  getOne: (id) => apiCall(`/api/testimonials/${id}`),
  create: (data) =>
    apiCall('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/api/testimonials/${id}`, { method: 'DELETE' }),
};

// ===== FAQ API =====
export const faqAPI = {
  getAll: () => apiCall('/api/faqs/all'),
  getPublished: () => apiCall('/api/faqs'),
  getOne: (id) => apiCall(`/api/faqs/${id}`),
  create: (data) =>
    apiCall('/api/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/api/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/api/faqs/${id}`, { method: 'DELETE' }),
};

// ===== Logos API =====
export const logosAPI = {
  getAll: () => apiCall('/api/logos'),
  getOne: (id) => apiCall(`/api/logos/${id}`),
  create: (data) =>
    apiCall('/api/logos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/api/logos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/api/logos/${id}`, { method: 'DELETE' }),
  reorder: (items) =>
    apiCall('/api/logos/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
};

// ===== Media API =====
export const mediaAPI = {
  getAll: () => apiCall('/api/media'),

  upload: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getToken();
    const response = await fetch(apiUrl('/api/media/upload'), {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  delete: (id) =>
    apiCall(`/api/media/${id}`, { method: 'DELETE' }),
};

// ===== Settings API =====
export const settingsAPI = {
  getAll: () => apiCall('/api/settings'),
  get: (key) => apiCall(`/api/settings/${key}`),
  update: (settings) =>
    apiCall('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// ===== Dashboard API =====
export const dashboardAPI = {
  getStats: () => apiCall('/api/dashboard/stats'),
  getRecentActivity: () => apiCall('/api/dashboard/activity'),
};

// Export all APIs
export default {
  auth: authAPI,
  articles: articlesAPI,
  projects: projectsAPI,
  services: servicesAPI,
  testimonials: testimonialsAPI,
  faq: faqAPI,
  logos: logosAPI,
  media: mediaAPI,
  settings: settingsAPI,
  dashboard: dashboardAPI,
};
