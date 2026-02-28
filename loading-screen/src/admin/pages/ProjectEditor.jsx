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
    marqueeCards: getDefaultMarqueeCards(),
  });

  const [newTag, setNewTag] = useState('');
  const [newService, setNewService] = useState('');
  const [newImage, setNewImage] = useState('');
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
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
          marqueeCards: (data.marqueeCards && data.marqueeCards.length > 0) ? data.marqueeCards : getDefaultMarqueeCards(),
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
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'marquee') {
      updateMarqueeCard(mediaPickerTarget.index, 'mediaUrl', firstUrl);
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
            {isCaseStudy ? '📋 Case Study' : '📁 Project'}
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
              📍 Appears in → <span style={{ color: '#a78bfa' }}>Portfolio listing cards</span> on Home + Portfolio pages, and the <span style={{ color: '#a78bfa' }}>Hero section header</span> of the case study detail page.
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
                  <option value="case-study">📋 Case Study</option>
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
              📍 Appears in → <span style={{ color: '#a78bfa' }}>Portfolio listing hover panel</span> (3 images) and <span style={{ color: '#a78bfa' }}>3D Gallery cards</span> on the case study page.
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

          {/* ═══ Case Study Detail Fields ═══ */}
          {isCaseStudy && (
            <>
              {/* Hero */}
              <div className="admin-card">
                <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                  🎯 Case Study — Hero Section
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
                    No sections yet. Click "Add Section" to build your case study content.
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
              📍 <span style={{ color: '#f59e0b' }}>Accent Color</span> = entire case study page theme. <span style={{ color: '#f59e0b' }}>Featured</span> = shows on home page portfolio section.
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
                {isCaseStudy ? 'Case Study' : 'Project'}
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
        multiple={mediaPickerTarget === 'gallery'}
      />
    </div>
  );
}
