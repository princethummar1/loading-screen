import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiX, FiImage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';
import MediaPicker from '../components/MediaPicker';

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Real Estate',
  'Manufacturing',
  'Entertainment',
  'Logistics',
  'Energy Technology',
  'HR Technology',
  'Climate Tech',
  'Food & Beverage',
  'Other'
];

const SECTION_TYPES = [
  { value: 'stats', label: 'Stats — Appears in marquee Impact card' },
  { value: 'quote', label: 'Quote — Appears in gallery + marquee Testimonial card' },
];

const MARQUEE_TYPES = [
  { value: 'standard', label: 'Standard Text Card' },
  { value: 'image', label: 'Image Background' },
  { value: 'video', label: 'Video Background' },
  { value: 'testimonial', label: 'Testimonial Blockquote' },
  { value: 'stats', label: 'Statistics Card' },
  { value: 'dashboard', label: 'Product / Dashboard Card' },
  { value: 'security', label: 'Security Badge' },
  { value: 'product', label: 'Product Sphere' },
];

const getDefaultMarqueeCards = () => [
  { cardType: 'product', label: '• Product', heading: '', body: 'Next-gen product experience', ctaText: 'Learn More →', ctaLink: '' },
  { cardType: 'standard', label: '• Hero', heading: 'Hero Headline', body: 'Subtitle description here', ctaText: 'Get Started →', ctaLink: '' },
  { cardType: 'security', label: '• Security', heading: 'Enterprise-grade\nSecurity', body: 'SOC 2 Type II Certified', ctaText: '', ctaLink: '' },
  { cardType: 'testimonial', label: '• Testimonial', heading: '', body: '', ctaText: '', ctaLink: '' },
  { cardType: 'stats', label: '• Impact', heading: '', body: '', ctaText: '', ctaLink: '' },
  { cardType: 'dashboard', label: '• Dashboard', heading: 'Platform', body: '', ctaText: 'View Demo →', ctaLink: '' },
];

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [project, setProject] = useState({
    name: '',
    description: '',
    tags: [],
    industry: INDUSTRIES[0],
    location: '',
    accent: '#6d28d9',
    images: [],
    visible: true,
    featured: false,
    type: 'project',
    // Detail page fields
    heroHeadline: '',
    heroSubtext: '',
    services: [],
    sections: [],
    results: [],
    liveUrl: '',
    year: new Date().getFullYear(),
    metaTitle: '',
    metaDescription: '',
    topVideoUrl: '',
    galleryCards: [],
    contentBlocks: [],
    marqueeCards: getDefaultMarqueeCards(),
    fullBleedImages: [],
    outcomeLabel: 'OUTCOME',
    outcomeDescription: '',
    outcomeLiveUrl: '',
    outcomeBgColor: '#0a0a0a',
    outcomeImage: '',
    outcomeImageAlt: 'Project outcome',
  });

  const [newTag, setNewTag] = useState('');
  const [newService, setNewService] = useState('');
  const [newImage, setNewImage] = useState('');
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
  const [fullBleedUrl, setFullBleedUrl] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await apiCall(`/api/projects/${id}`);
      const data = response?.data || null;
      if (data) {
        // Ensure arrays exist
        setProject({
          ...data,
          tags: data.tags || [],
          images: data.images || [],
          services: data.services || [],
          sections: data.sections || [],
          results: data.results || [],
          topVideoUrl: data.topVideoUrl || '',
          galleryCards: data.galleryCards || [],
          contentBlocks: data.contentBlocks || [],
          marqueeCards: (data.marqueeCards && data.marqueeCards.length > 0) ? data.marqueeCards : getDefaultMarqueeCards(),
          fullBleedImages: data.fullBleedImages || [],
          outcomeLabel: data.outcomeLabel || 'OUTCOME',
          outcomeDescription: data.outcomeDescription || '',
          outcomeLiveUrl: data.outcomeLiveUrl || '',
          outcomeBgColor: data.outcomeBgColor || '#0a0a0a',
          outcomeImage: data.outcomeImage || '',
          outcomeImageAlt: data.outcomeImageAlt || 'Project outcome',
        });
      }
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setProject(prev => ({ ...prev, [field]: value }));
  };

  // ─── Tags ───
  const addTag = () => {
    if (newTag.trim() && !project.tags.includes(newTag.trim())) {
      setProject(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // ─── Services ───
  const addService = () => {
    if (newService.trim() && !project.services.includes(newService.trim())) {
      setProject(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (svc) => {
    setProject(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== svc)
    }));
  };

  // ─── Images ───
  const addImage = () => {
    if (newImage.trim()) {
      setProject(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleMediaSelect = (urls) => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const firstUrl = urlArray[0];

    if (!mediaPickerTarget) return;

    if (mediaPickerTarget === 'gallery') {
      setProject(prev => ({
        ...prev,
        images: [...(prev.images || []), ...urlArray]
      }));
    } else if (mediaPickerTarget === 'topVideoUrl') {
      handleChange('topVideoUrl', firstUrl);
    } else if (mediaPickerTarget === 'fullBleedImages') {
      setProject(prev => ({
        ...prev,
        fullBleedImages: [...(prev.fullBleedImages || []), ...urlArray]
      }));
    } else if (mediaPickerTarget === 'outcomeImage') {
      handleChange('outcomeImage', firstUrl);
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'marquee') {
      updateMarqueeCard(mediaPickerTarget.index, 'mediaUrl', firstUrl);
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'galleryCard') {
      updateGalleryCard(mediaPickerTarget.slot, 'imageUrl', firstUrl);
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'contentBlock') {
      updateContentBlock(mediaPickerTarget.index, 'imageUrl', firstUrl);
    }
    
    setMediaPickerTarget(null);
  };

  const removeImage = (index) => {
    setProject(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ─── Sections ───
  const addSection = () => {
    setProject(prev => ({
      ...prev,
      sections: [...prev.sections, {
        type: 'text',
        heading: '',
        body: '',
        mediaUrl: '',
        stats: [],
        quote: '',
        author: '',
      }]
    }));
  };

  const updateSection = (index, field, value) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === index ? { ...sec, [field]: value } : sec
      )
    }));
  };

  const removeSection = (index) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const moveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= project.sections.length) return;
    setProject(prev => {
      const sections = [...prev.sections];
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return { ...prev, sections };
    });
  };

  const toggleSectionCollapse = (index) => {
    setCollapsedSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // ─── Section Stats ───
  const addStat = (sectionIndex) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, stats: [...(sec.stats || []), { label: '', value: '' }] }
          : sec
      )
    }));
  };

  const updateStat = (sectionIndex, statIndex, field, value) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              stats: sec.stats.map((stat, si) =>
                si === statIndex ? { ...stat, [field]: value } : stat
              )
            }
          : sec
      )
    }));
  };

  const removeStat = (sectionIndex, statIndex) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, stats: sec.stats.filter((_, si) => si !== statIndex) }
          : sec
      )
    }));
  };

  // ─── Results ───
  const addResult = () => {
    setProject(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', value: '' }]
    }));
  };

  const updateResult = (index, field, value) => {
    setProject(prev => ({
      ...prev,
      results: prev.results.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    }));
  };

  const removeResult = (index) => {
    setProject(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  // ─── Gallery Cards ───
  const GALLERY_CARD_LABELS = [
    'Card 0 — Accent CTA (top-left)',
    'Card 1 — Dot Grid (top-center)',
    'Card 2 — Quote (top-right)',
    'Card 3 — Dot Logo (mid-left)',
    'Card 4 — Center Dashboard (main)',
    'Card 5 — Image (bottom-left)',
    'Card 6 — Stripes (bottom-right)',
  ];

  const getGalleryCardForSlot = (slot) => {
    return (project.galleryCards || []).find(c => c.slot === slot);
  };

  const updateGalleryCard = (slot, field, value) => {
    setProject(prev => {
      const cards = [...(prev.galleryCards || [])];
      const existingIdx = cards.findIndex(c => c.slot === slot);
      if (existingIdx >= 0) {
        cards[existingIdx] = { ...cards[existingIdx], [field]: value };
      } else {
        cards.push({ slot, useImage: false, imageUrl: '', imageAlt: '', [field]: value });
      }
      return { ...prev, galleryCards: cards };
    });
  };

  const toggleGalleryCardImage = (slot, enabled) => {
    setProject(prev => {
      const cards = [...(prev.galleryCards || [])];
      const existingIdx = cards.findIndex(c => c.slot === slot);
      if (existingIdx >= 0) {
        cards[existingIdx] = { ...cards[existingIdx], useImage: enabled };
      } else {
        cards.push({ slot, useImage: enabled, imageUrl: '', imageAlt: '' });
      }
      return { ...prev, galleryCards: cards };
    });
  };

  const clearGalleryCardImage = (slot) => {
    setProject(prev => ({
      ...prev,
      galleryCards: (prev.galleryCards || []).filter(c => c.slot !== slot),
    }));
  };

  // ─── Content Blocks ───
  const CONTENT_BLOCK_TYPES = [
    { value: 'text-image-right', label: 'Text + Image Right' },
    { value: 'image-text-right', label: 'Image + Text Right' },
    { value: 'text-full', label: 'Full Width Text' },
    { value: 'image-full', label: 'Full Width Image' },
    { value: 'quote', label: 'Quote Block' },
    { value: 'stats', label: 'Stats Row' },
  ];

  const addContentBlock = (blockType) => {
    setProject(prev => {
      const blocks = [...(prev.contentBlocks || [])];
      const newIndex = blocks.length;
      blocks.push({
        type: blockType,
        order: newIndex,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: '',
        heading: '',
        headingSize: 'large',
        body: '',
        imageUrl: '',
        imageAlt: '',
        imageFit: 'cover',
        quote: '',
        quoteAuthor: '',
        stats: [],
        splitRatio: '50-50',
      });
      setCollapsedSections(c => ({ ...c, [`block-${newIndex}`]: false }));
      return { ...prev, contentBlocks: blocks };
    });
  };

  const updateContentBlock = (index, field, value) => {
    setProject(prev => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).map((b, i) =>
        i === index ? { ...b, [field]: value } : b
      ),
    }));
  };

  const removeContentBlock = (index) => {
    setProject(prev => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).filter((_, i) => i !== index)
        .map((b, i) => ({ ...b, order: i })),
    }));
  };

  const moveContentBlock = (index, direction) => {
    const newIndex = index + direction;
    setProject(prev => {
      const blocks = [...(prev.contentBlocks || [])];
      if (newIndex < 0 || newIndex >= blocks.length) return prev;
      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
      return { ...prev, contentBlocks: blocks.map((b, i) => ({ ...b, order: i })) };
    });
  };

  const addContentBlockStat = (blockIndex) => {
    setProject(prev => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).map((b, i) =>
        i === blockIndex ? { ...b, stats: [...(b.stats || []), { value: '', label: '' }] } : b
      ),
    }));
  };

  const updateContentBlockStat = (blockIndex, statIndex, field, value) => {
    setProject(prev => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).map((b, i) =>
        i === blockIndex
          ? { ...b, stats: (b.stats || []).map((s, si) => si === statIndex ? { ...s, [field]: value } : s) }
          : b
      ),
    }));
  };

  const removeContentBlockStat = (blockIndex, statIndex) => {
    setProject(prev => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).map((b, i) =>
        i === blockIndex ? { ...b, stats: (b.stats || []).filter((_, si) => si !== statIndex) } : b
      ),
    }));
  };

  // ─── Marquee Cards ───
  const addMarqueeCard = () => {
    setProject(prev => {
      const current = prev.marqueeCards || [];
      const newIndex = current.length;
      
      // Auto expand new card
      setCollapsedSections(c => ({ ...c, [`marquee-${newIndex}`]: false }));
      
      // Attempt to scroll to the card if needed
      setTimeout(() => {
        const el = document.getElementById(`marquee-card-${newIndex}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);

      return {
        ...prev,
        marqueeCards: [...current, {
          cardType: 'standard',
          label: '• New Card',
          heading: '',
          body: '',
          mediaUrl: '',
          ctaText: '',
          ctaLink: '',
          stats: []
        }]
      };
    });
  };

  const updateMarqueeCard = (index, field, value) => {
    setProject(prev => ({
      ...prev,
      marqueeCards: prev.marqueeCards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };

  const removeMarqueeCard = (index) => {
    setProject(prev => ({
      ...prev,
      marqueeCards: prev.marqueeCards.filter((_, i) => i !== index)
    }));
  };

  const moveMarqueeCard = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= project.marqueeCards.length) return;
    setProject(prev => {
      const cards = [...prev.marqueeCards];
      [cards[index], cards[newIndex]] = [cards[newIndex], cards[index]];
      return { ...prev, marqueeCards: cards };
    });
  };

  // ─── Save ───
  const handleSave = async () => {
    const newErrors = {};
    if (!project.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      // Strip readonly/metadata fields before sending
      const { _id, __v, createdAt, updatedAt, slug, ...payload } = project;

      if (isNew) {
        await apiCall('/api/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('Project created');
      } else {
        await apiCall(`/api/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success('Project saved');
      }
      navigate('/admin/projects');
    } catch (error) {
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.message || 'Failed to save project');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading project...</span>
      </div>
    );
  }

  const isCaseStudy = project.type === 'case-study';

  return (
    <div className="admin-project-editor">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => navigate('/admin/projects')}
          >
            <FiArrowLeft />
          </button>
          <h1>{isNew ? 'New Project' : 'Edit Project'}</h1>
          {/* Type badge */}
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: isCaseStudy ? 'rgba(255, 77, 46, 0.15)' : 'rgba(109, 40, 217, 0.15)',
            color: isCaseStudy ? '#FF4D2E' : '#a78bfa',
            border: `1px solid ${isCaseStudy ? 'rgba(255, 77, 46, 0.3)' : 'rgba(109, 40, 217, 0.3)'}`,
          }}>
            {isCaseStudy ? '📋 Selected Work' : '📁 Project'}
          </span>
        </div>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <div className="admin-editor-layout">
        <div className="admin-editor-main">
          {/* Basic Info */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>Basic Information</h3>
            <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
              📍 Appears in → <span style={{ color: '#a78bfa' }}>Portfolio listing cards</span> on Home + Portfolio pages, and the <span style={{ color: '#a78bfa' }}>Hero section header</span> of the selected work detail page.
            </p>
            <div className="admin-form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter project name..."
                className={errors.name ? 'admin-input-error' : ''}
              />
              {errors.name && <span className="admin-field-error">{errors.name}</span>}
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                value={project.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Project description..."
                rows={4}
              />
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Industry</label>
                <select
                  value={project.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={project.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label>Type</label>
                <select
                  value={project.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="project">📁 Project</option>
                  <option value="case-study">📋 Selected Work</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={project.year || ''}
                  onChange={(e) => handleChange('year', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g., 2024"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>Tags</h3>
            <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
              📍 Appears in → <span style={{ color: '#a78bfa' }}>Portfolio listing cards</span> as category pills beneath each project row.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {project.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="admin-badge admin-badge-purple"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '6px 12px'
                  }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'inherit', 
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex'
                    }}
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                style={{ flex: 1 }}
              />
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={addTag}
                type="button"
              >
                <FiPlus /> Add
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>Project Images</h3>
            <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
              📍 Appears in → <span style={{ color: '#a78bfa' }}>Portfolio listing hover panel</span> (3 images) and <span style={{ color: '#a78bfa' }}>3D Gallery cards</span> on the selected work page.
            </p>
            
            {project.images.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '12px',
                marginBottom: '16px' 
              }}>
                {project.images.map((image, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={image} 
                      alt={`Project ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        background: '#1a1a1a'
                      }}
                    />
                    <button
                      className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm"
                      onClick={() => removeImage(index)}
                      style={{ 
                        position: 'absolute', 
                        top: '4px', 
                        right: '4px',
                        width: '24px',
                        height: '24px'
                      }}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                placeholder="Image URL..."
                style={{ flex: 1 }}
              />
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setMediaPickerTarget('gallery')}
                type="button"
              >
                <FiImage /> Browse
              </button>
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={addImage}
                type="button"
              >
                <FiPlus /> Add URL
              </button>
            </div>
          </div>

          {/* ═══ Selected Work Detail Fields ═══ */}
          {isCaseStudy && (
            <>
              {/* Hero */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                  🎯 Selected Work — Hero Section
                </h3>
                <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
                  📍 Appears in → <span style={{ color: '#10b981' }}>Full-width hero</span> at the very top of <code style={{ fontSize: '0.65rem', background: '#222', padding: '1px 4px', borderRadius: '3px', color: '#f59e0b' }}>/case-study/{project.name ? project.name.toLowerCase().replace(/\s+/g, '-') : 'slug'}</code>. The headline is the big heading, subtext appears in the marquee section, and the URL adds a "Live Website →" link.
                </p>
                <div className="admin-form-group">
                  <label>Top Video URL (Optional)</label>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '8px' }}>
                    If provided, a full-width video will play above the 3D gallery.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={project.topVideoUrl || ''}
                      onChange={(e) => handleChange('topVideoUrl', e.target.value)}
                      placeholder="Enter video URL (e.g. .mp4 link)..."
                      style={{ flex: 1 }}
                    />
                    <button 
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setMediaPickerTarget('topVideoUrl')}
                      type="button"
                    >
                      <FiImage /> Browse
                    </button>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Hero Headline</label>
                  <input
                    type="text"
                    value={project.heroHeadline}
                    onChange={(e) => handleChange('heroHeadline', e.target.value)}
                    placeholder="e.g., The Power of Knowing"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Hero Subtext</label>
                  <textarea
                    value={project.heroSubtext}
                    onChange={(e) => handleChange('heroSubtext', e.target.value)}
                    placeholder="Subtitle or tagline for the hero section..."
                    rows={2}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Live Website URL</label>
                  <input
                    type="url"
                    value={project.liveUrl}
                    onChange={(e) => handleChange('liveUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Services */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                  🛠️ Services Provided
                </h3>
                <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
                  📍 Appears in → <span style={{ color: '#10b981' }}>Hero section left column</span> as a list under "Services" label.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {project.services.map((svc, index) => (
                    <span 
                      key={index} 
                      className="admin-badge"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10b981',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {svc}
                      <button
                        onClick={() => removeService(svc)}
                        style={{ 
                          background: 'none', border: 'none', color: 'inherit', 
                          cursor: 'pointer', padding: 0, display: 'flex'
                        }}
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    placeholder="Add a service..."
                    style={{ flex: 1 }}
                  />
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={addService}
                    type="button"
                  >
                    <FiPlus /> Add
                  </button>
                </div>
              </div>

              {/* Sections Builder */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="admin-card-title" style={{ margin: 0 }}>
                    📄 Content Sections
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: '#666', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    📍 <b>Stats</b> → Appears in the <span style={{ color: '#10b981' }}>Marquee "Impact" card</span> as big numbers. <b>Quote</b> → Appears in the <span style={{ color: '#10b981' }}>Gallery quote card</span> + <span style={{ color: '#10b981' }}>Marquee testimonial card</span>.
                  </p>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={addSection}
                    type="button"
                  >
                    <FiPlus /> Add Section
                  </button>
                </div>

                {project.sections.length === 0 && (
                  <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
                    No sections yet. Click "Add Section" to build your selected work content.
                  </p>
                )}

                {project.sections.map((section, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: '#111',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Section Header */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#161616',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleSectionCollapse(index)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>
                          #{index + 1}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: 'rgba(139,92,246,0.15)',
                          color: '#a78bfa',
                        }}>
                          {section.type}
                        </span>
                        <span style={{ color: '#ccc', fontSize: '0.85rem' }}>
                          {section.heading || '(untitled)'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm"
                          onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <FiChevronUp size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm"
                          onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }}
                          disabled={index === project.sections.length - 1}
                          title="Move down"
                        >
                          <FiChevronDown size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm"
                          onClick={(e) => { e.stopPropagation(); removeSection(index); }}
                          title="Delete section"
                          style={{ width: '28px', height: '28px' }}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Section Body */}
                    {!collapsedSections[index] && (
                      <div style={{ padding: '16px' }}>
                        <div className="admin-grid-2">
                          <div className="admin-form-group">
                            <label>Type</label>
                            <select
                              value={section.type}
                              onChange={(e) => updateSection(index, 'type', e.target.value)}
                            >
                              {SECTION_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Heading</label>
                            <input
                              type="text"
                              value={section.heading || ''}
                              onChange={(e) => updateSection(index, 'heading', e.target.value)}
                              placeholder="Section heading..."
                            />
                          </div>
                        </div>



                        {/* Stats — show for stats type */}
                        {section.type === 'stats' && (
                          <div className="admin-form-group">
                            <label style={{ marginBottom: '8px' }}>Stats</label>
                            {(section.stats || []).map((stat, si) => (
                              <div key={si} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                  type="text"
                                  value={stat.label || ''}
                                  onChange={(e) => updateStat(index, si, 'label', e.target.value)}
                                  placeholder="Label (e.g., Revenue Growth)"
                                  style={{ flex: 1 }}
                                />
                                <input
                                  type="text"
                                  value={stat.value || ''}
                                  onChange={(e) => updateStat(index, si, 'value', e.target.value)}
                                  placeholder="Value (e.g., +40%)"
                                  style={{ width: '140px' }}
                                />
                                <button
                                  className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm"
                                  onClick={() => removeStat(index, si)}
                                  style={{ width: '32px', height: '32px', flexShrink: 0 }}
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              className="admin-btn admin-btn-ghost admin-btn-sm"
                              onClick={() => addStat(index)}
                              type="button"
                              style={{ marginTop: '4px' }}
                            >
                              <FiPlus size={12} /> Add Stat
                            </button>
                          </div>
                        )}

                        {/* Quote — show for quote type */}
                        {section.type === 'quote' && (
                          <>
                            <div className="admin-form-group">
                              <label>Quote</label>
                              <textarea
                                value={section.quote || ''}
                                onChange={(e) => updateSection(index, 'quote', e.target.value)}
                                placeholder="Quote text..."
                                rows={3}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label>Author</label>
                              <input
                                type="text"
                                value={section.author || ''}
                                onChange={(e) => updateSection(index, 'author', e.target.value)}
                                placeholder="e.g., CEO, Company Name"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="admin-card-title" style={{ margin: 0 }}>
                    📊 Results / Outcomes
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: '#666', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    📍 Appears in → <span style={{ color: '#10b981' }}>Marquee "Impact" card</span> as big stat numbers if no stats section exists. Metric = label, Value = the big number.
                  </p>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={addResult}
                    type="button"
                  >
                    <FiPlus /> Add Result
                  </button>
                </div>

                {project.results.length === 0 && (
                  <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center', padding: '10px 0' }}>
                    No results yet. Click "Add Result" to add metrics.
                  </p>
                )}

                {project.results.map((result, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={result.metric || ''}
                      onChange={(e) => updateResult(index, 'metric', e.target.value)}
                      placeholder="Metric (e.g., Conversion Rate)"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      value={result.value || ''}
                      onChange={(e) => updateResult(index, 'value', e.target.value)}
                      placeholder="Value (e.g., +165%)"
                      style={{ width: '140px' }}
                    />
                    <button
                      className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm"
                      onClick={() => removeResult(index)}
                      style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Gallery Cards (Bento Grid) */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                  🎨 Gallery Cards (Bento Grid)
                </h3>
                <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
                  📍 The 7-card bento grid on the selected work page. Each card has a <b>default widget</b> (CTA, dot grid, quote, etc.).
                  Toggle "Use Custom Image" to replace any card with your own image.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '12px',
                }}>
                  {GALLERY_CARD_LABELS.map((label, slot) => {
                    const gc = getGalleryCardForSlot(slot);
                    const isCustom = gc?.useImage === true;

                    return (
                      <div
                        key={slot}
                        style={{
                          background: isCustom ? '#0f1a14' : '#111',
                          border: `1px solid ${isCustom ? '#10b981' : '#2a2a2a'}`,
                          borderRadius: '8px',
                          padding: '14px',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ccc' }}>{label}</span>
                          <span style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isCustom ? 'rgba(16,185,129,0.15)' : 'rgba(109,40,217,0.15)',
                            color: isCustom ? '#10b981' : '#a78bfa',
                          }}>
                            {isCustom ? 'Custom Image' : 'Default'}
                          </span>
                        </div>

                        {/* Toggle */}
                        <label style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          fontSize: '0.75rem', color: '#999', cursor: 'pointer', marginBottom: '10px',
                        }}>
                          <input
                            type="checkbox"
                            checked={isCustom}
                            onChange={(e) => toggleGalleryCardImage(slot, e.target.checked)}
                            style={{ accentColor: '#10b981' }}
                          />
                          Use custom image
                        </label>

                        {/* Image controls (only when custom) */}
                        {isCustom && (
                          <div>
                            {gc?.imageUrl ? (
                              <div style={{ position: 'relative', marginBottom: '8px' }}>
                                <img
                                  src={gc.imageUrl}
                                  alt={gc.imageAlt || ''}
                                  style={{
                                    width: '100%', height: '100px', objectFit: 'cover',
                                    borderRadius: '6px', background: '#1a1a1a',
                                  }}
                                />
                                <button
                                  className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm"
                                  onClick={() => updateGalleryCard(slot, 'imageUrl', '')}
                                  style={{
                                    position: 'absolute', top: '4px', right: '4px',
                                    width: '22px', height: '22px',
                                  }}
                                  title="Remove image"
                                >
                                  <FiTrash2 size={10} />
                                </button>
                              </div>
                            ) : (
                              <div style={{
                                width: '100%', height: '80px', borderRadius: '6px',
                                border: '2px dashed #333', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                marginBottom: '8px', color: '#555', fontSize: '0.75rem',
                              }}>
                                No image set
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                onClick={() => setMediaPickerTarget({ type: 'galleryCard', slot })}
                                type="button"
                                style={{ flex: 1, fontSize: '0.7rem' }}
                              >
                                <FiImage size={12} /> Browse
                              </button>
                              <button
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => clearGalleryCardImage(slot)}
                                type="button"
                                style={{ fontSize: '0.7rem' }}
                                title="Reset to default"
                              >
                                Reset
                              </button>
                            </div>
                            <div className="admin-form-group" style={{ marginTop: '8px', marginBottom: 0 }}>
                              <input
                                type="text"
                                value={gc?.imageAlt || ''}
                                onChange={(e) => updateGalleryCard(slot, 'imageAlt', e.target.value)}
                                placeholder="Alt text (optional)"
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marquee Builder */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="admin-card-title" style={{ margin: 0 }}>
                    🎞️ Marquee Cards (Horizontal Scroll)
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: '#666', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    📍 Configure the horizontally scrolling cards section. Default is 6 cards.
                  </p>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={addMarqueeCard}
                    type="button"
                  >
                    <FiPlus /> Add Card
                  </button>
                </div>

                {(!project.marqueeCards || project.marqueeCards.length === 0) && (
                  <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
                    No marquee cards. Click "Add Card" to build your horizontal scroll section.
                  </p>
                )}

                {(project.marqueeCards || []).map((card, index) => (
                  <div 
                    key={index}
                    id={`marquee-card-${index}`}
                    style={{ 
                      background: '#111',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Card Header */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#161616',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleSectionCollapse(`marquee-${index}`)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>
                          #{index + 1}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: 'rgba(16,185,129,0.15)',
                          color: '#10b981',
                        }}>
                          {card.cardType}
                        </span>
                        <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{card.label || '(no label)'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm"
                          onClick={(e) => { e.stopPropagation(); moveMarqueeCard(index, -1); }}
                          disabled={index === 0}
                          title="Move left"
                        >
                          <FiChevronUp size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm"
                          onClick={(e) => { e.stopPropagation(); moveMarqueeCard(index, 1); }}
                          disabled={index === project.marqueeCards.length - 1}
                          title="Move right"
                        >
                          <FiChevronDown size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm"
                          onClick={(e) => { e.stopPropagation(); removeMarqueeCard(index); }}
                          title="Delete card"
                          style={{ width: '28px', height: '28px' }}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    {!collapsedSections[`marquee-${index}`] && (
                      <div style={{ padding: '16px' }}>
                        <div className="admin-grid-2">
                          <div className="admin-form-group">
                            <label>Card Type</label>
                            <select
                              value={card.cardType}
                              onChange={(e) => updateMarqueeCard(index, 'cardType', e.target.value)}
                            >
                              {MARQUEE_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Label</label>
                            <input
                              type="text"
                              value={card.label || ''}
                              onChange={(e) => updateMarqueeCard(index, 'label', e.target.value)}
                              placeholder="e.g. • Product"
                            />
                          </div>
                        </div>

                        <div className="admin-grid-2">
                          <div className="admin-form-group">
                            <label>Heading</label>
                            <input
                              type="text"
                              value={card.heading || ''}
                              onChange={(e) => updateMarqueeCard(index, 'heading', e.target.value)}
                              placeholder="Card Headline"
                            />
                          </div>
                          {(card.cardType === 'image' || card.cardType === 'video') && (
                            <div className="admin-form-group">
                              <label>Media URL (Image / Video)</label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="text"
                                  value={card.mediaUrl || ''}
                                  onChange={(e) => updateMarqueeCard(index, 'mediaUrl', e.target.value)}
                                  placeholder="https://..."
                                  style={{ flex: 1 }}
                                />
                                <button 
                                  className="admin-btn admin-btn-secondary"
                                  onClick={() => setMediaPickerTarget({ type: 'marquee', index })}
                                  type="button"
                                >
                                  <FiImage /> Browse
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="admin-form-group">
                          <label>Body Content</label>
                          <textarea
                            value={card.body || ''}
                            onChange={(e) => updateMarqueeCard(index, 'body', e.target.value)}
                            placeholder="Main text content for the card..."
                            rows={3}
                          />
                        </div>

                        <div className="admin-grid-2">
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>CTA Text</label>
                            <input
                              type="text"
                              value={card.ctaText || ''}
                              onChange={(e) => updateMarqueeCard(index, 'ctaText', e.target.value)}
                              placeholder="e.g. Learn More →"
                            />
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>CTA Link</label>
                            <input
                              type="text"
                              value={card.ctaLink || ''}
                              onChange={(e) => updateMarqueeCard(index, 'ctaLink', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Full Bleed Images & Outcome Section */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                  🖼️ Full Bleed Images & Outcome Section
                </h3>
                <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
                  📍 Appears in → <span style={{ color: '#a78bfa' }}>Full-width image strip</span> after the marquee cards, and the <span style={{ color: '#a78bfa' }}>Outcome section</span> with brand color background. Both sections are optional.
                </p>

                {/* Full Bleed Images */}
                <div className="admin-form-group">
                  <label>Full Bleed Images</label>
                  <small style={{ color: '#888', display: 'block', marginBottom: '8px' }}>
                    Multiple 16:9 images shown in a grid before the outcome section. Leave empty to hide.
                  </small>
                  {(project.fullBleedImages || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {project.fullBleedImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '140px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            onClick={() => setProject(prev => ({ ...prev, fullBleedImages: prev.fullBleedImages.filter((_, i) => i !== idx) }))}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={fullBleedUrl}
                      onChange={(e) => setFullBleedUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && fullBleedUrl.trim()) {
                          e.preventDefault();
                          setProject(prev => ({ ...prev, fullBleedImages: [...(prev.fullBleedImages || []), fullBleedUrl.trim()] }));
                          setFullBleedUrl('');
                        }
                      }}
                      placeholder="Paste image URL and press Enter..."
                      style={{ flex: 1 }}
                    />
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => {
                        if (fullBleedUrl.trim()) {
                          setProject(prev => ({ ...prev, fullBleedImages: [...(prev.fullBleedImages || []), fullBleedUrl.trim()] }));
                          setFullBleedUrl('');
                        }
                      }}
                      type="button"
                    >
                      <FiPlus /> Add
                    </button>
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setMediaPickerTarget('fullBleedImages')}
                      type="button"
                    >
                      <FiImage /> Media
                    </button>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

                {/* Outcome Background Color */}
                <div className="admin-form-group">
                  <label>Outcome Background Color</label>
                  <div className="admin-color-picker">
                    <input
                      type="color"
                      value={project.outcomeBgColor || '#0a0a0a'}
                      onChange={(e) => handleChange('outcomeBgColor', e.target.value)}
                      className="admin-color-swatch"
                      style={{ width: '50px', height: '40px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={project.outcomeBgColor || '#0a0a0a'}
                      onChange={(e) => handleChange('outcomeBgColor', e.target.value)}
                      placeholder="#0a0a0a"
                      className="admin-color-input"
                    />
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: project.outcomeBgColor || '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.15)',
                      flexShrink: 0,
                    }} />
                  </div>
                </div>

                {/* Outcome Label */}
                <div className="admin-form-group">
                  <label>Outcome Label</label>
                  <input
                    type="text"
                    value={project.outcomeLabel || ''}
                    onChange={(e) => handleChange('outcomeLabel', e.target.value)}
                    placeholder="OUTCOME"
                  />
                </div>

                {/* Outcome Description */}
                <div className="admin-form-group">
                  <label>Outcome Description</label>
                  <textarea
                    value={project.outcomeDescription || ''}
                    onChange={(e) => handleChange('outcomeDescription', e.target.value)}
                    placeholder="Describe the project outcome..."
                    rows={4}
                  />
                </div>

                {/* Live Website URL */}
                <div className="admin-form-group">
                  <label>Live Website URL</label>
                  <input
                    type="text"
                    value={project.outcomeLiveUrl || ''}
                    onChange={(e) => handleChange('outcomeLiveUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                {/* Outcome Side Image */}
                <div className="admin-form-group">
                  <label>Outcome Side Image</label>
                  <small style={{ color: '#888', display: 'block', marginBottom: '8px' }}>
                    Image shown on right side beside the outcome text
                  </small>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={project.outcomeImage || ''}
                      onChange={(e) => handleChange('outcomeImage', e.target.value)}
                      placeholder="Image URL..."
                      style={{ flex: 1 }}
                    />
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setMediaPickerTarget('outcomeImage')}
                      type="button"
                    >
                      <FiImage /> Media
                    </button>
                  </div>
                  {project.outcomeImage && (
                    <div style={{ marginTop: '8px', width: '120px', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={project.outcomeImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                {/* Image Alt Text */}
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Image Alt Text</label>
                  <input
                    type="text"
                    value={project.outcomeImageAlt || ''}
                    onChange={(e) => handleChange('outcomeImageAlt', e.target.value)}
                    placeholder="Project outcome"
                  />
                </div>
              </div>

              {/* ═══ Content Blocks ═══ */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 className="admin-card-title" style={{ margin: 0 }}>
                    🧱 Content Blocks
                  </h3>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
                  📍 Appears in → <span style={{ color: '#10b981' }}>Between marquee and full-bleed sections</span>. Build custom page layouts by adding blocks in any order.
                </p>

                {/* Add Block Dropdown */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <select
                    id="block-type-select"
                    defaultValue=""
                    style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', padding: '8px 12px', color: '#ccc', fontSize: '0.85rem' }}
                  >
                    <option value="" disabled>Select block type...</option>
                    {CONTENT_BLOCK_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById('block-type-select');
                      if (sel.value) { addContentBlock(sel.value); sel.value = ''; }
                    }}
                  >
                    <FiPlus /> Add
                  </button>
                </div>

                {/* Block list */}
                {(!project.contentBlocks || project.contentBlocks.length === 0) ? (
                  <div style={{
                    border: '2px dashed #333', borderRadius: '10px', padding: '32px 20px',
                    textAlign: 'center', color: '#555', fontSize: '0.85rem',
                  }}>
                    No content blocks yet. Add your first block using the dropdown above.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {project.contentBlocks.map((block, idx) => {
                      const blockKey = `block-${idx}`;
                      const isCollapsed = collapsedSections[blockKey] !== false;
                      const typeName = CONTENT_BLOCK_TYPES.find(t => t.value === block.type)?.label || block.type;
                      const isTextType = ['text-image-right', 'image-text-right', 'text-full'].includes(block.type);
                      const hasImage = ['text-image-right', 'image-text-right', 'image-full'].includes(block.type);

                      return (
                        <div key={idx} style={{
                          background: '#111', border: '1px solid #222', borderRadius: '8px',
                          overflow: 'hidden',
                        }}>
                          {/* Header */}
                          <div
                            style={{
                              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
                              cursor: 'pointer', borderBottom: isCollapsed ? 'none' : '1px solid #222',
                            }}
                            onClick={() => setCollapsedSections(c => ({ ...c, [blockKey]: !isCollapsed }))}
                          >
                            <span style={{ fontSize: '0.7rem', color: '#888' }}>#{idx + 1}</span>
                            <div style={{
                              width: '16px', height: '16px', borderRadius: '3px',
                              background: block.bgColor || '#0a0a0a', border: '1px solid #444', flexShrink: 0,
                            }} />
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600, color: '#ddd' }}>{typeName}</span>
                            {block.heading && <span style={{ fontSize: '0.7rem', color: '#666', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.heading}</span>}
                            <button className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm" onClick={(e) => { e.stopPropagation(); moveContentBlock(idx, -1); }} disabled={idx === 0} type="button" title="Move up" style={{ fontSize: '0.75rem' }}>▲</button>
                            <button className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm" onClick={(e) => { e.stopPropagation(); moveContentBlock(idx, 1); }} disabled={idx === project.contentBlocks.length - 1} type="button" title="Move down" style={{ fontSize: '0.75rem' }}>▼</button>
                            <button className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm" onClick={(e) => { e.stopPropagation(); removeContentBlock(idx); }} type="button" title="Delete"><FiTrash2 size={12} /></button>
                            <span style={{ fontSize: '0.75rem', color: '#666' }}>{isCollapsed ? '▶' : '▼'}</span>
                          </div>

                          {/* Expanded content */}
                          {!isCollapsed && (
                            <div style={{ padding: '14px' }}>
                              {/* Background & Text Color */}
                              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '160px' }}>
                                  <label style={{ fontSize: '0.7rem', color: '#888', display: 'block', marginBottom: '4px' }}>Background Color</label>
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input type="color" value={block.bgColor || '#0a0a0a'} onChange={(e) => updateContentBlock(idx, 'bgColor', e.target.value)} style={{ width: '36px', height: '30px', cursor: 'pointer', border: 'none', borderRadius: '4px' }} />
                                    <input type="text" value={block.bgColor || '#0a0a0a'} onChange={(e) => updateContentBlock(idx, 'bgColor', e.target.value)} style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', color: '#ccc' }} />
                                  </div>
                                </div>
                                <div style={{ minWidth: '120px' }}>
                                  <label style={{ fontSize: '0.7rem', color: '#888', display: 'block', marginBottom: '4px' }}>Text Color</label>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button type="button" onClick={() => updateContentBlock(idx, 'textColor', '#ffffff')} style={{
                                      flex: 1, padding: '5px 10px', fontSize: '0.7rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer', border: '1px solid #444',
                                      background: block.textColor === '#ffffff' ? '#fff' : '#1a1a1a', color: block.textColor === '#ffffff' ? '#000' : '#888',
                                    }}>White</button>
                                    <button type="button" onClick={() => updateContentBlock(idx, 'textColor', '#0a0a0a')} style={{
                                      flex: 1, padding: '5px 10px', fontSize: '0.7rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer', border: '1px solid #444',
                                      background: block.textColor === '#0a0a0a' ? '#333' : '#1a1a1a', color: block.textColor === '#0a0a0a' ? '#fff' : '#888',
                                    }}>Dark</button>
                                  </div>
                                </div>
                              </div>

                              {/* Text fields — shown for text blocks + quote + image types with heading */}
                              {isTextType && (
                                <>
                                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Label</label>
                                    <input type="text" value={block.label || ''} onChange={(e) => updateContentBlock(idx, 'label', e.target.value)} placeholder="• SECTION /" style={{ fontSize: '0.8rem' }} />
                                  </div>
                                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.7rem' }}>Heading</label>
                                      <input type="text" value={block.heading || ''} onChange={(e) => updateContentBlock(idx, 'heading', e.target.value)} placeholder="Section heading..." style={{ fontSize: '0.8rem' }} />
                                    </div>
                                    <div className="admin-form-group" style={{ width: '100px', marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.7rem' }}>Size</label>
                                      <select value={block.headingSize || 'large'} onChange={(e) => updateContentBlock(idx, 'headingSize', e.target.value)} style={{ fontSize: '0.75rem' }}>
                                        <option value="large">Large</option>
                                        <option value="medium">Medium</option>
                                        <option value="small">Small</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Body</label>
                                    <textarea value={block.body || ''} onChange={(e) => updateContentBlock(idx, 'body', e.target.value)} placeholder="Body text..." rows={4} style={{ fontSize: '0.8rem' }} />
                                  </div>
                                </>
                              )}

                              {/* Image fields — shown for image-containing blocks */}
                              {hasImage && (
                                <>
                                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Image</label>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <input type="text" value={block.imageUrl || ''} onChange={(e) => updateContentBlock(idx, 'imageUrl', e.target.value)} placeholder="Image URL..." style={{ flex: 1, fontSize: '0.8rem' }} />
                                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setMediaPickerTarget({ type: 'contentBlock', index: idx })} type="button"><FiImage size={12} /> Browse</button>
                                    </div>
                                    {block.imageUrl && (
                                      <div style={{ marginTop: '8px', width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #222' }}>
                                        <img src={block.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.7rem' }}>Alt Text</label>
                                      <input type="text" value={block.imageAlt || ''} onChange={(e) => updateContentBlock(idx, 'imageAlt', e.target.value)} placeholder="Image alt text..." style={{ fontSize: '0.8rem' }} />
                                    </div>
                                    {block.type === 'image-full' && (
                                      <div className="admin-form-group" style={{ width: '100px', marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Fit</label>
                                        <select value={block.imageFit || 'cover'} onChange={(e) => updateContentBlock(idx, 'imageFit', e.target.value)} style={{ fontSize: '0.75rem' }}>
                                          <option value="cover">Cover</option>
                                          <option value="contain">Contain</option>
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                  {block.type !== 'image-full' && (
                                    <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                                      <label style={{ fontSize: '0.7rem' }}>Split Ratio</label>
                                      <select value={block.splitRatio || '50-50'} onChange={(e) => updateContentBlock(idx, 'splitRatio', e.target.value)} style={{ fontSize: '0.75rem' }}>
                                        <option value="50-50">50 / 50</option>
                                        <option value="60-40">60 / 40 (text bigger)</option>
                                        <option value="40-60">40 / 60 (image bigger)</option>
                                      </select>
                                    </div>
                                  )}
                                </>
                              )}

                              {/* Quote fields */}
                              {block.type === 'quote' && (
                                <>
                                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Quote Text</label>
                                    <textarea value={block.quote || ''} onChange={(e) => updateContentBlock(idx, 'quote', e.target.value)} placeholder="Quote text..." rows={3} style={{ fontSize: '0.8rem' }} />
                                  </div>
                                  <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Author</label>
                                    <input type="text" value={block.quoteAuthor || ''} onChange={(e) => updateContentBlock(idx, 'quoteAuthor', e.target.value)} placeholder="— Author name" style={{ fontSize: '0.8rem' }} />
                                  </div>
                                </>
                              )}

                              {/* Stats fields */}
                              {block.type === 'stats' && (
                                <div style={{ marginBottom: '10px' }}>
                                  <label style={{ fontSize: '0.7rem', color: '#888', display: 'block', marginBottom: '8px' }}>Stats</label>
                                  {(block.stats || []).map((stat, si) => (
                                    <div key={si} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                                      <input type="text" value={stat.value || ''} onChange={(e) => updateContentBlockStat(idx, si, 'value', e.target.value)} placeholder="98%" style={{ width: '80px', fontSize: '0.8rem' }} />
                                      <input type="text" value={stat.label || ''} onChange={(e) => updateContentBlockStat(idx, si, 'label', e.target.value)} placeholder="Client Retention" style={{ flex: 1, fontSize: '0.8rem' }} />
                                      <button className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm" onClick={() => removeContentBlockStat(idx, si)} type="button"><FiTrash2 size={10} /></button>
                                    </div>
                                  ))}
                                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addContentBlockStat(idx)} type="button" style={{ fontSize: '0.7rem' }}><FiPlus size={10} /> Add Stat</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SEO */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                  🔍 SEO
                </h3>
                <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
                  📍 Appears in → <span style={{ color: '#10b981' }}>Browser tab title</span> and search engine listings. If empty, defaults to project name.
                </p>
                <div className="admin-form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    value={project.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    placeholder="SEO title (defaults to project name)"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Meta Description</label>
                  <textarea
                    value={project.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    placeholder="SEO description..."
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="admin-editor-sidebar">
          {/* Status & Color */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>Settings</h3>
            <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '16px', lineHeight: 1.4 }}>
              📍 <span style={{ color: '#f59e0b' }}>Accent Color</span> = entire selected work page theme. <span style={{ color: '#f59e0b' }}>Featured</span> = shows on home page portfolio section.
            </p>
            
            <div className="admin-form-group">
              <label>Visibility</label>
              <div className="admin-toggle">
                <input
                  type="checkbox"
                  checked={project.visible}
                  onChange={(e) => handleChange('visible', e.target.checked)}
                  id="visibility-toggle"
                />
                <span className="admin-toggle-slider"></span>
              </div>
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                {project.visible ? 'Visible on website' : 'Hidden from website'}
              </small>
            </div>

            <div className="admin-form-group">
              <label>⭐ Feature on Homepage</label>
              <div className="admin-toggle">
                <input
                  type="checkbox"
                  checked={project.featured || false}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  id="featured-toggle"
                />
                <span className="admin-toggle-slider"></span>
              </div>
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                {project.featured ? 'Shown in homepage portfolio section' : 'Not shown on homepage'}
              </small>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Accent Color</label>
              <div className="admin-color-picker">
                <input
                  type="color"
                  value={project.accent}
                  onChange={(e) => handleChange('accent', e.target.value)}
                  className="admin-color-swatch"
                  style={{ width: '50px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={project.accent}
                  onChange={(e) => handleChange('accent', e.target.value)}
                  placeholder="#6d28d9"
                  className="admin-color-input"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Preview</h3>
            <div style={{ 
              background: project.accent || '#6d28d9',
              borderRadius: '8px',
              padding: '20px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Type badge on preview */}
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {isCaseStudy ? 'Selected Work' : 'Project'}
              </span>
              {project.featured && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  fontSize: '1rem',
                }}>
                  ⭐
                </span>
              )}
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', paddingTop: project.featured ? '16px' : 0 }}>
                {project.name || 'Project Name'}
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', opacity: 0.9 }}>
                {project.description?.slice(0, 100) || 'Project description will appear here...'}
                {project.description?.length > 100 ? '...' : ''}
              </p>
              {project.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {project.tags.map((tag, i) => (
                    <span key={i} style={{
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.2)',
                      fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={handleMediaSelect}
        multiple={mediaPickerTarget === 'gallery' || mediaPickerTarget === 'fullBleedImages'}
      />
    </div>
  );
}
