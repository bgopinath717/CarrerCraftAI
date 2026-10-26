import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Mail,
  ExternalLink,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Phone
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { storageService } from '../services/storageService';
import { sampleUserData } from '../data/sampleUserData';
import Button from '../components/common/Button';
import { apiService } from '../services/api';

export const PublicPortfolioPage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [portfolioSettings, setPortfolioSettings] = useState(() => storageService.getPortfolioSettings());

  useEffect(() => {
    window.scrollTo(0, 0);

    let isMounted = true;
    apiService.getPublicPortfolio(slug || 'gopinath').then((res) => {
      if (!isMounted) return;
      if (res?.profile) {
        setProfile(res.profile);
      }
      if (res?.portfolioSettings) {
        setPortfolioSettings(res.portfolioSettings);
      }
    }).catch((err) => {
      console.warn('Error loading dynamic public portfolio, using local fallback:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const THEME_PALETTES = {
    'tech-blue': {
      bg: '#F0F9FF',
      surface: '#FFFFFF',
      border: '#DCEAF5',
      text: '#1E293B',
      textMuted: '#64748B',
      accent: '#079FE8',
      darkBlue: '#073B68',
      heroGrad: 'linear-gradient(135deg, #073B68 0%, #079FE8 100%)',
      cardSubtle: '#F8FAFC'
    },
    'minimal-light': {
      bg: '#FAFAFA',
      surface: '#FFFFFF',
      border: '#E2E8F0',
      text: '#0F172A',
      textMuted: '#64748B',
      accent: '#2563EB',
      darkBlue: '#1E293B',
      heroGrad: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
      cardSubtle: '#F1F5F9'
    },
    'navy-pro': {
      bg: '#051329',
      surface: '#0B1E38',
      border: '#163156',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      accent: '#38C5F5',
      darkBlue: '#F1F5F9',
      heroGrad: 'linear-gradient(135deg, #079FE8 0%, #38C5F5 100%)',
      cardSubtle: '#08172E'
    },
    'royal-azure': {
      bg: '#071F38',
      surface: '#0B2D52',
      border: '#13467B',
      text: '#F0F9FF',
      textMuted: '#93C5FD',
      accent: '#38BDF8',
      darkBlue: '#FFFFFF',
      heroGrad: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
      cardSubtle: '#092442'
    },
    'tech-dark': {
      bg: '#0B0F19',
      surface: '#111827',
      border: '#1F2937',
      text: '#F9FAFB',
      textMuted: '#9CA3AF',
      accent: '#6366F1',
      darkBlue: '#F3F4F6',
      heroGrad: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
      cardSubtle: '#0F172A'
    }
  };

  const activeThemeId = portfolioSettings?.theme || 'tech-blue';
  const themeStyles = THEME_PALETTES[activeThemeId] || THEME_PALETTES['tech-blue'];

  const getInitials = (name) => {
    if (!name || name.trim().length === 0) return 'DEV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const {
    personalInfo = {},
    careerInfo = {},
    education = [],
    experience = [],
    skills = {},
    projects = [],
    certifications = [],
    achievements = []
  } = profile || sampleUserData || {};

  const displayName = personalInfo.fullName || 'Developer';
  const displayTitle = personalInfo.title || careerInfo.targetRole || '';
  const displayTagline = portfolioSettings?.tagline || '';
  const displayBio = portfolioSettings?.customBio || careerInfo.summary || careerInfo.objective || '';

  // Calculate section presence strictly based on resume content
  const hasTechSkills = Boolean(skills?.technical && skills.technical.length > 0);
  const hasFrameworks = Boolean(skills?.frameworks && skills.frameworks.length > 0);
  const hasDatabases = Boolean(skills?.databases && skills.databases.length > 0);
  const hasTools = Boolean(skills?.tools && skills.tools.length > 0);
  const hasLanguages = Boolean(skills?.languages && skills.languages.length > 0);
  const hasSoft = Boolean(skills?.soft && skills.soft.length > 0);
  const hasSkills = hasTechSkills || hasFrameworks || hasDatabases || hasTools || hasLanguages || hasSoft;

  const hasProjects = Boolean(projects && projects.length > 0);
  const hasExperience = Boolean(experience && experience.length > 0);
  const hasEducation = Boolean(education && education.length > 0);
  const hasExpOrEdu = hasExperience || hasEducation;

  const hasCerts = Boolean(certifications && certifications.length > 0);
  const hasAch = Boolean(achievements && achievements.length > 0);
  const hasCredentials = hasCerts || hasAch;

  const hasAbout = Boolean(displayBio || personalInfo.location || careerInfo.targetRole);
  const hasSocial = Boolean(personalInfo.github || personalInfo.linkedin || personalInfo.email || personalInfo.phone);

  return (
    <div style={{ backgroundColor: themeStyles.bg, color: themeStyles.text, minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      
      {/* Top Floating Portfolio Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: `${themeStyles.surface}dd`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${themeStyles.border}`,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '50%',
            background: themeStyles.heroGrad || 'linear-gradient(135deg, #073B68, #079FE8)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9375rem'
          }}>
            {getInitials(displayName)}
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>
            {displayName}
          </span>
        </div>

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          {hasAbout && <a href="#about" style={{ color: themeStyles.textMuted }}>About</a>}
          {hasSkills && <a href="#skills" style={{ color: themeStyles.textMuted }}>Skills</a>}
          {hasProjects && <a href="#projects" style={{ color: themeStyles.textMuted }}>Projects</a>}
          {hasExpOrEdu && <a href="#experience" style={{ color: themeStyles.textMuted }}>Experience</a>}
          {hasCredentials && <a href="#certifications" style={{ color: themeStyles.textMuted }}>Credentials</a>}
          {hasSocial && <a href="#contact" style={{ color: themeStyles.textMuted }}>Contact</a>}
        </div>

        <Link to="/dashboard">
          <Button variant="primary" size="sm" icon={Sparkles}>
            Built on CareerCraft AI
          </Button>
        </Link>
      </nav>

      {/* 1. HERO SECTION */}
      <section style={{ padding: '6rem 1.5rem 4rem 1.5rem', maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: '6.5rem',
          height: '6.5rem',
          borderRadius: '50%',
          background: themeStyles.heroGrad || 'linear-gradient(135deg, #073B68 0%, #079FE8 100%)',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.25rem',
          fontWeight: 800,
          marginBottom: '1.5rem',
          boxShadow: '0 12px 24px rgba(7, 159, 232, 0.25)'
        }}>
          {getInitials(displayName)}
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', color: themeStyles.darkBlue }}>
          Hi, I'm <span className="gradient-text">{displayName}</span>
        </h1>

        {displayTitle && (
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary, #079FE8)', marginBottom: '1.25rem' }}>
            {displayTitle}
          </div>
        )}

        {displayTagline && (
          <p style={{ fontSize: '1.125rem', color: themeStyles.textMuted, maxWidth: '680px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            {displayTagline}
          </p>
        )}

        {/* Social Links Bar */}
        {hasSocial && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <GithubIcon size={18} />
                <span>GitHub</span>
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <LinkedinIcon size={18} />
                <span>LinkedIn</span>
              </a>
            )}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="btn btn-primary">
                <Mail size={18} />
                <span>Get in Touch</span>
              </a>
            )}
            {personalInfo.phone && (
              <a href={`tel:${personalInfo.phone}`} className="btn btn-secondary">
                <Phone size={18} />
                <span>{personalInfo.phone}</span>
              </a>
            )}
          </div>
        )}
      </section>

      {/* 2. ABOUT ME SECTION */}
      {hasAbout && (
        <section id="about" style={{ padding: '4rem 1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: themeStyles.darkBlue }}>
              <Sparkles size={20} color="var(--color-primary)" />
              About Me
            </h2>
            {displayBio && (
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: themeStyles.textMuted }}>
                {displayBio}
              </p>
            )}

            {(personalInfo.location || careerInfo.targetRole || personalInfo.title) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '2rem', gap: '1rem' }}>
                {personalInfo.location && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: themeStyles.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem', color: themeStyles.darkBlue }}>{personalInfo.location}</div>
                  </div>
                )}
                {(careerInfo.targetRole || personalInfo.title) && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: themeStyles.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Target Role</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem', color: themeStyles.darkBlue }}>{careerInfo.targetRole || personalInfo.title}</div>
                  </div>
                )}
                <div style={{ padding: '1rem', background: 'var(--color-bg-success)', border: '1px solid rgba(22, 163, 74, 0.25)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 700 }}>Availability</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--color-success)' }}>Open for Opportunities</div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. SKILLS SECTION */}
      {hasSkills && (
        <section id="skills" style={{ padding: '4rem 1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: themeStyles.darkBlue }}>
            Technical Arsenal & Core Stack
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Frontend */}
            {hasTechSkills && (
              <div style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: themeStyles.darkBlue }}>Frontend & UI</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.technical.map((s, i) => (
                    <span key={i} className="badge badge-primary">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Backend */}
            {hasFrameworks && (
              <div style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#06b6d4' }}>Backend & APIs</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.frameworks.map((s, i) => (
                    <span key={i} className="badge badge-success">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Databases */}
            {hasDatabases && (
              <div style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#f59e0b' }}>Databases & Storage</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.databases.map((s, i) => (
                    <span key={i} className="badge badge-warning">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools & DevOps */}
            {hasTools && (
              <div style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#8b5cf6' }}>DevOps & Tools</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.tools.map((s, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages & Core */}
            {hasLanguages && (
              <div style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#ec4899' }}>Programming Languages</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.languages.map((s, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.2)' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft / Competencies */}
            {hasSoft && (
              <div style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#10b981' }}>Core Competencies</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.soft.map((s, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. FEATURED PROJECTS SECTION */}
      {hasProjects && (
        <section id="projects" style={{ padding: '4rem 1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: themeStyles.darkBlue }}>
            Featured Projects
          </h2>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {projects.map((proj, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: themeStyles.surface,
                  border: `1px solid ${themeStyles.border}`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {proj.image && (
                  <img
                    src={proj.image}
                    alt={proj.name}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: themeStyles.darkBlue }}>{proj.name}</h3>
                  {proj.description && (
                    <p style={{ fontSize: '0.875rem', color: themeStyles.textMuted, flex: 1, lineHeight: 1.5 }}>
                      {proj.description.replace(/^[•\-*]\s*/, '')}
                    </p>
                  )}

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.5rem 0' }}>
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', background: 'rgba(7, 159, 232, 0.1)', color: '#073B68', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {(proj.githubUrl || proj.liveUrl) && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: `1px solid ${themeStyles.border}`, paddingTop: '1rem' }}>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: themeStyles.text }}>
                          <GithubIcon size={15} /> <span>Code</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#06b6d4', marginLeft: 'auto' }}>
                          <ExternalLink size={15} /> <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. EXPERIENCE & EDUCATION */}
      {hasExpOrEdu && (
        <section id="experience" style={{ padding: '4rem 1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
          <div className={hasExperience && hasEducation ? "grid-2" : ""} style={{ gap: '2rem', maxWidth: !hasExperience || !hasEducation ? '820px' : undefined, margin: '0 auto' }}>
            
            {/* Experience */}
            {hasExperience && (
              <div style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-blue)' }}>
                  <Briefcase size={20} color="var(--color-primary)" />
                  Work Experience
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {experience.map((exp, idx) => (
                    <div key={idx} style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>{exp.position}</h3>
                      {exp.company && <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>{exp.company}</div>}
                      {(exp.startDate || exp.endDate) && (
                        <div style={{ fontSize: '0.75rem', color: themeStyles.textMuted, marginBottom: '0.5rem' }}>
                          {exp.startDate} {exp.endDate && `– ${exp.current ? 'Present' : exp.endDate}`}
                        </div>
                      )}
                      {exp.description && (
                        <div style={{ fontSize: '0.8125rem', color: themeStyles.textMuted, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {hasEducation && (
              <div style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-dark-blue)' }}>
                  <GraduationCap size={20} color="var(--color-light-blue)" />
                  Education
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {education.map((edu, idx) => (
                    <div key={idx} style={{ borderLeft: '2px solid var(--color-light-blue)', paddingLeft: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>{edu.degree}</h3>
                      {edu.institution && <div style={{ fontSize: '0.8125rem', color: 'var(--color-dark-blue)', fontWeight: 600 }}>{edu.institution}</div>}
                      {(edu.startYear || edu.endYear || edu.grade) && (
                        <div style={{ fontSize: '0.75rem', color: themeStyles.textMuted, marginBottom: '0.25rem' }}>
                          {edu.startYear} {edu.endYear && `– ${edu.endYear}`} {edu.grade && `• Grade: ${edu.grade}`}
                        </div>
                      )}
                      {edu.description && (
                        <div style={{ fontSize: '0.8125rem', color: themeStyles.textMuted }}>{edu.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 5.5 CERTIFICATIONS & ACHIEVEMENTS */}
      {hasCredentials && (
        <section id="certifications" style={{ padding: '4rem 1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
          <div className={hasCerts && hasAch ? "grid-2" : ""} style={{ gap: '2rem', maxWidth: !hasCerts || !hasAch ? '820px' : undefined, margin: '0 auto' }}>
            {/* Certifications */}
            {hasCerts && (
              <div style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: themeStyles.darkBlue }}>
                  <Award size={20} color={themeStyles.accent} />
                  Licenses & Certifications
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {certifications.map((c, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: themeStyles.cardSubtle, borderRadius: 'var(--radius-md)', border: `1px solid ${themeStyles.border}` }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: themeStyles.darkBlue }}>
                        {typeof c === 'string' ? c : c.name}
                      </div>
                      {typeof c === 'object' && (c.issuer || c.issueDate) && (
                        <div style={{ fontSize: '0.8125rem', color: themeStyles.textMuted, marginTop: '0.25rem' }}>
                          {c.issuer} {c.issueDate && `• Issued ${c.issueDate}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {hasAch && (
              <div style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: themeStyles.surface, border: `1px solid ${themeStyles.border}` }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: themeStyles.darkBlue }}>
                  <Sparkles size={20} color={themeStyles.accent} />
                  Honors & Key Achievements
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {achievements.map((a, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: themeStyles.cardSubtle, borderRadius: 'var(--radius-md)', border: `1px solid ${themeStyles.border}` }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: themeStyles.darkBlue }}>
                        {typeof a === 'string' ? a : a.title}
                      </div>
                      {typeof a === 'object' && a.description && (
                        <div style={{ fontSize: '0.8125rem', color: themeStyles.textMuted, marginTop: '0.25rem', lineHeight: 1.5 }}>
                          {a.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. CONTACT SECTION */}
      {hasSocial && (
        <section id="contact" style={{ padding: '4rem 1.5rem 6rem 1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, rgba(7, 159, 232, 0.12) 0%, rgba(56, 197, 245, 0.08) 100%)', border: `1px solid ${themeStyles.border}` }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: themeStyles.darkBlue }}>Let's Connect</h2>
            <p style={{ fontSize: '1rem', color: themeStyles.textMuted, marginBottom: '2rem' }}>
              Feel free to reach out directly for technical collaborations, career opportunities, or engineering discussions.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="btn btn-primary btn-lg">
                  <Mail size={18} />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="btn btn-secondary btn-lg">
                  <Phone size={18} />
                  <span>{personalInfo.phone}</span>
                </a>
              )}
              {personalInfo.linkedin && !personalInfo.email && !personalInfo.phone && (
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
                  <LinkedinIcon size={18} />
                  <span>Connect on LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${themeStyles.border}`, padding: '2rem', textAlign: 'center', fontSize: '0.8125rem', color: themeStyles.textMuted }}>
        Portfolio of <strong>{displayName}</strong> • Built & Verified via CareerCraft AI
      </footer>

    </div>
  );
};

export default PublicPortfolioPage;
