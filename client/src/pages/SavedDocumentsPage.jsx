import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderArchive,
  FileText,
  MailCheck,
  Globe,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Edit,
  Search,
  Target,
  AlertTriangle,
  X,
  CheckCircle2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { storageService } from '../services/storageService';
import { pdfService } from '../services/pdfService';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

export const SavedDocumentsPage = () => {
  const { resumes, deleteResume, deleteAllResumes, duplicateResume, createNewResume } = useResume();
  const [coverLetters, setCoverLetters] = useState(() => storageService.getCoverLetters());
  const [jobMatches, setJobMatches] = useState(() => storageService.getJobMatches());
  const portfolio = storageService.getPortfolioSettings();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'resumes' | 'letters' | 'matches' | 'portfolios'
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteScope, setDeleteScope] = useState('current'); // 'current' | 'all'
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Single delete handlers
  const handleDeleteCoverLetter = (id) => {
    storageService.deleteCoverLetter(id);
    setCoverLetters(storageService.getCoverLetters());
    addToast('Cover letter deleted', 'info');
  };

  const handleDeleteJobMatch = (id) => {
    storageService.deleteJobMatch(id);
    setJobMatches(storageService.getJobMatches());
    addToast('Job match analysis removed', 'info');
  };

  const handleDuplicateResume = (id) => {
    const copy = duplicateResume(id);
    addToast(`Duplicated as "${copy.title}"`, 'success');
  };

  const handleNewResume = () => {
    const created = createNewResume({ title: `MERN Developer Resume ${resumes.length + 1}` });
    addToast('Created new resume document', 'success');
    navigate('/resumes/builder');
  };

  // Filtered lists
  const filteredResumes = resumes.filter(r =>
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoverLetters = coverLetters.filter(cl =>
    (cl.title || cl.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cl.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobMatches = jobMatches.filter(jm =>
    (jm.jobTitle || 'Job Match').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (jm.resumeTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDocsCount = resumes.length + coverLetters.length + jobMatches.length;

  const currentCategoryCount =
    activeFilter === 'resumes' ? resumes.length :
    activeFilter === 'letters' ? coverLetters.length :
    activeFilter === 'matches' ? jobMatches.length :
    activeFilter === 'portfolios' ? 1 : totalDocsCount;

  const getFilterLabel = (filter) => {
    switch (filter) {
      case 'resumes': return 'Resumes';
      case 'letters': return 'Cover Letters';
      case 'matches': return 'Job Matches';
      case 'portfolios': return 'Portfolios';
      default: return 'All Documents';
    }
  };

  // Delete All action handler
  const handleConfirmDeleteAll = () => {
    if (deleteScope === 'all' || activeFilter === 'all') {
      // Delete everything across all categories
      if (typeof deleteAllResumes === 'function') {
        deleteAllResumes();
      } else {
        storageService.deleteAllResumes();
      }
      storageService.deleteAllCoverLetters();
      storageService.deleteAllJobMatches();
      setCoverLetters([]);
      setJobMatches([]);
      addToast('All saved documents have been permanently deleted', 'success');
    } else if (activeFilter === 'resumes') {
      if (typeof deleteAllResumes === 'function') {
        deleteAllResumes();
      } else {
        storageService.deleteAllResumes();
      }
      addToast(`All ${resumes.length} saved resumes have been deleted`, 'success');
    } else if (activeFilter === 'letters') {
      storageService.deleteAllCoverLetters();
      setCoverLetters([]);
      addToast(`All ${coverLetters.length} cover letters have been deleted`, 'success');
    } else if (activeFilter === 'matches') {
      storageService.deleteAllJobMatches();
      setJobMatches([]);
      addToast(`All ${jobMatches.length} job match reports have been deleted`, 'success');
    }

    setShowDeleteModal(false);
  };

  const hasVisibleDocs =
    (activeFilter === 'all' && (filteredResumes.length > 0 || filteredCoverLetters.length > 0 || filteredJobMatches.length > 0 || Boolean(portfolio))) ||
    (activeFilter === 'resumes' && filteredResumes.length > 0) ||
    (activeFilter === 'letters' && filteredCoverLetters.length > 0) ||
    (activeFilter === 'matches' && filteredJobMatches.length > 0) ||
    (activeFilter === 'portfolios' && Boolean(portfolio));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">Document Repository</span>
            <span className="badge badge-neutral">{totalDocsCount} Total Items</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>My Saved Documents</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Access, edit, duplicate, download, and manage all your generated resumes, cover letters, and career assets.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" icon={Plus} onClick={handleNewResume}>
            New Resume
          </Button>
          <Link to="/cover-letter">
            <Button variant="secondary" icon={MailCheck}>
              New Cover Letter
            </Button>
          </Link>
          <Button
            variant="outline"
            icon={Trash2}
            disabled={totalDocsCount === 0}
            onClick={() => {
              setDeleteScope(activeFilter === 'all' ? 'all' : 'current');
              setShowDeleteModal(true);
            }}
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--primary-50)'
            }}
            title="Delete all saved documents"
          >
            Delete All
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'resumes', 'letters', 'matches', 'portfolios'].map(f => {
            const count =
              f === 'resumes' ? resumes.length :
              f === 'letters' ? coverLetters.length :
              f === 'matches' ? jobMatches.length :
              f === 'portfolios' ? 1 : totalDocsCount;

            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: activeFilter === f ? 'var(--color-primary)' : 'var(--border-color)',
                  backgroundColor: activeFilter === f ? 'var(--color-primary)' : 'var(--bg-surface)',
                  color: activeFilter === f ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{f === 'letters' ? 'Cover Letters' : f === 'matches' ? 'Job Matches' : f}</span>
                <span style={{
                  fontSize: '0.6875rem',
                  background: activeFilter === f ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface-subtle)',
                  color: activeFilter === f ? '#fff' : 'var(--text-muted)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '9999px',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ width: '100%', maxWidth: '320px', flex: '1 1 220px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search saved documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty State */}
      {!hasVisibleDocs && (
        <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)' }}>
            <FolderArchive size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
              No Saved Documents in {getFilterLabel(activeFilter)}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
              {searchQuery ? 'No documents matched your search term.' : 'You do not have any saved documents in this section yet. Create a resume or generate a cover letter to get started.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="primary" icon={Plus} onClick={handleNewResume}>
              Create New Resume
            </Button>
            <Link to="/cover-letter">
              <Button variant="secondary" icon={MailCheck}>
                Generate Cover Letter
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Documents Grid */}
      {hasVisibleDocs && (
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          
          {/* RESUMES */}
          {(activeFilter === 'all' || activeFilter === 'resumes') &&
            filteredResumes.map(res => (
              <Card key={res.id} elevated style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(33, 150, 211, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>{res.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Resume • {res.template || 'classic-ats'}
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-success">ATS {res.atsScore || 88}</span>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div>Target Role: <strong>{res.targetRole || 'Developer'}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Updated: {new Date(res.updatedAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
                  <Link to="/resumes/builder" style={{ flex: 1 }}>
                    <Button variant="primary" size="sm" icon={Edit} style={{ width: '100%' }}>
                      Open
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" icon={Copy} onClick={() => handleDuplicateResume(res.id)} title="Duplicate" />
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => deleteResume(res.id)} title="Delete" style={{ color: '#ef4444' }} />
                </div>
              </Card>
            ))}

          {/* COVER LETTERS */}
          {(activeFilter === 'all' || activeFilter === 'letters') &&
            filteredCoverLetters.map(cl => (
              <Card key={cl.id} elevated style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(11, 58, 91, 0.08)', color: 'var(--color-dark-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MailCheck size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>{cl.title || `${cl.jobTitle} Letter`}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Cover Letter • {cl.tone || 'Professional'}
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-primary">Saved</span>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div>Company: <strong>{cl.companyName || 'Target Company'}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Updated: {new Date(cl.updatedAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
                  <Link to="/cover-letter" style={{ flex: 1 }}>
                    <Button variant="primary" size="sm" icon={Edit} style={{ width: '100%' }}>
                      Open
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDeleteCoverLetter(cl.id)} title="Delete" style={{ color: '#ef4444' }} />
                </div>
              </Card>
            ))}

          {/* JOB MATCH ANALYSES */}
          {(activeFilter === 'all' || activeFilter === 'matches') &&
            filteredJobMatches.map(jm => (
              <Card key={jm.id} elevated style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(33, 150, 211, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>{jm.jobTitle || 'Job Match Analysis'}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Analysis • {jm.resumeTitle || 'Resume'}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${jm.matchScore >= 80 ? 'badge-success' : jm.matchScore >= 60 ? 'badge-primary' : 'badge-warning'}`}>
                    {jm.matchScore}% Match
                  </span>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div>Resume: <strong>{jm.resumeTitle || 'Standard Profile'}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Analyzed: {new Date(jm.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
                  <Link to="/job-match" style={{ flex: 1 }}>
                    <Button variant="primary" size="sm" icon={Edit} style={{ width: '100%' }}>
                      Open Analyzer
                    </Button>
                  </Link>
                  {jm.analysis && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={() => {
                        const res = resumes.find(r => r.id === jm.resumeId) || resumes[0];
                        pdfService.generateJobMatchReportPDF(jm.analysis, res, jm.jobTitle);
                        addToast('Downloaded Job Match Report PDF', 'success');
                      }}
                      title="Download PDF"
                    />
                  )}
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDeleteJobMatch(jm.id)} title="Delete" style={{ color: '#ef4444' }} />
                </div>
              </Card>
            ))}

          {/* PORTFOLIO ITEM */}
          {(activeFilter === 'all' || activeFilter === 'portfolios') && (
            <Card elevated style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(33, 150, 211, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Developer Portfolio</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Web Site • {portfolio.theme || 'tech-dark'}
                    </span>
                  </div>
                </div>
                <span className="badge badge-success">Live</span>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <div>URL: <strong>/portfolio/{portfolio.slug || 'gopinath'}</strong></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Status: Published & Accessible
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
                <Link to="/portfolio" style={{ flex: 1 }}>
                  <Button variant="secondary" size="sm" icon={Edit} style={{ width: '100%' }}>
                    Configure
                  </Button>
                </Link>
                <Link to={`/portfolio/${portfolio.slug || 'gopinath'}`} target="_blank" style={{ flex: 1 }}>
                  <Button variant="primary" size="sm" icon={ExternalLink} style={{ width: '100%' }}>
                    View Live
                  </Button>
                </Link>
              </div>
            </Card>
          )}

        </div>
      )}

      {/* CONFIRM DELETE ALL MODAL */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 58, 91, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            width: '100%',
            maxWidth: '480px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(33, 150, 211, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                    Delete Saved Documents
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Permanent removal confirmation
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Are you sure you want to permanently delete your saved documents? This action cannot be reversed.
              </p>

              {/* Scope Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {activeFilter !== 'all' && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${deleteScope === 'current' ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    background: deleteScope === 'current' ? 'rgba(33, 150, 211, 0.08)' : 'var(--bg-surface-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                    <input
                      type="radio"
                      name="deleteScope"
                      checked={deleteScope === 'current'}
                      onChange={() => setDeleteScope('current')}
                      style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                        Delete all in {getFilterLabel(activeFilter)} ({currentCategoryCount} items)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Only removes documents in the currently active tab.
                      </div>
                    </div>
                  </label>
                )}

                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${deleteScope === 'all' ? 'var(--color-primary)' : 'var(--border-color)'}`,
                  background: deleteScope === 'all' ? 'rgba(33, 150, 211, 0.08)' : 'var(--bg-surface-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="radio"
                    name="deleteScope"
                    checked={deleteScope === 'all'}
                    onChange={() => setDeleteScope('all')}
                    style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                      Delete all documents ({totalDocsCount} items across all categories)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Clears all resumes ({resumes.length}), cover letters ({coverLetters.length}), and job match reports ({jobMatches.length}).
                    </div>
                  </div>
                </label>
              </div>

              {/* Warning Notice */}
              <div style={{ padding: '0.75rem', background: 'rgba(33, 150, 211, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--primary-800)' }}>
                <AlertTriangle size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>Note: Your portfolio settings and profile details will remain preserved.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Trash2}
                onClick={handleConfirmDeleteAll}
              >
                Yes, Delete All
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SavedDocumentsPage;
