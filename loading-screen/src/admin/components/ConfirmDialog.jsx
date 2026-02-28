import { useEffect, useRef } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger' // 'danger', 'warning', 'info'
}) {
  const dialogRef = useRef(null);
  const confirmBtnRef = useRef(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && document.activeElement === confirmBtnRef.current) {
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus confirm button on open
    setTimeout(() => confirmBtnRef.current?.focus(), 100);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={handleBackdropClick}>
      <div className="confirm-dialog" ref={dialogRef} role="dialog" aria-modal="true">
        <button className="confirm-dialog-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>
        
        <div className={`confirm-dialog-icon ${variant}`}>
          <FiAlertTriangle size={24} />
        </div>
        
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-btn cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            ref={confirmBtnRef}
            className={`confirm-dialog-btn confirm ${variant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
