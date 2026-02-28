import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiMenu } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

function SortableRow({ article, onEdit, onDelete, onTogglePublish }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: article._id });

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 500 }}>{article.title}</span>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>/{article.slug}</span>
          <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
            {article.featuredNewsTop && <span style={{ fontSize: '0.65rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px' }}>News Top</span>}
            {article.featuredNewsOther && <span style={{ fontSize: '0.65rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px' }}>News Grid</span>}
            {article.featuredAbout && <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>About Page</span>}
          </div>
        </div>
      </td>
      <td>
        <span className="admin-badge admin-badge-purple">{article.category}</span>
      </td>
      <td>
        <span className={`admin-badge ${article.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
          {article.status}
        </span>
      </td>
      <td className="admin-table-actions">
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onTogglePublish(article)}
          title={article.status === 'published' ? 'Unpublish' : 'Publish'}
        >
          {article.status === 'published' ? <FiEyeOff /> : <FiEye />}
        </button>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onEdit(article)}
          title="Edit"
        >
          <FiEdit2 />
        </button>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onDelete(article)}
          title="Delete"
          style={{ color: 'var(--admin-danger)' }}
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
}

export default function ArticlesManager() {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, draft

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await apiCall('/api/articles/all');
      setArticles(response?.data || []);
    } catch (error) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = articles.findIndex(a => a._id === active.id);
      const newIndex = articles.findIndex(a => a._id === over.id);
      const newArticles = arrayMove(articles, oldIndex, newIndex);
      setArticles(newArticles);

      try {
        // Backend expects { items: [{id, order}] } format
        const items = newArticles.map((a, i) => ({ id: a._id, order: i }));
        await apiCall('/api/articles/reorder', {
          method: 'PUT',
          body: JSON.stringify({ items })
        });
        toast.success('Order updated');
      } catch (error) {
        toast.error('Failed to update order');
        fetchArticles();
      }
    }
  };

  const handleEdit = (article) => {
    navigate(`/admin/articles/${article._id}`);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await apiCall(`/api/articles/${deleteModal._id}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a._id !== deleteModal._id));
      toast.success('Article deleted');
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleTogglePublish = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    
    try {
      await apiCall(`/api/articles/${article._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setArticles(articles.map(a => 
        a._id === article._id ? { ...a, status: newStatus } : a
      ));
      toast.success(`Article ${newStatus === 'published' ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error('Failed to update article status');
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading articles...</span>
      </div>
    );
  }

  return (
    <div className="admin-articles-manager">
      <div className="admin-page-header">
        <h1>Articles</h1>
        <div className="admin-page-actions">
          <Link to="/admin/articles/new" className="admin-btn admin-btn-primary">
            <FiPlus /> New Article
          </Link>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({articles.length})
        </button>
        <button 
          className={`admin-tab ${filter === 'published' ? 'active' : ''}`}
          onClick={() => setFilter('published')}
        >
          Published ({articles.filter(a => a.status === 'published').length})
        </button>
        <button 
          className={`admin-tab ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Drafts ({articles.filter(a => a.status === 'draft').length})
        </button>
      </div>

      <div className="admin-card">
        {filteredArticles.length > 0 ? (
          <div className="admin-table-wrapper">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th style={{ width: '140px' }}>Actions</th>
                  </tr>
                </thead>
                <SortableContext items={filteredArticles.map(a => a._id)} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {filteredArticles.map(article => (
                      <SortableRow
                        key={article._id}
                        article={article}
                        onEdit={handleEdit}
                        onDelete={setDeleteModal}
                        onTogglePublish={handleTogglePublish}
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
            <h3>No articles found</h3>
            <p>{filter === 'all' ? 'Create your first article to get started' : `No ${filter} articles`}</p>
            {filter === 'all' && (
              <Link to="/admin/articles/new" className="admin-btn admin-btn-primary">
                Create Article
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-body">
              <div className="admin-confirm-dialog">
                <h3>Delete Article?</h3>
                <p>Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.</p>
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
