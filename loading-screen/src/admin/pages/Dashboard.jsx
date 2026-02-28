import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiBriefcase, FiBook, FiMessageSquare, FiHelpCircle, FiImage, FiUsers, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../AdminApp';

export default function Dashboard() {
  const { apiCall } = useAuth();
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, drafts: 0 },
    projects: { total: 0, visible: 0 },
    services: { total: 3 },
    testimonials: { total: 0 },
    faqs: { total: 0 },
    logos: { total: 0 },
    media: { total: 0 }
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, projectsRes, testimonialsRes, faqsRes, logosRes, mediaRes] = await Promise.all([
        apiCall('/api/articles/all'),
        apiCall('/api/projects/all'),
        apiCall('/api/testimonials'),
        apiCall('/api/faqs'),
        apiCall('/api/logos'),
        apiCall('/api/media')
      ]);

      // Extract data arrays from API responses
      const articles = articlesRes?.data || [];
      const projects = projectsRes?.data || [];
      const testimonials = testimonialsRes?.data || [];
      const faqs = faqsRes?.data || [];
      const logos = logosRes?.data || [];
      const media = mediaRes?.data || [];

      setStats({
        articles: {
          total: articles.length,
          published: articles.filter(a => a.status === 'published').length,
          drafts: articles.filter(a => a.status === 'draft').length
        },
        projects: {
          total: projects.length,
          visible: projects.filter(p => p.visible).length
        },
        services: { total: 3 },
        testimonials: { total: testimonials.length },
        faqs: { total: faqs.length },
        logos: { total: logos.length },
        media: { total: media.length }
      });

      setRecentArticles(articles.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  const statCards = [
    { icon: FiFileText, label: 'Articles', value: stats.articles.total, subtext: `${stats.articles.published} published`, link: '/admin/articles', color: '#6d28d9' },
    { icon: FiBriefcase, label: 'Projects', value: stats.projects.total, subtext: `${stats.projects.visible} visible`, link: '/admin/projects', color: '#10b981' },
    { icon: FiBook, label: 'Services', value: stats.services.total, subtext: 'Static services', link: '/admin/services', color: '#f59e0b' },
    { icon: FiMessageSquare, label: 'Testimonials', value: stats.testimonials.total, subtext: 'Active quotes', link: '/admin/testimonials', color: '#ec4899' },
    { icon: FiHelpCircle, label: 'FAQs', value: stats.faqs.total, subtext: 'Questions', link: '/admin/faqs', color: '#3b82f6' },
    { icon: FiUsers, label: 'Partner Logos', value: stats.logos.total, subtext: 'Company logos', link: '/admin/logos', color: '#8b5cf6' },
    { icon: FiImage, label: 'Media Files', value: stats.media.total, subtext: 'Uploaded files', link: '/admin/media', color: '#14b8a6' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} style={{ textDecoration: 'none' }}>
            <div className="admin-stat-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div className="admin-stat-number" style={{ color: card.color }}>
                    {card.value}
                  </div>
                  <div className="admin-stat-label">{card.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{card.subtext}</div>
                </div>
                <card.icon style={{ fontSize: '1.5rem', color: card.color, opacity: 0.5 }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Articles</h2>
            <Link to="/admin/articles" className="admin-btn admin-btn-ghost admin-btn-sm">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {recentArticles.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map(article => (
                    <tr key={article._id}>
                      <td>
                        <Link to={`/admin/articles/${article._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {article.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`admin-badge ${article.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {article.status}
                        </span>
                      </td>
                      <td style={{ color: '#aaa' }}>{article.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state">
              <FiFileText />
              <h3>No articles yet</h3>
              <p>Create your first article to get started</p>
              <Link to="/admin/articles/new" className="admin-btn admin-btn-primary">
                Create Article
              </Link>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Quick Actions</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/admin/articles/new" className="admin-btn admin-btn-primary admin-btn-full" style={{ justifyContent: 'flex-start' }}>
              <FiFileText /> Create New Article
            </Link>
            <Link to="/admin/projects/new" className="admin-btn admin-btn-secondary admin-btn-full" style={{ justifyContent: 'flex-start' }}>
              <FiBriefcase /> Add New Project
            </Link>
            <Link to="/admin/media" className="admin-btn admin-btn-secondary admin-btn-full" style={{ justifyContent: 'flex-start' }}>
              <FiImage /> Upload Media
            </Link>
            <Link to="/admin/settings" className="admin-btn admin-btn-secondary admin-btn-full" style={{ justifyContent: 'flex-start' }}>
              <FiHelpCircle /> Site Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
