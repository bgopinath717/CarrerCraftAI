import React, { useState } from 'react';
import {
  MailCheck,
  Sparkles,
  Copy,
  Download,
  Save,
  RotateCcw,
  Check,
  Printer,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { apiService } from '../services/api';
import { pdfService } from '../services/pdfService';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

export const CoverLetterPage = () => {
  const { profile } = useProfile();
  const [jobTitle, setJobTitle] = useState('MERN Stack Developer');
  const [companyName, setCompanyName] = useState('Apex Cloud Technologies');
  const [jobDescription, setJobDescription] = useState('Looking for a Full Stack MERN Developer proficient in React.js, Node.js, Express.js, MongoDB and building RESTful APIs.');
  const [tone, setTone] = useState('Professional');
  const [generating, setGenerating] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const savedLetters = storageService.getCoverLetters();
  const [activeLetter, setActiveLetter] = useState(savedLetters[0] || null);
  const [editableContent, setEditableContent] = useState(savedLetters[0]?.content || '');

  const tones = ['Professional', 'Confident', 'Friendly', 'Formal'];

  const handleGenerate = async () => {
    if (!jobTitle || !companyName) {
      addToast('Please specify Job Title and Company Name', 'warning');
      return;
    }

    setGenerating(true);
    try {
      const generated = await aiService.generateCoverLetter({
        targetJobTitle: jobTitle,
        companyName,
        jobDescription,
        userProfile: profile,
        tone
      });
      const contentText = typeof generated === 'string' ? generated : (generated?.content || '');
      const letterObj = typeof generated === 'object' && generated !== null ? generated : {
        id: `cl-${Date.now()}`,
        title: `${jobTitle} Cover Letter (${companyName})`,
        jobTitle,
        companyName,
        jobDescription,
        tone,
        content: contentText,
        generatedAt: new Date().toISOString()
      };
      setActiveLetter(letterObj);
      setEditableContent(contentText);
      setIsAiGenerated(true);
      addToast('AI Cover Letter generated successfully!', 'success');
    } catch (err) {
      console.error('Cover letter generation error:', err);
      addToast('Cover letter generation failed. Please try again.', 'danger');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!editableContent) {
      addToast('No cover letter content to save', 'warning');
      return;
    }

    const toSave = {
      id: activeLetter?.id || `cl-${Date.now()}`,
      title: `${jobTitle} Cover Letter (${companyName})`,
      jobTitle,
      companyName,
      jobDescription,
      tone,
      content: editableContent
    };

    storageService.saveCoverLetter(toSave);
    try {
      await apiService.saveCoverLetter(toSave);
    } catch {}
    setActiveLetter(toSave);
    addToast('Cover letter saved to My Documents!', 'success');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    addToast('Cover letter copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editableContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Cover letter downloaded as text file', 'success');
  };

  const handleDownloadPdf = () => {
    if (!editableContent) {
      addToast('No cover letter content to export', 'warning');
      return;
    }
    try {
      pdfService.generateCoverLetterPDF({
        candidateName: profile?.personalInfo?.fullName || 'B. Gopinath',
        jobTitle,
        companyName,
        content: editableContent,
        email: profile?.personalInfo?.email || '',
        phone: profile?.personalInfo?.phone || '',
        location: profile?.personalInfo?.location || ''
      });
      addToast('Cover letter downloaded as PDF in Times New Roman!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PDF. You can still download as .txt', 'danger');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">AI Writer Suite</span>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          AI Cover Letter Generator
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Create authentic, tailored cover letters matching your actual technical projects and target job specifications.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left: Input Form */}
        <Card elevated style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Job & Tone Configuration</h3>

          <div>
            <label className="input-label">Target Job Title</label>
            <input
              type="text"
              className="input-field"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. MERN Stack Developer"
            />
          </div>

          <div>
            <label className="input-label">Company / Organization Name</label>
            <input
              type="text"
              className="input-field"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Apex Cloud Solutions"
            />
          </div>

          <div>
            <label className="input-label">Select Voice Tone</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tones.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: tone === t ? 'var(--primary-600)' : 'var(--border-color)',
                    background: tone === t ? 'var(--primary-600)' : 'var(--bg-surface-subtle)',
                    color: tone === t ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">Job Description / Keywords (Optional)</label>
            <textarea
              rows={4}
              className="textarea-field"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job responsibilities to emphasize specific requirements..."
            />
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Candidate Profile Active: <strong>{profile?.personalInfo?.fullName || 'B. Gopinath'}</strong> ({profile?.skills?.technical?.slice(0, 4).join(', ')})
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            loading={generating}
            onClick={handleGenerate}
          >
            Generate Cover Letter
          </Button>
        </Card>

        {/* Right: Editable Output Editor */}
        <Card style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '520px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Generated Letter Editor</h3>
              {isAiGenerated && (
                <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#fff' }}>
                  <Sparkles size={13} /> Generated with Gemini AI
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button variant="outline" size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="secondary" size="sm" icon={Download} onClick={handleDownloadTxt}>
                .txt
              </Button>
              <Button variant="secondary" size="sm" icon={FileText} onClick={handleDownloadPdf}>
                Download PDF
              </Button>
              <Button variant="primary" size="sm" icon={Save} onClick={handleSave}>
                Save Letter
              </Button>
            </div>
          </div>

          <textarea
            rows={18}
            className="textarea-field"
            style={{
              fontFamily: 'var(--font-main)',
              lineHeight: 1.6,
              fontSize: '0.9375rem',
              padding: '1.25rem',
              resize: 'vertical'
            }}
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            placeholder="Your generated cover letter will appear here..."
          />
        </Card>

      </div>

    </div>
  );
};

export default CoverLetterPage;
