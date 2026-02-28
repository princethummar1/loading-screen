import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const routeLabels = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'articles': 'Articles',
  'projects': 'Projects',
  'services': 'Services',
  'testimonials': 'Testimonials',
  'faq': 'FAQ',
  'logos': 'Logo Marquee',
  'media': 'Media Library',
  'settings': 'Settings',
  'new': 'New',
  'edit': 'Edit',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on dashboard (home)
  if (pathnames.length <= 2 && pathnames[1] === 'dashboard') {
    return null;
  }

  return (
    <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard" className="breadcrumb-link home">
            <FiHome size={14} />
          </Link>
        </li>
        
        {pathnames.slice(1).map((value, index) => {
          const to = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === pathnames.slice(1).length - 1;
          const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to} className="breadcrumb-item">
              <FiChevronRight size={12} className="breadcrumb-separator" />
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={to} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
