import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  User,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'ATS Analysis Complete', desc: 'Your MERN Developer Resume scored 88/100.', time: '10m ago' },
    { id: 2, title: 'Portfolio Published', desc: 'Your portfolio is live at /portfolio/gopinath', time: '1h ago' },
    { id: 3, title: 'Career Guidance Ready', desc: '3 new role recommendations matched your profile.', time: '2h ago' }
  ];

  return (
    <header style={{
      height: '4.5rem',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Left: Mobile Toggle & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '480px' }}>
        <button
          onClick={onOpenSidebar}
          className="btn-ghost lg:hidden"
          style={{ padding: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <Menu size={22} />
        </button>

        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search resumes, jobs, skills, documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '2.25rem',
              paddingTop: '0.45rem',
              paddingBottom: '0.45rem',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-ghost"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} />
          </button>

          {showNotifications && (
            <div
              className="card-elevated"
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: 'min(320px, calc(100vw - 2rem))',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                zIndex: 60,
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Notifications</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-500)', fontWeight: 600 }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-subtle)', fontSize: '0.8125rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{n.desc}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginTop: '0.2rem' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #073B68 0%, #079FE8 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {user?.name ? user.name.charAt(0) : 'G'}
          </div>
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden.md\\:inline-flex { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
