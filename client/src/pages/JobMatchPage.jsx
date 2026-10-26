import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Briefcase,
  Copy,
  Lightbulb,
  Download,
  Bookmark,
  Check,
  RotateCcw,
  FileText,
  Layers,
  GraduationCap,
  Info,
  ExternalLink,
  Code2,
  Upload,
  FolderOpen,
  Trash2,
  FileUp,
  FileCheck
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { atsEngine } from '../services/atsEngine';
import { apiService } from '../services/api';
import { pdfService } from '../services/pdfService';
import { storageService } from '../services/storageService';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ATSScoreGauge } from '../components/ats/ATSScoreGauge';
import { useToast } from '../components/common/Toast';

export const JobMatchPage = () => {
  const navigate = useNavigate();
  const { resumes } = useResume();
  const fileInputRef = useRef(null);

  // Resume source selection mode: 'saved' | 'upload'
  const [resumeSourceMode, setResumeSourceMode] = useState('saved');
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileText, setUploadedFileText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [jobDescription, setJobDescription] = useState(
    `Position: Full Stack MERN Developer
Company: Apex Cloud Solutions
Requirements:
• Strong experience with React.js, modern JavaScript (ES6+), and CSS3/Tailwind.
• Hands-on backend skills with Node.js and Express.js REST APIs.
• Experience in MongoDB schema modeling, queries, and JWT authentication.
• Familiarity with Git version control, TypeScript, Docker containerization, and AWS deployment.`
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [isAiPowered, setIsAiPowered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [inputsChanged, setInputsChanged] = useState(false);

  // Initial evaluation
  const [matchResult, setMatchResult] = useState(() => {
    return atsEngine.compareJobDescription(resumes[0], jobDescription);
  });
  const { addToast } = useToast();

  useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0].id);
    }
  }, [resumes, selectedResumeId]);

  const activeResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];

  const handleResumeChange = (e) => {
    setSelectedResumeId(e.target.value);
    setInputsChanged(true);
    setIsSaved(false);
  };

  const handleJdChange = (e) => {
    setJobDescription(e.target.value);
    setInputsChanged(true);
    setIsSaved(false);
  };

  // Upload handlers
  const validateAndSetFile = async (selectedFile) => {
    if (!selectedFile) return;

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExt) {
      addToast('Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or text file (.txt).', 'error');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      addToast('File size exceeds 10MB limit. Please upload a smaller document.', 'error');
      return;
    }

    setUploadedFile(selectedFile);
    setInputsChanged(true);
    setIsSaved(false);

    // Extract raw text client-side for immediate inspection & fallback
    try {
      const raw = await selectedFile.text().catch(() => '');
      if (raw && raw.length > 30) {
        const cleaned = raw.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s+/g, ' ');
        setUploadedFileText(cleaned);
      }
    } catch {
      // Background parsing via server on submit
    }

    addToast(`Loaded ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`, 'success');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadedFileText('');
    setInputsChanged(true);
    setIsSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Uploaded resume removed.', 'info');
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescription || jobDescription.trim().length < 25) {
      addToast('Please paste a complete job description (at least 25 characters).', 'warning');
      return;
    }

    if (resumeSourceMode === 'upload' && !uploadedFile) {
      addToast('Please upload a resume file (PDF, DOCX, or TXT) first.', 'warning');
      return;
    }

    setAnalyzing(true);
    const currentResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];

    try {
      if (resumeSourceMode === 'upload' && uploadedFile) {
        // If file text is already readable client-side (TXT or pre-extracted)
        if (uploadedFileText && uploadedFileText.length > 30) {
          await new Promise(r => setTimeout(r, 200));
          const result = atsEngine.compareJobDescription(uploadedFileText, jobDescription);
          setMatchResult(result);
          setIsAiPowered(false);
          setInputsChanged(false);
          setAnalyzing(false);
          addToast(`Job Match Complete: ${result.matchScore}% Match Score for ${uploadedFile.name}!`, 'success');
          return;
        }

        // Fast server document text extraction for PDF / DOCX
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('jobDescription', jobDescription.trim());

        const serverResult = await apiService.analyzeJobMatchAI(formData);
        if (serverResult && serverResult.matchScore !== undefined) {
          setMatchResult(serverResult);
          setIsAiPowered(false);
          setInputsChanged(false);
          setAnalyzing(false);
          addToast(`Job Match Complete: ${serverResult.matchScore}% Match Score for ${uploadedFile.name}!`, 'success');
          return;
        }
      } else {
        // Saved resume evaluation: instant recruiter criteria analysis
        await new Promise(r => setTimeout(r, 200));
        const result = atsEngine.compareJobDescription(currentResume, jobDescription);
        setMatchResult(result);
        setIsAiPowered(false);
        setInputsChanged(false);
        setAnalyzing(false);
        addToast(`Job Match Complete: ${result.matchScore}% Match Score!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('[Job Match Notice]: Local evaluation:', err);
    }

    // Fast fallback evaluation
    const targetSource = (resumeSourceMode === 'upload' && uploadedFileText) ? uploadedFileText : currentResume;
    const result = atsEngine.compareJobDescription(targetSource, jobDescription);
    setMatchResult(result);
    setIsAiPowered(false);
    setInputsChanged(false);
    setAnalyzing(false);
    addToast(`Job Match Complete: ${result.matchScore}% Match Score!`, 'success');
  };

  // 9. Available Actions
  const handleImproveResume = () => {
    navigate('/resumes/builder');
  };

  const handleAnalyzeAnother = () => {
    setJobDescription('');
    setMatchResult(null);
    setInputsChanged(true);
    setIsSaved(false);
  };

  const handleSaveAnalysis = () => {
    if (!matchResult) return;
    const isUpload = resumeSourceMode === 'upload' && uploadedFile;
    const resumeTitle = isUpload ? uploadedFile.name : (activeResume?.title || 'MERN Developer Resume');
    const candidateName = isUpload ? (matchResult?.candidateName || uploadedFile.name.replace(/\.[^/.]+$/, '')) : (activeResume?.personalInfo?.fullName || 'B. Gopinath');

    const savePayload = {
      id: `jm-${Date.now()}`,
      resumeId: isUpload ? `upload-${Date.now()}` : (activeResume?.id || 'res-default'),
      resumeTitle,
      candidateName,
      jobTitle: extractJobTitle(jobDescription),
      matchScore: matchResult.matchScore,
      scoreInterpretation: matchResult.scoreInterpretation,
      analysis: matchResult,
      jobDescriptionSnippet: jobDescription.slice(0, 200)
    };
    storageService.saveJobMatch(savePayload);
    setIsSaved(true);
    addToast('Job Match Analysis saved to your Document Repository!', 'success');
  };

  const handleDownloadReport = () => {
    if (!matchResult) return;
    const isUpload = resumeSourceMode === 'upload' && uploadedFile;
    const resumeTitle = isUpload ? uploadedFile.name : (activeResume?.title || 'Resume');
    const candidateName = isUpload ? (matchResult?.candidateName || uploadedFile.name.replace(/\.[^/.]+$/, '')) : (activeResume?.personalInfo?.fullName || 'B. Gopinath');

    try {
      pdfService.generateJobMatchReportPDF({
        analysis: matchResult,
        resumeTitle,
        candidateName,
        jobTitle: extractJobTitle(jobDescription)
      });
      addToast('Job Match Audit Report downloaded successfully.', 'success');
    } catch (err) {
      console.error('[PDF Download Error]:', err);
      addToast('Failed to export PDF report.', 'error');
    }
  };

  const extractJobTitle = (jd) => {
    const match = jd.match(/(?:position|role|title|opening)\s*:\s*([^\n\r]+)/i);
    if (match && match[1]) return match[1].trim();
    const firstLine = jd.split(/[\n\r]+/)[0] || 'Target Role';
    return firstLine.slice(0, 45);
  };

  // Score tier color helpers
  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        color: '#16A34A',
        bg: '#F0FDF4',
        border: '#86EFAC',
        label: 'Strong Fit',
        tagBg: 'rgba(22, 163, 74, 0.1)'
      };
    }
    if (score >= 60) {
      return {
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A',
        label: 'Moderate Fit',
        tagBg: 'rgba(217, 119, 6, 0.1)'
      };
    }
    return {
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      label: 'Growth Fit',
      tagBg: 'rgba(220, 38, 38, 0.1)'
    };
  };

  const scoreTheme = matchResult ? getScoreTheme(matchResult.matchScore) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">Recruiter Job Match</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Hiring Criteria Fit & Qualification Checklist
          </span>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>
          Match Your Resume With a Job
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Compare your resume directly against real recruiter expectations. Review key skill requirements, experience overlap, project relevance, and practical tips to stand out before submitting your application.
        </p>
      </div>

      {/* Input Form Card */}
      <Card elevated style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Resume Selection Mode Toggle */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
              Resume Source Selection
            </span>
            <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--bg-surface-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => { setResumeSourceMode('saved'); setInputsChanged(true); setIsSaved(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: resumeSourceMode === 'saved' ? 'var(--primary-600)' : 'transparent',
                  color: resumeSourceMode === 'saved' ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <FolderOpen size={15} />
                <span>Saved Resumes</span>
              </button>
              <button
                type="button"
                onClick={() => { setResumeSourceMode('upload'); setInputsChanged(true); setIsSaved(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: resumeSourceMode === 'upload' ? 'var(--primary-600)' : 'transparent',
                  color: resumeSourceMode === 'upload' ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Upload size={15} />
                <span>Upload Resume File</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Select From Saved Resumes */}
          {resumeSourceMode === 'saved' && (
            <div className="grid-2" style={{ gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <label className="input-label" htmlFor="source-resume-select">Select Saved Resume Profile</label>
                <select
                  id="source-resume-select"
                  className="select-field"
                  value={selectedResumeId}
                  onChange={handleResumeChange}
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.targetRole || 'Developer'}) — ATS {r.atsScore || 88}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Candidate</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                    {activeResume?.personalInfo?.fullName || 'B. Gopinath'}
                  </div>
                </div>
                <span className="badge badge-success">
                  {activeResume?.template ? `${activeResume.template} Template` : 'Classic ATS'}
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Upload Resume File */}
          {resumeSourceMode === 'upload' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileInputChange}
              />

              {!uploadedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? 'var(--primary-600)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: isDragging ? 'rgba(7, 159, 232, 0.05)' : 'var(--bg-surface-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(7, 159, 232, 0.1)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileUp size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)', marginBottom: '0.25rem' }}>
                      Click to Browse or Drag & Drop Resume File
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Supports PDF (.pdf), Word (.docx, .doc), or Text (.txt) up to 10MB
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span className="badge badge-primary">PDF</span>
                    <span className="badge badge-primary">DOCX</span>
                    <span className="badge badge-primary">TXT</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(7, 159, 232, 0.04)',
                  border: '1px solid var(--primary-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '2.75rem',
                      height: '2.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(7, 59, 104, 0.1)',
                      color: 'var(--color-dark-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileCheck size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                        {uploadedFile.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span style={{ color: '#16A34A', fontWeight: 600 }}>Ready for Match Analysis</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Upload}
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      Change File
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                      style={{ color: '#ef4444' }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label className="input-label" htmlFor="job-description-input" style={{ margin: 0 }}>
              Paste Recruiter Job Description
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Include requirements, responsibilities, and qualifications
            </span>
          </div>
          <textarea
            id="job-description-input"
            rows={7}
            className="textarea-field"
            value={jobDescription}
            onChange={handleJdChange}
            placeholder="Paste complete job post, responsibilities, and qualifications here..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {inputsChanged && matchResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#D97706' }}>
              <Info size={15} />
              <span>Inputs changed. Click "Analyze Job Match" to recalculate.</span>
            </div>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <Button
              variant="primary"
              size="lg"
              icon={Target}
              loading={analyzing}
              onClick={handleAnalyzeJob}
              disabled={analyzing}
              id="analyze-job-button"
            >
              {analyzing ? 'Analyzing Alignment...' : 'Analyze Job Match'}
            </Button>
          </div>
        </div>
      </Card>

      {/* =========================================================================
         RESULTS SECTIONS — Rendered in Exact Required Sequential Order
         1. Overall Job Match Score
         2. Match Score Breakdown
         3. Matched Skills
         4. Partially Matched Skills
         5. Missing Skills or Missing Evidence
         6. Resume Evidence vs. Job Requirements Table
         7. Experience, Education & Project Alignment
         8. Prioritized Resume Improvement Recommendations
         9. Available Actions Bar
         ========================================================================= */}
      {matchResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 1. OVERALL JOB MATCH SCORE WITH EXPLANATION */}
          <Card elevated style={{ padding: '2rem', borderTop: `4px solid ${scoreTheme.color}` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                <ATSScoreGauge score={matchResult.matchScore} size={140} strokeWidth={12} showLabel={false} />
                <div style={{ maxWidth: '620px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: scoreTheme.bg,
                      color: scoreTheme.color,
                      border: `1px solid ${scoreTheme.border}`
                    }}>
                      {scoreTheme.label} ({matchResult.matchScore}%)
                    </span>
                    <span className="badge badge-secondary" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Briefcase size={12} /> Recruiter Screening Fit
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
                    Overall Job Match Score: {matchResult.matchScore}%
                  </h2>

                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {matchResult.scoreInterpretation || 'Calculated based on transparent weighted criteria across technical skills, experience alignment, project relevance, and education.'}
                  </p>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>Target Role: <strong>{extractJobTitle(jobDescription)}</strong></span>
                    <span>•</span>
                    <span>Source: <strong>{resumeSourceMode === 'upload' && uploadedFile ? uploadedFile.name : activeResume?.title}</strong></span>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {resumeSourceMode === 'upload' ? 'Uploaded File' : 'Saved Resume'}
                    </span>
                  </div>
                </div>
              </div>

              {/* High-level status pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                <div style={{ padding: '0.625rem 1rem', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16A34A' }}>Matched Skills</span>
                  <strong style={{ color: '#16A34A' }}>{matchResult.matchedSkills?.length || 0}</strong>
                </div>
                <div style={{ padding: '0.625rem 1rem', background: '#FFFBEB', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#D97706' }}>Partially Matched</span>
                  <strong style={{ color: '#D97706' }}>{matchResult.partiallyMatchedSkills?.length || 0}</strong>
                </div>
                <div style={{ padding: '0.625rem 1rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#DC2626' }}>Missing Evidence</span>
                  <strong style={{ color: '#DC2626' }}>{matchResult.missingSkills?.length || 0}</strong>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={handleDownloadReport}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
                >
                  Download PDF Report
                </Button>
              </div>

            </div>

            {/* Disclaimer notice */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={14} style={{ flexShrink: 0 }} />
              <span>
                Recruiter Fit Guide: This review mirrors how hiring managers and talent screening systems evaluate applicants. If you have practical experience with unlisted tools, adding truthful bullet points to your resume or portfolio will help your profile get noticed.
              </span>
            </div>
          </Card>

          {/* 2. MATCH SCORE BREAKDOWN (WEIGHTED CRITERIA) */}
          {matchResult.scoringFormula && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                    Hiring Evaluation Breakdown
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Scored using standard industry hiring weights: Technical Skills (40%), Experience (25%), Projects (20%), Education (10%), and Keyword Fit (5%).
                  </p>
                </div>
                <span className="badge badge-primary">5 Evaluation Criteria</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
                
                {/* Tech Skills 40% */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Technical Skills</span>
                    <span className="badge badge-primary">Weight: 40%</span>
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#079FE8', marginBottom: '0.5rem' }}>
                    {matchResult.scoringFormula.technicalSkills?.score || 0}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.scoringFormula.technicalSkills?.score || 0}%`, height: '100%', background: '#079FE8', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Direct and partially matched competencies against JD requirements.
                  </p>
                </div>

                {/* Experience 25% */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Experience & Duties</span>
                    <span className="badge badge-primary">Weight: 25%</span>
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#073B68', marginBottom: '0.5rem' }}>
                    {matchResult.scoringFormula.experience?.score || 0}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.scoringFormula.experience?.score || 0}%`, height: '100%', background: '#073B68', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Candidate roles and demonstrated duties vs. core job responsibilities.
                  </p>
                </div>

                {/* Projects 20% */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Projects & Practice</span>
                    <span className="badge badge-primary">Weight: 20%</span>
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#38C5F5', marginBottom: '0.5rem' }}>
                    {matchResult.scoringFormula.projects?.score || 0}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.scoringFormula.projects?.score || 0}%`, height: '100%', background: '#38C5F5', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Hands-on application of target tech stack in portfolio/github projects.
                  </p>
                </div>

                {/* Education 10% */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Education & Certs</span>
                    <span className="badge badge-primary">Weight: 10%</span>
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.5rem' }}>
                    {matchResult.scoringFormula.education?.score || 0}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.scoringFormula.education?.score || 0}%`, height: '100%', background: '#16A34A', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Technical degree, computer science coursework, and credentials.
                  </p>
                </div>

                {/* Keyword Coverage 5% */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Keyword Coverage</span>
                    <span className="badge badge-primary">Weight: 5%</span>
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
                    {matchResult.scoringFormula.keywordCoverage?.score || 0}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${matchResult.scoringFormula.keywordCoverage?.score || 0}%`, height: '100%', background: '#f59e0b', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Direct lexical density of role terms across the resume.
                  </p>
                </div>

              </div>
            </Card>
          )}

          {/* 3. MATCHED SKILLS (WITH RESUME EVIDENCE) */}
          <Card elevated style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                  Matched Skills ({matchResult.matchedSkills?.length || 0})
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Skills verified with clear, direct evidence in your resume
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1rem' }}>
              {(matchResult.matchedSkills || []).map((sk, idx) => {
                const name = typeof sk === 'string' ? sk : sk.name;
                const evidence = typeof sk === 'object' ? sk.evidence : null;
                const section = typeof sk === 'object' ? sk.section : 'Skills & Projects';
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={16} /> {name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-sm)' }}>
                        {section}
                      </span>
                    </div>
                    {evidence && (
                      <p style={{ fontSize: '0.8125rem', color: '#166534', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                        "{evidence}"
                      </p>
                    )}
                  </div>
                );
              })}
              {(!matchResult.matchedSkills || matchResult.matchedSkills.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No exact matching keywords found for this job posting.
                </div>
              )}
            </div>
          </Card>

          {/* 4. PARTIALLY MATCHED SKILLS (ADJACENT & TRANSFERABLE) */}
          {matchResult.partiallyMatchedSkills && matchResult.partiallyMatchedSkills.length > 0 && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#92400E' }}>
                    Transferable & Adjacent Skills ({matchResult.partiallyMatchedSkills.length})
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Related technologies or foundational knowledge that can translate directly to this role
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1rem' }}>
                {matchResult.partiallyMatchedSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#B45309' }}>
                        ≈ {sk.name}
                      </span>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-sm)' }}>
                        Adjacent: {sk.adjacentSkillFound}
                      </span>
                    </div>
                    {sk.gapExplanation && (
                      <p style={{ fontSize: '0.8125rem', color: '#78350F', margin: 0, lineHeight: 1.4 }}>
                        {sk.gapExplanation}
                      </p>
                    )}
                    {sk.evidence && (
                      <div style={{ fontSize: '0.75rem', color: '#92400E', fontStyle: 'italic', background: 'rgba(255,255,255,0.6)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                        Resume background: {sk.evidence}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 5. MISSING SKILLS OR MISSING EVIDENCE (DISTINGUISHED) */}
          {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#991B1B' }}>
                    Missing from Resume ({matchResult.missingSkills.length})
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Not found in your resume text. If you have practical experience with these tools, add truthful bullet points or coursework.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
                {matchResult.missingSkills.map((sk, idx) => {
                  const name = typeof sk === 'string' ? sk : sk.name;
                  const rec = typeof sk === 'object' ? sk.recommendation : `Add practical experience or coursework for ${name}.`;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#DC2626' }}>
                          ✗ {name}
                        </span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-sm)' }}>
                          Not In Resume
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#7F1D1D', margin: 0, lineHeight: 1.4 }}>
                        {rec}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 6. RESUME EVIDENCE VS JOB REQUIREMENTS TABLE */}
          {matchResult.requirementAlignments && matchResult.requirementAlignments.length > 0 && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                  Job Requirements vs. Resume Evidence Checklist
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Line-by-line check of each job posting requirement against the specific details found in your resume
                </p>
              </div>

              <div className="touch-scroll" style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)' }}>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Requirement</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Resume Evidence Found</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchResult.requirementAlignments.map((req, idx) => {
                      const isMatched = req.status === 'Matched';
                      const isPartial = req.status === 'Partially Matched';
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>
                            {req.requirement}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {req.category}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: isMatched ? '#F0FDF4' : isPartial ? '#FFFBEB' : '#FEF2F2',
                              color: isMatched ? '#16A34A' : isPartial ? '#D97706' : '#DC2626',
                              border: `1px solid ${isMatched ? '#BBF7D0' : isPartial ? '#FDE68A' : '#FECACA'}`
                            }}>
                              {req.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {req.evidenceFound}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* 7. EXPERIENCE, EDUCATION & PROJECT ALIGNMENT */}
          {matchResult.sectionAlignments && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                  Experience, Projects & Education Overview
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  How your past work, projects, and degree align with the recruiter's expectations
                </p>
              </div>

              <div className="grid-3" style={{ gap: '1.25rem' }}>
                
                {/* Projects Alignment */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={18} color="#079FE8" />
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-dark-blue)' }}>Project Alignment</span>
                  </div>
                  {(matchResult.sectionAlignments.projects || []).slice(0, 2).map((proj, idx) => (
                    <div key={idx} style={{ padding: '0.625rem', background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.8125rem' }}>{proj.name}</strong>
                        <span style={{ fontSize: '0.6875rem', color: '#079FE8', fontWeight: 700 }}>{proj.alignmentLevel}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Overlap: {proj.overlappingTech?.join(', ') || 'Demonstrates full stack design'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience Alignment */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={18} color="#073B68" />
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-dark-blue)' }}>Role Experience</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {matchResult.sectionAlignments.experience?.rolesSummary || 'Work history reviewed against duty expectations.'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.25rem' }}>
                    {(matchResult.sectionAlignments.experience?.responsibilitiesEvaluated || []).slice(0, 3).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                        {r.demonstratedInResume ? <CheckCircle2 size={13} color="#16A34A" /> : <AlertTriangle size={13} color="#D97706" />}
                        <span>{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Alignment */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={18} color="#16A34A" />
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-dark-blue)' }}>Education & Credentials</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16A34A' }}>
                    {matchResult.sectionAlignments.education?.status || 'Meets Technical Degree Requirements'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {(matchResult.sectionAlignments.education?.degrees || []).join(' • ') || 'Computer Science / Engineering Degree'}
                  </div>
                </div>

              </div>
            </Card>
          )}

          {/* 8. PRIORITIZED RESUME IMPROVEMENT RECOMMENDATIONS */}
          {matchResult.prioritizedRecommendations && matchResult.prioritizedRecommendations.length > 0 && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Lightbulb size={22} color="#D97706" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                    Recruiter Recommendations & Quick Wins
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Practical, honest steps to tailor your resume for this specific job before applying
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {matchResult.prioritizedRecommendations.map((rec, idx) => {
                  const isHigh = rec.priority === 'High';
                  const isMedium = rec.priority === 'Medium';
                  const prioColor = isHigh ? '#DC2626' : isMedium ? '#D97706' : '#079FE8';
                  const prioBg = isHigh ? '#FEF2F2' : isMedium ? '#FFFBEB' : '#F0F9FF';
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        background: 'var(--bg-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: `4px solid ${prioColor}`,
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.625rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: prioBg,
                            color: prioColor,
                            textTransform: 'uppercase'
                          }}>
                            {rec.priority || 'Action'} Priority
                          </span>
                          <strong style={{ fontSize: '0.9375rem', color: 'var(--color-dark-blue)' }}>
                            {rec.title}
                          </strong>
                        </div>
                        {rec.section && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            Target: {rec.section}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {rec.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 9. AVAILABLE ACTIONS BAR */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem 1.75rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="md"
                icon={RotateCcw}
                onClick={handleAnalyzeAnother}
              >
                Analyze Another Job
              </Button>
              <Button
                variant={isSaved ? "secondary" : "outline"}
                size="md"
                icon={isSaved ? Check : Bookmark}
                onClick={handleSaveAnalysis}
              >
                {isSaved ? 'Analysis Saved' : 'Save Analysis'}
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="md"
                icon={Download}
                onClick={handleDownloadReport}
              >
                Download PDF Report
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                onClick={handleImproveResume}
              >
                Improve Resume in Builder
              </Button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default JobMatchPage;
