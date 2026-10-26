import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';

export const ResumeTemplate = ({ resume, template = 'classic-ats' }) => {
  if (!resume) return null;

  const {
    personalInfo = {},
    summary = '',
    education = [],
    experience = [],
    skills = {},
    projects = [],
    certifications = [],
    achievements = [],
    languages = [],
    interests = []
  } = resume;

  const currentTemplate = template || 'classic-ats';
  const templateClass = `template-${currentTemplate}`;

  return (
    <div className={`resume-paper ${templateClass}`} id="resume-printable-area">
      {/* Header / Personal Details */}
      <header className="resume-header">
        <h1 className="resume-name">{personalInfo.fullName || "B Gopinath"}</h1>
        {currentTemplate !== 'classic-ats' && personalInfo.title && (
          <div className="resume-title">{personalInfo.title}</div>
        )}
        
        {/* Contact bar */}
        <div className="resume-contact-bar">
          {personalInfo.phone && (
            <span className="resume-contact-item">
              <Phone size={11} className="no-print" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.phone && personalInfo.email && <span className="no-print">|</span>}
          {personalInfo.email && (
            <span className="resume-contact-item">
              <Mail size={11} className="no-print" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.email && personalInfo.location && <span className="no-print">|</span>}
          {personalInfo.location && (
            <span className="resume-contact-item">
              <MapPin size={11} className="no-print" /> {personalInfo.location}
            </span>
          )}
        </div>

        {/* Links bar (LinkedIn | GitHub | Portfolio/LeetCode) */}
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <div className="resume-links-bar">
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="resume-contact-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <LinkedinIcon size={11} className="no-print" /> LinkedIn
              </a>
            )}
            {personalInfo.linkedin && (personalInfo.github || personalInfo.website) && <span>|</span>}
            {personalInfo.github && (
              <a
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noreferrer"
                className="resume-contact-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <GithubIcon size={11} className="no-print" /> GitHub
              </a>
            )}
            {personalInfo.github && personalInfo.website && <span>|</span>}
            {personalInfo.website && (
              <a
                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                target="_blank"
                rel="noreferrer"
                className="resume-contact-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Globe size={11} className="no-print" /> Portfolio / Links
              </a>
            )}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="resume-section">
          <h2 className="resume-section-title">Professional Summary</h2>
          <p className="resume-summary-text">{summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {skills && (skills.technical?.length > 0 || skills.tools?.length > 0 || skills.frameworks?.length > 0 || skills.languages?.length > 0 || skills.databases?.length > 0) && (
        <section className="resume-section">
          <h2 className="resume-section-title">Technical Skills</h2>
          {skills.languages?.length > 0 && (
            <div className="resume-skills-group">
              <span className="resume-skills-label">Programming Languages: </span>
              <span className="resume-skills-list">{skills.languages.join(', ')}</span>
            </div>
          )}
          {skills.technical?.length > 0 && (
            <div className="resume-skills-group">
              <span className="resume-skills-label">Web Technologies: </span>
              <span className="resume-skills-list">{skills.technical.join(', ')}</span>
            </div>
          )}
          {skills.frameworks?.length > 0 && (
            <div className="resume-skills-group">
              <span className="resume-skills-label">Frameworks & Libraries: </span>
              <span className="resume-skills-list">{skills.frameworks.join(', ')}</span>
            </div>
          )}
          {skills.databases?.length > 0 && (
            <div className="resume-skills-group">
              <span className="resume-skills-label">Database: </span>
              <span className="resume-skills-list">{skills.databases.join(', ')}</span>
            </div>
          )}
          {skills.tools?.length > 0 && (
            <div className="resume-skills-group">
              <span className="resume-skills-label">Platforms & Tools: </span>
              <span className="resume-skills-list">{skills.tools.join(', ')}</span>
            </div>
          )}
          {skills.soft?.length > 0 && (
            <div className="resume-skills-group">
              <span className="resume-skills-label">Core Concepts: </span>
              <span className="resume-skills-list">{skills.soft.join(', ')}</span>
            </div>
          )}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Projects</h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="resume-item">
              <div className="resume-item-header">
                <span>{proj.name || proj.title}</span>
                {proj.liveUrl && (
                  <span style={{ fontSize: '11px', color: '#2196D3', fontWeight: 500 }}>
                    {proj.liveUrl.replace(/^https?:\/\//, '')}
                  </span>
                )}
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="resume-item-subtitle" style={{ color: '#4b5563', fontSize: '11.5px', marginBottom: '3px' }}>
                  {proj.technologies.join(', ')}
                </div>
              )}
              {proj.description && (
                <ul className="resume-item-bullets">
                  {proj.description.split('\n').filter(Boolean).map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-*]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="resume-item">
              <div className="resume-item-header">
                <span style={{ fontWeight: 700 }}>{edu.institution}</span>
                <span style={{ fontWeight: 700 }}>{edu.startYear} – {edu.endYear}</span>
              </div>
              <div className="resume-item-subtitle" style={{ display: 'flex', justifyContent: 'space-between', color: '#374151', fontSize: '12px' }}>
                <span>{edu.degree}</span>
                {edu.grade && <span style={{ fontWeight: 600 }}>CGPA: {edu.grade}</span>}
              </div>
              {edu.description && (
                <div style={{ fontSize: '11.5px', color: '#4b5563', marginTop: '2px' }}>
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Internship / Work Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Internship & Experience</h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="resume-item">
              <div className="resume-item-header">
                <span style={{ fontWeight: 700 }}>{exp.position} – {exp.company}</span>
                <span style={{ fontWeight: 700 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.description && (
                <ul className="resume-item-bullets" style={{ marginTop: '3px' }}>
                  {exp.description.split('\n').filter(Boolean).map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-*]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Certifications</h2>
          <ul className="resume-item-bullets">
            {certifications.map((cert, idx) => {
              const text = typeof cert === 'string' ? cert : `${cert.name}${cert.organization ? ' – ' + cert.organization : ''}`;
              return <li key={cert.id || idx}>{text}</li>;
            })}
          </ul>
        </section>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Achievements</h2>
          <ul className="resume-item-bullets">
            {achievements.map((ach, idx) => {
              const text = typeof ach === 'string' ? ach : `${ach.title}${ach.description ? ': ' + ach.description : ''}`;
              return <li key={ach.id || idx}>{text}</li>;
            })}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Languages</h2>
          <div style={{ fontSize: '12px', color: '#1f2937' }}>
            {languages.map(l => typeof l === 'string' ? l : `${l.name || l.language}`).join(', ')}
          </div>
        </section>
      )}

      {/* Interests (Optional) */}
      {interests && interests.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Interests</h2>
          <div style={{ fontSize: '12px', color: '#1f2937' }}>
            {interests.join(', ')}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate;
