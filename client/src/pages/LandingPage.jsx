import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FileSearch,
  Globe,
  MailCheck,
  Compass,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Target,
  Award,
  Layers,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ATSScoreGauge } from '../components/ats/ATSScoreGauge';
import { storageService } from '../services/storageService';
import { atsEngine } from '../services/atsEngine';
import { sampleUserData } from '../data/sampleUserData';

export const LandingPage = () => {
  // Retrieve saved resume or use representative sample data
  const sampleResume = useMemo(() => {
    const saved = storageService.getResumes();
    if (saved && saved.length > 0) return saved[0];
    return {
      title: "MERN Stack Developer Resume",
      targetRole: "MERN Stack Developer",
      personalInfo: sampleUserData.personalInfo,
      summary: sampleUserData.careerInfo.summary,
      experience: sampleUserData.experience,
      education: sampleUserData.education,
      skills: sampleUserData.skills,
      projects: sampleUserData.projects,
    };
  }, []);

  // Compute realistic ATS evaluation using the platform's ATS engine
  const atsAnalysis = useMemo(() => {
    return atsEngine.analyzeResume(sampleResume);
  }, [sampleResume]);

  const atsScore = atsAnalysis?.score || 88;
  const detectedKeywords = useMemo(() => {
    const raw = atsAnalysis?.foundKeywords || [];
    const unique = [];
    for (const kw of raw) {
      if (!unique.some(u => u.toLowerCase() === kw.toLowerCase() || (u.toLowerCase().includes(kw.toLowerCase()) && u.length > kw.length))) {
        unique.push(kw);
      }
    }
    return unique.length > 0 ? unique.slice(0, 6) : ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "REST APIs"];
  }, [atsAnalysis]);
  const missingKeywords = atsAnalysis?.missingTopKeywords?.slice(0, 3) || [
    "TypeScript", "Docker", "CI/CD"
  ];

  // Core Features (Section 4)
  const coreFeatures = [
    {
      title: "ATS-Friendly Resume Builder",
      desc: "Build clean, structured resumes designed to pass Applicant Tracking Systems with professional formatting and instant PDF export.",
      icon: FileText,
      link: "/resumes/builder",
      action: "Create Resume"
    },
    {
      title: "AI-Powered ATS Analyzer",
      desc: "Scan your resume against recruitment criteria to uncover keyword gaps, formatting issues, and section-by-section improvements.",
      icon: FileSearch,
      link: "/ats-checker",
      action: "Analyze Resume"
    },
    {
      title: "AI Cover Letter Generator",
      desc: "Generate tailored cover letters customized for target job descriptions with adjustable professional voice tones.",
      icon: MailCheck,
      link: "/cover-letter",
      action: "Generate Letter"
    },
    {
      title: "Portfolio Builder",
      desc: "Turn your skills and projects into a clean, responsive developer portfolio website with a shareable public URL.",
      icon: Globe,
      link: "/portfolio",
      action: "Build Portfolio"
    }
  ];

  // How It Works Steps (Section 5)
  const workflowSteps = [
    {
      step: "01",
      title: "Create Your Resume",
      desc: "Build a new resume or upload your existing resume using our guided ATS-optimized templates.",
      icon: FileText
    },
    {
      step: "02",
      title: "Analyze and Improve",
      desc: "Check ATS compatibility, identify missing keywords, and receive actionable suggestions.",
      icon: CheckCircle2
    },
    {
      step: "03",
      title: "Get Career-Ready",
      desc: "Improve your resume and prepare for relevant job opportunities with personalized guidance.",
      icon: TrendingUp
    }
  ];

  // Career Tools (Section 6)
  const careerTools = [
    {
      title: "Career Recommendations",
      desc: "Discover matching technology roles, expected industry demand, and salary benchmarks aligned with your current skills.",
      icon: Compass,
      link: "/career-recommendation"
    },
    {
      title: "Job Description Matching",
      desc: "Compare your resume directly against any job posting to calculate match percentage and pinpoint missing qualifications.",
      icon: Target,
      link: "/job-match"
    },
    {
      title: "Skill Gap Analysis",
      desc: "Identify key competencies missing from your profile and follow a structured 3-tier roadmap to acquire them.",
      icon: TrendingUp,
      link: "/skill-gap"
    },
    {
      title: "Portfolio Builder",
      desc: "Showcase completed projects, certifications, and technical experience on a live public web portfolio.",
      icon: Globe,
      link: "/portfolio"
    },
    {
      title: "Resume Improvement Suggestions",
      desc: "Receive clear, line-by-line feedback on bullet point impact, quantifiable achievements, and recruiter readability.",
      icon: Sparkles,
      link: "/ats-checker"
    }
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1E293B', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ========================================================
          HERO SECTION (Section 2 & 3)
      ======================================================== */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F3FAFE 0%, #FFFFFF 100%)',
          paddingTop: '3.5rem',
          paddingBottom: '4.5rem',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3rem auto' }}>
            
            {/* Trust Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CFE2F3',
                padding: '0.35rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#0B3A5B',
                marginBottom: '1.25rem',
                boxShadow: '0 1px 2px rgba(11, 58, 91, 0.04)'
              }}
            >
              <ShieldCheck size={16} color="#16A34A" />
              <span>ATS-Optimized Formatting & Industry Validation</span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0B3A5B',
                marginBottom: '1.25rem',
                letterSpacing: '-0.025em'
              }}
            >
              Build a Resume That <span style={{ color: '#2196D3' }}>Gets Noticed.</span>
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
                color: '#64748B',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '720px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              Create ATS-friendly resumes, build your professional portfolio, generate job-specific cover letters, and discover your career path with AI-powered assistance.
            </p>

            {/* Two Balanced Medium Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.875rem',
                alignItems: 'center'
              }}
            >
              <Button
                to="/resumes/builder"
                variant="primary"
                size="md"
                icon={FileText}
                style={{
                  minWidth: '160px',
                  height: '42px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Create My Resume
              </Button>
              <Button
                to="/ats-checker"
                variant="secondary"
                size="md"
                icon={FileSearch}
                style={{
                  minWidth: '160px',
                  height: '42px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Analyze My Resume
              </Button>
            </div>
          </div>

          {/* ========================================================
              RESUME DASHBOARD PREVIEW (Section 3)
          ======================================================== */}
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #CBD5E1',
              boxShadow: '0 20px 40px -15px rgba(11, 58, 91, 0.08)',
              overflow: 'hidden'
            }}
          >
            {/* Dashboard Top Application Bar */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                padding: '0.875rem 1.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B3A5B', marginLeft: '0.35rem' }}>
                  Resume Analytics & Verification Suite
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: '#F0FDF4',
                    color: '#16A34A',
                    border: '1px solid rgba(22, 163, 74, 0.25)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: 600
                  }}
                >
                  ✓ ATS Verified
                </span>
                <span style={{ color: '#64748B', fontWeight: 500 }}>
                  Role: <strong style={{ color: '#0B3A5B' }}>MERN Stack Developer</strong>
                </span>
              </div>
            </div>

            {/* Dashboard Split Content: Document Preview (Left) & Diagnostics (Right) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '1.5rem',
                padding: '1.5rem'
              }}
            >
              {/* Left Pane: Resume Document Sheet Preview */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 2px 4px rgba(11, 58, 91, 0.03)'
                }}
              >
                {/* Header */}
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B3A5B', margin: 0 }}>
                        {sampleResume?.personalInfo?.fullName || "B. Gopinath"}
                      </h3>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2196D3', margin: '0.15rem 0 0 0' }}>
                        {sampleResume?.personalInfo?.title || "MERN Stack Developer"}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                      Chennai, India
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span>gopinath.mern@example.com</span>
                    <span>•</span>
                    <span>linkedin.com/in/gopinath-mern</span>
                  </div>
                </div>

                {/* Professional Summary Snippet */}
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B3A5B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    Professional Summary
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#1E293B', lineHeight: 1.5, margin: 0 }}>
                    Dedicated MERN Stack Developer proficient in React.js, Node.js, Express.js, and MongoDB. Experienced in architecting performant frontends, building secure RESTful APIs, and implementing production workflows.
                  </p>
                </div>

                {/* Core Competencies */}
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B3A5B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Core Technical Skills
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "REST APIs", "Git"].map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: '#F3FAFE',
                          color: '#0B3A5B',
                          border: '1px solid #CFE2F3',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Snippet */}
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B3A5B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    Work Experience
                  </h4>
                  <div style={{ fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1E293B' }}>
                      <span>Frontend Engineer Intern</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>2024 – Present</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#2196D3', fontWeight: 600, marginBottom: '0.25rem' }}>
                      CodeCraft Technologies
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#1E293B', lineHeight: 1.45, fontSize: '0.75rem' }}>
                      <li>Architected modular React components, cutting render times by 32% and ensuring responsiveness.</li>
                      <li>Implemented JWT-authenticated Express endpoints and optimized database aggregation pipelines.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Pane: ATS Diagnostics & Real Analysis */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  justifyContent: 'space-between'
                }}
              >
                {/* Score & Gauge Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <ATSScoreGauge score={atsScore} size={88} strokeWidth={8} showLabel={false} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      ATS Compatibility Score
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#16A34A', margin: '0.15rem 0' }}>
                      {atsScore} / 100 — Optimized
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                      Formatted to recruiter parsing standards with high keyword alignment.
                    </p>
                  </div>
                </div>

                {/* Keyword Matching Status */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B3A5B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Keyword Matching Status
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>
                      {detectedKeywords.length} Detected
                    </span>
                  </div>
                  
                  {/* Found Keywords */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    {detectedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: '#F0FDF4',
                          color: '#16A34A',
                          border: '1px solid rgba(22, 163, 74, 0.25)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Check size={12} /> {kw}
                      </span>
                    ))}
                  </div>

                  {/* Missing Keywords Suggestion */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Recommended additions:</span>
                    {missingKeywords.map((mkw, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: '#FFFBEB',
                          color: '#D97706',
                          border: '1px solid rgba(217, 119, 6, 0.25)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '9999px'
                        }}
                      >
                        + {mkw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resume Improvement Suggestions */}
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B3A5B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Improvement Suggestions
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#16A34A' }}>
                      <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#1E293B' }}>Clean section hierarchy and standard ATS-compliant fonts.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#16A34A' }}>
                      <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#1E293B' }}>Action verbs (Architected, Implemented) present in experience bullets.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#2196D3' }}>
                      <AlertCircle size={14} color="#2196D3" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#1E293B' }}>Add 1-2 quantified metrics to project outcomes to increase impact.</span>
                    </div>
                  </div>
                </div>

                {/* View Detailed Analysis Action */}
                <Button to="/ats-checker" variant="primary" size="md" icon={ChevronRight} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          CORE FEATURES SECTION (Section 4)
      ======================================================== */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.25rem auto' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.375rem)', fontWeight: 800, color: '#0B3A5B', marginBottom: '0.75rem' }}>
              Core Platform Features
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6 }}>
              Purpose-built tools to craft ATS-optimized resumes, compelling cover letters, and web portfolios that stand out.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {coreFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.75rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '10px',
                        backgroundColor: '#F3FAFE',
                        color: '#2196D3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0B3A5B', marginBottom: '0.5rem' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                      {feat.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                    <Link
                      to={feat.link}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#2196D3',
                        textDecoration: 'none'
                      }}
                    >
                      <span>{feat.action}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS SECTION (Section 5)
      ======================================================== */}
      <section
        id="how-it-works"
        style={{
          padding: '5rem 0',
          backgroundColor: '#F3FAFE',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#2196D3',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Streamlined Process
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.375rem)', fontWeight: 800, color: '#0B3A5B', marginBottom: '0.75rem' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6 }}>
              A straightforward three-step path to an interview-ready resume and career profile.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '2rem 1.75rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 4px rgba(11, 58, 91, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '8px',
                        backgroundColor: '#F3FAFE',
                        color: '#2196D3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0B3A5B',
                        opacity: 0.35
                      }}
                    >
                      {step.step}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0B3A5B', margin: 0 }}>
                    Step {idx + 1} — {step.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          CAREER TOOLS SECTION (Section 6)
      ======================================================== */}
      <section id="career-tools" style={{ padding: '5.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#2196D3',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Complete Career Intelligence
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.375rem)', fontWeight: 800, color: '#0B3A5B', marginBottom: '0.75rem' }}>
              Everything You Need for Your Career
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6 }}>
              Comprehensive tools designed to guide your job search from initial skill alignment to job application.
            </p>
          </div>

          <div
            className="career-tools-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '1.25rem',
              width: '100%'
            }}
          >
            {careerTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link
                  to={tool.link}
                  key={idx}
                  style={{ textDecoration: 'none', minWidth: 0, height: '100%', display: 'flex' }}
                >
                  <div
                    className="card"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(11, 58, 91, 0.04)'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '8px',
                          backgroundColor: '#F3FAFE',
                          color: '#2196D3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '0.875rem'
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B3A5B', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                        {tool.title}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                        {tool.desc}
                      </p>
                    </div>

                    <div style={{ marginTop: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2196D3', fontSize: '0.8125rem', fontWeight: 600 }}>
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 1024px) {
          .career-tools-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 1023px) and (min-width: 681px) {
          .career-tools-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 680px) and (min-width: 481px) {
          .career-tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .career-tools-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
