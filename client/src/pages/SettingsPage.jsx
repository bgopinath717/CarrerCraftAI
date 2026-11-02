import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield, Bell, Moon, Save, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';
import { apiService } from '../services/api';
import { storageService } from '../services/storageService';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { resetToEmpty } = useProfile();
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const payload = {
        ...settings,
        name,
        email,
        password: password !== '••••••••' ? password : null,
      };

      const res = await apiService.updateSettings(payload);
      if (res.success) {
        addToast('Preferences and account profile saved to database!', 'success');
      } else {
        addToast(res.message || 'Failed to update settings', 'danger');
      }
    } catch (e) {
      addToast(e.message || 'Error updating settings', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleClearWorkspaceData = () => {
    if (window.confirm('Are you sure you want to clear your local draft state?')) {
      resetToEmpty();
      addToast('Local workspace drafts reset.', 'info');
    }
  };

  const handleLogout = async () => {
    await logout();
    addToast('Signed out of session', 'info');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-blue)', marginBottom: '0.5rem' }}>
          Account Settings & Preferences
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your personal account credentials, document privacy, and display preferences.
        </p>
      </div>

      {/* Account Profile Card */}
      <Card style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <User size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Personal Profile</h2>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div>
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password to change"
          />
          <div className="input-helper">Leave as bullets to keep your current password.</div>
        </div>
      </Card>

      {/* Preferences Card */}
      <Card style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <Shield size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Privacy & Notification Preferences</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Email Notifications</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Receive periodic notifications for ATS scan updates and recommendations.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Public Portfolio Visibility</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Allow external recruiters to view your published portfolio website.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.publicPortfolio}
            onChange={(e) => setSettings({ ...settings, publicPortfolio: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button variant="primary" icon={Save} loading={loading} onClick={handleSaveSettings}>
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Session & Account Management */}
      <Card style={{ padding: '1.75rem', border: '1px solid #ef444440', background: 'rgba(239, 68, 68, 0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ef4444', margin: 0 }}>Session & Workspace</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Reset Local Drafts</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Clear local cached form state and start fresh.
            </div>
          </div>
          <Button variant="outline" size="sm" icon={Trash2} onClick={handleClearWorkspaceData}>
            Clear Drafts
          </Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Account Session</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Sign out of your active authenticated session on this device.
            </div>
          </div>
          <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
