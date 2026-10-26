import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'ATS Checker', path: '/ats-checker' },
    { name: 'Career Guidance', path: '/career-recommendation' }
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.25rem' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="CareerCraft AI Logo"
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--radius-md)',
              objectFit: 'contain'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0B3A5B' }}>
              CareerCraft<span style={{ color: '#2196D3' }}> AI</span>
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              ATS Resume & Career Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-links" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                if (link.path.startsWith('/#')) {
                  e.preventDefault();
                  handleNavClick(link.path);
                }
              }}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: location.pathname === link.path && !link.path.includes('#') ? '#2196D3' : '#1E293B',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.target.style.color = '#2196D3')}
              onMouseLeave={(e) => (e.target.style.color = location.pathname === link.path && !link.path.includes('#') ? '#2196D3' : '#1E293B')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Button to="/dashboard" variant="primary" size="md" icon={LayoutDashboard}>
                Dashboard
              </Button>
              <button
                onClick={logout}
                className="btn btn-ghost btn-sm"
                title="Log Out"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B' }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Button to="/login" variant="ghost" size="md">
                Log In
              </Button>
              <Button to="/resumes/builder" variant="primary" size="md" icon={ArrowRight}>
                Create My Resume
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-toggle">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost"
            aria-label="Toggle navigation menu"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', color: '#0B3A5B' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem'
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                if (link.path.startsWith('/#')) {
                  e.preventDefault();
                  handleNavClick(link.path);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E293B',
                padding: '0.5rem 0',
                borderBottom: '1px solid #F1F5F9'
              }}
            >
              {link.name}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
            {isAuthenticated ? (
              <>
                <Button
                  to="/dashboard"
                  variant="primary"
                  style={{ width: '100%' }}
                  icon={LayoutDashboard}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Button>
                <Button
                  variant="secondary"
                  style={{ width: '100%' }}
                  icon={LogOut}
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  to="/login"
                  variant="secondary"
                  style={{ width: '100%' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Button>
                <Button
                  to="/resumes/builder"
                  variant="primary"
                  style={{ width: '100%' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create My Resume
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-links { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
