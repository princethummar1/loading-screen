import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiMenu, FiX } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { useAuth } from '../AdminApp';

function SortableItem({ item, index, onUpdate, onRemove, type }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id || `item-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  if (type === 'approach') {
    return (
      <div ref={setNodeRef} style={style} className="admin-content-block">
        <div className="admin-content-block-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="admin-drag-handle" {...attributes} {...listeners}>
              <FiMenu />
            </button>
            <span className="admin-content-block-type">Step {index + 1}</span>
          </div>
          <button
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => onRemove(index)}
            style={{ color: 'var(--admin-danger)' }}
          >
            <FiTrash2 />
          </button>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label>Question</label>
            <input
              type="text"
              value={item.question || ''}
              onChange={(e) => onUpdate(index, { ...item, question: e.target.value })}
              placeholder="Step question/title..."
            />
          </div>
          <div className="admin-form-group">
            <label>Number</label>
            <input
              type="text"
              value={item.num || ''}
              onChange={(e) => onUpdate(index, { ...item, num: e.target.value })}
              placeholder="01"
            />
          </div>
        </div>
        <div className="admin-form-group" style={{ marginBottom: 0 }}>
          <label>Answer</label>
          <textarea
            value={item.answer || ''}
            onChange={(e) => onUpdate(index, { ...item, answer: e.target.value })}
            placeholder="Step answer/description..."
            rows={2}
          />
        </div>
      </div>
    );
  }

  // Service Card type
  return (
    <div ref={setNodeRef} style={style} className="admin-content-block">
      <div className="admin-content-block-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="admin-drag-handle" {...attributes} {...listeners}>
            <FiMenu />
          </button>
          <span className="admin-content-block-type">Service Card {index + 1}</span>
        </div>
        <button
          className="admin-btn admin-btn-ghost admin-btn-icon"
          onClick={() => onRemove(index)}
          style={{ color: 'var(--admin-danger)' }}
        >
          <FiTrash2 />
        </button>
      </div>
      <div className="admin-form-group">
        <label>Title</label>
        <input
          type="text"
          value={item.title || ''}
          onChange={(e) => onUpdate(index, { ...item, title: e.target.value })}
          placeholder="Card title..."
        />
      </div>
      <div className="admin-form-group" style={{ marginBottom: 0 }}>
        <label>Description</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => onUpdate(index, { ...item, description: e.target.value })}
          placeholder="Card description..."
          rows={3}
        />
      </div>
    </div>
  );
}

export default function ServiceEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  const [service, setService] = useState({
    name: '',
    heroDescription: '',
    heroImage: '',
    statementText: '',
    statementImage: '',
    visionTitle: '',
    visionQuote: '',
    visionPara1: '',
    visionPara2: '',
    visionImage: '',
    approachItems: [],
    serviceCards: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchService();
  }, [slug]);

  const fetchService = async () => {
    try {
      const response = await apiCall(`/api/services/${slug}`);
      const data = response?.data || {};
      // Add IDs to items for drag-and-drop
      setService({
        ...data,
        approachItems: (data.approachItems || []).map((item, i) => ({ ...item, id: `approach-${i}` })),
        serviceCards: (data.serviceCards || []).map((item, i) => ({ ...item, id: `card-${i}` }))
      });
    } catch (error) {
      toast.error('Failed to load service');
      navigate('/admin/services');
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
    setService(prev => ({ ...prev, [field]: value }));
  };

  const addApproachItem = () => {
    const newItem = {
      id: `approach-${Date.now()}`,
      question: '',
      answer: '',
      num: String(service.approachItems.length + 1).padStart(2, '0')
    };
    setService(prev => ({
      ...prev,
      approachItems: [...prev.approachItems, newItem]
    }));
  };

  const updateApproachItem = (index, updatedItem) => {
    setService(prev => ({
      ...prev,
      approachItems: prev.approachItems.map((item, i) => i === index ? updatedItem : item)
    }));
  };

  const removeApproachItem = (index) => {
    setService(prev => ({
      ...prev,
      approachItems: prev.approachItems.filter((_, i) => i !== index)
    }));
  };

  const addServiceCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: '',
      description: ''
    };
    setService(prev => ({
      ...prev,
      serviceCards: [...prev.serviceCards, newCard]
    }));
  };

  const updateServiceCard = (index, updatedCard) => {
    setService(prev => ({
      ...prev,
      serviceCards: prev.serviceCards.map((card, i) => i === index ? updatedCard : card)
    }));
  };

  const removeServiceCard = (index) => {
    setService(prev => ({
      ...prev,
      serviceCards: prev.serviceCards.filter((_, i) => i !== index)
    }));
  };

  const handleApproachDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = service.approachItems.findIndex(item => item.id === active.id);
      const newIndex = service.approachItems.findIndex(item => item.id === over.id);
      setService(prev => ({
        ...prev,
        approachItems: arrayMove(prev.approachItems, oldIndex, newIndex)
      }));
    }
  };

  const handleCardDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = service.serviceCards.findIndex(card => card.id === active.id);
      const newIndex = service.serviceCards.findIndex(card => card.id === over.id);
      setService(prev => ({
        ...prev,
        serviceCards: arrayMove(prev.serviceCards, oldIndex, newIndex)
      }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!service.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      // Clean up IDs before saving
      const payload = {
        ...service,
        approachItems: service.approachItems.map(({ id, ...item }) => item),
        serviceCards: service.serviceCards.map(({ id, ...card }) => card)
      };

      await apiCall(`/api/services/${slug}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      toast.success('Service saved');
      navigate('/admin/services');
    } catch (error) {
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.message || 'Failed to save service');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="admin-loading-spinner"></div>
        <span>Loading service...</span>
      </div>
    );
  }

  return (
    <div className="admin-service-editor">
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="admin-btn admin-btn-ghost admin-btn-icon"
            onClick={() => navigate('/admin/services')}
          >
            <FiArrowLeft />
          </button>
          <h1>Edit: {service.name}</h1>
        </div>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`admin-tab ${activeTab === 'approach' ? 'active' : ''}`}
          onClick={() => setActiveTab('approach')}
        >
          Approach ({service.approachItems.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          Service Cards ({service.serviceCards.length})
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="admin-card">
          <div className="admin-form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Service name..."
              className={errors.name ? 'admin-input-error' : ''}
            />
            {errors.name && <span className="admin-field-error">{errors.name}</span>}
          </div>

          <div className="admin-form-group">
            <label>Hero Description</label>
            <textarea
              value={service.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              placeholder="Hero section description..."
              rows={3}
            />
          </div>

          <div className="admin-form-group">
            <label>Hero Image URL</label>
            <input
              type="text"
              value={service.heroImage || ''}
              onChange={(e) => handleChange('heroImage', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-group">
            <label>Statement Text</label>
            <textarea
              value={service.statementText}
              onChange={(e) => handleChange('statementText', e.target.value)}
              placeholder="Main statement text..."
              rows={4}
            />
          </div>

          <div className="admin-form-group">
            <label>Statement Image URL</label>
            <input
              type="text"
              value={service.statementImage || ''}
              onChange={(e) => handleChange('statementImage', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label>Vision Title</label>
              <input
                type="text"
                value={service.visionTitle}
                onChange={(e) => handleChange('visionTitle', e.target.value)}
                placeholder="Vision section title..."
              />
            </div>
            <div className="admin-form-group">
              <label>Vision Image URL</label>
              <input
                type="text"
                value={service.visionImage || ''}
                onChange={(e) => handleChange('visionImage', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Vision Quote</label>
            <textarea
              value={service.visionQuote || ''}
              onChange={(e) => handleChange('visionQuote', e.target.value)}
              placeholder="Pull quote for the vision section..."
              rows={2}
            />
          </div>

          <div className="admin-form-group">
            <label>Vision Paragraph 1</label>
            <textarea
              value={service.visionPara1 || ''}
              onChange={(e) => handleChange('visionPara1', e.target.value)}
              placeholder="First paragraph of vision section..."
              rows={3}
            />
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label>Vision Paragraph 2</label>
            <textarea
              value={service.visionPara2 || ''}
              onChange={(e) => handleChange('visionPara2', e.target.value)}
              placeholder="Second paragraph of vision section..."
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Approach Tab */}
      {activeTab === 'approach' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ marginBottom: '20px' }}>
            <h3 className="admin-card-title">Approach Steps</h3>
            <button 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={addApproachItem}
            >
              <FiPlus /> Add Step
            </button>
          </div>

          {service.approachItems.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleApproachDragEnd}>
              <SortableContext items={service.approachItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                {service.approachItems.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdate={updateApproachItem}
                    onRemove={removeApproachItem}
                    type="approach"
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="admin-empty-state">
              <h3>No approach steps</h3>
              <p>Add steps to show your service process</p>
            </div>
          )}
        </div>
      )}

      {/* Service Cards Tab */}
      {activeTab === 'cards' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ marginBottom: '20px' }}>
            <h3 className="admin-card-title">Service Cards</h3>
            <button 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={addServiceCard}
            >
              <FiPlus /> Add Card
            </button>
          </div>

          {service.serviceCards.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCardDragEnd}>
              <SortableContext items={service.serviceCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                {service.serviceCards.map((card, index) => (
                  <SortableItem
                    key={card.id}
                    item={card}
                    index={index}
                    onUpdate={updateServiceCard}
                    onRemove={removeServiceCard}
                    type="card"
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="admin-empty-state">
              <h3>No service cards</h3>
              <p>Add cards to detail your service offerings</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
