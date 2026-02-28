import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiMenu, FiX } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

const PAGES_OPTIONS = ['home', 'about', 'services', 'portfolio'];

function SortableCard({ testimonial, onEdit, onDelete, onToggleVisibility }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: testimonial._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="admin-card" key={testimonial._id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
          <button className="admin-drag-handle" {...attributes} {...listeners}>
            <FiMenu />
          </button>
          {testimonial.authorImage ? (
            <img 
              src={testimonial.authorImage}
              alt={testimonial.authorName}
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: 'var(--admin-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              flexShrink: 0
            }}>
              {testimonial.authorName?.charAt(0) || '?'}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: '0 0 8px 0', 
              color: 'var(--admin-text)', 
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              fontStyle: 'italic'
            }}>
              "{testimonial.quote?.slice(0, 150)}
              {testimonial.quote?.length > 150 ? '...' : ''}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--admin-text)', fontWeight: 500, fontSize: '0.875rem' }}>
                {testimonial.authorName}
              </span>
              {testimonial.authorCompany && (
                <span style={{ color: '#888', fontSize: '0.875rem' }}>
                  — {testimonial.authorCompany}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {(testimonial.pages || []).map((page, i) => (
                <span key={i} className="admin-badge admin-badge-purple">{page}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => onToggleVisibility(testimonial)}
            title={testimonial.visible ? 'Hide' : 'Show'}
          >
            {testimonial.visible ? <FiEyeOff /> : <FiEye />}
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => onEdit(testimonial)}
            title="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => onDelete(testimonial)}
            title="Delete"
            style={{ color: 'var(--admin-danger)' }}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsManager() {
  const { apiCall } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
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
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await apiCall('/api/testimonials/all');
      setTestimonials(response?.data || []);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = testimonials.findIndex(t => t._id === active.id);
      const newIndex = testimonials.findIndex(t => t._id === over.id);
      const newTestimonials = arrayMove(testimonials, oldIndex, newIndex);
      setTestimonials(newTestimonials);

      try {
        const items = newTestimonials.map((t, i) => ({ id: t._id, order: i }));
        await apiCall('/api/testimonials/reorder', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
        toast.success('Order updated');
      } catch (error) {
        toast.error('Failed to update order');
        fetchTestimonials();
      }
    }
  };

  const handleSave = async () => {
    if (!editModal.quote?.trim() || !editModal.authorName?.trim()) {
      toast.error('Quote and author name are required');
      return;
    }

    try {
      if (editModal._id) {
        // Update
        await apiCall(`/api/testimonials/${editModal._id}`, {
          method: 'PUT',
          body: JSON.stringify(editModal)
        });
        setTestimonials(testimonials.map(t => 
          t._id === editModal._id ? { ...t, ...editModal } : t
        ));
        toast.success('Testimonial updated');
      } else {
        // Create
        const created = await apiCall('/api/testimonials', {
          method: 'POST',
          body: JSON.stringify(editModal)
        });
        setTestimonials([...testimonials, created]);
        toast.success('Testimonial created');
      }
      setEditModal(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await apiCall(`/api/testimonials/${deleteModal._id}`, { method: 'DELETE' });
      setTestimonials(testimonials.filter(t => t._id !== deleteModal._id));
      toast.success('Testimonial deleted');
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleToggleVisibility = async (testimonial) => {
    try {
      await apiCall(`/api/testimonials/${testimonial._id}`, {
        method: 'PUT',
        body: JSON.stringify({ visible: !testimonial.visible })
      });
      setTestimonials(testimonials.map(t => 
        t._id === testimonial._id ? { ...t, visible: !t.visible } : t
      ));
      toast.success(`Testimonial ${!testimonial.visible ? 'visible' : 'hidden'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const togglePage = (page) => {
    const pages = editModal.pages || [];
    if (pages.includes(page)) {
      setEditModal({ ...editModal, pages: pages.filter(p => p !== page) });
    } else {
      setEditModal({ ...editModal, pages: [...pages, page] });
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading testimonials...</span>
      </div>
    );
  }

  return (
    <div className="admin-testimonials-manager">
      <div className="admin-page-header">
        <h1>Testimonials</h1>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setEditModal({ 
              quote: '', 
              authorName: '', 
              authorCompany: '', 
              authorImage: '',
              pages: ['home'],
              visible: true
            })}
          >
            <FiPlus /> New Testimonial
          </button>
        </div>
      </div>

      {testimonials.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={testimonials.map(t => t._id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {testimonials.map(testimonial => (
                <SortableCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  onEdit={setEditModal}
                  onDelete={setDeleteModal}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="admin-card">
          <div className="admin-empty-state">
            <FiEdit2 style={{ fontSize: '3rem', opacity: 0.5 }} />
            <h3>No testimonials yet</h3>
            <p>Add testimonials from your clients</p>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={() => setEditModal({ 
                quote: '', 
                authorName: '', 
                authorCompany: '', 
                authorImage: '',
                pages: ['home'],
                visible: true
              })}
            >
              Add Testimonial
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
                {editModal._id ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button className="admin-modal-close" onClick={() => setEditModal(null)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Quote *</label>
                <textarea
                  value={editModal.quote || ''}
                  onChange={(e) => setEditModal({ ...editModal, quote: e.target.value })}
                  placeholder="Enter testimonial quote..."
                  rows={4}
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Author Name *</label>
                  <input
                    type="text"
                    value={editModal.authorName || ''}
                    onChange={(e) => setEditModal({ ...editModal, authorName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={editModal.authorCompany || ''}
                    onChange={(e) => setEditModal({ ...editModal, authorCompany: e.target.value })}
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Author Image URL</label>
                <input
                  type="text"
                  value={editModal.authorImage || ''}
                  onChange={(e) => setEditModal({ ...editModal, authorImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-form-group">
                <label>Show on Pages</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PAGES_OPTIONS.map(page => (
                    <button
                      key={page}
                      type="button"
                      className={`admin-btn admin-btn-sm ${(editModal.pages || []).includes(page) ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                      onClick={() => togglePage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="admin-toggle">
                    <input
                      type="checkbox"
                      checked={editModal.visible !== false}
                      onChange={(e) => setEditModal({ ...editModal, visible: e.target.checked })}
                    />
                    <span className="admin-toggle-slider"></span>
                  </div>
                  Visible
                </label>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditModal(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                {editModal._id ? 'Save Changes' : 'Create Testimonial'}
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
                <h3>Delete Testimonial?</h3>
                <p>Are you sure you want to delete this testimonial from {deleteModal.authorName}?</p>
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
