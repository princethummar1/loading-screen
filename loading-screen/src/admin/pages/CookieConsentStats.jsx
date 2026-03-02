import { useState, useEffect } from 'react';
import { FiPieChart, FiCheckCircle, FiXCircle, FiSliders } from 'react-icons/fi';
import { useAuth } from '../AdminApp';

export default function CookieConsentStats() {
  const { apiCall } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/consent/stats');
      if (response?.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch consent stats:', err);
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading consent statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-empty-state">
        <p>Error: {error}</p>
        <button className="admin-btn admin-btn-primary" onClick={fetchStats}>
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-empty-state">
        <p>No consent data available yet.</p>
      </div>
    );
  }

  const statCards = [
    { 
      icon: FiPieChart, 
      label: 'Total Consents', 
      value: stats.total.toLocaleString(), 
      subtext: 'All time', 
      color: '#6d28d9' 
    },
    { 
      icon: FiCheckCircle, 
      label: 'Accepted', 
      value: stats.breakdown.accepted.toLocaleString(), 
      subtext: stats.percentages.accepted, 
      color: '#10b981' 
    },
    { 
      icon: FiXCircle, 
      label: 'Rejected', 
      value: stats.breakdown.rejected.toLocaleString(), 
      subtext: stats.percentages.rejected, 
      color: '#ef4444' 
    },
    { 
      icon: FiSliders, 
      label: 'Custom', 
      value: stats.breakdown.custom.toLocaleString(), 
      subtext: stats.percentages.custom, 
      color: '#f59e0b' 
    },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDecisionBadgeClass = (decision) => {
    switch (decision) {
      case 'accepted': return 'admin-badge-success';
      case 'rejected': return 'admin-badge-danger';
      default: return 'admin-badge-warning';
    }
  };

  const formatPreferences = (prefs) => {
    const enabled = [];
    if (prefs.analytics) enabled.push('Analytics');
    if (prefs.marketing) enabled.push('Marketing');
    if (prefs.personalization) enabled.push('Personalization');
    return enabled.length > 0 ? enabled.join(', ') : 'Essential only';
  };

  return (
    <div className="admin-cookie-consent">
      <div className="admin-page-header">
        <h1>Cookie Consent Statistics</h1>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="admin-stat-card">
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
        ))}
      </div>

      <div className="admin-grid-2">
        {/* Category Breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Category Breakdown</h2>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Enabled</th>
                  <th>Disabled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Analytics</td>
                  <td style={{ color: '#10b981' }}>{stats.categoryStats.analytics.enabled.toLocaleString()}</td>
                  <td style={{ color: '#ef4444' }}>{stats.categoryStats.analytics.disabled.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Marketing</td>
                  <td style={{ color: '#10b981' }}>{stats.categoryStats.marketing.enabled.toLocaleString()}</td>
                  <td style={{ color: '#ef4444' }}>{stats.categoryStats.marketing.disabled.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Personalization</td>
                  <td style={{ color: '#10b981' }}>{stats.categoryStats.personalization.enabled.toLocaleString()}</td>
                  <td style={{ color: '#ef4444' }}>{stats.categoryStats.personalization.disabled.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Consents */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Consents</h2>
          </div>
          {stats.recentConsents && stats.recentConsents.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Decision</th>
                    <th>Preferences</th>
                    <th>Date</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentConsents.map((consent, index) => (
                    <tr key={consent._id || index}>
                      <td>
                        <span className={`admin-badge ${getDecisionBadgeClass(consent.decision)}`}>
                          {consent.decision}
                        </span>
                      </td>
                      <td style={{ color: '#aaa', fontSize: '0.85rem' }}>
                        {formatPreferences(consent.preferences)}
                      </td>
                      <td style={{ color: '#888', fontSize: '0.85rem' }}>
                        {formatDate(consent.createdAt)}
                      </td>
                      <td style={{ color: '#666', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {consent.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state" style={{ padding: '2rem' }}>
              <p>No recent consents recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
