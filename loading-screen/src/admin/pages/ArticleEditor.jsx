import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiMenu, FiImage, FiType, FiList, FiCode } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';
import MediaPicker from '../components/MediaPicker';

const BLOCK_TYPES = [
  { type: 'heading', label: 'Heading', icon: FiType },
  { type: 'paragraph', label: 'Paragraph', icon: FiType },
  { type: 'image', label: 'Image', icon: FiImage },
  { type: 'list', label: 'List', icon: FiList },
  { type: 'quote', label: 'Quote', icon: FiCode },
  { type: 'code', label: 'Code', icon: FiCode }
];

const CATEGORIES = [
  'INSIGHTS',
  'AI',
  'NEWS',
  'WEB DESIGN',
  'RESOURCES'
];

function ContentBlock({ block, index, onUpdate, onRemove, outlineOptions = [] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleChange = (field, value) => {
    onUpdate(index, { ...block, [field]: value });
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        return (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div className="admin-form-group" style={{ width: '100px', marginBottom: 0 }}>
                <select
                  value={block.level || 'h2'}
                  onChange={(e) => handleChange('level', e.target.value)}
                >
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                  <option value="h4">H4</option>
                </select>
              </div>
              <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                <select
                  value={block.outlineId || ''}
                  onChange={(e) => handleChange('outlineId', e.target.value)}
                >
                  <option value="">-- No Outline Link --</option>
                  {outlineOptions.map(o => (
                    <option key={o.id} value={o.id}>Link to Outline: {o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <input
              type="text"
              value={block.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Enter heading text..."
              className="admin-form-group"
            />
          </>
        );

      case 'paragraph':
        return (
          <textarea
            value={block.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="Enter paragraph text..."
            rows={4}
          />
        );

      case 'image':
        return (
          <>
            <input
              type="text"
              value={block.src || ''}
              onChange={(e) => handleChange('src', e.target.value)}
              placeholder="Image URL..."
              style={{ marginBottom: '8px' }}
            />
            <input
              type="text"
              value={block.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
              placeholder="Alt text..."
              style={{ marginBottom: '8px' }}
            />
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => handleChange('caption', e.target.value)}
              placeholder="Caption (optional)..."
            />
          </>
        );

      case 'list':
        return (
          <>
            <div className="admin-form-group" style={{ marginBottom: '12px' }}>
              <select
                value={block.listType || 'unordered'}
                onChange={(e) => handleChange('listType', e.target.value)}
                style={{ width: '120px' }}
              >
                <option value="unordered">Bullet List</option>
                <option value="ordered">Numbered List</option>
              </select>
            </div>
            <textarea
              value={(block.items || []).join('\n')}
              onChange={(e) => handleChange('items', e.target.value.split('\n'))}
              placeholder="Enter each list item on a new line..."
              rows={4}
            />
          </>
        );

      case 'quote':
        return (
          <>
            <textarea
              value={block.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Enter quote text..."
              rows={3}
              style={{ marginBottom: '8px' }}
            />
            <input
              type="text"
              value={block.author || ''}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Quote author (optional)..."
            />
          </>
        );

      case 'code':
        return (
          <>
            <input
              type="text"
              value={block.language || ''}
              onChange={(e) => handleChange('language', e.target.value)}
              placeholder="Language (e.g., javascript, python)..."
              style={{ marginBottom: '8px' }}
            />
            <textarea
              value={block.code || ''}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Enter code..."
              rows={6}
              style={{ fontFamily: 'monospace' }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="admin-content-block">
      <div className="admin-content-block-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="admin-drag-handle" {...attributes} {...listeners}>
            <FiMenu />
          </button>
          <span className="admin-content-block-type">{block.type}</span>
        </div>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onRemove(index)}
          style={{ color: 'var(--admin-danger)' }}
        >
          <FiTrash2 />
        </button>
      </div>
      <div className="admin-form-group" style={{ marginBottom: 0 }}>
        {renderBlockContent()}
      </div>
    </div>
  );
}

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  const [article, setArticle] = useState({
    title: '',
    slug: '',
    category: CATEGORIES[0],
    author: '',
    authorImage: '',
    readTime: '5 min',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    heroImage: '',
    content: [],
    outline: [],
    featuredNewsTop: false,
    featuredNewsOther: false,
    featuredAbout: false,
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: ''
    }
  });

  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'hero' or block index

  // Clear error when field changes
  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Calculate word count from all content blocks
  const getWordCount = () => {
    let text = article.title + ' ';
    article.content.forEach(block => {
      if (block.text) text += block.text + ' ';
      if (block.code) text += block.code + ' ';
      if (block.items) text += block.items.join(' ') + ' ';
    });
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  };

  // Calculate reading time (average 200 words per minute)
  const getReadingTime = () => {
    const words = getWordCount();
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? '< 1 min' : `${minutes} min read`;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isNew) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await apiCall(`/api/articles/${id}`);
      setArticle(response?.data || null);
    } catch (error) {
      toast.error('Failed to load article');
      navigate('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    clearError(field);
    setArticle(prev => ({ ...prev, [field]: value }));
  };

  const handleSEOChange = (field, value) => {
    clearError(`seo.${field}`);
    setArticle(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const generateSlug = () => {
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    handleChange('slug', slug);
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      text: '',
      ...(type === 'heading' ? { level: 'h2' } : {}),
      ...(type === 'list' ? { listType: 'unordered', items: [] } : {}),
      ...(type === 'image' ? { src: '', alt: '', caption: '' } : {}),
      ...(type === 'quote' ? { author: '' } : {}),
      ...(type === 'code' ? { language: '', code: '' } : {})
    };
    setArticle(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
    setShowAddBlock(false);
  };

  const updateBlock = (index, updatedBlock) => {
    setArticle(prev => ({
      ...prev,
      content: prev.content.map((block, i) => i === index ? updatedBlock : block)
    }));
  };

  const removeBlock = (index) => {
    setArticle(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = article.content.findIndex(b => b.id === active.id);
      const newIndex = article.content.findIndex(b => b.id === over.id);
      
      setArticle(prev => ({
        ...prev,
        content: arrayMove(prev.content, oldIndex, newIndex)
      }));
    }
  };

  const openMediaPicker = (target) => {
    setMediaPickerTarget(target);
    setShowMediaPicker(true);
  };

  const handleMediaSelect = (url) => {
    if (mediaPickerTarget === 'hero') {
      handleChange('heroImage', url);
    } else if (typeof mediaPickerTarget === 'number') {
      // Update image block
      const block = article.content[mediaPickerTarget];
      if (block) {
        updateBlock(mediaPickerTarget, { ...block, src: url });
      }
    }
    setShowMediaPicker(false);
    setMediaPickerTarget(null);
  };

  const handleSave = async (status = article.status) => {
    // Client-side validation
    const newErrors = {};
    if (!article.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!article.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const payload = { 
        ...article, 
        status,
        // Filter out empty outline items that were meant for entering new lines
        outline: (article.outline || []).filter(o => o.label && o.label.trim() !== '')
      };
      
      if (isNew) {
        await apiCall('/api/articles', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('Article created');
      } else {
        await apiCall(`/api/articles/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success('Article saved');
        setLastSaved(new Date());
      }
      navigate('/admin/articles');
    } catch (error) {
      // Parse field-level errors from API response
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.message || 'Failed to save article');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading article...</span>
      </div>
    );
  }

  return (
    <div className="admin-article-editor">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => navigate('/admin/articles')}
          >
            <FiArrowLeft />
          </button>
          <h1>{isNew ? 'New Article' : 'Edit Article'}</h1>
        </div>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            Save Draft
          </button>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => handleSave('published')}
            disabled={saving}
          >
            <FiSave /> {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="admin-editor-layout">
        <div className="admin-editor-main">
          {/* Title & Slug */}
          <div className="admin-card">
            <div className="admin-form-group">
              <label>Title</label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => !article.slug && generateSlug()}
                placeholder="Article title..."
                className={errors.title ? 'admin-input-error' : ''}
              />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Slug</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="article-url-slug"
                  style={{ flex: 1 }}
                  className={errors.slug ? 'admin-input-error' : ''}
                />
                <button 
                  className="admin-btn admin-btn-secondary"
                  onClick={generateSlug}
                  type="button"
                >
                  Generate
                </button>
              </div>
              {errors.slug && <span className="admin-field-error">{errors.slug}</span>}
            </div>
          </div>

          {/* Hero Image */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Hero Image</h3>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={article.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  placeholder="Hero image URL..."
                  style={{ flex: 1 }}
                />
                <button 
                  className="admin-btn admin-btn-secondary"
                  onClick={() => openMediaPicker('hero')}
                  type="button"
                >
                  <FiImage /> Browse
                </button>
              </div>
              {article.heroImage && (
                <img 
                  src={article.heroImage} 
                  alt="Hero preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px', 
                    marginTop: '12px' 
                  }} 
                />
              )}
            </div>
          </div>

          {/* Content Blocks */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Content</h3>
              <button 
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => setShowAddBlock(!showAddBlock)}
              >
                <FiPlus /> Add Block
              </button>
            </div>

            {showAddBlock && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px', 
                marginBottom: '20px',
                padding: '16px',
                background: 'var(--admin-bg)',
                borderRadius: '8px'
              }}>
                {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => addBlock(type)}
                  >
                    <Icon /> {label}
                  </button>
                ))}
              </div>
            )}

            {article.content.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={article.content.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {article.content.map((block, index) => (
                    <ContentBlock
                      key={block.id}
                      block={block}
                      index={index}
                      onUpdate={updateBlock}
                      onRemove={removeBlock}
                      outlineOptions={article.outline || []}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="admin-empty-state" style={{ padding: '40px' }}>
                <FiType style={{ fontSize: '2rem', opacity: 0.5 }} />
                <h3>No content blocks</h3>
                <p>Click "Add Block" to start building your article</p>
              </div>
            )}
          </div>

          {/* Outline */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Article Outline</h3>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <textarea
                value={(article.outline || []).map(o => typeof o === 'object' ? o.label : o).join('\n')}
                onChange={(e) => {
                  const items = e.target.value.split('\n');
                  const outlineObjects = items.map(label => {
                    const cleanLabel = label.trim();
                    if (!cleanLabel) return { id: '', label: '' }; // keep empty lines while typing
                    return {
                      id: cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      label: cleanLabel
                    };
                  });
                  handleChange('outline', outlineObjects);
                }}
                placeholder="Enter outline items, one per line..."
                rows={5}
              />
              <small style={{ color: '#666' }}>Shown as anchor links in the sidebar. One item per line.</small>
            </div>
          </div>
        </div>

        <div className="admin-editor-sidebar">
          {/* Article Stats */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--admin-bg)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--admin-purple)' }}>{getWordCount()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>Words</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--admin-bg)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--admin-purple)' }}>{article.content.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>Blocks</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--admin-bg)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--admin-text)' }}>{getReadingTime()}</div>
            </div>
            {lastSaved && (
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--admin-text-secondary)', textAlign: 'center' }}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Status & Category */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Settings</h3>
            <div className="admin-form-group">
              <label>Status</label>
              <select
                value={article.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Category</label>
              <select
                value={article.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="admin-form-group" style={{ marginTop: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
              <label style={{ marginBottom: '12px', display: 'block' }}>Featured Placements</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={article.featuredNewsTop || false}
                  onChange={(e) => handleChange('featuredNewsTop', e.target.checked)}
                />
                Top 3 on News Page
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={article.featuredNewsOther || false}
                  onChange={(e) => handleChange('featuredNewsOther', e.target.checked)}
                />
                Grid 3 on News Page
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={article.featuredAbout || false}
                  onChange={(e) => handleChange('featuredAbout', e.target.checked)}
                />
                Top 3 on About Page
              </label>
            </div>

            <div className="admin-form-group">
              <label>Author</label>
              <input
                type="text"
                value={article.author || ''}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Author name..."
              />
            </div>
            <div className="admin-form-group">
              <label>Author Image URL</label>
              <input
                type="text"
                value={article.authorImage || ''}
                onChange={(e) => handleChange('authorImage', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="admin-form-group">
              <label>Read Time</label>
              <input
                type="text"
                value={article.readTime || ''}
                onChange={(e) => handleChange('readTime', e.target.value)}
                placeholder="e.g. 5 min"
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Publish Date</label>
              <input
                type="date"
                value={article.date ? new Date(article.date).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Excerpt</h3>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <textarea
                value={article.excerpt || ''}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Short description shown in article lists..."
                rows={3}
              />
              <div className="admin-char-counter">
                {(article.excerpt || '').length}/300
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>SEO</h3>
            <div className="admin-form-group">
              <label>Meta Title</label>
              <input
                type="text"
                value={article.seo?.metaTitle || ''}
                onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                placeholder="SEO title..."
              />
              <div className="admin-char-counter">
                {(article.seo?.metaTitle || '').length}/60
              </div>
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Meta Description</label>
              <textarea
                value={article.seo?.metaDescription || ''}
                onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                placeholder="SEO description..."
                rows={3}
              />
              <div className="admin-char-counter">
                {(article.seo?.metaDescription || '').length}/160
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => {
          setShowMediaPicker(false);
          setMediaPickerTarget(null);
        }}
        onSelect={handleMediaSelect}
        multiple={false}
      />
    </div>
  );
}
