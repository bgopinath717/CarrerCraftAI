import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Save,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { storageService } from '../services/storageService';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { resetToSample } = useProfile();
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [name, setName] = useState(user?.name || 'B. Gopinath');
  const [email, setEmail] = useState(user?.email || 'gopinath.mern@example.com');
  const [password, setPassword] = useState('••••••••');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    storageService.saveSettings(settings);
    storageService.setUser({ ...user, name, email });
    addToast('Preferences and account settings saved!', 'success');
  };

  const handleResetAllData = () => {
    resetToSample();
    storageService.initialize();
    addToast('Demo database restored to default state', 'info');
  };

  const handleLogout = () => {
    logout();
    addToast('Signed out of session', 'info');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '880px', width: '100%' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">Platform Settings</span>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Account & Preferences</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Manage your credentials, notifications, and portfolio privacy controls.
        </p>
      </div>

      {/* Account Profile Card */}
      <Card elevated style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--color-primary)" />
          Account Profile
        </h3>

        <div className="grid-2">
          <div>
            <label className="input-label">Display Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="input-label">Change Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </div>
      </Card>

      {/* Preferences Card */}
      <Card elevated style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={18} color="var(--color-primary)" />
          Application Preferences
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Email Notifications</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Receive updates on ATS scans and career recommendation alerts
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Public Portfolio Visibility</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Allow external recruiters to view your live portfolio at /portfolio/gopinath
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
          <Button variant="primary" icon={Save} onClick={handleSaveSettings}>
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Danger Zone & Logout */}
      <Card style={{ padding: '1.75rem', border: '1px solid #ef444440', background: 'rgba(239, 68, 68, 0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ef4444' }}>Danger Zone & Session</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Reset Demo Database</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Reload initial sample profile and project data for B. Gopinath
            </div>
          </div>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetAllData}>
            Reset Sample Data
          </Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Account Session</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              End your active authenticated session on this browser
            </div>
          </div>
          <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Card>

    </div>
  );
};

export default SettingsPage;
