/**
 * API utility functions for fetching data from the backend
 * Falls back to static data if API is unavailable
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Static data imports (fallback)
import { articlesData } from '../data/articlesData';
import { servicesData } from '../data/servicesData';

// Static fallback data for components without dedicated static files
const staticFallbacks = {
  testimonials: [
    {
      _id: 'static-1',
      quote: 'Kyurex transformed our digital presence completely. Their team delivered beyond expectations.',
      authorName: 'Sarah Chen',
      authorCompany: 'TechCorp Inc.',
      authorImage: '',
      pages: ['home'],
      visible: true
    }
  ],
  faqs: [
    { _id: 'faq-1', question: 'What services does Kyurex offer?', answer: 'We offer web development, AI automation, and full-stack product development services.' },
    { _id: 'faq-2', question: 'How do I get started?', answer: 'Contact us through our contact form or email us directly to discuss your project needs.' },
    { _id: 'faq-3', question: 'What is your typical project timeline?', answer: 'Project timelines vary based on scope, but most projects are completed within 4-12 weeks.' }
  ],
  logos: [
    { _id: 'logo-1', name: 'Partner 1', logoUrl: '', url: '' },
    { _id: 'logo-2', name: 'Partner 2', logoUrl: '', url: '' }
  ]
};

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API fetch failed for ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Fetch all published articles
 */
export async function getArticles() {
  try {
    const response = await fetchAPI('/api/articles');
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static articles fallback');
    return articlesData.filter(a => a.status === 'published' || !a.status);
  }
}

/**
 * Fetch single article by slug
 */
export async function getArticle(slug) {
  try {
    const response = await fetchAPI(`/api/articles/${slug}`);
    if (response && response.data) {
      console.log(response.data);
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static article fallback');
    return articlesData.find(a => a.slug === slug) || null;
  }
}

/**
 * Fetch all visible projects
 */
export async function getProjects() {
  try {
    const response = await fetchAPI('/api/projects');
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable for projects');
    return [];
  }
}

/**
 * Fetch single project by ID
 */
export async function getProject(id) {
  try {
    const response = await fetchAPI(`/api/projects/${id}`);
    return response?.data || null;
  } catch (error) {
    console.warn('API unavailable for project');
    return null;
  }
}

/**
 * Fetch all services
 */
export async function getServices() {
  try {
    const response = await fetchAPI('/api/services');
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static services fallback');
    return Object.values(servicesData);
  }
}

/**
 * Fetch single service by slug
 */
export async function getService(slug) {
  try {
    const response = await fetchAPI(`/api/services/${slug}`);
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static service fallback');
    return servicesData[slug] || null;
  }
}

/**
 * Fetch testimonials, optionally filtered by page
 */
export async function getTestimonials(page = null) {
  try {
    let endpoint = '/api/testimonials';
    if (page) {
      endpoint += `?page=${page}`;
    }
    const response = await fetchAPI(endpoint);
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static testimonials fallback');
    let fallback = staticFallbacks.testimonials;
    if (page) {
      fallback = fallback.filter(t => t.pages?.includes(page));
    }
    return fallback;
  }
}

/**
 * Fetch all FAQs
 */
export async function getFAQs() {
  try {
    const response = await fetchAPI('/api/faqs');
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static FAQs fallback');
    return staticFallbacks.faqs;
  }
}

/**
 * Fetch all partner logos
 */
export async function getLogos() {
  try {
    const response = await fetchAPI('/api/logos');
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using static logos fallback');
    return staticFallbacks.logos;
  }
}

/**
 * Fetch site settings
 */
export async function getSettings() {
  try {
    const data = await fetchAPI('/api/settings');
    if (data && data.success && data.data) {
      return data.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable, using default settings');
    return {
      siteName: 'Kyurex',
      siteDescription: 'Global technology consulting company',
      contactEmail: 'hello@kyurex.com',
      socialLinkedIn: '',
      socialTwitter: '',
      socialInstagram: ''
    };
  }
}

/**
 * Fetch single setting by key
 */
export async function getSetting(key) {
  try {
    const data = await fetchAPI(`/api/settings/${key}`);
    if (data && data.success) {
      return data.value;
    }
    return null;
  } catch (error) {
    console.warn(`API unavailable for setting: ${key}`);
    return null;
  }
}

/**
 * Fetch related articles for a given article slug
 */
export async function getRelatedArticles(slug, limit = 3) {
  try {
    const response = await fetchAPI(`/api/articles/${slug}/related?limit=${limit}`);
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.warn('API unavailable for related articles, using static fallback');
    // Fallback: get articles from the same category
    const article = articlesData.find(a => a.slug === slug);
    if (article && article.category) {
      return articlesData
        .filter(a => a.slug !== slug && a.category === article.category)
        .slice(0, limit);
    }
    // If no category match, return random articles
    return articlesData.filter(a => a.slug !== slug).slice(0, limit);
  }
}

export default {
  getArticles,
  getArticle,
  getRelatedArticles,
  getProjects,
  getProject,
  getServices,
  getService,
  getTestimonials,
  getFAQs,
  getLogos,
  getSettings,
  getSetting
};
