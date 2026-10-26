import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('B. Gopinath');
  const [email, setEmail] = useState('gopinath.mern@example.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      addToast('Please fill out all required fields', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'danger');
      return;
    }
    if (!agreeTerms) {
      addToast('Please accept terms and conditions', 'warning');
      return;
    }

    setLoading(true);
    const res = await register(fullName, email, password);
    setLoading(false);

    if (res.success) {
      addToast(`Account created successfully! Welcome ${fullName}.`, 'success');
      navigate('/dashboard');
    } else {
      addToast(res.message || 'Registration failed', 'danger');
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
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
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Start building your ATS-friendly career documents in seconds
          </p>
        </div>

        {/* Form Card */}
        <Card elevated style={{ padding: '2rem' }}>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. B. Gopinath"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem' }} />
                <input
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. gopinath@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem' }} />
                <input
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem' }} />
                <input
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                I agree to the Terms of Service & Privacy Policy
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
              Create My Free Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default RegisterPage;
