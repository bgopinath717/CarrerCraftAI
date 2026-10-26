import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Globe,
  MailCheck,
  Compass,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useResume } from '../context/ResumeContext';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/Badge';
import { ATSScoreGauge } from '../components/ats/ATSScoreGauge';
import { storageService } from '../services/storageService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { profile, completionPercentage, missingSections } = useProfile();
  const { resumes, createNewResume } = useResume();
  const coverLetters = storageService.getCoverLetters();
  const portfolioSettings = storageService.getPortfolioSettings();

  const completedResumes = resumes.filter(r => r.status === 'Completed').length;
  const draftResumes = resumes.filter(r => r.status !== 'Completed').length;
  const latestAtsScore = resumes.length > 0 ? resumes[0].atsScore || 88 : 88;

  const quickActions = [
    {
      title: "Create Resume",
      desc: "Build an ATS-optimized single/multi-page resume.",
      icon: FileText,
      link: "/resumes/builder",
      color: "#079FE8"
    },
    {
      title: "Build Portfolio",
      desc: "Customize and publish your live developer site.",
      icon: Globe,
      link: "/portfolio",
      color: "#073B68"
    },
    {
      title: "Generate Cover Letter",
      desc: "Create an AI-customized job cover letter.",
      icon: MailCheck,
      link: "/cover-letter",
      color: "#38C5F5"
    },
    {
      title: "Get Career Recommendation",
      desc: "Discover matching tech roles and skill roadmaps.",
      icon: Compass,
      link: "/career-recommendation",
      color: "#062B4F"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div className="card glass-panel" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(7, 159, 232, 0.08) 0%, rgba(56, 197, 245, 0.05) 100%)',
        border: '1px solid rgba(7, 159, 232, 0.2)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">MERN Developer Portal</span>
            <span className="badge badge-success">Candidate Active</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || 'Gopinath'}!
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Build your career profile and get ready for your next opportunity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/resumes/builder">
            <Button variant="primary" icon={Plus}>
              New Resume
            </Button>
          </Link>
          <Link to="/job-match">
            <Button variant="secondary" icon={Target}>
              Match Job
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Statistics Cards */}
      <div className="grid-4">
        
        {/* Stat 1: Resume Stats */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Resumes</span>
            <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', background: 'rgba(7, 159, 232, 0.1)', color: '#079FE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{resumes.length}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              ({completedResumes} Completed, {draftResumes} Draft)
            </span>
          </div>
          <Link to="/resumes/builder" style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#079FE8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            <span>Edit in Builder</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Stat 2: Portfolio Status */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Portfolio</span>
            <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 197, 245, 0.1)', color: '#073B68', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={16} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-success">Published & Live</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Slug: /portfolio/{portfolioSettings?.slug || 'gopinath'}
            </div>
          </div>
          <Link to={`/portfolio/${portfolioSettings?.slug || 'gopinath'}`} target="_blank" style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#079FE8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </Link>
        </Card>

        {/* Stat 3: Latest ATS Score */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Latest ATS Score</span>
            <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>{latestAtsScore}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
          </div>
          <Link to="/ats-checker" style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            <span>Run Deep Audit</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Stat 4: Profile Completion */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Career Profile</span>
            <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <span>Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <ProgressBar value={completionPercentage} variant={completionPercentage >= 80 ? 'success' : 'warning'} />
          </div>
          <Link to="/profile" style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            <span>Complete Profile</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

      </div>

      {/* QUICK ACTIONS SECTION */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div className="grid-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link to={action.link} key={idx} style={{ textDecoration: 'none' }}>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', transition: 'all 0.2s' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: `${action.color}15`,
                    color: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{action.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{action.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RECENT DOCUMENTS & PROFILE HEALTH */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        
        {/* Recent Resumes */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>My Saved Resumes</h3>
            <Link to="/documents" style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resumes.map(res => (
              <div key={res.id} style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    ATS {res.atsScore || 88}
                  </span>
                  <Link to="/resumes/builder">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Strength & Missing Insights */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Profile Strength Insights</h3>
            <span className="badge badge-primary">{completionPercentage}% Completed</span>
          </div>

          {missingSections.length === 0 ? (
            <div style={{ padding: '1rem', background: '#F0FDF4', border: '1px solid rgba(22, 163, 74, 0.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={24} color="#16A34A" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#16A34A' }}>Profile All Set!</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  All key sections including skills, education, projects, and work experience are complete.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Complete the following sections to maximize ATS scoring and portfolio impact:
              </p>
              {missingSections.map((sec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
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
