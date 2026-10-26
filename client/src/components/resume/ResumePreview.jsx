import React, { useState } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Info,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ResumeTemplate from './ResumeTemplates';
import Button from '../common/Button';
import { Modal } from '../common/Card';
import { atsEngine } from '../../services/atsEngine';
import { pdfService } from '../../services/pdfService';
import { ATSScoreGauge } from '../ats/ATSScoreGauge';
import { JOB_ROLES } from '../../data/jobRolesData';
import { useToast } from '../common/Toast';

export const ResumePreview = ({ resume, onTemplateChange }) => {
  const [zoom, setZoom] = useState(100);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [targetRole, setTargetRole] = useState(resume?.targetRole || 'mern-developer');
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const { addToast } = useToast();

  const templates = [
    { id: 'classic-ats', name: 'CareerCraft Classic ATS (Default)' },
    { id: 'modern', name: 'Modern ATS' },
    { id: 'tech-pro', name: 'Tech Pro' },
    { id: 'minimal', name: 'Minimal Classic' },
    { id: 'executive', name: 'Executive' }
  ];

  // 1. Download Real PDF
  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const activeTemplate = resume.template || 'classic-ats';
      const filename = pdfService.generateResumePDF(resume, activeTemplate);
      addToast(`Downloaded ${filename} successfully!`, 'success');
    } catch (err) {
      console.error('[PDF Download Error]:', err);
      addToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // 2. Export Structured JSON
  const handleExportJson = () => {
    try {
      const rawName = resume.personalInfo?.fullName || 'Candidate';
      const safeName = rawName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'Resume';

      const exportPayload = {
        schemaVersion: '1.0',
        platform: 'CareerCraft AI',
        exportedAt: new Date().toISOString(),
        template: resume.template || 'classic-ats',
        targetRole: targetRole,
        ...resume
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeName}_Resume.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      addToast(`Exported ${safeName}_Resume.json (Schema v1.0)`, 'success');
    } catch (err) {
      console.error('[JSON Export Error]:', err);
      addToast('Failed to export JSON file.', 'error');
    }
  };

  // 3. ATS Check in Builder
  const handleRunATSCheck = (roleToUse = targetRole) => {
    try {
      const analysis = atsEngine.analyzeResume(resume, roleToUse);
      setAtsAnalysis(analysis);
      setShowAtsModal(true);

      if (analysis.score >= 80) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
        addToast(`Strong ATS Optimization: ${analysis.score}/100!`, 'success');
      } else {
        addToast(`ATS Score: ${analysis.score}/100. Review recommendations.`, 'info');
      }
    } catch (err) {
      console.error('[ATS Check Error]:', err);
      addToast('Unable to complete ATS Check.', 'error');
    }
  };

  const handleRoleChangeInModal = (newRole) => {
    setTargetRole(newRole);
    handleRunATSCheck(newRole);
  };

  // Download ATS Report from within Modal
  const handleDownloadATSReport = () => {
    if (!atsAnalysis) return;
    try {
      pdfService.generateATSReportPDF(atsAnalysis);
      addToast('ATS Audit Report downloaded successfully.', 'success');
    } catch (err) {
      console.error('[ATS PDF Error]:', err);
      addToast('Failed to generate ATS PDF report.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      
      {/* Top Controls Bar */}
      <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        
        {/* Template Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Template:</span>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-surface-subtle)', padding: '0.2rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => onTemplateChange(t.id)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: (resume.template || 'classic-ats') === t.id ? 'var(--primary-600)' : 'transparent',
                  color: (resume.template || 'classic-ats') === t.id ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '0.2rem' }}>
            <button
              onClick={() => setZoom(Math.max(60, zoom - 10))}
              className="btn-ghost"
              style={{ padding: '0.25rem 0.4rem', border: 'none', cursor: 'pointer' }}
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0 0.3rem', minWidth: '40px', textAlign: 'center' }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(120, zoom + 10))}
              className="btn-ghost"
              style={{ padding: '0.25rem 0.4rem', border: 'none', cursor: 'pointer' }}
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* ATS Check button */}
          <Button
            variant="outline"
            size="sm"
            icon={<Search size={14} />}
            onClick={() => handleRunATSCheck(targetRole)}
            id="builder-ats-check-button"
          >
            ATS Check
          </Button>

          {/* JSON Export */}
          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExportJson}
            id="builder-json-export-button"
          >
            JSON
          </Button>

          {/* Real PDF Download */}
          <Button
            variant="primary"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleDownloadPDF}
            loading={downloadingPdf}
            id="builder-pdf-download-button"
          >
            {downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Live Resume Canvas Wrapper */}
      <div className="resume-paper-container" style={{ flex: 1, minHeight: '650px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}>
          <ResumeTemplate resume={resume} template={resume.template || 'classic-ats'} />
        </div>
      </div>

      {/* ATS Check Modal (Uses the same 100-point transparent engine) */}
      <Modal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        title="Resume ATS Check"
        maxWidth="740px"
      >
        {atsAnalysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Target Role Selector inside Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Target IT Role:
              </span>
              <select
                value={targetRole}
                onChange={(e) => handleRoleChangeInModal(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#fff',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {JOB_ROLES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.id === 'general' ? 'Without Role (General Evaluation)' : r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Score Overview Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <ATSScoreGauge score={atsAnalysis.score} size={100} strokeWidth={10} showLabel={false} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: atsAnalysis.score >= 80 ? '#F0FDF4' : atsAnalysis.score >= 60 ? '#FFFBEB' : '#FEF2F2',
                    color: atsAnalysis.score >= 80 ? '#16A34A' : atsAnalysis.score >= 60 ? '#D97706' : '#DC2626'
                  }}>
                    {atsAnalysis.score >= 80 ? 'ATS Optimized' : atsAnalysis.score >= 60 ? 'Moderate Alignment' : 'Needs Optimization'}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Overall ATS Score: {atsAnalysis.score} / 100
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {atsAnalysis.interpretation}
                </p>
              </div>
            </div>

            {/* 6 Categories Breakdown */}
            <div>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Category Breakdown (100 Points Total)
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {(atsAnalysis.categories || []).map(c => {
                  const pct = Math.round((c.earned / c.max) * 100);
                  const color = pct >= 80 ? '#16A34A' : pct >= 60 ? '#D97706' : '#DC2626';
                  return (
                    <div key={c.id || c.name} style={{ padding: '0.75rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                        <span style={{ color }}>{c.earned}/{c.max}</span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matched Keywords */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Detected Keywords ({atsAnalysis.matchedKeywords?.length || 0})
                </h5>
                {atsAnalysis.matchPercentage !== undefined && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                    Match Rate: {atsAnalysis.matchPercentage}%
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(atsAnalysis.matchedKeywords || []).slice(0, 15).map((kw, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', fontWeight: 600 }}>
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            {atsAnalysis.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#D97706', marginBottom: '0.5rem' }}>
                  Missing Keywords for {atsAnalysis.targetRole} ({atsAnalysis.missingKeywords.length})
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {atsAnalysis.missingKeywords.slice(0, 10).map((kw, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 600 }}>
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Actionable Recommendations */}
            {atsAnalysis.recommendations && atsAnalysis.recommendations.length > 0 && (
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Actionable Recommendations:
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {atsAnalysis.recommendations.map((r, idx) => (
                    <div key={idx} style={{ padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-subtle)', fontSize: '0.8125rem', borderLeft: '3px solid var(--primary-500)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                        {r.issue}
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {r.suggestedImprovement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <Button variant="outline" size="sm" onClick={handleDownloadATSReport} icon={<Download size={14} />}>
                Download ATS Report PDF
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowAtsModal(false)}>
                Back to Editing
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ResumePreview;
