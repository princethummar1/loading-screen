const statusStyles = {
  published: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'Published' },
  draft: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Draft' },
  archived: { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', label: 'Archived' },
  active: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'Active' },
  inactive: { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', label: 'Inactive' },
  pending: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', label: 'Pending' },
  featured: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', label: 'Featured' },
};

export default function StatusBadge({ status, size = 'medium' }) {
  const style = statusStyles[status?.toLowerCase()] || statusStyles.draft;
  
  const sizeClasses = {
    small: 'status-badge-sm',
    medium: 'status-badge-md',
    large: 'status-badge-lg',
  };

  return (
    <span 
      className={`status-badge ${sizeClasses[size]}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      <span className="status-badge-dot" style={{ backgroundColor: style.color }} />
      {style.label}
    </span>
  );
}
