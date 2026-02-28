import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

function SortableLogo({ logo, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: logo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <button className="admin-drag-handle" {...attributes} {...listeners}>
          <FiMenu />
        </button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => onEdit(logo)}
            title="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => onDelete(logo)}
            title="Delete"
            style={{ color: 'var(--admin-danger)' }}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      <div style={{ 
        background: 'var(--admin-bg)', 
        borderRadius: '8px', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        marginBottom: '12px'
      }}>
        {logo.logoUrl ? (
          <img 
            src={logo.logoUrl}
            alt={logo.name}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '60px',
              objectFit: 'contain',
              filter: 'invert(1)'
            }}
          />
        ) : (
          <span style={{ color: '#666' }}>No logo image</span>
        )}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 4px 0', color: 'var(--admin-text)', fontSize: '0.875rem' }}>
          {logo.name}
        </h4>
        {logo.url && (
          <a 
            href={logo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--admin-purple-light)', 
              fontSize: '0.75rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            Visit <FiExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function LogosManager() {
  const { apiCall } = useAuth();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await apiCall('/api/logos');
      setLogos(response?.data || []);
    } catch (error) {
      toast.error('Failed to load logos');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = logos.findIndex(l => l._id === active.id);
      const newIndex = logos.findIndex(l => l._id === over.id);
      const newLogos = arrayMove(logos, oldIndex, newIndex);
      setLogos(newLogos);

      try {
        const items = newLogos.map((l, i) => ({ id: l._id, order: i }));
        await apiCall('/api/logos/reorder', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
        toast.success('Order updated');
      } catch (error) {
        toast.error('Failed to update order');
        fetchLogos();
      }
    }
  };

  const handleSave = async () => {
    if (!editModal.name?.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      if (editModal._id) {
        // Update
        await apiCall(`/api/logos/${editModal._id}`, {
          method: 'PUT',
          body: JSON.stringify(editModal)
        });
        setLogos(logos.map(l => 
          l._id === editModal._id ? { ...l, ...editModal } : l
        ));
        toast.success('Logo updated');
      } else {
        // Create
        const created = await apiCall('/api/logos', {
          method: 'POST',
          body: JSON.stringify(editModal)
        });
        setLogos([...logos, created]);
        toast.success('Logo added');
      }
      setEditModal(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save logo');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await apiCall(`/api/logos/${deleteModal._id}`, { method: 'DELETE' });
      setLogos(logos.filter(l => l._id !== deleteModal._id));
      toast.success('Logo deleted');
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete logo');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading logos...</span>
      </div>
    );
  }

  return (
    <div className="admin-logos-manager">
      <div className="admin-page-header">
        <h1>Partner Logos</h1>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setEditModal({ name: '', url: '', logoUrl: '' })}
          >
            <FiPlus /> Add Logo
          </button>
        </div>
      </div>

      {logos.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={logos.map(l => l._id)} strategy={rectSortingStrategy}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              {logos.map(logo => (
                <SortableLogo
                  key={logo._id}
                  logo={logo}
                  onEdit={setEditModal}
                  onDelete={setDeleteModal}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="admin-card">
          <div className="admin-empty-state">
            <FiEdit2 style={{ fontSize: '3rem', opacity: 0.5 }} />
            <h3>No partner logos yet</h3>
            <p>Add logos to display in the marquee</p>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={() => setEditModal({ name: '', url: '', logoUrl: '' })}
            >
              Add Logo
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="admin-modal-overlay" onClick={() => setEditModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editModal._id ? 'Edit Logo' : 'Add Logo'}
              </h3>
              <button className="admin-modal-close" onClick={() => setEditModal(null)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={editModal.name || ''}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="admin-form-group">
                <label>Logo Image URL</label>
                <input
                  type="text"
                  value={editModal.logoUrl || ''}
                  onChange={(e) => setEditModal({ ...editModal, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
                {editModal.logoUrl && (
                  <div style={{ 
                    marginTop: '12px', 
                    background: 'var(--admin-bg)', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <img 
                      src={editModal.logoUrl} 
                      alt="Preview"
                      style={{ 
                        maxWidth: '150px', 
                        maxHeight: '50px',
                        filter: 'invert(1)'
                      }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Website URL</label>
                <input
                  type="text"
                  value={editModal.url || ''}
                  onChange={(e) => setEditModal({ ...editModal, url: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditModal(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                {editModal._id ? 'Save Changes' : 'Add Logo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-body">
              <div className="admin-confirm-dialog">
                <h3>Delete Logo?</h3>
                <p>Are you sure you want to remove {deleteModal.name}?</p>
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
