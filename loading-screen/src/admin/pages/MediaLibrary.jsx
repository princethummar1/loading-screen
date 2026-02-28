import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiTrash2, FiCopy, FiImage, FiFile, FiX, FiCheck, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function MediaLibrary() {
  const { apiCall, token } = useAuth();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await apiCall('/api/media');
      setMedia(response?.data || []);
    } catch (error) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    if (files.length === 1) {
      formData.append('image', files[0]);
    } else {
      files.forEach(file => formData.append('images', file));
    }

    try {
      const endpoint = files.length === 1 ? '/api/media/upload' : '/api/media/upload-multiple';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (Array.isArray(result)) {
        setMedia([...result, ...media]);
        toast.success(`${result.length} files uploaded`);
      } else {
        setMedia([result, ...media]);
        toast.success('File uploaded');
      }
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await apiCall(`/api/media/${deleteModal._id}`, { method: 'DELETE' });
      setMedia(media.filter(m => m._id !== deleteModal._id));
      toast.success('File deleted');
      setDeleteModal(null);
      if (selectedMedia?._id === deleteModal._id) {
        setSelectedMedia(null);
      }
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isImage = (mimeType) => mimeType?.startsWith('image/');

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading media...</span>
      </div>
    );
  }

  return (
    <div className="admin-media-library">
      <div className="admin-page-header">
        <h1>Media Library</h1>
        <div className="admin-page-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FiUpload /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedMedia ? '1fr 350px' : '1fr', gap: '24px' }}>
        {/* Media Grid */}
        <div className="admin-card">
          {media.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '16px' 
            }}>
              {media.map(item => (
                <div 
                  key={item._id}
                  onClick={() => setSelectedMedia(item)}
                  style={{ 
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedMedia?._id === item._id ? '2px solid var(--admin-purple)' : '2px solid transparent',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <div style={{ 
                    aspectRatio: '1',
                    background: 'var(--admin-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isImage(item.mimeType) ? (
                      <img 
                        src={item.url}
                        alt={item.originalName}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <FiFile style={{ fontSize: '2rem', color: '#666' }} />
                    )}
                  </div>
                  <div style={{ 
                    padding: '8px',
                    background: 'var(--admin-surface)',
                    borderTop: '1px solid var(--admin-border)'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.75rem', 
                      color: 'var(--admin-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.originalName}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.6875rem', color: '#666' }}>
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <FiImage style={{ fontSize: '3rem', opacity: 0.5 }} />
              <h3>No media files</h3>
              <p>Upload images to use in your content</p>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload /> Upload Files
              </button>
            </div>
          )}
        </div>

        {/* Selected Media Details */}
        {selectedMedia && (
          <div className="admin-card" style={{ position: 'sticky', top: '20px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="admin-card-title">Details</h3>
              <button 
                className="admin-btn admin-btn-ghost admin-btn-icon"
                onClick={() => setSelectedMedia(null)}
              >
                <FiX />
              </button>
            </div>

            <div style={{ 
              aspectRatio: '16/9',
              background: 'var(--admin-bg)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {isImage(selectedMedia.mimeType) ? (
                <img 
                  src={selectedMedia.url}
                  alt={selectedMedia.originalName}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <FiFile style={{ fontSize: '3rem', color: '#666' }} />
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                Filename
              </label>
              <p style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                {selectedMedia.originalName}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                Size
              </label>
              <p style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.875rem' }}>
                {formatFileSize(selectedMedia.size)}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                Type
              </label>
              <p style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.875rem' }}>
                {selectedMedia.mimeType}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                Uploaded
              </label>
              <p style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.875rem' }}>
                {formatDate(selectedMedia.createdAt)}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                URL
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={selectedMedia.url}
                  readOnly
                  style={{ 
                    flex: 1, 
                    background: 'var(--admin-bg)', 
                    border: '1px solid var(--admin-border)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'var(--admin-text)',
                    fontSize: '0.75rem'
                  }}
                />
                <button 
                  className="admin-btn admin-btn-secondary admin-btn-icon"
                  onClick={() => copyUrl(selectedMedia.url, selectedMedia._id)}
                  title="Copy URL"
                >
                  {copiedId === selectedMedia._id ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>

            <button 
              className="admin-btn admin-btn-danger admin-btn-full"
              onClick={() => setDeleteModal(selectedMedia)}
            >
              <FiTrash2 /> Delete File
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-body">
              <div className="admin-confirm-dialog">
                <h3>Delete File?</h3>
                <p>Are you sure you want to delete "{deleteModal.originalName}"? This cannot be undone.</p>
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
