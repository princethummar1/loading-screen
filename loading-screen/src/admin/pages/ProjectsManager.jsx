import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiMenu, FiStar } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

function SortableRow({ project, onEdit, onDelete, onToggleVisibility, onToggleFeatured }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? 'var(--admin-surface-hover)' : undefined
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <button className="admin-drag-handle" {...attributes} {...listeners}>
          <FiMenu />
        </button>
      </td>
      <td>
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt={project.name}
            className="admin-image-preview"
          />
        ) : (
          <div className="admin-image-preview" style={{ background: project.accent || '#6d28d9' }} />
        )}
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500 }}>{project.name}</span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              background: project.type === 'case-study' ? 'rgba(255,77,46,0.15)' : 'rgba(109,40,217,0.15)',
              color: project.type === 'case-study' ? '#FF4D2E' : '#a78bfa',
              whiteSpace: 'nowrap',
            }}>
              {project.type === 'case-study' ? 'Selected Work' : 'Project'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>{project.industry}</span>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {(project.tags || []).slice(0, 3).map((tag, i) => (
            <span key={i} className="admin-badge admin-badge-purple">{tag}</span>
          ))}
          {(project.tags?.length || 0) > 3 && (
            <span className="admin-badge" style={{ background: '#333' }}>+{project.tags.length - 3}</span>
          )}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className={`admin-badge ${project.visible ? 'admin-badge-success' : 'admin-badge-warning'}`}>
            {project.visible ? 'Visible' : 'Hidden'}
          </span>
          {project.featured && (
            <span className="admin-badge" style={{ background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <FiStar size={10} /> Featured
            </span>
          )}
        </div>
      </td>
      <td className="admin-table-actions">
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onToggleFeatured(project)}
          title={project.featured ? 'Remove from homepage' : 'Feature on homepage'}
          style={{ color: project.featured ? '#7c3aed' : undefined }}
        >
          <FiStar />
        </button>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onToggleVisibility(project)}
          title={project.visible ? 'Hide' : 'Show'}
        >
          {project.visible ? <FiEyeOff /> : <FiEye />}
        </button>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onEdit(project)}
          title="Edit"
        >
          <FiEdit2 />
        </button>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onDelete(project)}
          title="Delete"
          style={{ color: 'var(--admin-danger)' }}
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
}

export default function ProjectsManager() {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiCall('/api/projects/all');
      setProjects(response?.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p._id === active.id);
      const newIndex = projects.findIndex(p => p._id === over.id);
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      try {
        const items = newProjects.map((p, i) => ({ id: p._id, order: i }));
        await apiCall('/api/projects/reorder', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
        toast.success('Order updated');
      } catch (error) {
        toast.error('Failed to update order');
        fetchProjects();
      }
    }
  };

  const handleEdit = (project) => {
    navigate(`/admin/projects/${project._id}`);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      await apiCall(`/api/projects/${deleteModal._id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p._id !== deleteModal._id));
      toast.success('Project deleted');
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleToggleVisibility = async (project) => {
    try {
      await apiCall(`/api/projects/${project._id}/visibility`, { method: 'PUT' });
      setProjects(projects.map(p =>
        p._id === project._id ? { ...p, visible: !p.visible } : p
      ));
      toast.success(`Project ${!project.visible ? 'visible' : 'hidden'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      await apiCall(`/api/projects/${project._id}/featured`, { method: 'PUT' });
      setProjects(projects.map(p =>
        p._id === project._id ? { ...p, featured: !p.featured } : p
      ));
      toast.success(project.featured ? 'Removed from homepage' : 'Featured on homepage ⭐');
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading projects...</span>
      </div>
    );
  }

  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <div className="admin-projects-manager">
      <div className="admin-page-header">
        <div>
          <h1>Projects</h1>
          {featuredCount > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#7c3aed' }}>
              ⭐ {featuredCount} project{featuredCount > 1 ? 's' : ''} featured on homepage
            </p>
          )}
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/projects/new" className="admin-btn admin-btn-primary">
            <FiPlus /> New Project
          </Link>
        </div>
      </div>

      {/* Featured info banner */}
      <div className="admin-card" style={{ padding: '12px 20px', marginBottom: '20px', borderLeft: '3px solid #7c3aed', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FiStar style={{ color: '#7c3aed', flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem', color: '#aaa' }}>
          Click the <strong style={{ color: '#fff' }}>⭐ star icon</strong> on any project to feature it on the homepage portfolio section. You can feature multiple projects.
        </span>
      </div>

      <div className="admin-card">
        {projects.length > 0 ? (
          <div className="admin-table-wrapper">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Name</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th style={{ width: '160px' }}>Actions</th>
                  </tr>
                </thead>
                <SortableContext items={projects.map(p => p._id)} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {projects.map(project => (
                      <SortableRow
                        key={project._id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={setDeleteModal}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        ) : (
          <div className="admin-empty-state">
            <FiEdit2 style={{ fontSize: '3rem', opacity: 0.5 }} />
            <h3>No projects yet</h3>
            <p>Create your first project to showcase your work</p>
            <Link to="/admin/projects/new" className="admin-btn admin-btn-primary">
              Create Project
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-body">
              <div className="admin-confirm-dialog">
                <h3>Delete Project?</h3>
                <p>Are you sure you want to delete "{deleteModal.name}"? This action cannot be undone.</p>
                <div className="admin-confirm-actions">
                  <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteModal(null)}>
                    Cancel
                  </button>
                  <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
