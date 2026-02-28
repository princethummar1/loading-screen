import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiBook, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

const SERVICE_SLUGS = {
  'web-development': {
    icon: '🌐',
    description: 'High-performance web platforms'
  },
  'ai-automation': {
    icon: '🤖',
    description: 'Intelligent automation systems'
  },
  'full-stack': {
    icon: '⚡',
    description: 'Complete digital products'
  }
};

export default function ServicesManager() {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await apiCall('/api/services/all');
      setServices(response?.data || []);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    navigate(`/admin/services/${service.slug}`);
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading services...</span>
      </div>
    );
  }

  return (
    <div className="admin-services-manager">
      <div className="admin-page-header">
        <div>
          <h1>Services</h1>
          <p style={{ color: '#888', margin: '8px 0 0 0', fontSize: '0.875rem' }}>
            Manage the three core service offerings. Services cannot be added or deleted.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {services.length > 0 ? (
          services.map(service => (
            <div key={service._id} className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    background: 'var(--admin-purple-bg)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {SERVICE_SLUGS[service.slug]?.icon || '📋'}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--admin-text)' }}>
                      {service.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '0.875rem' }}>
                      /{service.slug}
                    </p>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '0.9375rem' }}>
                      {service.heroDescription?.slice(0, 150) || 'No description set...'}
                      {service.heroDescription?.length > 150 ? '...' : ''}
                    </p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                      <span className="admin-badge admin-badge-purple">
                        {service.serviceCards?.length || 0} Service Cards
                      </span>
                      <span className="admin-badge admin-badge-purple">
                        {service.approachItems?.length || 0} Approach Items
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => handleEdit(service)}
                >
                  <FiEdit2 /> Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-card">
            <div className="admin-empty-state">
              <FiBook style={{ fontSize: '3rem', opacity: 0.5 }} />
              <h3>No services found</h3>
              <p>Run the database seeder to initialize services</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Service Structure</h3>
        <p style={{ color: '#888', margin: '0 0 16px 0', fontSize: '0.875rem' }}>
          Each service page contains the following editable sections:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Hero Section', desc: 'Name and hero description' },
            { label: 'Statement Section', desc: 'Main statement text' },
            { label: 'Vision Section', desc: 'Title and description' },
            { label: 'Approach Items', desc: 'List of approach steps' },
            { label: 'Service Cards', desc: 'Detailed service offerings' }
          ].map((item, i) => (
            <div key={i} style={{ 
              background: 'var(--admin-bg)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid var(--admin-border)'
            }}>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--admin-text)', fontSize: '0.9375rem' }}>
                {item.label}
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.8125rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
