import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, loginDemoUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      addToast(`Welcome back, ${res.user?.name || 'User'}!`, 'success');
      navigate('/dashboard');
    } else {
      addToast(res.message || 'Invalid credentials', 'danger');
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    addToast('Logged in as B. Gopinath (Demo Mode)', 'success');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/logo.png"
            alt="CareerCraft AI Logo"
            style={{
              width: '3.5rem',
              height: '3.5rem',
              objectFit: 'contain',
              marginBottom: '1rem'
            }}
          />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Log in to manage your resumes, portfolio, and career plans
          </p>
        </div>

        {/* Form Card */}
        <Card elevated style={{ padding: '2rem' }}>
          
          {/* Quick 1-Click Demo Login Banner */}
          <div style={{
            padding: '0.875rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-light)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              <UserCheck size={16} />
              <span>Instant Review Mode</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Evaluate the complete MERN application preloaded with <strong>B. Gopinath's</strong> profile and projects.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={handleDemoLogin}
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              1-Click Login as B. Gopinath
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Or enter details</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem' }} />
                <input
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="gopinath@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); addToast('Password reset link sent to demo email.', 'info'); }}
                  style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem' }} />
                <input
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default LoginPage;
