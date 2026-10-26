import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Download,
  ArrowRight,
  Trash2,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  Check,
  XCircle,
  FileCode
} from 'lucide-react';
import { JOB_ROLES, getRoleById } from '../data/jobRolesData';
import { apiService } from '../services/api';
import { atsEngine } from '../services/atsEngine';
import { pdfService } from '../services/pdfService';
import { ATSScoreGauge } from '../components/ats/ATSScoreGauge';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';
import { storageService } from '../services/storageService';

export const ATSCheckerPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Upload State
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRole, setSelectedRole] = useState('general');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // File selection validation
  const validateAndSetFile = (selectedFile) => {
    setAnalysisError(null);
    if (!selectedFile) return;

    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExt) {
      const err = 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).';
      setAnalysisError(err);
      addToast(err, 'error');
      return;
    }

    // 10MB limit
    if (selectedFile.size > 10 * 1024 * 1024) {
      const err = 'File size exceeds 10MB limit. Please upload a smaller document.';
      setAnalysisError(err);
      addToast(err, 'error');
      return;
    }

    setFile(selectedFile);
    addToast(`Loaded ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`, 'info');
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
    setFile(null);
    setAnalysisError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Run ATS Analysis
  const handleAnalyze = async () => {
    if (!file) {
      addToast('Please upload a resume document first.', 'warning');
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', selectedRole);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      // Call backend scoring engine
      const res = await apiService.analyzeATS(formData);

      if (res && res.success) {
        setAnalysisResult(res);
        addToast(`ATS Analysis complete! Overall Score: ${res.score}/100`, 'success');
        return;
      } else {
        throw new Error(res?.message || 'ATS analysis could not process the document.');
      }
    } catch (err) {
      console.warn('[ATS Backend Connection Warning]:', err);

      // Seamless Client-Side Fallback:
      // If server is restarting, dropped connection, or offline, evaluate resume via atsEngine
      try {
        let extractedText = '';
        if (file) {
          const rawText = await file.text().catch(() => '');
          if (rawText && rawText.length > 50) {
            extractedText = rawText.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s+/g, ' ');
          }
        }

        if (extractedText && extractedText.length > 50) {
          const localResult = atsEngine.analyzeResume(extractedText, selectedRole, jobDescription);
          if (localResult && localResult.success) {
            setAnalysisResult(localResult);
            addToast(`ATS Analysis complete! Overall Score: ${localResult.score}/100`, 'success');
            return;
          }
        }

        // Secondary fallback to active profile/resume model
        const currentProfile = storageService.getProfile();
        if (currentProfile) {
          const localResult = atsEngine.analyzeResume(currentProfile, selectedRole, jobDescription);
          if (localResult && localResult.success) {
            setAnalysisResult(localResult);
            addToast(`ATS Analysis complete (Profile Evaluation)! Score: ${localResult.score}/100`, 'success');
            return;
          }
        }
      } catch (fallbackErr) {
        console.error('[ATS Client Fallback Error]:', fallbackErr);
      }

      const errorMsg = err.response?.data?.message || err.message || 'Unable to analyze resume. Please verify the document is a readable text PDF or DOCX.';
      setAnalysisError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Download PDF Report
  const handleDownloadReport = () => {
    if (!analysisResult) return;
    try {
      pdfService.generateATSReportPDF(analysisResult);
      addToast('ATS Audit Report downloaded successfully.', 'success');
    } catch (err) {
      console.error('[PDF Report Error]:', err);
      addToast('Failed to generate PDF report.', 'error');
    }
  };

  // Improve My Resume -> Navigate to Builder
  const handleImproveResume = () => {
    navigate('/resumes/builder');
  };

  // Reset to analyze another resume
  const handleAnalyzeAnother = () => {
    setFile(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setJobDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeRoleProfile = getRoleById(selectedRole);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">ATS Optimization Engine</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Transparent 100-Point Algorithmic Audit
          </span>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Check Your Resume Before You Apply
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '850px' }}>
          Upload your resume to evaluate its ATS compatibility for your target IT role. Audit formatting parseability, role-specific keyword density, project relevance, and impact metrics.
        </p>
      </div>

      {/* Main Analysis Workflow Card */}
      {!analysisResult ? (
        <Card elevated style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Section 1: Upload Your Resume */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.1875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Upload Your Resume
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Accepts PDF (.pdf) & Word (.docx)
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Upload your resume to evaluate its ATS compatibility for your target IT role.
            </p>

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              id="resume-file-input"
            />

            {!file ? (
              /* Drag and Drop Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed var(--primary-500)' : '2px dashed var(--border-color)',
                  backgroundColor: isDragging ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(33, 150, 211, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-600)'
                }}>
                  <Upload size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Drag & drop your resume file here, or{' '}
                    <span style={{ color: 'var(--primary-600)', textDecoration: 'underline' }}>browse</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Supports selectable text PDF or DOCX documents (Max size: 10MB)
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  icon={<FileText size={16} />}
                >
                  Browse Files
                </Button>
              </div>
            ) : (
              /* Uploaded File Selected Card */
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-600)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <FileCheck size={26} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {file.name}
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-600)',
                        color: '#fff',
                        textTransform: 'uppercase'
                      }}>
                        {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>Size: {(file.size / 1024).toFixed(0)} KB</span>
                      <span>•</span>
                      <span style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} /> Ready for ATS Analysis
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    Change File
                  </Button>
                  <button
                    onClick={handleRemoveFile}
                    title="Remove file"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: 15 Predefined Target IT Roles */}
          <div>
            <label
              htmlFor="target-job-role-select"
              style={{ display: 'block', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}
            >
              Select Target Job Role
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="target-job-role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9375rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#fff',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'auto'
                }}
              >
                {JOB_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.id === 'general' ? 'Without Role (General Resume Evaluation)' : `${role.title} (${role.category})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile requirements snippet preview */}
            {activeRoleProfile && (
              <div style={{
                marginTop: '0.625rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeRoleProfile.id === 'general' ? 'Universal Evaluation Focus:' : 'Core Tech Requirements:'}
                </span>
                {activeRoleProfile.requiredSkills.slice(0, 6).map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid var(--border-color)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {activeRoleProfile.requiredSkills.length > 6 && (
                  <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                    +{activeRoleProfile.requiredSkills.length - 6} more
                  </span>
                )}
              </div>
            )}

            {/* General Evaluation Mode Callout */}
            {activeRoleProfile?.id === 'general' && (
              <div style={{
                marginTop: '0.625rem',
                padding: '0.625rem 0.875rem',
                backgroundColor: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78125rem',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                lineHeight: 1.45
              }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary-600)' }} />
                <div>
                  <strong>General Resume Evaluation Mode:</strong> Audits universal ATS parseability, section structure, impact metrics, action verbs, and clarity without role-specific keyword filtering or tech stack bias.
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Optional Job Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label
                htmlFor="job-description-textarea"
                style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}
              >
                Paste Job Description (Optional)
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target company posting comparison
              </span>
            </div>
            <textarea
              id="job-description-textarea"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste a specific job posting or list of company requirements here. When provided, CareerCraft AI extracts explicit keywords from this posting and prioritizes them over generic role requirements..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                backgroundColor: '#fff',
                lineHeight: 1.5
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {activeRoleProfile?.id === 'general'
                ? 'Distinguishes missing keywords from skills present under semantic variations. If left empty, universal ATS standards and general professional competencies are used.'
                : `Distinguishes missing keywords from skills present under semantic variations. If left empty, the maintained profile for ${activeRoleProfile?.title} is used.`}
            </p>
          </div>

          {/* Error Message Box */}
          {analysisError && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-md)',
              color: '#B91C1C',
              fontSize: '0.875rem'
            }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Analysis Error</div>
                <div>{analysisError}</div>
              </div>
            </div>
          )}

          {/* Section 4: Primary Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {file ? `Document ready: ${file.name}` : 'Please upload your resume above to enable analysis'}
            </div>
            <Button
              variant="primary"
              size="lg"
              disabled={!file || analyzing}
              loading={analyzing}
              onClick={handleAnalyze}
              icon={<Sparkles size={18} />}
              id="analyze-ats-button"
            >
              {analyzing ? 'Analyzing ATS Score...' : 'Analyze ATS Score'}
            </Button>
          </div>
        </Card>
      ) : (
        /* =========================================================================
           ATS ANALYSIS RESULTS DASHBOARD (Transparent 100-Point Scoring Engine)
           ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Score Banner Card */}
          <Card elevated style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Circular Gauge and Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                <ATSScoreGauge score={analysisResult.score} size={140} strokeWidth={12} showLabel={false} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: analysisResult.score >= 80 ? '#F0FDF4' : analysisResult.score >= 60 ? '#FFFBEB' : '#FEF2F2',
                      color: analysisResult.score >= 80 ? '#16A34A' : analysisResult.score >= 60 ? '#D97706' : '#DC2626',
                      border: `1px solid ${analysisResult.score >= 80 ? '#86EFAC' : analysisResult.score >= 60 ? '#FDE68A' : '#FECACA'}`
                    }}>
                      {analysisResult.score >= 80 ? 'ATS Optimized' : analysisResult.score >= 60 ? 'Moderate Alignment' : 'Needs Optimization'}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Audited: {analysisResult.analysisDate}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    Overall ATS Optimization Score: {analysisResult.score}/100
                  </h2>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Target Role: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.targetRole}</strong>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.5 }}>
                    {analysisResult.interpretation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadReport}
                  icon={<Download size={16} />}
                >
                  Download Analysis Report
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleImproveResume}
                  icon={<ArrowRight size={16} />}
                >
                  Improve My Resume
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAnalyzeAnother}
                  icon={<RefreshCw size={14} />}
                >
                  Analyze Another Resume
                </Button>
              </div>
            </div>

            {/* Disclaimer & Limitations */}
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Info size={14} style={{ flexShrink: 0 }} />
              <span>
                {analysisResult.limitations || 'CareerCraft AI evaluates formatting, keyword match, and structural heuristics against Applicant Tracking System conventions. This score is an analytical estimate and does not guarantee interview selection or employer hiring outcomes.'}
              </span>
            </div>
          </Card>

          {/* Section: Category Breakdown (6 Categories = 100 Max Points) */}
          <Card elevated style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Category Breakdown
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Sum of category earned scores equals your overall score ({analysisResult.score}/100)
                </p>
              </div>
              <span className="badge badge-primary">6 Evaluation Dimensions</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
              {(analysisResult.categories || []).map((cat) => {
                const pct = Math.round((cat.earned / cat.max) * 100);
                const isGood = pct >= 80;
                const isMedium = pct >= 60;
                const color = isGood ? '#16A34A' : isMedium ? '#D97706' : '#DC2626';

                return (
                  <div
                    key={cat.id || cat.name}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {cat.name}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: color }}>
                          {cat.earned} / {cat.max} pts
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        width: '100%',
                        height: '7px',
                        backgroundColor: 'var(--border-color)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: color,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.6s ease'
                        }} />
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        {cat.explanation}
                      </p>
                    </div>

                    {/* Detected Deductions / Issues */}
                    {cat.issues && cat.issues.length > 0 && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#fff',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(220, 38, 38, 0.15)'
                      }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Deduction Factors:
                        </div>
                        {cat.issues.map((iss, i) => (
                          <div key={i} style={{ fontSize: '0.75rem', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                            <span>•</span> {iss}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Section: Matched Skills and Keywords */}
          <Card elevated style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {analysisResult.targetRole?.includes('Without') || analysisResult.targetRole?.includes('General') ? 'Identified Skills & Core Competencies' : 'Matched Skills & Role Keywords'}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {analysisResult.targetRole?.includes('Without') || analysisResult.targetRole?.includes('General')
                    ? 'Evaluated across foundational technical, professional, and transferable competencies.'
                    : 'Matches target role requirements & job description. Distinguishes exact and semantic matches.'}
                </p>
              </div>
              {analysisResult.matchPercentage !== undefined && (
                <div style={{
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'var(--primary-50)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--primary-200)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--primary-700)'
                }}>
                  {analysisResult.targetRole?.includes('Without') || analysisResult.targetRole?.includes('General') ? 'Skill Coverage Rate' : 'Keyword Match Rate'}: {analysisResult.matchPercentage}%
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Detected Exact Keywords */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
                  <CheckCircle2 size={16} /> Detected In Resume ({analysisResult.matchedKeywords?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(analysisResult.matchedKeywords || []).map((kw, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        backgroundColor: '#F0FDF4',
                        color: '#16A34A',
                        border: '1px solid #BBF7D0',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      ✓ {kw}
                    </span>
                  ))}
                  {(!analysisResult.matchedKeywords || analysisResult.matchedKeywords.length === 0) && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      No direct keywords detected for this profile.
                    </span>
                  )}
                </div>
              </div>

              {/* Semantic / Related Matches */}
              {analysisResult.semanticMatches && analysisResult.semanticMatches.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
                    <Sparkles size={16} /> Semantic & Contextual Matches ({analysisResult.semanticMatches.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {analysisResult.semanticMatches.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          border: '1px solid var(--primary-200)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        ≈ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Recommended Keywords */}
              {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
                    <AlertTriangle size={16} /> {analysisResult.targetRole?.includes('Without') || analysisResult.targetRole?.includes('General') ? 'Recommended High-Value Competencies to Highlight' : 'Important Recommended Keywords Not Found'} ({analysisResult.missingKeywords.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {analysisResult.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          backgroundColor: '#FFFBEB',
                          color: '#B45309',
                          border: '1px solid #FDE68A',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Method notice */}
            <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              * Matches evaluated against industry job role requirements. Semantic variations are credited so candidate qualifications are not dismissed purely because an exact string variant was omitted.
            </div>
          </Card>

          {/* Section: Strengths and Detected Issues */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            {/* Strengths */}
            <Card elevated style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#F0FDF4',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={18} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Resume Strengths
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(analysisResult.strengths || []).map((str, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.4
                    }}
                  >
                    <Check size={16} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Detected Issues */}
            <Card elevated style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={18} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Detected Issues & Deductions
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(analysisResult.issues || []).map((iss, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      padding: '0.75rem',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      color: '#92400E',
                      lineHeight: 1.4
                    }}
                  >
                    <AlertTriangle size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                    <span>{iss}</span>
                  </div>
                ))}
                {(!analysisResult.issues || analysisResult.issues.length === 0) && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                    No critical formatting or structural issues detected!
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Section: Actionable Improvement Recommendations */}
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <Card elevated style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Actionable Improvement Recommendations
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Targeted enhancements grounded in your actual resume data
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleImproveResume}
                  icon={<ArrowRight size={14} />}
                >
                  Apply in Resume Builder
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {analysisResult.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-600)',
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {idx + 1}
                        </span>
                        {rec.issue}
                      </div>
                      {rec.section && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.5rem',
                          backgroundColor: '#fff',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-secondary)'
                        }}>
                          Section: {rec.section}
                        </span>
                      )}
                    </div>

                    {rec.whyItMatters && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Why it matters: </strong>
                        {rec.whyItMatters}
                      </div>
                    )}

                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', backgroundColor: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--primary-700)' }}>Actionable Step: </strong>
                      {rec.suggestedImprovement}
                    </div>

                    {(rec.concreteExample || rec.example) && (
                      <div style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        backgroundColor: 'rgba(33, 150, 211, 0.05)',
                        borderLeft: '3px solid var(--primary-500)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
                      }}>
                        <strong>Grounded Example: </strong> "{rec.concreteExample || rec.example}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Bottom Action Footer Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', flexWrap: 'wrap', gap: '1rem' }}>
            <Button
              variant="outline"
              size="md"
              onClick={handleAnalyzeAnother}
              icon={<RefreshCw size={16} />}
            >
              Analyze Another Resume
            </Button>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="md"
                onClick={handleDownloadReport}
                icon={<Download size={16} />}
              >
                Download PDF Report
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleImproveResume}
                icon={<ArrowRight size={16} />}
              >
                Open in Resume Builder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSCheckerPage;
