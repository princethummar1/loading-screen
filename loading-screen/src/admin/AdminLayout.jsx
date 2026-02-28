import { NavLink } from 'react-router-dom';
import { useAuth } from './AdminApp';
import Breadcrumbs from './components/Breadcrumbs';
import { 
  FiGrid, 
  FiFileText, 
  FiBriefcase, 
  FiSettings, 
  FiMessageSquare, 
  FiHelpCircle, 
  FiTag, 
  FiImage, 
  FiSliders,
  FiLogOut
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const { email, logout } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/articles', icon: FiFileText, label: 'Articles' },
    { path: '/admin/projects', icon: FiBriefcase, label: 'Projects' },
    { path: '/admin/services', icon: FiSettings, label: 'Services' },
    { path: '/admin/testimonials', icon: FiMessageSquare, label: 'Testimonials' },
    { path: '/admin/faq', icon: FiHelpCircle, label: 'FAQ' },
    { path: '/admin/logos', icon: FiTag, label: 'Logo Marquee' },
    { path: '/admin/media', icon: FiImage, label: 'Media Library' },
    { path: '/admin/settings', icon: FiSliders, label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <span className="logo-text">KYUREX</span>
            <span className="logo-badge">Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => 
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="admin-nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-email">{email}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
