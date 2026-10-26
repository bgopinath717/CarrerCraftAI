// LocalStorage Persistence Service for CareerCraft AI
import { sampleUserData } from '../data/sampleUserData';

const KEYS = {
  USER: 'careercraft_user',
  TOKEN: 'careercraft_jwt_token',
  PROFILE: 'careercraft_profile',
  RESUMES: 'careercraft_resumes',
  COVER_LETTERS: 'careercraft_cover_letters',
  PORTFOLIO: 'careercraft_portfolio',
  SETTINGS: 'careercraft_settings',
  THEME: 'careercraft_theme',
  JOB_MATCHES: 'careercraft_job_matches'
};

// Initial default resume created for B. Gopinath
const defaultResume = {
  id: "res-default-1",
  title: "MERN Stack Developer Resume",
  template: "classic-ats",
  targetRole: "MERN Stack Developer",
  personalInfo: { ...sampleUserData.personalInfo },
  summary: sampleUserData.careerInfo.summary,
  education: [...sampleUserData.education],
  experience: [...sampleUserData.experience],
  skills: { ...sampleUserData.skills },
  projects: [...sampleUserData.projects],
  certifications: [...sampleUserData.certifications],
  achievements: [...sampleUserData.achievements],
  languages: [...sampleUserData.languages],
  interests: [...sampleUserData.interests],
  atsScore: 88,
  status: "Completed",
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: new Date().toISOString()
};

const defaultCoverLetter = {
  id: "cl-default-1",
  title: "Full Stack Developer Cover Letter",
  jobTitle: "MERN Stack Developer",
  companyName: "Tech Innovations Inc.",
  jobDescription: "Looking for a MERN Stack Developer proficient in React, Node.js, Express, MongoDB and REST APIs to build scalable cloud-based web applications.",
  tone: "Professional",
  content: `Dear Hiring Team,\n\nI am writing to express my enthusiastic interest in the MERN Stack Developer position at Tech Innovations Inc. With strong practical experience in React.js, Node.js, Express.js, and MongoDB, alongside a proven track record of building production-grade full-stack web platforms such as CareerCraft AI and high-concurrency e-commerce architectures, I am eager to contribute effectively to your engineering initiatives.\n\nDuring my development journey, I have engineered performant frontend interfaces using React, built secure JWT-authenticated RESTful APIs, and optimized database aggregation pipelines. My dedication to clean architecture, code quality, and continuous learning enables me to quickly adapt and deliver high-impact software solutions.\n\nI welcome the opportunity to discuss how my technical skills and problem-solving mindset can support the mission at Tech Innovations Inc. Thank you for your time and consideration.\n\nSincerely,\nB. Gopinath`,
  createdAt: "2025-01-16T12:30:00.000Z",
  updatedAt: new Date().toISOString()
};

export const storageService = {
  // Initialize default data if empty
  initialize() {
    if (!localStorage.getItem(KEYS.PROFILE)) {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(sampleUserData));
    }
    if (!localStorage.getItem(KEYS.RESUMES)) {
      localStorage.setItem(KEYS.RESUMES, JSON.stringify([defaultResume]));
    }
    if (!localStorage.getItem(KEYS.COVER_LETTERS)) {
      localStorage.setItem(KEYS.COVER_LETTERS, JSON.stringify([defaultCoverLetter]));
    }
    if (!localStorage.getItem(KEYS.PORTFOLIO)) {
      localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(sampleUserData.portfolioSettings));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify({
        darkMode: true,
        emailNotifications: true,
        publicPortfolio: true,
        profileVisibility: 'public'
      }));
    }
  },

  // Auth & User
  getUser() {
    const user = localStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : {
      id: "usr-gopinath-1",
      name: "B. Gopinath",
      email: "gopinath.mern@example.com",
      avatar: sampleUserData.personalInfo.avatar,
      role: "MERN Stack Developer"
    };
  },
  setUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  getToken() {
    return localStorage.getItem(KEYS.TOKEN) || "demo-jwt-token-careercraft-gopinath";
  },
  setToken(token) {
    localStorage.setItem(KEYS.TOKEN, token);
  },
  clearAuth() {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.TOKEN);
  },

  // Profile
  getProfile() {
    this.initialize();
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : sampleUserData;
  },
  saveProfile(profile) {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },
  resetProfileToSample() {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(sampleUserData));
    return sampleUserData;
  },

  // Resumes
  getResumes() {
    this.initialize();
    const data = localStorage.getItem(KEYS.RESUMES);
    return data ? JSON.parse(data) : [defaultResume];
  },
  getResumeById(id) {
    const resumes = this.getResumes();
    return resumes.find(r => r.id === id) || null;
  },
  saveResume(resume) {
    const resumes = this.getResumes();
    const existingIndex = resumes.findIndex(r => r.id === resume.id);
    const updatedResume = {
      ...resume,
      updatedAt: new Date().toISOString()
    };
    if (existingIndex >= 0) {
      resumes[existingIndex] = updatedResume;
    } else {
      resumes.unshift(updatedResume);
    }
    localStorage.setItem(KEYS.RESUMES, JSON.stringify(resumes));
    return updatedResume;
  },
  deleteResume(id) {
    const resumes = this.getResumes().filter(r => r.id !== id);
    localStorage.setItem(KEYS.RESUMES, JSON.stringify(resumes));
    return true;
  },
  deleteAllResumes() {
    localStorage.setItem(KEYS.RESUMES, JSON.stringify([]));
    return true;
  },
  duplicateResume(id) {
    const target = this.getResumeById(id);
    if (!target) return null;
    const copy = {
      ...target,
      id: `res-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const resumes = this.getResumes();
    resumes.unshift(copy);
    localStorage.setItem(KEYS.RESUMES, JSON.stringify(resumes));
    return copy;
  },

  // Cover Letters
  getCoverLetters() {
    this.initialize();
    const data = localStorage.getItem(KEYS.COVER_LETTERS);
    return data ? JSON.parse(data) : [defaultCoverLetter];
  },
  saveCoverLetter(letter) {
    const letters = this.getCoverLetters();
    const existingIndex = letters.findIndex(l => l.id === letter.id);
    const updated = { ...letter, updatedAt: new Date().toISOString() };
    if (existingIndex >= 0) {
      letters[existingIndex] = updated;
    } else {
      letters.unshift(updated);
    }
    localStorage.setItem(KEYS.COVER_LETTERS, JSON.stringify(letters));
    return updated;
  },
  deleteCoverLetter(id) {
    const letters = this.getCoverLetters().filter(l => l.id !== id);
    localStorage.setItem(KEYS.COVER_LETTERS, JSON.stringify(letters));
    return true;
  },
  deleteAllCoverLetters() {
    localStorage.setItem(KEYS.COVER_LETTERS, JSON.stringify([]));
    return true;
  },

  // Portfolio
  getPortfolioSettings() {
    this.initialize();
    const data = localStorage.getItem(KEYS.PORTFOLIO);
    return data ? JSON.parse(data) : sampleUserData.portfolioSettings;
  },
  savePortfolioSettings(settings) {
    localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(settings));
    return settings;
  },

  // Settings
  getSettings() {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      darkMode: true,
      emailNotifications: true,
      publicPortfolio: true,
      profileVisibility: 'public'
    };
  },
  saveSettings(settings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // Job Matches
  getJobMatches() {
    this.initialize();
    const data = localStorage.getItem(KEYS.JOB_MATCHES);
    return data ? JSON.parse(data) : [];
  },
  saveJobMatch(match) {
    const matches = this.getJobMatches();
    const id = match.id || `jm-${Date.now()}`;
    const updated = {
      ...match,
      id,
      savedAt: new Date().toISOString()
    };
    const existingIndex = matches.findIndex(m => m.id === id);
    if (existingIndex >= 0) {
      matches[existingIndex] = updated;
    } else {
      matches.unshift(updated);
    }
    localStorage.setItem(KEYS.JOB_MATCHES, JSON.stringify(matches));
    return updated;
  },
  deleteJobMatch(id) {
    const matches = this.getJobMatches().filter(m => m.id !== id);
    localStorage.setItem(KEYS.JOB_MATCHES, JSON.stringify(matches));
    return true;
  },
  deleteAllJobMatches() {
    localStorage.setItem(KEYS.JOB_MATCHES, JSON.stringify([]));
    return true;
  },
  deleteAllDocuments() {
    localStorage.setItem(KEYS.RESUMES, JSON.stringify([]));
    localStorage.setItem(KEYS.COVER_LETTERS, JSON.stringify([]));
    localStorage.setItem(KEYS.JOB_MATCHES, JSON.stringify([]));
    return true;
  },

  // Saved Career Roles
  getSavedRoles() {
    try {
      const data = localStorage.getItem('careercraft_saved_roles');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  toggleSavedRole(roleId) {
    const saved = this.getSavedRoles();
    let updated;
    if (saved.includes(roleId)) {
      updated = saved.filter(id => id !== roleId);
    } else {
      updated = [...saved, roleId];
    }
    localStorage.setItem('careercraft_saved_roles', JSON.stringify(updated));
    return updated;
  },
  isRoleSaved(roleId) {
    return this.getSavedRoles().includes(roleId);
  },

  // Roadmap Progress (completed tasks)
  getCompletedTasks(roleId) {
    try {
      const data = localStorage.getItem(`careercraft_roadmap_${roleId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  toggleCompletedTask(roleId, taskId) {
    const tasks = this.getCompletedTasks(roleId);
    let updated;
    if (tasks.includes(taskId)) {
      updated = tasks.filter(id => id !== taskId);
    } else {
      updated = [...tasks, taskId];
    }
    localStorage.setItem(`careercraft_roadmap_${roleId}`, JSON.stringify(updated));
    return updated;
  },

  // Skill Progress tracking (learning / completed)
  getSkillProgress(roleId) {
    try {
      const data = localStorage.getItem(`careercraft_skill_progress_${roleId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  setSkillStatus(roleId, skillName, status) {
    const current = this.getSkillProgress(roleId);
    const updated = { ...current, [skillName]: status };
    localStorage.setItem(`careercraft_skill_progress_${roleId}`, JSON.stringify(updated));
    return updated;
  },

  // Last Analyzed Timestamp
  getLastAnalyzed(roleId) {
    return localStorage.getItem(`careercraft_last_analyzed_${roleId}`) || null;
  },
  setLastAnalyzed(roleId, timestamp = new Date().toISOString()) {
    localStorage.setItem(`careercraft_last_analyzed_${roleId}`, timestamp);
    return timestamp;
  },

  // Region preference
  getRegionPreference() {
    return localStorage.getItem('careercraft_region_pref') || 'IN';
  },
  setRegionPreference(region) {
    localStorage.setItem('careercraft_region_pref', region);
    return region;
  }
};

