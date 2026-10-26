import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  FileSearch,
  Sparkles,
  Globe,
  MailCheck,
  TrendingUp,
  Compass,
  FolderArchive,
  Settings,
  LogOut,
  X,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Resume Builder', path: '/resumes/builder', icon: FileText },
    { name: 'ATS Analyzer', path: '/ats-checker', icon: FileSearch },
    { name: 'Job Match Analyzer', path: '/job-match', icon: Target },
    { name: 'Portfolio Builder', path: '/portfolio', icon: Globe },
    { name: 'Cover Letter', path: '/cover-letter', icon: MailCheck },
    { name: 'Career Recommendation', path: '/career-recommendation', icon: Compass },
    { name: 'Skill Gap Analysis', path: '/skill-gap', icon: TrendingUp },
    { name: 'Saved Documents', path: '/documents', icon: FolderArchive },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(2px)'
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar Content */}
      <aside
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform var(--transition-normal)',
          transform: isOpen ? 'translateX(0)' : undefined
        }}
        className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        {/* Brand Header */}
        <div style={{
          height: '4.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
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
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                CareerCraft<span className="gradient-text"> AI</span>
              </span>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                ATS & CAREER PLATFORM
              </span>
            </div>
          </NavLink>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-ghost lg:hidden"
              style={{ padding: '0.35rem', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : 'var(--color-dark-blue)'} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #073B68 0%, #079FE8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              flexShrink: 0
            }}>
              {user?.name ? user.name.charAt(0) : 'G'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'B. Gopinath'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.role || 'MERN Stack Dev'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{ padding: '0.5rem', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .sidebar-closed {
            transform: translateX(-100%);
          }
        }
        @media (min-width: 1024px) {
          .sidebar-container {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
