import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  Eye,
  Save,
  Check,
  Upload,
  FileCheck,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Target,
  Lightbulb,
  Download,
  Plus,
  Edit3,
  User,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Globe,
  FileText
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { storageService } from '../services/storageService';
import { apiService } from '../services/api';
import { parseResumeLocally } from '../services/resumeParser';
import { portfolioZipService } from '../services/portfolioZipService';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

const SAMPLE_RESUME_TEXT = `B. Gopinath
Senior Full Stack MERN Developer | Chennai, India
Email: gopinath@example.com | Phone: +91 98765 43210
LinkedIn: https://linkedin.com/in/gopinath-mern | GitHub: https://github.com/gopinath-dev

PROFESSIONAL SUMMARY
Senior MERN Stack Engineer with 4+ years of hands-on expertise building enterprise web applications, RESTful microservices, and reactive user interfaces using React, Node.js, Express, and MongoDB.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
- Frontend: React.js, Redux Toolkit, Next.js, Tailwind CSS
- Backend: Node.js, Express.js, RESTful APIs, Microservices, JWT Authentication
- Databases: MongoDB, Mongoose, Redis, Schema Design & Indexing
- DevOps & Tools: Git, GitHub, Docker, AWS (EC2, S3), Jest, CI/CD, VS Code, Postman

PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer | CloudTech Solutions (2022 - Present)
- Engineered scalable RESTful microservices with Node.js and Express, processing over 100,000 daily API transactions.
- Designed and optimized MongoDB aggregation pipelines and compound indexes, cutting query latency by 45%.
- Implemented secure JWT role-based access control and OAuth2 flows.
- Built responsive user dashboards in React.js with Redux state management.

Frontend Developer | WebCraft Digital (2020 - 2022)
- Developed interactive web portals with React, JavaScript, HTML5, and Tailwind CSS.
- Automated testing with Jest and integrated third-party RESTful APIs.

FEATURED PROJECTS
CareerCraft AI Platform
- Full-stack SaaS application for ATS-friendly resume generation, automated keyword scoring, cover letter creation, and AI career guidance.
- Technologies: React.js, Node.js, Express.js, MongoDB, Tailwind CSS, JWT.

E-Commerce Web Application
- Scalable multi-vendor e-commerce platform with product filtering, shopping cart state management, and Stripe payment gateway.
- Technologies: React.js, Redux Toolkit, Node.js, Express, MongoDB.

EDUCATION
Bachelor of Engineering in Computer Science | Anna University (2016 - 2020)
Grade: First Class with Distinction

CERTIFICATIONS
- Full Stack Web Development with MERN | Udemy
- AWS Certified Developer Associate | Amazon Web Services

ACHIEVEMENTS
- 1st Place Winner - Inter-College Hackathon 2024
- Top 5% Rank - LeetCode Algorithms & Data Structures
`;

export const PortfolioBuilderPage = () => {
  const { profile, updateProfile } = useProfile();
  const [portfolioSettings, setPortfolioSettings] = useState(() => storageService.getPortfolioSettings());
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  // Mode Selection: 'upload' | 'manual'
  const [inputMode, setInputMode] = useState('upload');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [manualSection, setManualSection] = useState('personal');

  // Resume Upload & Generator State
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSampleResume, setIsSampleResume] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedStats, setGeneratedStats] = useState(null);
  const [atsAnalysis, setAtsAnalysis] = useState(() => storageService.getProfile()?.atsAnalysis || null);
  const [activeAtsTab, setActiveAtsTab] = useState('recommendations');

  // Manual Entry Editable State
  const [manualData, setManualData] = useState(() => ({
    personalInfo: {
      fullName: profile?.personalInfo?.fullName || 'B. Gopinath',
      title: profile?.personalInfo?.title || 'Senior Full Stack MERN Developer',
      email: profile?.personalInfo?.email || 'gopinath@example.com',
      phone: profile?.personalInfo?.phone || '+91 98765 43210',
      location: profile?.personalInfo?.location || 'Chennai, India',
      github: profile?.personalInfo?.github || 'https://github.com/gopinath-dev',
      linkedin: profile?.personalInfo?.linkedin || 'https://linkedin.com/in/gopinath-mern',
      website: profile?.personalInfo?.website || ''
    },
    tagline: portfolioSettings?.tagline || 'Senior MERN Stack Engineer with 4+ years of hands-on expertise building enterprise web applications.',
    customBio: portfolioSettings?.customBio || profile?.careerInfo?.summary || 'Passionate software engineer with hands-on experience developing modern web platforms, solving complex technical challenges, and delivering clean, maintainable code.',
    skills: {
      technical: [...(profile?.skills?.technical || ['JavaScript', 'TypeScript', 'Node.js', 'HTML5', 'CSS3'])],
      frameworks: [...(profile?.skills?.frameworks || ['React.js', 'Express.js', 'Redux Toolkit', 'Tailwind CSS'])],
      databases: [...(profile?.skills?.databases || ['MongoDB', 'PostgreSQL', 'Redis'])],
      tools: [...(profile?.skills?.tools || ['Git', 'GitHub', 'Docker', 'AWS', 'Postman'])],
      soft: [...(profile?.skills?.soft || ['Agile & Scrum', 'Team Leadership', 'Problem Solving'])]
    },
    projects: (profile?.projects || []).length > 0 ? JSON.parse(JSON.stringify(profile.projects)) : [
      {
        name: 'CareerCraft AI Platform',
        description: 'Full-stack SaaS application for ATS-friendly resume generation, automated keyword scoring, cover letter creation, and AI portfolio website generation.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
        link: 'https://careercraft.ai',
        github: 'https://github.com/gopinath-dev/careercraft-ai'
      },
      {
        name: 'E-Commerce Web Application',
        description: 'Scalable multi-vendor e-commerce platform with product filtering, shopping cart state management, and Stripe payment gateway.',
        technologies: ['React.js', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB'],
        link: '',
        github: 'https://github.com/gopinath-dev/ecommerce-mern'
      }
    ],
    experience: (profile?.experience || []).length > 0 ? JSON.parse(JSON.stringify(profile.experience)) : [
      {
        position: 'Senior Full Stack Engineer',
        company: 'CloudTech Solutions',
        duration: '2022 - Present',
        description: 'Engineered scalable RESTful microservices with Node.js and Express, processing over 100,000 daily API transactions. Designed and optimized MongoDB aggregation pipelines and compound indexes.'
      },
      {
        position: 'Frontend Developer',
        company: 'WebCraft Digital',
        duration: '2020 - 2022',
        description: 'Developed interactive web portals with React, JavaScript, HTML5, and Tailwind CSS. Automated testing with Jest and integrated third-party RESTful APIs.'
      }
    ],
    education: (profile?.education || []).length > 0 ? JSON.parse(JSON.stringify(profile.education)) : [
      {
        degree: 'Bachelor of Engineering in Computer Science',
        institution: 'Anna University',
        year: '2016 - 2020',
        score: 'First Class with Distinction'
      }
    ],
    certifications: (profile?.certifications || []).length > 0 ? JSON.parse(JSON.stringify(profile.certifications)) : [
      { name: 'Full Stack Web Development with MERN', issuer: 'Udemy', year: '2023' },
      { name: 'AWS Certified Developer Associate', issuer: 'Amazon Web Services', year: '2024' }
    ],
    achievements: (profile?.achievements || []).length > 0 ? [...profile.achievements] : [
      '1st Place Winner - Inter-College Hackathon 2024',
      'Top 5% Rank - LeetCode Algorithms & Data Structures'
    ]
  }));

  // Temporary skill input state for manual addition
  const [newSkillText, setNewSkillText] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('technical');

  const themes = [
    { id: 'tech-blue', name: 'Primary Blue Modern', bg: '#F0F9FF', color: '#079FE8' },
    { id: 'minimal-light', name: 'Clean Minimalist', bg: '#ffffff', color: '#073B68' },
    { id: 'navy-pro', name: 'Deep Navy Professional', bg: '#062B4F', color: '#38C5F5' },
    { id: 'royal-azure', name: 'Royal Azure', bg: '#073B68', color: '#079FE8' },
    { id: 'tech-dark', name: 'Cyber Tech Dark', bg: '#0B0F19', color: '#6366F1' }
  ];

  const getInitials = (name) => {
    if (!name) return 'DEV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSave = () => {
    storageService.savePortfolioSettings(portfolioSettings);
    apiService.updatePortfolioSettings(portfolioSettings).catch(() => {});
    addToast('Portfolio configuration updated and published!', 'success');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio/${portfolioSettings.slug || 'gopinath'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Shareable portfolio link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Portfolio as ZIP handler
  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      addToast('Packaging your portfolio website source code...', 'info');
      const res = await portfolioZipService.downloadPortfolioZip(profile, portfolioSettings);
      if (res && res.success) {
        addToast(`Downloaded ${res.fileName} successfully!`, 'success');
      }
    } catch (err) {
      console.error('Error packaging portfolio ZIP:', err);
      addToast('Failed to package portfolio ZIP. Please try again.', 'error');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Generate Portfolio from Manual Entry
  const handleGenerateFromManual = () => {
    if (!manualData.personalInfo.fullName.trim()) {
      addToast('Please enter your full name.', 'warning');
      return;
    }

    const updatedProfile = {
      ...(profile || {}),
      personalInfo: { ...manualData.personalInfo },
      careerInfo: {
        ...(profile?.careerInfo || {}),
        targetRole: manualData.personalInfo.title,
        summary: manualData.customBio
      },
      skills: { ...manualData.skills },
      projects: [...manualData.projects],
      experience: [...manualData.experience],
      education: [...manualData.education],
      certifications: [...manualData.certifications],
      achievements: [...manualData.achievements]
    };

    const updatedSettings = {
      ...portfolioSettings,
      tagline: manualData.tagline,
      customBio: manualData.customBio,
      slug: portfolioSettings.slug || manualData.personalInfo.fullName.toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'developer'
    };

    // Update state and persistent storage
    updateProfile(updatedProfile);
    setPortfolioSettings(updatedSettings);
    storageService.savePortfolioSettings(updatedSettings);

    const totalSkills = (manualData.skills.technical?.length || 0) +
                        (manualData.skills.frameworks?.length || 0) +
                        (manualData.skills.databases?.length || 0) +
                        (manualData.skills.tools?.length || 0) +
                        (manualData.skills.soft?.length || 0);

    setGeneratedStats({
      skillsCount: totalSkills,
      projectsCount: manualData.projects.length,
      experienceCount: manualData.experience.length,
      educationCount: manualData.education.length,
      certificationsCount: manualData.certifications.length,
      achievementsCount: manualData.achievements.length
    });

    addToast(`Portfolio generated for ${manualData.personalInfo.fullName}! Ready to preview & download.`, 'success');
  };

  // Manual editing helper methods
  const handleAddSkill = (category) => {
    if (!newSkillText.trim()) return;
    const cat = category || selectedSkillCategory;
    const existing = manualData.skills[cat] || [];
    if (!existing.includes(newSkillText.trim())) {
      setManualData({
        ...manualData,
        skills: {
          ...manualData.skills,
          [cat]: [...existing, newSkillText.trim()]
        }
      });
      setNewSkillText('');
      addToast(`Added "${newSkillText.trim()}" to ${cat} skills`, 'info');
    }
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setManualData({
      ...manualData,
      skills: {
        ...manualData.skills,
        [category]: (manualData.skills[category] || []).filter(s => s !== skillToRemove)
      }
    });
  };

  const handleAddProject = () => {
    const newProj = {
      name: 'New Featured Project',
      description: 'Describe the problem solved, architecture, and measurable impact.',
      technologies: ['React.js', 'Node.js'],
      link: '',
      github: ''
    };
    setManualData({
      ...manualData,
      projects: [newProj, ...manualData.projects]
    });
    setManualSection('projects');
  };

  const handleRemoveProject = (index) => {
    setManualData({
      ...manualData,
      projects: manualData.projects.filter((_, idx) => idx !== index)
    });
  };

  const handleAddExperience = () => {
    const newExp = {
      position: 'Software Developer',
      company: 'Organization / Company',
      duration: 'Year - Present',
      description: 'Key responsibilities, technologies utilized, and engineering accomplishments.'
    };
    setManualData({
      ...manualData,
      experience: [newExp, ...manualData.experience]
    });
    setManualSection('experience');
  };

  const handleRemoveExperience = (index) => {
    setManualData({
      ...manualData,
      experience: manualData.experience.filter((_, idx) => idx !== index)
    });
  };

  const handleAddEducation = () => {
    const newEdu = {
      degree: 'B.E. / B.Tech / Degree',
      institution: 'University / College Name',
      year: 'Year - Year',
      score: 'Grade / GPA'
    };
    setManualData({
      ...manualData,
      education: [...manualData.education, newEdu]
    });
    setManualSection('education');
  };

  const handleRemoveEducation = (index) => {
    setManualData({
      ...manualData,
      education: manualData.education.filter((_, idx) => idx !== index)
    });
  };

  const handleAddCertification = () => {
    const newCert = {
      name: 'Certification Name',
      issuer: 'Issuing Body (e.g. AWS, Coursera, Meta)',
      year: new Date().getFullYear().toString()
    };
    setManualData({
      ...manualData,
      certifications: [...manualData.certifications, newCert]
    });
    setManualSection('credentials');
  };

  const handleRemoveCertification = (index) => {
    setManualData({
      ...manualData,
      certifications: manualData.certifications.filter((_, idx) => idx !== index)
    });
  };

  const handleAddAchievement = () => {
    setManualData({
      ...manualData,
      achievements: [...manualData.achievements, 'New Engineering Honor / Award']
    });
    setManualSection('credentials');
  };

  const handleRemoveAchievement = (index) => {
    setManualData({
      ...manualData,
      achievements: manualData.achievements.filter((_, idx) => idx !== index)
    });
  };

  // File Selection Handlers
  const validateAndSetFile = (file) => {
    if (!file) return;
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      addToast('Please upload a PDF (.pdf), Word doc (.docx), or Text file (.txt).', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File size exceeds 10MB limit. Please upload a smaller document.', 'error');
      return;
    }

    setUploadedFile(file);
    setIsSampleResume(false);
    setGeneratedStats(null);
    addToast(`Loaded ${file.name} (${(file.size / 1024).toFixed(0)} KB)`, 'info');
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

  const handleUseSampleResume = () => {
    const blob = new Blob([SAMPLE_RESUME_TEXT], { type: 'text/plain' });
    const file = new File([blob], 'sample_developer_resume.txt', { type: 'text/plain' });
    setUploadedFile(file);
    setIsSampleResume(true);
    setGeneratedStats(null);
    addToast('Loaded sample developer resume! Click "Generate Website Now" below.', 'success');
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setIsSampleResume(false);
    setGeneratedStats(null);
    setAtsAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Main Resume Analysis & Website Generation
  const handleAnalyzeAndGenerate = async () => {
    if (!uploadedFile) {
      addToast('Please select or drop a resume file first.', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStage('Extracting credentials with Google Gemini AI...');

    try {
      let result = null;

      setTimeout(() => {
        setGenerationProgress(45);
        setGenerationStage('Evaluating ATS compatibility & recruiter keywords with Gemini API...');
      }, 500);

      setTimeout(() => {
        setGenerationProgress(75);
        setGenerationStage('Synthesizing ATS-friendly recommendations & theme with Gemini AI...');
      }, 1000);

      // 1. Try calling Backend Generator
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        result = await apiService.generatePortfolioFromResume(formData);
      } catch (backendErr) {
        console.warn('Backend generation failed, attempting seamless local fallback:', backendErr);
        let rawText = '';
        if (isSampleResume) {
          rawText = SAMPLE_RESUME_TEXT;
        } else {
          rawText = await uploadedFile.text().catch(() => '');
        }

        if (rawText && rawText.length > 30) {
          const localParsed = parseResumeLocally(rawText);
          result = {
            success: true,
            profile: localParsed,
            portfolioSettings: localParsed.portfolioSettings,
            atsAnalysis: localParsed.atsAnalysis,
            stats: {
              skillsCount: (localParsed.skills?.technical?.length || 0) + (localParsed.skills?.frameworks?.length || 0),
              projectsCount: localParsed.projects?.length || 0,
              experienceCount: localParsed.experience?.length || 0,
              educationCount: localParsed.education?.length || 0
            },
            source: 'local-engine'
          };
        } else {
          throw backendErr;
        }
      }

      setGenerationProgress(95);
      setGenerationStage('Assembling and publishing live portfolio website...');

      if (result && result.success && result.profile) {
        const newProfile = result.profile;
        const newSettings = result.portfolioSettings || result.profile.portfolioSettings;

        // Set ATS Analysis
        const atsData = result.atsAnalysis || newProfile.atsAnalysis || null;
        if (atsData) {
          setAtsAnalysis(atsData);
          newProfile.atsAnalysis = atsData;
        }

        // Update profile in state and storage
        updateProfile(newProfile);

        // Update portfolio settings
        setPortfolioSettings(newSettings);
        storageService.savePortfolioSettings(newSettings);

        // Set extraction stats
        const totalSkills = (newProfile.skills?.technical?.length || 0) +
                            (newProfile.skills?.frameworks?.length || 0) +
                            (newProfile.skills?.databases?.length || 0) +
                            (newProfile.skills?.tools?.length || 0) +
                            (newProfile.skills?.languages?.length || 0);

        setGeneratedStats(result.stats || {
          skillsCount: totalSkills,
          projectsCount: newProfile.projects?.length || 0,
          experienceCount: newProfile.experience?.length || 0,
          educationCount: newProfile.education?.length || 0,
          certificationsCount: newProfile.certifications?.length || 0,
          achievementsCount: newProfile.achievements?.length || 0
        });

        // Also synchronize manual editing state with extracted data
        setManualData({
          personalInfo: {
            fullName: newProfile.personalInfo?.fullName || 'B. Gopinath',
            title: newProfile.personalInfo?.title || 'Senior Full Stack MERN Developer',
            email: newProfile.personalInfo?.email || '',
            phone: newProfile.personalInfo?.phone || '',
            location: newProfile.personalInfo?.location || '',
            github: newProfile.personalInfo?.github || '',
            linkedin: newProfile.personalInfo?.linkedin || '',
            website: newProfile.personalInfo?.website || ''
          },
          tagline: newSettings.tagline || newProfile.personalInfo?.title || '',
          customBio: newSettings.customBio || newProfile.careerInfo?.summary || '',
          skills: {
            technical: [...(newProfile.skills?.technical || [])],
            frameworks: [...(newProfile.skills?.frameworks || [])],
            databases: [...(newProfile.skills?.databases || [])],
            tools: [...(newProfile.skills?.tools || [])],
            soft: [...(newProfile.skills?.soft || [])]
          },
          projects: [...(newProfile.projects || [])],
          experience: [...(newProfile.experience || [])],
          education: [...(newProfile.education || [])],
          certifications: [...(newProfile.certifications || [])],
          achievements: [...(newProfile.achievements || [])]
        });

        setGenerationProgress(100);

        addToast(`Website generated for ${newProfile.personalInfo?.fullName || 'Developer'}!`, 'success');
      } else {
        throw new Error(result?.message || 'Could not parse resume document.');
      }
    } catch (err) {
      console.error('Error generating portfolio:', err);
      addToast(err.message || 'Failed to analyze resume. Please try another file.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">AI Website Generator</span>
            <span className="badge badge-success">MERN Live</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Portfolio Builder</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Upload your resume to analyze its ATS score, receive actionable improvement tips, and generate a live developer website displaying your real experience.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="outline"
            size="md"
            icon={isDownloadingZip ? RefreshCw : Download}
            loading={isDownloadingZip}
            onClick={handleDownloadZip}
            title="Download complete static HTML/CSS/JS source code"
          >
            {isDownloadingZip ? 'Packaging ZIP...' : 'Download Source Code (.zip)'}
          </Button>
          <Button variant="outline" size="md" icon={copied ? Check : Copy} onClick={handleCopyLink}>
            {copied ? 'Copied Link' : 'Copy Portfolio Link'}
          </Button>
          <Link to={`/portfolio/${portfolioSettings.slug || 'gopinath'}`} target="_blank">
            <Button variant="secondary" size="md" icon={ExternalLink}>
              Preview Live Site
            </Button>
          </Link>
          <Button variant="primary" size="md" icon={Save} onClick={handleSave}>
            Publish Portfolio
          </Button>
        </div>
      </div>

      {/* 1. RESUME UPLOAD TO WEBSITE GENERATOR (HERO CARD) */}
      <Card elevated style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(7, 159, 232, 0.08) 0%, rgba(99, 102, 241, 0.05) 50%, var(--bg-surface) 100%)',
        border: '2px solid rgba(7, 159, 232, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(7, 159, 232, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Mode Switcher: Resume Upload vs Manual Entry */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          background: 'var(--bg-surface-subtle)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          width: 'fit-content'
        }}>
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: inputMode === 'upload' ? 'var(--primary-600, #079FE8)' : 'transparent',
              color: inputMode === 'upload' ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Upload size={16} />
            <span>Upload Resume File</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('manual')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: inputMode === 'manual' ? 'var(--primary-600, #079FE8)' : 'transparent',
              color: inputMode === 'manual' ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Edit3 size={16} />
            <span>Manual Portfolio Entry</span>
          </button>
        </div>

        {/* WORKFLOW A: RESUME UPLOAD */}
        {inputMode === 'upload' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #073B68, #079FE8)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={18} />
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Auto-Generate Website from Resume</h2>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: 1.5 }}>
                  Upload your resume (PDF, Word DOCX, or TXT). Our parser extracts your real experience, skills, and projects to generate a live portfolio website and source code ZIP.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Sparkles}
                  onClick={handleUseSampleResume}
                  disabled={isGenerating}
                >
                  Try with Sample Resume
                </Button>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary-600, #079FE8)' : uploadedFile ? 'rgba(22, 163, 74, 0.5)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: uploadedFile ? '1.25rem 1.75rem' : '2.25rem 1.5rem',
                textAlign: 'center',
                backgroundColor: isDragging ? 'rgba(7, 159, 232, 0.05)' : uploadedFile ? 'rgba(22, 163, 74, 0.03)' : 'var(--bg-surface-subtle)',
                cursor: uploadedFile ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".pdf,.docx,.doc,.txt"
                style={{ display: 'none' }}
              />

              {!uploadedFile ? (
                <>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(7, 159, 232, 0.12)',
                    color: 'var(--primary-600, #079FE8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={26} />
                  </div>

                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Drag & drop your resume file here, or <span style={{ color: '#079FE8', textDecoration: 'underline' }}>browse</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Supports PDF (.pdf), Word (.docx), or Text (.txt) up to 10MB
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', fontSize: '0.75rem' }}>.PDF</span>
                    <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', fontSize: '0.75rem' }}>.DOCX</span>
                    <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', fontSize: '0.75rem' }}>.TXT</span>
                  </div>
                </>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(22, 163, 74, 0.15)',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileCheck size={24} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {uploadedFile.name}
                        {isSampleResume && <span className="badge badge-primary">Sample Resume</span>}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {(uploadedFile.size / 1024).toFixed(1)} KB • Ready to analyze & generate
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      disabled={isGenerating}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      icon={Sparkles}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnalyzeAndGenerate();
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? 'Generating Website...' : 'Generate Website Now'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKFLOW B: MANUAL ENTRY */}
        {inputMode === 'manual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit3 size={20} color="#079FE8" />
                  Manual Portfolio Information Editor
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Add, edit, or customize your portfolio content section-by-section. When ready, click "Generate Portfolio Website" to create your live site and downloadable ZIP.
                </p>
              </div>

              <Button variant="primary" size="md" icon={Sparkles} onClick={handleGenerateFromManual}>
                Generate Portfolio Website
              </Button>
            </div>

            {/* Manual Section Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              {[
                { id: 'personal', label: 'Personal & Links', icon: User },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'projects', label: `Projects (${manualData.projects.length})`, icon: Globe },
                { id: 'experience', label: `Experience (${manualData.experience.length})`, icon: Briefcase },
                { id: 'education', label: `Education (${manualData.education.length})`, icon: GraduationCap },
                { id: 'credentials', label: `Certifications & Honors`, icon: Award }
              ].map(sec => {
                const IconComponent = sec.icon;
                const isActive = manualSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setManualSection(sec.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      border: `1px solid ${isActive ? 'var(--primary-600, #079FE8)' : 'var(--border-color)'}`,
                      background: isActive ? 'rgba(7, 159, 232, 0.12)' : 'var(--bg-surface)',
                      color: isActive ? 'var(--primary-600, #079FE8)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComponent size={15} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab 1: Personal Details & Links */}
            {manualSection === 'personal' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={manualData.personalInfo.fullName}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, fullName: e.target.value }
                    })}
                    placeholder="e.g. B. Gopinath"
                  />
                </div>

                <div>
                  <label className="input-label">Professional Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={manualData.personalInfo.title}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, title: e.target.value }
                    })}
                    placeholder="e.g. Senior Full Stack MERN Developer"
                  />
                </div>

                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={manualData.personalInfo.email}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, email: e.target.value }
                    })}
                    placeholder="e.g. gopinath@example.com"
                  />
                </div>

                <div>
                  <label className="input-label">Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={manualData.personalInfo.phone}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, phone: e.target.value }
                    })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={manualData.personalInfo.location}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, location: e.target.value }
                    })}
                    placeholder="e.g. Chennai, India"
                  />
                </div>

                <div>
                  <label className="input-label">GitHub URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={manualData.personalInfo.github}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, github: e.target.value }
                    })}
                    placeholder="https://github.com/your-username"
                  />
                </div>

                <div>
                  <label className="input-label">LinkedIn URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={manualData.personalInfo.linkedin}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>

                <div>
                  <label className="input-label">Personal Website / Blog</label>
                  <input
                    type="url"
                    className="input-field"
                    value={manualData.personalInfo.website}
                    onChange={(e) => setManualData({
                      ...manualData,
                      personalInfo: { ...manualData.personalInfo, website: e.target.value }
                    })}
                    placeholder="https://yourdomain.com"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Hero Headline Tagline</label>
                  <input
                    type="text"
                    className="input-field"
                    value={manualData.tagline}
                    onChange={(e) => setManualData({ ...manualData, tagline: e.target.value })}
                    placeholder="e.g. Building scalable web experiences and modern digital platforms."
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Professional Summary / About Bio</label>
                  <textarea
                    rows={4}
                    className="textarea-field"
                    value={manualData.customBio}
                    onChange={(e) => setManualData({ ...manualData, customBio: e.target.value })}
                    placeholder="Write a compelling overview of your engineering background..."
                  />
                </div>
              </div>
            )}

            {/* Sub-tab 2: Skills Editor */}
            {manualSection === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select
                    className="select-field"
                    style={{ width: 'auto', minWidth: '180px' }}
                    value={selectedSkillCategory}
                    onChange={(e) => setSelectedSkillCategory(e.target.value)}
                  >
                    <option value="technical">Languages & Core</option>
                    <option value="frameworks">Frameworks & Libraries</option>
                    <option value="databases">Databases</option>
                    <option value="tools">DevOps & Tools</option>
                    <option value="soft">Soft Skills</option>
                  </select>

                  <input
                    type="text"
                    className="input-field"
                    style={{ flex: 1, minWidth: '200px' }}
                    placeholder="Enter skill name (e.g. Next.js, Docker, Tailwind CSS)..."
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  />

                  <Button variant="primary" size="md" icon={Plus} onClick={() => handleAddSkill()}>
                    Add Skill
                  </Button>
                </div>

                {/* Categorized Skills Pills */}
                {['technical', 'frameworks', 'databases', 'tools', 'soft'].map(cat => {
                  const catLabels = {
                    technical: 'Languages & Core Tech',
                    frameworks: 'Frameworks & Libraries',
                    databases: 'Databases & Storage',
                    tools: 'DevOps & Tools',
                    soft: 'Soft & Leadership Skills'
                  };
                  const skillsList = manualData.skills[cat] || [];

                  return (
                    <div key={cat} style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--color-dark-blue)' }}>
                        {catLabels[cat]} ({skillsList.length})
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {skillsList.map((sk, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '0.3rem 0.65rem',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <span>{sk}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(cat, sk)}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1 }}
                              title="Remove skill"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {skillsList.length === 0 && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No skills added in this category yet.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sub-tab 3: Projects Editor */}
            {manualSection === 'projects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Add your featured portfolio projects with live URLs and GitHub repository links.
                  </span>
                  <Button variant="outline" size="sm" icon={Plus} onClick={handleAddProject}>
                    Add Project
                  </Button>
                </div>

                {manualData.projects.map((proj, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9375rem', color: '#079FE8' }}>Project #{idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <div>
                        <label className="input-label">Project Title</label>
                        <input
                          type="text"
                          className="input-field"
                          value={proj.name}
                          onChange={(e) => {
                            const updated = [...manualData.projects];
                            updated[idx].name = e.target.value;
                            setManualData({ ...manualData, projects: updated });
                          }}
                          placeholder="e.g. AI SaaS Platform"
                        />
                      </div>

                      <div>
                        <label className="input-label">Technologies (comma-separated)</label>
                        <input
                          type="text"
                          className="input-field"
                          value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')}
                          onChange={(e) => {
                            const updated = [...manualData.projects];
                            updated[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setManualData({ ...manualData, projects: updated });
                          }}
                          placeholder="e.g. React.js, Node.js, Express, MongoDB"
                        />
                      </div>

                      <div>
                        <label className="input-label">Live Demo URL</label>
                        <input
                          type="url"
                          className="input-field"
                          value={proj.link || ''}
                          onChange={(e) => {
                            const updated = [...manualData.projects];
                            updated[idx].link = e.target.value;
                            setManualData({ ...manualData, projects: updated });
                          }}
                          placeholder="https://project-demo.com"
                        />
                      </div>

                      <div>
                        <label className="input-label">GitHub Repository URL</label>
                        <input
                          type="url"
                          className="input-field"
                          value={proj.github || ''}
                          onChange={(e) => {
                            const updated = [...manualData.projects];
                            updated[idx].github = e.target.value;
                            setManualData({ ...manualData, projects: updated });
                          }}
                          placeholder="https://github.com/user/project-repo"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Project Description</label>
                      <textarea
                        rows={3}
                        className="textarea-field"
                        value={proj.description || ''}
                        onChange={(e) => {
                          const updated = [...manualData.projects];
                          updated[idx].description = e.target.value;
                          setManualData({ ...manualData, projects: updated });
                        }}
                        placeholder="Detail the architecture, your specific role, and outcomes achieved..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 4: Experience Editor */}
            {manualSection === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    List your employment history, client engagements, or internships.
                  </span>
                  <Button variant="outline" size="sm" icon={Plus} onClick={handleAddExperience}>
                    Add Experience
                  </Button>
                </div>

                {manualData.experience.map((exp, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9375rem', color: '#073B68' }}>Role #{idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="grid-3" style={{ gap: '0.75rem' }}>
                      <div>
                        <label className="input-label">Job Title / Position</label>
                        <input
                          type="text"
                          className="input-field"
                          value={exp.position || exp.title || ''}
                          onChange={(e) => {
                            const updated = [...manualData.experience];
                            updated[idx].position = e.target.value;
                            setManualData({ ...manualData, experience: updated });
                          }}
                          placeholder="e.g. Senior Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="input-label">Company / Organization</label>
                        <input
                          type="text"
                          className="input-field"
                          value={exp.company || ''}
                          onChange={(e) => {
                            const updated = [...manualData.experience];
                            updated[idx].company = e.target.value;
                            setManualData({ ...manualData, experience: updated });
                          }}
                          placeholder="e.g. CloudTech Solutions"
                        />
                      </div>

                      <div>
                        <label className="input-label">Dates / Duration</label>
                        <input
                          type="text"
                          className="input-field"
                          value={exp.duration || ''}
                          onChange={(e) => {
                            const updated = [...manualData.experience];
                            updated[idx].duration = e.target.value;
                            setManualData({ ...manualData, experience: updated });
                          }}
                          placeholder="e.g. 2022 - Present"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Responsibilities & Achievements</label>
                      <textarea
                        rows={3}
                        className="textarea-field"
                        value={exp.description || ''}
                        onChange={(e) => {
                          const updated = [...manualData.experience];
                          updated[idx].description = e.target.value;
                          setManualData({ ...manualData, experience: updated });
                        }}
                        placeholder="Detail core contributions, system scale, and impact..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 5: Education Editor */}
            {manualSection === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Add college degrees, diplomas, or academic qualifications.
                  </span>
                  <Button variant="outline" size="sm" icon={Plus} onClick={handleAddEducation}>
                    Add Education
                  </Button>
                </div>

                {manualData.education.map((edu, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9375rem', color: '#16a34a' }}>Education #{idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <div>
                        <label className="input-label">Degree & Field of Study</label>
                        <input
                          type="text"
                          className="input-field"
                          value={edu.degree || ''}
                          onChange={(e) => {
                            const updated = [...manualData.education];
                            updated[idx].degree = e.target.value;
                            setManualData({ ...manualData, education: updated });
                          }}
                          placeholder="e.g. B.Tech in Computer Science"
                        />
                      </div>

                      <div>
                        <label className="input-label">Institution / University</label>
                        <input
                          type="text"
                          className="input-field"
                          value={edu.institution || edu.school || ''}
                          onChange={(e) => {
                            const updated = [...manualData.education];
                            updated[idx].institution = e.target.value;
                            setManualData({ ...manualData, education: updated });
                          }}
                          placeholder="e.g. Anna University"
                        />
                      </div>

                      <div>
                        <label className="input-label">Years of Study</label>
                        <input
                          type="text"
                          className="input-field"
                          value={edu.year || ''}
                          onChange={(e) => {
                            const updated = [...manualData.education];
                            updated[idx].year = e.target.value;
                            setManualData({ ...manualData, education: updated });
                          }}
                          placeholder="e.g. 2016 - 2020"
                        />
                      </div>

                      <div>
                        <label className="input-label">Grade / GPA / Honors</label>
                        <input
                          type="text"
                          className="input-field"
                          value={edu.score || edu.grade || ''}
                          onChange={(e) => {
                            const updated = [...manualData.education];
                            updated[idx].score = e.target.value;
                            setManualData({ ...manualData, education: updated });
                          }}
                          placeholder="e.g. First Class with Distinction (8.8 GPA)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 6: Certifications & Honors Editor */}
            {manualSection === 'credentials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Certifications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Certifications</h3>
                    <Button variant="outline" size="sm" icon={Plus} onClick={handleAddCertification}>
                      Add Certification
                    </Button>
                  </div>

                  {manualData.certifications.map((cert, idx) => (
                    <div key={idx} style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ flex: 2 }}
                        value={typeof cert === 'string' ? cert : (cert.name || '')}
                        onChange={(e) => {
                          const updated = [...manualData.certifications];
                          if (typeof cert === 'string') {
                            updated[idx] = e.target.value;
                          } else {
                            updated[idx].name = e.target.value;
                          }
                          setManualData({ ...manualData, certifications: updated });
                        }}
                        placeholder="Certificate Title"
                      />
                      <input
                        type="text"
                        className="input-field"
                        style={{ flex: 1 }}
                        value={typeof cert === 'object' ? (cert.issuer || '') : ''}
                        onChange={(e) => {
                          const updated = [...manualData.certifications];
                          if (typeof cert === 'object') {
                            updated[idx].issuer = e.target.value;
                          }
                          setManualData({ ...manualData, certifications: updated });
                        }}
                        placeholder="Issuer (e.g. AWS)"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(idx)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Achievements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Honors & Achievements</h3>
                    <Button variant="outline" size="sm" icon={Plus} onClick={handleAddAchievement}>
                      Add Honor
                    </Button>
                  </div>

                  {manualData.achievements.map((ach, idx) => (
                    <div key={idx} style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="input-field"
                        style={{ flex: 1 }}
                        value={typeof ach === 'string' ? ach : (ach.title || '')}
                        onChange={(e) => {
                          const updated = [...manualData.achievements];
                          updated[idx] = e.target.value;
                          setManualData({ ...manualData, achievements: updated });
                        }}
                        placeholder="Achievement description (e.g. 1st Place Hackathon Winner)..."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(idx)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Generate Action Button for Manual Entry */}
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="primary" size="lg" icon={Sparkles} onClick={handleGenerateFromManual}>
                Generate Portfolio Website
              </Button>
            </div>
          </div>
        )}

        {/* Generation Progress Indicator */}
        {isGenerating && (
          <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#079FE8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={16} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                {generationStage}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{generationProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${generationProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #079FE8, #6366f1)',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        )}

        {/* Post-Generation Success Celebration Banner */}
        {generatedStats && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(7, 159, 232, 0.08) 100%)',
            border: '1px solid rgba(22, 163, 74, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#16a34a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Developer Website Generated Successfully!
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <span>✓ <strong>{generatedStats.skillsCount}</strong> Skills Extracted</span>
                  {generatedStats.projectsCount > 0 && <span>✓ <strong>{generatedStats.projectsCount}</strong> Projects Built</span>}
                  {generatedStats.experienceCount > 0 && <span>✓ <strong>{generatedStats.experienceCount}</strong> Work Experiences</span>}
                  {generatedStats.educationCount > 0 && <span>✓ <strong>{generatedStats.educationCount}</strong> Education</span>}
                  {generatedStats.certificationsCount > 0 && <span>✓ <strong>{generatedStats.certificationsCount}</strong> Certifications</span>}
                  <span>✓ Published at <strong>/portfolio/{portfolioSettings.slug}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="sm"
                icon={isDownloadingZip ? RefreshCw : Download}
                loading={isDownloadingZip}
                onClick={handleDownloadZip}
              >
                Download Source (.zip)
              </Button>
              <Link to={`/portfolio/${portfolioSettings.slug || 'gopinath'}`} target="_blank">
                <Button variant="secondary" size="sm" icon={ExternalLink}>
                  Open Live Website
                </Button>
              </Link>
              <Button variant="outline" size="sm" icon={copied ? Check : Copy} onClick={handleCopyLink}>
                {copied ? 'Copied Link' : 'Copy Link'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 1.5 ATS RESUME SCORE & ACTIONABLE IMPROVEMENT ADVISORY */}
      {atsAnalysis && (
        <Card elevated style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(7, 159, 232, 0.25)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: atsAnalysis.score >= 80 ? 'rgba(22, 163, 74, 0.12)' : atsAnalysis.score >= 60 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: atsAnalysis.score >= 80 ? '#16a34a' : atsAnalysis.score >= 60 ? '#f59e0b' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>ATS Resume Score & Improvement Advisory</h2>
                  <span className={`badge ${atsAnalysis.score >= 80 ? 'badge-success' : atsAnalysis.score >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                    {atsAnalysis.score >= 80 ? 'Strong ATS Match' : atsAnalysis.score >= 60 ? 'Needs Optimization' : 'Low Compatibility'}
                  </span>
                  <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                    <Sparkles size={12} />
                    Powered by Gemini AI
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Evaluated against recruitment algorithms for <strong>{atsAnalysis.targetRole || 'Software Engineer'}</strong>
                </p>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: atsAnalysis.score >= 80 ? 'rgba(22, 163, 74, 0.08)' : atsAnalysis.score >= 60 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${atsAnalysis.score >= 80 ? 'rgba(22, 163, 74, 0.3)' : atsAnalysis.score >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ATS Score</div>
                <div style={{ fontSize: '0.8125rem', color: atsAnalysis.score >= 80 ? '#16a34a' : atsAnalysis.score >= 60 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                  {atsAnalysis.score >= 80 ? 'Top Tier Match' : 'Optimization Needed'}
                </div>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: atsAnalysis.score >= 80 ? '#16a34a' : atsAnalysis.score >= 60 ? '#f59e0b' : '#ef4444',
                lineHeight: 1
              }}>
                {atsAnalysis.score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
              </div>
            </div>
          </div>

          {/* Interpretation Banner */}
          {atsAnalysis.interpretation && (
            <div style={{
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              borderLeft: `4px solid ${atsAnalysis.score >= 80 ? '#16a34a' : '#f59e0b'}`,
              fontSize: '0.875rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)'
            }}>
              <strong>Summary Assessment:</strong> {atsAnalysis.interpretation}
            </div>
          )}

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
            <button
              onClick={() => setActiveAtsTab('recommendations')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                background: activeAtsTab === 'recommendations' ? 'var(--primary-600, #079FE8)' : 'transparent',
                color: activeAtsTab === 'recommendations' ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Lightbulb size={16} />
              <span>Improvement Suggestions ({atsAnalysis.recommendations?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveAtsTab('breakdown')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                background: activeAtsTab === 'breakdown' ? 'var(--primary-600, #079FE8)' : 'transparent',
                color: activeAtsTab === 'breakdown' ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Target size={16} />
              <span>Score Breakdown ({atsAnalysis.categories?.length || 0})</span>
            </button>

            {atsAnalysis.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
              <button
                onClick={() => setActiveAtsTab('keywords')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeAtsTab === 'keywords' ? 'var(--primary-600, #079FE8)' : 'transparent',
                  color: activeAtsTab === 'keywords' ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <AlertTriangle size={16} />
                <span>Missing Keywords ({atsAnalysis.missingKeywords.length})</span>
              </button>
            )}

            {atsAnalysis.strengths && atsAnalysis.strengths.length > 0 && (
              <button
                onClick={() => setActiveAtsTab('strengths')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeAtsTab === 'strengths' ? 'var(--primary-600, #079FE8)' : 'transparent',
                  color: activeAtsTab === 'strengths' ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Key Strengths ({atsAnalysis.strengths.length})</span>
              </button>
            )}
          </div>

          {/* TAB 1: ACTIONABLE IMPROVEMENT SUGGESTIONS */}
          {activeAtsTab === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Apply these recommendations to optimize your resume for automated screening systems and increase recruiter callback rates:
              </div>

              {(!atsAnalysis.recommendations || atsAnalysis.recommendations.length === 0) ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: 700 }}>No critical ATS issues detected!</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Your resume follows standard ATS structure and has high keyword alignment.</div>
                </div>
              ) : (
                atsAnalysis.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                        {rec.section || 'General'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action Item #{idx + 1}</span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {rec.issue}
                    </h4>

                    {rec.whyItMatters && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        <strong>Why ATS parsers flag this:</strong> {rec.whyItMatters}
                      </p>
                    )}

                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(7, 159, 232, 0.08)',
                      borderLeft: '3px solid #079FE8',
                      fontSize: '0.84375rem',
                      lineHeight: 1.5
                    }}>
                      <strong>How to improve:</strong> {rec.suggestedImprovement}
                    </div>

                    {rec.example && (
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-light, #f8fafc)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace',
                        lineHeight: 1.5
                      }}>
                        {rec.example}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SCORE BREAKDOWN (6 PILLARS) */}
          {activeAtsTab === 'breakdown' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(atsAnalysis.categories || []).map((cat, idx) => {
                const percent = Math.round((cat.earned / cat.max) * 100);
                const barColor = percent >= 80 ? '#16a34a' : percent >= 60 ? '#f59e0b' : '#ef4444';

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{cat.name}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: barColor }}>
                        {cat.earned} / {cat.max} pts
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>

                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {cat.explanation}
                    </p>

                    {cat.issues && cat.issues.length > 0 && (
                      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>Issues to Address:</div>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                          {cat.issues.map((iss, iIdx) => (
                            <li key={iIdx}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: MISSING HIGH-PRIORITY KEYWORDS */}
          {activeAtsTab === 'keywords' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}>
                <strong>Why Keywords Matter:</strong> Automated applicant screening algorithms (ATS) look for role-critical keywords in your work experience and technical skills to compute an automated match score. Adding keywords you have worked with ensures your profile passes the recruiter screening threshold.
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Missing Target Role Keywords ({atsAnalysis.missingKeywords?.length || 0}):
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(atsAnalysis.missingKeywords || []).map((kw, idx) => (
                    <span
                      key={idx}
                      className="badge badge-warning"
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>+ {kw}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEY STRENGTHS */}
          {activeAtsTab === 'strengths' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(atsAnalysis.strengths || []).map((str, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(22, 163, 74, 0.06)',
                    border: '1px solid rgba(22, 163, 74, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Main Settings Grid */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        
        {/* Left: Customization Panel */}
        <Card elevated style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Customization Settings</h3>
            <span className="badge badge-primary">Auto-Populated</span>
          </div>
          
          <div>
            <label className="input-label">Custom Portfolio Slug (URL identifier)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/portfolio/</span>
              <input
                type="text"
                className="input-field"
                value={portfolioSettings.slug || ''}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                placeholder="gopinath"
              />
            </div>
            <div className="input-helper">This creates your unique public URL: /portfolio/{portfolioSettings.slug || 'gopinath'}</div>
          </div>

          <div>
            <label className="input-label">Select Theme Aesthetic</label>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              {themes.map(t => (
                <div
                  key={t.id}
                  onClick={() => setPortfolioSettings({ ...portfolioSettings, theme: t.id })}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${portfolioSettings.theme === t.id ? 'var(--primary-600, #079FE8)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'var(--bg-surface-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.bg, border: `2px solid ${t.color}` }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">Hero Tagline Headline</label>
            <input
              type="text"
              className="input-field"
              value={portfolioSettings.tagline || ''}
              onChange={(e) => setPortfolioSettings({ ...portfolioSettings, tagline: e.target.value })}
              placeholder="Building scalable full-stack web experiences..."
            />
          </div>

          <div>
            <label className="input-label">Custom Bio / About Intro</label>
            <textarea
              rows={4}
              className="textarea-field"
              value={portfolioSettings.customBio || ''}
              onChange={(e) => setPortfolioSettings({ ...portfolioSettings, customBio: e.target.value })}
              placeholder="Write a custom developer introduction..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <input
              type="checkbox"
              id="showContact"
              checked={portfolioSettings.showContactForm}
              onChange={(e) => setPortfolioSettings({ ...portfolioSettings, showContactForm: e.target.checked })}
              style={{ width: '1.125rem', height: '1.125rem' }}
            />
            <label htmlFor="showContact" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Enable Direct Get In Touch Contact Actions
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
            <Button variant="primary" size="md" icon={Save} onClick={handleSave} style={{ flex: 1 }}>
              Save & Publish Changes
            </Button>
          </div>
        </Card>

        {/* Right: Live Interactive Visual Card Preview */}
        <Card elevated style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Interactive Site Preview</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/portfolio/${portfolioSettings.slug || 'gopinath'}`} target="_blank">
                <Button variant="outline" size="sm" icon={Eye}>Full Page Preview</Button>
              </Link>
            </div>
          </div>

          <div style={{
            flex: 1,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            background: themes.find(t => t.id === portfolioSettings.theme)?.bg || '#F0F9FF',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            
            {/* Mock Browser Header */}
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.85)',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.06)',
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ marginLeft: 'auto', marginRight: 'auto', fontWeight: 600 }}>
                careercraft.ai/portfolio/{portfolioSettings.slug || 'gopinath'}
              </span>
            </div>

            {/* Simulated Hero Mock */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #073B68, #079FE8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                boxShadow: '0 8px 16px rgba(7, 159, 232, 0.25)'
              }}>
                {getInitials(profile?.personalInfo?.fullName || 'B. Gopinath')}
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                  Hi, I'm {profile?.personalInfo?.fullName || 'Developer'}
                </h4>
                {profile?.personalInfo?.title && (
                  <div style={{ fontSize: '0.8125rem', color: '#079FE8', fontWeight: 700 }}>
                    {profile.personalInfo.title}
                  </div>
                )}
              </div>
              {portfolioSettings.tagline && (
                <p style={{ fontSize: '0.75rem', opacity: 0.85, maxWidth: '320px', lineHeight: 1.5 }}>
                  {portfolioSettings.tagline}
                </p>
              )}

              {/* Skills Pill Preview */}
              {((profile?.skills?.technical || profile?.skills?.frameworks || []).length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', maxWidth: '320px', margin: '0.25rem 0' }}>
                  {[...(profile?.skills?.technical || []), ...(profile?.skills?.frameworks || [])].slice(0, 5).map((sk, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.625rem',
                      padding: '0.15rem 0.45rem',
                      background: 'rgba(7, 159, 232, 0.15)',
                      color: '#073B68',
                      borderRadius: '10px',
                      fontWeight: 600
                    }}>
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              {/* Mini Projects Showcase (only if projects exist in resume) */}
              {profile?.projects && profile.projects.length > 0 && (
                <div style={{ width: '100%', borderTop: '1px solid rgba(120,120,120,0.15)', paddingTop: '0.875rem', marginTop: '0.25rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Featured Projects</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{profile.projects.length} Total</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {profile.projects.slice(0, 2).map((p, idx) => (
                      <div key={idx} style={{
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(120,120,120,0.08)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.6875rem',
                        border: '1px solid rgba(120,120,120,0.1)'
                      }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong>
                        {p.technologies && p.technologies.length > 0 && (
                          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {p.technologies.slice(0, 4).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </Card>

      </div>

    </div>
  );
};

export default PortfolioBuilderPage;
