import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Trophy,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import Button from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

export const ProfilePage = () => {
  const { profile, completionPercentage, updateProfile, resetToSample } = useProfile();
  const [formData, setFormData] = useState(profile);
  const [activeTab, setActiveTab] = useState('personal');
  const { addToast } = useToast();

  const tabs = [
    { id: 'personal', label: 'Personal & Career', icon: User },
    { id: 'skills', label: 'Skills & Tech', icon: Wrench },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications & Honors', icon: Award }
  ];

  const handleSave = () => {
    updateProfile(formData);
    addToast('Profile saved successfully!', 'success');
  };

  const handleReset = () => {
    const res = resetToSample();
    setFormData(res);
    addToast('Profile reset to B. Gopinath sample data', 'info');
  };

  const updatePersonal = (field, val) => {
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [field]: val }
    });
  };

  const updateCareer = (field, val) => {
    setFormData({
      ...formData,
      careerInfo: { ...formData.careerInfo, [field]: val }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Manage your credentials, tech stack, and career information across all generated documents.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="md" icon={RotateCcw} onClick={handleReset}>
            Reset to Sample
          </Button>
          <Button variant="primary" size="md" icon={Save} onClick={handleSave}>
            Save Profile
          </Button>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <Card elevated style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
          <span>Career Profile Completion: {completionPercentage}%</span>
          <span className="badge badge-primary">{completionPercentage === 100 ? 'All Set' : 'In Progress'}</span>
        </div>
        <ProgressBar value={completionPercentage} variant={completionPercentage >= 80 ? 'success' : 'warning'} height="10px" />
      </Card>

      {/* Tabs */}
      <div className="tabs-header">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <Card style={{ padding: '2rem' }}>
        
        {/* 1. PERSONAL & CAREER INFO */}
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Personal Information</h3>
              <div className="grid-2">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.fullName || ''}
                    onChange={(e) => updatePersonal('fullName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Professional Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.title || ''}
                    onChange={(e) => updatePersonal('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.personalInfo?.email || ''}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.phone || ''}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.location || ''}
                    onChange={(e) => updatePersonal('location', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.linkedin || ''}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">GitHub Profile URL</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.github || ''}
                    onChange={(e) => updatePersonal('github', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Portfolio Website URL</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo?.website || ''}
                    onChange={(e) => updatePersonal('website', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Career Positioning</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="input-label">Target Job Role</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.careerInfo?.targetRole || ''}
                    onChange={(e) => updateCareer('targetRole', e.target.value)}
                    placeholder="e.g. MERN Stack Developer / Full Stack Engineer"
                  />
                </div>
                <div>
                  <label className="input-label">Career Objective</label>
                  <textarea
                    rows={3}
                    className="textarea-field"
                    value={formData.careerInfo?.objective || ''}
                    onChange={(e) => updateCareer('objective', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Professional Summary</label>
                  <textarea
                    rows={4}
                    className="textarea-field"
                    value={formData.careerInfo?.summary || ''}
                    onChange={(e) => updateCareer('summary', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SKILLS */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Technical & Soft Skills Categorization</h3>
            
            <div>
              <label className="input-label">Core Technical Skills (Comma separated)</label>
              <textarea
                rows={2}
                className="textarea-field"
                value={(formData.skills?.technical || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setFormData({ ...formData, skills: { ...formData.skills, technical: arr } });
                }}
              />
            </div>

            <div>
              <label className="input-label">Frameworks & Libraries (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(formData.skills?.frameworks || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setFormData({ ...formData, skills: { ...formData.skills, frameworks: arr } });
                }}
              />
            </div>

            <div>
              <label className="input-label">Databases (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(formData.skills?.databases || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setFormData({ ...formData, skills: { ...formData.skills, databases: arr } });
                }}
              />
            </div>

            <div>
              <label className="input-label">Developer Tools (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={(formData.skills?.tools || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setFormData({ ...formData, skills: { ...formData.skills, tools: arr } });
                }}
              />
            </div>

            <div>
              <label className="input-label">Soft Skills / Professional Competencies</label>
              <input
                type="text"
                className="input-field"
                value={(formData.skills?.soft || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setFormData({ ...formData, skills: { ...formData.skills, soft: arr } });
                }}
              />
            </div>
          </div>
        )}

        {/* 3. EXPERIENCE */}
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
                  setFormData({ ...formData, experience: [...(formData.experience || []), newExp] });
                }}
              >
                Add Experience
              </Button>
            </div>

            {(formData.experience || []).map((exp, idx) => (
              <div key={exp.id || idx} style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Experience #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = formData.experience.filter((_, i) => i !== idx);
                      setFormData({ ...formData, experience: updated });
                    }}
                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="input-label">Company</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].company = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">Position</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.position}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].position = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">Start Date</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].startDate = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">End Date</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].endDate = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Description & Achievements</label>
                  <textarea
                    rows={4}
                    className="textarea-field"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...formData.experience];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, experience: updated });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. PROJECTS */}
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
                    description: '',
                    technologies: [],
                    githubUrl: '',
                    liveUrl: ''
                  };
                  setFormData({ ...formData, projects: [...(formData.projects || []), newProj] });
                }}
              >
                Add Project
              </Button>
            </div>

            {(formData.projects || []).map((proj, idx) => (
              <div key={proj.id || idx} style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Project #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = formData.projects.filter((_, i) => i !== idx);
                      setFormData({ ...formData, projects: updated });
                    }}
                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="input-label">Project Title</label>
                    <input
                      type="text"
                      className="input-field"
                      value={proj.name}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">Technologies (Comma separated)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[idx].technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        setFormData({ ...formData, projects: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">GitHub Repository</label>
                    <input
                      type="text"
                      className="input-field"
                      value={proj.githubUrl}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[idx].githubUrl = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">Live Application URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={proj.liveUrl}
                      onChange={(e) => {
                        const updated = [...formData.projects];
                        updated[idx].liveUrl = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Project Details</label>
                  <textarea
                    rows={3}
                    className="textarea-field"
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. EDUCATION */}
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
                  setFormData({ ...formData, education: [...(formData.education || []), newEdu] });
                }}
              >
                Add Education
              </Button>
            </div>

            {(formData.education || []).map((edu, idx) => (
              <div key={edu.id || idx} style={{ padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Education #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = formData.education.filter((_, i) => i !== idx);
                      setFormData({ ...formData, education: updated });
                    }}
                    style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="input-label">Degree</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].degree = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">Institution</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].institution = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">Start Year</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.startYear}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].startYear = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="input-label">End Year</label>
                    <input
                      type="text"
                      className="input-field"
                      value={edu.endYear}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].endYear = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
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
                      const updated = [...formData.education];
                      updated[idx].grade = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. CERTIFICATIONS & HONORS */}
        {activeTab === 'certifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Certifications & Honors</h3>
            {(formData.certifications || []).map((cert, idx) => (
              <div key={cert.id || idx} className="grid-2" style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <label className="input-label">Certification Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, certifications: updated });
                    }}
                  />
                </div>
                <div>
                  <label className="input-label">Issuing Body</label>
                  <input
                    type="text"
                    className="input-field"
                    value={cert.organization}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      updated[idx].organization = e.target.value;
                      setFormData({ ...formData, certifications: updated });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </Card>

    </div>
  );
};

export default ProfilePage;
