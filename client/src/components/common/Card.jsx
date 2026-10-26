import React from 'react';
import { X } from 'lucide-react';

export const Card = ({
  children,
  className = '',
  elevated = false,
  glass = false,
  onClick,
  style = {},
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card ${elevated ? 'card-elevated' : ''} ${glass ? 'glass-panel' : ''} ${className}`}
      style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '550px'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: 'none' }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeMap = {
    sm: '20px',
    md: '36px',
    lg: '54px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--primary-500)',
          borderRadius: '50%',
          animation: 'spinSlow 0.8s linear infinite'
        }}
      />
      {message && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{message}</p>}
    </div>
  );
};
