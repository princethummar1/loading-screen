import { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiLock, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

const DEFAULT_SETTINGS = [
  { key: 'siteName', label: 'Site Name', type: 'text', description: 'The name of your website' },
  { key: 'siteDescription', label: 'Site Description', type: 'textarea', description: 'Default meta description for SEO' },
  { key: 'contactEmail', label: 'Contact Email', type: 'email', description: 'Main contact email address' },
  { key: 'contactPhone', label: 'Contact Phone', type: 'text', description: 'Main contact phone number' },
  { key: 'address', label: 'Address', type: 'textarea', description: 'Business address' },
  { key: 'socialLinkedIn', label: 'LinkedIn URL', type: 'url', description: 'LinkedIn profile URL' },
  { key: 'socialTwitter', label: 'Twitter URL', type: 'url', description: 'Twitter profile URL' },
  { key: 'socialInstagram', label: 'Instagram URL', type: 'url', description: 'Instagram profile URL' },
  { key: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text', description: 'GA4 Measurement ID (G-XXXXXXXXXX)' },
  { key: 'footerText', label: 'Footer Text', type: 'text', description: 'Text displayed in footer' }
];

export default function SettingsManager() {
  const { apiCall, email } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiCall('/api/settings');
      // Data is already an object from API
      setSettings(response?.data || {});
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Backend reads req.body directly, not req.body.settings
      await apiCall('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('All fields are required');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await apiCall('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      toast.success('Password changed successfully');
      setPasswordModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="admin-settings-manager">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`admin-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social Links
        </button>
        <button 
          className={`admin-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '24px' }}>General Settings</h3>
          
          {DEFAULT_SETTINGS.filter(s => !s.key.startsWith('social')).map(setting => (
            <div key={setting.key} className="admin-form-group">
              <label>{setting.label}</label>
              {setting.type === 'textarea' ? (
                <textarea
                  value={settings[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  placeholder={setting.description}
                  rows={3}
                />
              ) : (
                <input
                  type={setting.type}
                  value={settings[setting.key] || ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  placeholder={setting.description}
                />
              )}
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                {setting.description}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* Social Links */}
      {activeTab === 'social' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '24px' }}>Social Media Links</h3>
          
          {DEFAULT_SETTINGS.filter(s => s.key.startsWith('social')).map(setting => (
            <div key={setting.key} className="admin-form-group">
              <label>{setting.label}</label>
              <input
                type="url"
                value={settings[setting.key] || ''}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                placeholder={setting.description}
              />
            </div>
          ))}

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label>Custom Social Links</label>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0' }}>
              Additional social links can be added through the site code. Contact your developer to add more platforms.
            </p>
          </div>
        </div>
      )}

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '24px' }}>Account Settings</h3>
          
          <div className="admin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email || ''}
              disabled
              style={{ opacity: 0.6 }}
            />
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              Email cannot be changed. Contact your developer to update.
            </small>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label>Password</label>
            <button 
              className="admin-btn admin-btn-secondary"
              onClick={() => setPasswordModal(true)}
            >
              <FiLock /> Change Password
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: '24px 0' }} />

          <div>
            <h4 style={{ color: 'var(--admin-text)', margin: '0 0 8px 0' }}>Session Info</h4>
            <p style={{ color: '#888', fontSize: '0.875rem', margin: 0 }}>
              You are currently logged in as <strong style={{ color: 'var(--admin-text)' }}>{email}</strong>. 
              Your session will expire after 7 days of inactivity.
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModal && (
        <div className="admin-modal-overlay" onClick={() => setPasswordModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Change Password</h3>
              <button className="admin-modal-close" onClick={() => setPasswordModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="admin-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setPasswordModal(false)}>
                Cancel
              </button>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
