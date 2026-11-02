import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Globe,
  MailCheck,
  Compass,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  FileSearch,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useResume } from '../context/ResumeContext';
import Button from '../components/common/Button';
import { Card, LoadingSpinner } from '../components/common/Card';
import { ProgressBar } from '../components/common/Badge';
import { apiService } from '../services/api';
import { storageService } from '../services/storageService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { profile, completionPercentage, missingSections } = useProfile();
  const { resumes, createNewResume } = useResume();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiService
      .getDashboard()
      .then((res) => {
        if (isMounted && res?.success && res?.dashboard) {
          setDashboardData(res.dashboard);
        }
      })
      .catch((err) => {
        console.error('[Dashboard fetch error]:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resumes.length]);

  const userName = user?.name || dashboardData?.user?.name || 'User';

  // Real statistics derived from database
  const totalResumes = dashboardData?.counts?.resumes ?? resumes.length;
  const completedResumes = dashboardData?.counts?.completedResumes ?? resumes.filter((r) => r.status === 'Completed').length;
  const draftResumes = dashboardData?.counts?.draftResumes ?? (totalResumes - completedResumes);
  const coverLettersCount = dashboardData?.counts?.coverLetters ?? storageService.getCoverLetters().length;
  const latestAtsScore = dashboardData?.latestAtsScore;
  const userPortfolio = dashboardData?.portfolio || storageService.getPortfolioSettings();

  const quickActions = [
    {
      title: 'Resume Builder',
      desc: 'Build an ATS-optimized professional resume.',
      icon: FileText,
      link: '/resumes/builder',
      color: '#079FE8',
    },
    {
      title: 'ATS Resume Analyzer',
      desc: 'Check keyword matching and scoring.',
      icon: FileSearch,
      link: '/ats-checker',
      color: '#16A34A',
    },
    {
      title: 'Cover Letter Generator',
      desc: 'Generate tailored AI cover letters.',
      icon: MailCheck,
      link: '/cover-letter',
      color: '#38C5F5',
    },
    {
      title: 'Portfolio Builder',
      desc: 'Publish your personal developer portfolio.',
      icon: Globe,
      link: '/portfolio',
      color: '#073B68',
    },
  ];

  if (loading && !dashboardData && resumes.length === 0) {
    return (
      <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" message="Loading your personal dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="card glass-panel"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(7, 159, 232, 0.08) 0%, rgba(56, 197, 245, 0.05) 100%)',
          border: '1px solid rgba(7, 159, 232, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">Personal Workspace</span>
            <span className="badge badge-success">Active Session</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: 'var(--color-dark-blue)',
            }}
          >
            Welcome, {userName}!
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Manage your ATS resumes, portfolio, cover letters, and career guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/resumes/builder">
            <Button variant="primary" icon={Plus}>
              Create Resume
            </Button>
          </Link>
          <Link to="/ats-checker">
            <Button variant="secondary" icon={FileSearch}>
              Analyze Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Statistics Cards (Real data only, no fake stats) */}
      <div className="grid-4">
        {/* Stat 1: Resumes */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>My Resumes</span>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(7, 159, 232, 0.1)',
                color: '#079FE8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>{totalResumes}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              ({completedResumes} Completed, {draftResumes} Draft)
            </span>
          </div>
          <Link
            to="/resumes/builder"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#079FE8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: 'auto',
            }}
          >
            <span>{totalResumes > 0 ? 'Manage in Builder' : 'Create My First Resume'}</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Stat 2: Portfolio */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Portfolio</span>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 197, 245, 0.1)',
                color: '#073B68',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={16} />
            </div>
          </div>
          <div>
            {userPortfolio?.slug ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success">Published & Live</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Slug: /portfolio/{userPortfolio.slug}
                </div>
              </>
            ) : (
              <div>
                <span className="badge badge-warning">Not Created Yet</span>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Your site is waiting to be built
                </div>
              </div>
            )}
          </div>
          {userPortfolio?.slug ? (
            <Link
              to={`/portfolio/${userPortfolio.slug}`}
              target="_blank"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#079FE8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: 'auto',
              }}
            >
              <span>View Public Site</span>
              <ExternalLink size={14} />
            </Link>
          ) : (
            <Link
              to="/portfolio"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#079FE8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: 'auto',
              }}
            >
              <span>Build My Portfolio</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </Card>

        {/* Stat 3: Latest ATS Score */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Latest ATS Score</span>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(22, 163, 74, 0.1)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} />
            </div>
          </div>
          {latestAtsScore !== null && latestAtsScore !== undefined && latestAtsScore > 0 ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>{latestAtsScore}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-muted)' }}>No Score Yet</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload a resume to evaluate</div>
            </div>
          )}
          <Link
            to="/ats-checker"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: 'auto',
            }}
          >
            <span>{latestAtsScore ? 'Run Deep Audit' : 'Analyze My Resume'}</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Stat 4: Cover Letters */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cover Letters</span>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 197, 245, 0.1)',
                color: '#38C5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MailCheck size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>{coverLettersCount}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Generated</span>
          </div>
          <Link
            to="/cover-letter"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#38C5F5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: 'auto',
            }}
          >
            <span>{coverLettersCount > 0 ? 'View Letters' : 'Generate Cover Letter'}</span>
            <ArrowRight size={14} />
          </Link>
        </Card>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-blue)', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div className="grid-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link to={action.link} key={idx} style={{ textDecoration: 'none' }}>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', transition: 'all 0.2s' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: `${action.color}15`,
                      color: action.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: 0 }}>
                    {action.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {action.desc}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* MAIN SECTIONS WITH CLEAN EMPTY STATES */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Section 1: My Saved Resumes */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: 0 }}>
              My Saved Resumes
            </h3>
            {resumes.length > 0 && (
              <Link to="/documents" style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                View All
              </Link>
            )}
          </div>

          {resumes.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  background: 'rgba(7, 159, 232, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#079FE8',
                }}
              >
                <FileText size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  You haven't created any resumes yet.
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Build your first ATS-optimized resume with guided templates.
                </p>
              </div>
              <Link to="/resumes/builder">
                <Button variant="primary" size="sm" icon={Plus}>
                  Create My First Resume
                </Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resumes.slice(0, 3).map((res) => (
                <div
                  key={res.id || res._id}
                  style={{
                    padding: '0.875rem 1rem',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={18} color="var(--primary-600)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{res.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Updated: {new Date(res.updatedAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {res.atsScore > 0 && (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        ATS {res.atsScore}
                      </span>
                    )}
                    <Link to="/resumes/builder">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Section 2: Profile Strength & Guidance */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: 0 }}>
              Career Profile Strength
            </h3>
            <span className="badge badge-primary">{completionPercentage}% Completed</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>Profile Completeness</span>
              <span>{completionPercentage}%</span>
            </div>
            <ProgressBar value={completionPercentage} variant={completionPercentage >= 80 ? 'success' : 'warning'} />
          </div>

          {missingSections.length === 0 ? (
            <div
              style={{
                padding: '1rem',
                background: '#F0FDF4',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <CheckCircle2 size={24} color="#16A34A" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#16A34A' }}>Profile Complete!</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  All key sections including skills, education, projects, and work experience are in place.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                Complete the following sections to maximize your ATS match score:
              </p>
              {missingSections.slice(0, 3).map((sec, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-primary)' }}
                >
                  <AlertCircle size={14} color="#f59e0b" />
                  <span>{sec}</span>
                </div>
              ))}
              <Link to="/profile" style={{ marginTop: '0.5rem' }}>
                <Button variant="primary" size="sm" style={{ width: '100%' }}>
                  Update Profile Details
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
