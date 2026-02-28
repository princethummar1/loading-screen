import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SiteDataContext = createContext(null);

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider');
  }
  return context;
}

export function SiteDataProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [logos, setLogos] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSiteData();
  }, []);

  async function loadSiteData() {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        articlesData,
        projectsData,
        servicesData,
        testimonialsData,
        faqsData,
        logosData,
        settingsData
      ] = await Promise.all([
        api.getArticles(),
        api.getProjects(),
        api.getServices(),
        api.getTestimonials(),
        api.getFAQs(),
        api.getLogos(),
        api.getSettings()
      ]);

      setArticles(articlesData);
      setProjects(projectsData);
      setServices(servicesData);
      setTestimonials(testimonialsData);
      setFaqs(faqsData);
      setLogos(logosData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load site data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Refresh specific data type
  async function refresh(type) {
    try {
      switch (type) {
        case 'articles':
          setArticles(await api.getArticles());
          break;
        case 'projects':
          setProjects(await api.getProjects());
          break;
        case 'services':
          setServices(await api.getServices());
          break;
        case 'testimonials':
          setTestimonials(await api.getTestimonials());
          break;
        case 'faqs':
          setFaqs(await api.getFAQs());
          break;
        case 'logos':
          setLogos(await api.getLogos());
          break;
        case 'settings':
          setSettings(await api.getSettings());
          break;
        default:
          await loadSiteData();
      }
    } catch (err) {
      console.error(`Failed to refresh ${type}:`, err);
    }
  }

  const value = {
    // Data
    articles,
    projects,
    services,
    testimonials,
    faqs,
    logos,
    settings,
    
    // State
    loading,
    error,
    
    // Methods
    refresh,
    reloadAll: loadSiteData,

    // Helper getters
    getArticle: (slug) => articles.find(a => a.slug === slug),
    getService: (slug) => services.find(s => s.slug === slug),
    getProject: (id) => projects.find(p => p._id === id),
    getTestimonialsForPage: (page) => testimonials.filter(t => t.pages?.includes(page)),
    getSetting: (key, defaultValue = null) => settings[key] ?? defaultValue
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export default SiteDataContext;
