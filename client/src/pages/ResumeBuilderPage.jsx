import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { useProfile } from '../context/ProfileContext';
import ResumeEditor from '../components/resume/ResumeEditor';
import ResumePreview from '../components/resume/ResumePreview';
import { useToast } from '../components/common/Toast';
import { Eye, Edit3, Sparkles } from 'lucide-react';

export const ResumeBuilderPage = () => {
  const { resumes, saveResume, createNewResume } = useResume();
  const { profile } = useProfile();
  const { addToast } = useToast();

  const [activeResume, setActiveResume] = useState(() => {
    return resumes.length > 0 ? resumes[0] : null;
  });

  const [mobileView, setMobileView] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 1024 ? 'edit' : 'both';
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileView('both');
      } else if (mobileView === 'both') {
        setMobileView('edit');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileView]);

  useEffect(() => {
    if (!activeResume && resumes.length > 0) {
      setActiveResume(resumes[0]);
    } else if (!activeResume) {
      const created = createNewResume();
      setActiveResume(created);
    }
  }, [resumes]);

  const handleResumeChange = (updated) => {
    setActiveResume(updated);
  };

  const handleSave = () => {
    if (activeResume) {
      const saved = saveResume(activeResume);
      setActiveResume(saved);
      addToast('Resume saved successfully with updated ATS score!', 'success');
    }
  };

  const handleTemplateChange = (templateId) => {
    if (activeResume) {
      const updated = { ...activeResume, template: templateId };
      setActiveResume(updated);
      saveResume(updated);
      addToast(`Switched template to ${templateId}`, 'info');
    }
  };

  if (!activeResume) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Initializing Resume Builder...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 7rem)', gap: '1rem' }}>
      
      {/* Mobile Switcher (Visible only on mobile/tablet) */}
      <div className="lg:hidden" style={{ display: 'flex', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setMobileView('edit')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.875rem',
            background: mobileView === 'edit' ? 'var(--primary-600)' : 'transparent',
            color: mobileView === 'edit' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}
        >
          <Edit3 size={16} /> Edit Form
        </button>
        <button
          onClick={() => setMobileView('preview')}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.875rem',
            background: mobileView === 'preview' ? 'var(--primary-600)' : 'transparent',
            color: mobileView === 'preview' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}
        >
          <Eye size={16} /> Live Preview
        </button>
      </div>

      {/* Dual Pane Workstation */}
      <div className="resume-builder-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', minHeight: 0 }}>
        
        {/* Left Pane: Editor */}
        <div className={`builder-pane-edit ${mobileView === 'preview' ? 'hidden-mobile' : ''}`} style={{ height: '100%', overflowY: 'hidden' }}>
          <ResumeEditor
            resume={activeResume}
            onChange={handleResumeChange}
            onSave={handleSave}
          />
        </div>

        {/* Right Pane: Live Preview & ATS Controls */}
        <div className={`builder-pane-preview ${mobileView === 'edit' ? 'hidden-mobile' : ''}`} style={{ height: '100%', overflowY: 'hidden' }}>
          <ResumePreview
            resume={activeResume}
            onTemplateChange={handleTemplateChange}
          />
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .resume-builder-grid {
            grid-template-columns: 1fr !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilderPage;
