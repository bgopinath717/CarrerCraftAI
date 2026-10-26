import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: 'clamp(5rem, 12vw, 8rem)',
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: '-0.05em'
      }} className="gradient-text">
        404
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.75rem' }}>
        Oops! Page Not Found
      </h1>

      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.6 }}>
        The career resource or page you are looking for might have been moved, renamed, or is currently unavailable.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/dashboard">
          <Button variant="primary" size="lg" icon={Compass}>
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="lg" icon={Home}>
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
