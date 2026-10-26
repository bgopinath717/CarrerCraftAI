import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const combinedClassName = `btn btn-${variant} ${sizeClasses[size] || ''} ${className}`;

  const renderIcon = () => {
    if (loading) {
      return (
        <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      );
    }
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    return <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />;
  };

  const content = (
    <>
      {renderIcon()}
      {children && <span>{children}</span>}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={combinedClassName} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={combinedClassName} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
