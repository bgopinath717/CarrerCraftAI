import React, { useState, useRef } from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Trophy,
  Languages,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
  Upload
} from 'lucide-react';
import Button from '../common/Button';
import { aiService } from '../../services/aiService';
import { useToast } from '../common/Toast';

export const ResumeEditor = ({ resume, onChange, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [polishingIndex, setPolishingIndex] = useState(null);
  const [polishingSummary, setPolishingSummary] = useState(false);
  const { addToast } = useToast();
  const jsonInputRef = useRef(null);

  const handleImportJsonFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON resume format.');
        }

        const restored = {
          ...resume,
          ...parsed,
          personalInfo: parsed.personalInfo || resume.personalInfo || {},
          skills: parsed.skills || resume.skills || {},
          experience: Array.isArray(parsed.experience) ? parsed.experience : (resume.experience || []),
          projects: Array.isArray(parsed.projects) ? parsed.projects : (resume.projects || []),
          education: Array.isArray(parsed.education) ? parsed.education : (resume.education || []),
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : (resume.certifications || []),
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : (resume.achievements || []),
          languages: Array.isArray(parsed.languages) ? parsed.languages : (resume.languages || []),
          summary: parsed.summary !== undefined ? parsed.summary : (resume.summary || ''),
          template: parsed.template || resume.template || 'classic-ats'
        };

        onChange(restored);
        onSave(restored);
        addToast('Resume JSON imported and restored successfully!', 'success');
      } catch (err) {
        console.error('[JSON Import Error]:', err);
        addToast('Failed to import JSON file. Please ensure it is a valid CareerCraft resume JSON.', 'error');
      } finally {
        if (jsonInputRef.current) jsonInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const sections = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'languages', label: 'Languages & Interests', icon: Languages },
  ];

  // Helper updater
  const updateField = (field, value) => {
    onChange({ ...resume, [field]: value });
  };

  const updatePersonalInfo = (field, value) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  // AI Polish Summary
  const handlePolishSummary = async () => {
    setPolishingSummary(true);
    try {
      const polished = await aiService.polishBulletPoint(
        resume.summary || "MERN Stack Developer with React and Node experience.",
        resume.targetRole || "MERN Stack Developer"
      );
      updateField('summary', polished.replace(/^•\s*/, ''));
      addToast('Professional summary polished by AI!', 'success');
    } catch {
      addToast('AI service currently busy, try again shortly', 'warning');
    } finally {
      setPolishingSummary(false);
    }
  };

  // AI Polish Experience Bullet
  const handlePolishExperienceBullet = async (expIndex) => {
    setPolishingIndex(`exp-${expIndex}`);
    try {
      const exp = resume.experience[expIndex];
      const polished = await aiService.polishBulletPoint(exp.description, resume.targetRole);
      const updatedExp = [...resume.experience];
      updatedExp[expIndex] = { ...exp, description: polished };
      updateField('experience', updatedExp);
      addToast('Experience bullet point optimized with action verbs!', 'success');
    } catch {
      addToast('AI optimization failed', 'warning');
    } finally {
      setPolishingIndex(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      
      {/* Resume Title, Import JSON, and Save Header */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={resume.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="input-field"
            style={{ fontWeight: 700, fontSize: '1.0625rem', border: 'none', background: 'transparent', padding: '0.25rem 0' }}
            placeholder="Resume Document Title"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <input
            type="file"
            ref={jsonInputRef}
            onChange={handleImportJsonFile}
            accept=".json,application/json"
            style={{ display: 'none' }}
            id="resume-json-importer-input"
          />
          <Button
            variant="outline"
            size="sm"
            icon={Upload}
            onClick={() => jsonInputRef.current?.click()}
            title="Import and restore resume from JSON file"
          >
            Import JSON
          </Button>
          <Button variant="primary" size="sm" icon={Save} onClick={onSave}>
            Save Resume
          </Button>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary-600)' : 'var(--border-color)',
                backgroundColor: isActive ? 'rgba(7, 159, 232, 0.12)' : 'var(--bg-surface)',
                color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={14} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Editor Panel */}
      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        
        {/* 1. PERSONAL DETAILS */}
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Personal Information</h3>
            <div className="grid-2">
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.fullName || ''}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="e.g. B. Gopinath"
                />
              </div>
              <div>
                <label className="input-label">Professional Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.title || ''}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  placeholder="e.g. MERN Stack Developer"
                />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  value={resume.personalInfo?.email || ''}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="e.g. gopinath@example.com"
                />
              </div>
              <div>
                <label className="input-label">Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.phone || ''}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
              <div>
                <label className="input-label">Location (City, State/Country)</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.location || ''}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="e.g. Chennai, Tamil Nadu, India"
                />
              </div>
              <div>
                <label className="input-label">LinkedIn URL</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/gopinath-mern"
                />
              </div>
              <div>
                <label className="input-label">GitHub URL</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.github || ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="e.g. https://github.com/gopinath-dev"
                />
              </div>
              <div>
                <label className="input-label">Portfolio Website URL</label>
                <input
                  type="text"
                  className="input-field"
                  value={resume.personalInfo?.website || ''}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="e.g. https://careercraft-ai.dev/portfolio/gopinath"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SUMMARY */}
        {activeTab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Professional Summary</h3>
                <p style={{ fontSize: '0.8125rem' }}>Write a concise 2-4 sentence summary highlighting your core tech stack and passion.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                loading={polishingSummary}
                onClick={handlePolishSummary}
              >
                AI Polish Summary
              </Button>
            </div>
            <textarea
              rows={6}
              className="textarea-field"
              value={resume.summary || ''}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="e.g. Dedicated MERN Stack Developer with hands-on experience in building scalable full-stack web applications, RESTful APIs, and responsive interfaces..."
            />
          </div>
        )}

        {/* 3. SKILLS */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Technical Skills & Categorized Competencies</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Organize your technical competencies into ATS-parseable categories. Each category maps to standard recruiter ATS searches.
              </p>
            </div>
            
            <div>
              <label className="input-label">Programming Languages (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.skills?.languages || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  onChange({ ...resume, skills: { ...resume.skills, languages: arr } });
                }}
                placeholder="Java, Python, JavaScript, TypeScript, C, C++"
              />
            </div>

            <div>
              <label className="input-label">Web Technologies (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.skills?.technical || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  onChange({ ...resume, skills: { ...resume.skills, technical: arr } });
                }}
                placeholder="HTML, CSS, JavaScript, SpringBoot, RESTful APIs, JSON"
              />
            </div>

            <div>
              <label className="input-label">Frameworks & Libraries (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.skills?.frameworks || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  onChange({ ...resume, skills: { ...resume.skills, frameworks: arr } });
                }}
                placeholder="React.js, Node.js, Express.js, Tailwind CSS, Bootstrap, Redux Toolkit"
              />
            </div>

            <div>
              <label className="input-label">Database (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.skills?.databases || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  onChange({ ...resume, skills: { ...resume.skills, databases: arr } });
                }}
                placeholder="MySQL, MongoDB, PostgreSQL, Redis"
              />
            </div>

            <div>
              <label className="input-label">Platforms & Developer Tools (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.skills?.tools || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  onChange({ ...resume, skills: { ...resume.skills, tools: arr } });
                }}
                placeholder="VS Code, GitHub, Figma, Docker, AWS, Postman"
              />
            </div>

            <div>
              <label className="input-label">Core Concepts / Computer Science Fundamentals</label>
              <input
                type="text"
                className="input-field"
                value={(resume.skills?.soft || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  onChange({ ...resume, skills: { ...resume.skills, soft: arr } });
                }}
                placeholder="Data Structures, Object-Oriented Programming, DBMS, Operating Systems"
              />
            </div>
          </div>
        )}

        {/* 4. EXPERIENCE */}
        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Work Experience & Internships</h3>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  const newExp = {
                    id: `exp-${Date.now()}`,
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '• '
                  };
                  updateField('experience', [...(resume.experience || []), newExp]);
                }}
              >
                Add Experience
              </Button>
            </div>

            {(resume.experience || []).map((exp, idx) => (
              <div key={exp.id || idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Experience #{idx + 1}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Sparkles}
                      loading={polishingIndex === `exp-${idx}`}
                      onClick={() => handlePolishExperienceBullet(idx)}
                    >
                      AI Polish
                    </Button>
                    <button
                      onClick={() => {
                        const updated = resume.experience.filter((_, i) => i !== idx);
                        updateField('experience', updated);
                      }}
                      style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="input-label">Company / Organization</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx].company = e.target.value;
                        updateField('experience', updated);
                      }}
                      placeholder="e.g. CodeCraft Technologies"
                    />
                  </div>
                  <div>
                    <label className="input-label">Position / Role</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.position}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx].position = e.target.value;
                        updateField('experience', updated);
                      }}
                      placeholder="e.g. MERN Stack Developer Intern"
                    />
                  </div>
                  <div>
                    <label className="input-label">Start Date</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx].startDate = e.target.value;
                        updateField('experience', updated);
                      }}
                      placeholder="e.g. June 2024"
                    />
                  </div>
                  <div>
                    <label className="input-label">End Date</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx].endDate = e.target.value;
                        updateField('experience', updated);
                      }}
                      placeholder="e.g. August 2024 or Present"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Key Responsibilities & Achievements (Bullet points)</label>
                  <textarea
                    rows={4}
                    className="textarea-field"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx].description = e.target.value;
                      updateField('experience', updated);
                    }}
                    placeholder="• Engineered responsive React components and integrated RESTful Express micro-endpoints..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. PROJECTS */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Featured Projects</h3>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  const newProj = {
                    id: `proj-${Date.now()}`,
                    name: '',
                    description: '• ',
                    technologies: [],
                    githubUrl: '',
                    liveUrl: ''
                  };
                  updateField('projects', [...(resume.projects || []), newProj]);
                }}
              >
                Add Project
              </Button>
            </div>

            {(resume.projects || []).map((proj, idx) => (
              <div key={proj.id || idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Project #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = resume.projects.filter((_, i) => i !== idx);
                      updateField('projects', updated);
                    }}
                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="input-label">Project Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={proj.name}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx].name = e.target.value;
                        updateField('projects', updated);
                      }}
                      placeholder="e.g. CareerCraft AI"
                    />
                  </div>
                  <div>
                    <label className="input-label">Technologies (Comma separated)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx].technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        updateField('projects', updated);
                      }}
                      placeholder="e.g. React.js, Node.js, MongoDB, JWT"
                    />
                  </div>
                  <div>
                    <label className="input-label">GitHub Repository Link</label>
                    <input
                      type="text"
                      className="input-field"
                      value={proj.githubUrl}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx].githubUrl = e.target.value;
                        updateField('projects', updated);
                      }}
                      placeholder="https://github.com/gopinath-dev/project"
                    />
                  </div>
                  <div>
                    <label className="input-label">Live Demo Link</label>
                    <input
                      type="text"
                      className="input-field"
                      value={proj.liveUrl}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx].liveUrl = e.target.value;
                        updateField('projects', updated);
                      }}
                      placeholder="https://careercraft-ai.dev"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Project Description & Impact</label>
                  <textarea
                    rows={3}
                    className="textarea-field"
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...resume.projects];
                      updated[idx].description = e.target.value;
                      updateField('projects', updated);
                    }}
                    placeholder="• Built full-stack responsive web application featuring ATS analysis, JWT auth, and MongoDB backend..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. EDUCATION */}
        {activeTab === 'education' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Education</h3>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  const newEdu = {
                    id: `edu-${Date.now()}`,
                    degree: '',
                    institution: '',
                    startYear: '',
                    endYear: '',
                    grade: '',
                    description: ''
                  };
                  updateField('education', [...(resume.education || []), newEdu]);
                }}
              >
                Add Education
              </Button>
            </div>

            {(resume.education || []).map((edu, idx) => (
              <div key={edu.id || idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Education #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = resume.education.filter((_, i) => i !== idx);
                      updateField('education', updated);
                    }}
                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="input-label">Degree / Certificate</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx].degree = e.target.value;
                        updateField('education', updated);
                      }}
                      placeholder="e.g. B.Tech Computer Science and Engineering"
                    />
                  </div>
                  <div>
                    <label className="input-label">Institution / University</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx].institution = e.target.value;
                        updateField('education', updated);
                      }}
                      placeholder="e.g. Anna University Affiliated College"
                    />
                  </div>
                  <div>
                    <label className="input-label">Start Year</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.startYear}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx].startYear = e.target.value;
                        updateField('education', updated);
                      }}
                      placeholder="e.g. 2021"
                    />
                  </div>
                  <div>
                    <label className="input-label">End Year</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.endYear}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx].endYear = e.target.value;
                        updateField('education', updated);
                      }}
                      placeholder="e.g. 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">CGPA / Percentage</label>
                  <input
                    type="text"
                    className="input-field"
                    value={edu.grade}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].grade = e.target.value;
                      updateField('education', updated);
                    }}
                    placeholder="e.g. 8.6 CGPA or 90%"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. CERTIFICATIONS & ACHIEVEMENTS */}
        {activeTab === 'certifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Certifications</h3>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  const newCert = {
                    id: `cert-${Date.now()}`,
                    name: '',
                    organization: '',
                    date: '',
                    url: ''
                  };
                  updateField('certifications', [...(resume.certifications || []), newCert]);
                }}
              >
                Add Certification
              </Button>
            </div>

            {(resume.certifications || []).map((cert, idx) => (
              <div key={cert.id || idx} className="grid-2" style={{ padding: '0.75rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <label className="input-label">Certificate Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...resume.certifications];
                      updated[idx].name = e.target.value;
                      updateField('certifications', updated);
                    }}
                    placeholder="e.g. Meta Front-End Developer"
                  />
                </div>
                <div>
                  <label className="input-label">Issuing Organization</label>
                  <input
                    type="text"
                    className="input-field"
                    value={cert.organization}
                    onChange={(e) => {
                      const updated = [...resume.certifications];
                      updated[idx].organization = e.target.value;
                      updateField('certifications', updated);
                    }}
                    placeholder="e.g. Meta / Coursera"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 8. ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Achievements & Honors</h3>
            {(resume.achievements || []).map((ach, idx) => (
              <div key={ach.id || idx} style={{ padding: '0.75rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input-field"
                  value={ach.title}
                  onChange={(e) => {
                    const updated = [...resume.achievements];
                    updated[idx].title = e.target.value;
                    updateField('achievements', updated);
                  }}
                  placeholder="Achievement title (e.g. 1st Place Hackathon)"
                />
                <textarea
                  rows={2}
                  className="textarea-field"
                  value={ach.description}
                  onChange={(e) => {
                    const updated = [...resume.achievements];
                    updated[idx].description = e.target.value;
                    updateField('achievements', updated);
                  }}
                  placeholder="Description of achievement"
                />
              </div>
            ))}
          </div>
        )}

        {/* 9. LANGUAGES & INTERESTS */}
        {activeTab === 'languages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Languages & Interests</h3>
            <div>
              <label className="input-label">Languages (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.languages || []).map(l => typeof l === 'string' ? l : (l.name || l.language || '')).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  updateField('languages', arr);
                }}
                placeholder="e.g. English, Tamil, Hindi"
              />
            </div>
            <div>
              <label className="input-label">Interests & Extracurricular (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(resume.interests || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  updateField('interests', arr);
                }}
                placeholder="Cloud Computing, AI & Machine Learning, Open Source, Hackathons"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ResumeEditor;
