import React from 'react';

export const Badge = ({
  children,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  icon: Icon,
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
};

export const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger'
  showLabel = false,
  height = '8px',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const getVariantGradient = () => {
    switch (variant) {
      case 'success':
        return 'linear-gradient(90deg, #16A34A 0%, #15803d 100%)';
      case 'warning':
        return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
      case 'danger':
        return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
      case 'primary':
      default:
        return 'linear-gradient(90deg, #073B68 0%, #079FE8 100%)';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="progress-bar-container" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            background: getVariantGradient()
          }}
        />
      </div>
    </div>
  );
};

export default Badge;
