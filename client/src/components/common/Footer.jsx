import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        paddingTop: '3.75rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto'
      }}
    >
      <div className="container-custom">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr 1fr 1fr 1.1fr',
            gap: '2rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '320px' }}>
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
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B3A5B' }}>
                CareerCraft<span style={{ color: '#2196D3' }}> AI</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0B3A5B', margin: 0 }}>
              Build Your Career. Get Noticed.
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Create ATS-friendly resumes, professional portfolios, personalized cover letters, and smarter career plans — all in one unified platform.
            </p>
          </div>

          {/* Group 1: Product */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B3A5B', marginBottom: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/resumes/builder" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  ATS Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  ATS Score Analyzer
                </Link>
              </li>
              <li>
                <Link to="/cover-letter" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link to="/portfolio" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Portfolio Builder
                </Link>
              </li>
              <li>
                <Link to="/job-match" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Job Match Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 2: Career Resources */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B3A5B', marginBottom: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Career Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/career-recommendation" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Role Recommendations
                </Link>
              </li>
              <li>
                <Link to="/skill-gap" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Skill Gap Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/portfolio/gopinath" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Public Portfolio Demo
                </Link>
              </li>
              <li>
                <Link to="/documents" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Saved Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 3: Company */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B3A5B', marginBottom: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <a href="#how-it-works" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Core Features
                </a>
              </li>
              <li>
                <a href="#career-tools" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Career Tools
                </a>
              </li>
              <li>
                <Link to="/settings" style={{ color: '#64748B', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
                  Settings & Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 4: Contact & Support */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B3A5B', marginBottom: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact & Support
            </h4>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>
              CareerCraft AI Support
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '1rem', lineHeight: 1.5 }}>
              Have questions or feedback? Reach out to our technical team.
            </p>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                aria-label="GitHub Repository"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <GithubIcon size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                aria-label="LinkedIn Profile"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href="mailto:support@careercraft.dev"
                className="btn btn-secondary btn-sm"
                aria-label="Email Support"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#64748B'
          }}
        >
          <div>
            &copy; {currentYear} CareerCraft AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/settings" style={{ color: '#64748B' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
              Privacy Policy
            </Link>
            <Link to="/settings" style={{ color: '#64748B' }} onMouseEnter={(e) => e.target.style.color = '#2196D3'} onMouseLeave={(e) => e.target.style.color = '#64748B'}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
