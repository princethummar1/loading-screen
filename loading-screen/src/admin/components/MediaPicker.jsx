import { useState, useEffect } from 'react';
import { FiX, FiUpload, FiSearch, FiCheck, FiImage, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../AdminApp';
import toast from 'react-hot-toast';
import './MediaPicker.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MediaPicker({ isOpen, onClose, onSelect, multiple = false }) {
  const { apiCall } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedItems([]);
    }
  }, [isOpen]);

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

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    // Support multiple files
    Array.from(files).forEach(file => {
      formData.append('image', file);
    });

    try {
      // Use the correct token key — must match AdminLogin.jsx which stores as 'kyurex_admin_token'
      const token = localStorage.getItem('kyurex_admin_token');
      const response = await fetch(`${API_BASE}/api/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      toast.success('Image uploaded');
      
      // Refresh media list
      await fetchMedia();
      
      // Auto-select the newly uploaded image
      if (result.data) {
        const newItem = result.data;
        if (multiple) {
          setSelectedItems(prev => [...prev, newItem]);
        } else {
          setSelectedItems([newItem]);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    handleUpload(e.target.files);
    e.target.value = ''; // Reset input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const toggleSelection = (item) => {
    if (multiple) {
      setSelectedItems(prev => {
        const exists = prev.find(i => i._id === item._id);
        if (exists) {
          return prev.filter(i => i._id !== item._id);
        }
        return [...prev, item];
      });
    } else {
      setSelectedItems([item]);
    }
  };

  const isSelected = (item) => {
    return selectedItems.some(i => i._id === item._id);
  };

  const handleConfirm = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (multiple) {
      onSelect(selectedItems.map(item => `${API_BASE}/uploads/${item.filename}`));
    } else {
      onSelect(`${API_BASE}/uploads/${selectedItems[0].filename}`);
    }
    onClose();
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    
    if (!confirm('Delete this image? This cannot be undone.')) return;

    try {
      await apiCall(`/api/media/${item._id}`, { method: 'DELETE' });
      toast.success('Image deleted');
      setMedia(prev => prev.filter(m => m._id !== item._id));
      setSelectedItems(prev => prev.filter(i => i._id !== item._id));
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const filteredMedia = media.filter(item => 
    (item.originalName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="media-picker-overlay" onClick={onClose}>
      <div className="media-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="media-picker-header">
          <h2>Select Media</h2>
          <button className="media-picker-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="media-picker-toolbar">
          <div className="media-picker-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <label className="media-picker-upload-btn">
            <FiUpload />
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div 
          className={`media-picker-dropzone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading && (
            <div className="media-picker-uploading">
              <div className="admin-loading-spinner"></div>
              <span>Uploading...</span>
            </div>
          )}

          {loading ? (
            <div className="media-picker-loading">
              <div className="admin-loading-spinner"></div>
              <span>Loading media...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="media-picker-empty">
              <FiImage />
              <p>{searchTerm ? 'No images match your search' : 'No images uploaded yet'}</p>
              <p>Drag & drop images here or click Upload</p>
            </div>
          ) : (
            <div className="media-picker-grid">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  className={`media-picker-item ${isSelected(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item)}
                >
                  <img
                    src={`${API_BASE}/uploads/${item.filename}`}
                    alt={item.originalName || item.filename}
                  />
                  <div className="media-picker-item-overlay">
                    {isSelected(item) && (
                      <div className="media-picker-check">
                        <FiCheck />
                      </div>
                    )}
                    <button
                      className="media-picker-delete"
                      onClick={(e) => handleDelete(item, e)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="media-picker-item-name">
                    {item.originalName || item.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="media-picker-footer">
          <span className="media-picker-selected-count">
            {selectedItems.length} selected
          </span>
          <div className="media-picker-actions">
            <button className="admin-btn admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="admin-btn admin-btn-primary" 
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              <FiCheck /> Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
