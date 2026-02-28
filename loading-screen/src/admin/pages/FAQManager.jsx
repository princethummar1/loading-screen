import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

function SortableItem({ faq, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: faq._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="admin-card">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <button className="admin-drag-handle" {...attributes} {...listeners}>
          <FiMenu />
        </button>
        
        <div style={{ flex: 1 }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <h4 style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.9375rem' }}>
              {faq.question}
            </h4>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                className="admin-btn admin-btn-ghost admin-btn-icon"
                onClick={(e) => { e.stopPropagation(); onEdit(faq); }}
                title="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                className="admin-btn admin-btn-ghost admin-btn-icon"
                onClick={(e) => { e.stopPropagation(); onDelete(faq); }}
                title="Delete"
                style={{ color: 'var(--admin-danger)' }}
              >
                <FiTrash2 />
              </button>
              {expanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          
          {expanded && (
            <div style={{ 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: '1px solid var(--admin-border)',
              color: '#aaa',
              fontSize: '0.875rem',
              lineHeight: 1.6
            }}>
              {faq.answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FAQManager() {
  const { apiCall } = useAuth();
  const [faqs, setFaqs] = useState([]);
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
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await apiCall('/api/faqs');
      setFaqs(response?.data || []);
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = faqs.findIndex(f => f._id === active.id);
      const newIndex = faqs.findIndex(f => f._id === over.id);
      const newFAQs = arrayMove(faqs, oldIndex, newIndex);
      setFaqs(newFAQs);

      try {
        const items = newFAQs.map((f, i) => ({ id: f._id, order: i }));
        await apiCall('/api/faqs/reorder', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
        toast.success('Order updated');
      } catch (error) {
        toast.error('Failed to update order');
        fetchFAQs();
      }
    }
  };

  const handleSave = async () => {
    if (!editModal.question?.trim() || !editModal.answer?.trim()) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      if (editModal._id) {
        // Update
        await apiCall(`/api/faqs/${editModal._id}`, {
          method: 'PUT',
          body: JSON.stringify(editModal)
        });
        setFaqs(faqs.map(f => 
          f._id === editModal._id ? { ...f, ...editModal } : f
        ));
        toast.success('FAQ updated');
      } else {
        // Create
        const created = await apiCall('/api/faqs', {
          method: 'POST',
          body: JSON.stringify(editModal)
        });
        setFaqs([...faqs, created]);
        toast.success('FAQ created');
      }
      setEditModal(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save FAQ');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await apiCall(`/api/faqs/${deleteModal._id}`, { method: 'DELETE' });
      setFaqs(faqs.filter(f => f._id !== deleteModal._id));
      toast.success('FAQ deleted');
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading FAQs...</span>
      </div>
    );
  }

  return (
    <div className="admin-faq-manager">
      <div className="admin-page-header">
        <h1>FAQs</h1>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setEditModal({ question: '', answer: '' })}
          >
            <FiPlus /> New FAQ
          </button>
        </div>
      </div>

      {faqs.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={faqs.map(f => f._id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map(faq => (
                <SortableItem
                  key={faq._id}
                  faq={faq}
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
            <h3>No FAQs yet</h3>
            <p>Add frequently asked questions</p>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={() => setEditModal({ question: '', answer: '' })}
            >
              Add FAQ
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
                {editModal._id ? 'Edit FAQ' : 'New FAQ'}
              </h3>
              <button className="admin-modal-close" onClick={() => setEditModal(null)}>
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Question *</label>
                <input
                  type="text"
                  value={editModal.question || ''}
                  onChange={(e) => setEditModal({ ...editModal, question: e.target.value })}
                  placeholder="Enter the question..."
                />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Answer *</label>
                <textarea
                  value={editModal.answer || ''}
                  onChange={(e) => setEditModal({ ...editModal, answer: e.target.value })}
                  placeholder="Enter the answer..."
                  rows={6}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditModal(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                {editModal._id ? 'Save Changes' : 'Create FAQ'}
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
                <h3>Delete FAQ?</h3>
                <p>Are you sure you want to delete this FAQ?</p>
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
