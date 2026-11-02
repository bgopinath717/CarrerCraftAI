// LocalStorage User-Isolated Persistence Service for CareerCraft AI

const BASE_KEYS = {
  USER: 'careercraft_user',
  TOKEN: 'careercraft_jwt_token',
  SETTINGS: 'careercraft_settings',
  THEME: 'careercraft_theme',
};

// Helper to get user-scoped key to guarantee strict isolation in browser storage
const getUserKey = (prefix) => {
  try {
    const rawUser = localStorage.getItem(BASE_KEYS.USER);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user?.id) {
        return `careercraft_${prefix}_${user.id}`;
      }
    }
  } catch (e) {
    // fallback
  }
  return `careercraft_${prefix}`;
};

export const storageService = {
  // Initialize minimal global settings
  initialize() {
    if (!localStorage.getItem(BASE_KEYS.SETTINGS)) {
      localStorage.setItem(
        BASE_KEYS.SETTINGS,
        JSON.stringify({
          darkMode: false,
          emailNotifications: true,
          publicPortfolio: true,
          profileVisibility: 'public',
        })
      );
    }
  },

  // Auth & User Management (Strictly dynamic)
  getUser() {
    const user = localStorage.getItem(BASE_KEYS.USER);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(BASE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(BASE_KEYS.USER);
    }
  },

  getToken() {
    return localStorage.getItem(BASE_KEYS.TOKEN) || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(BASE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(BASE_KEYS.TOKEN);
    }
  },

  clearAuth() {
    localStorage.removeItem(BASE_KEYS.USER);
    localStorage.removeItem(BASE_KEYS.TOKEN);
  },

  // User Profile
  getProfile() {
    const key = getUserKey('profile');
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    const currentUser = this.getUser();
    return {
      personalInfo: {
        fullName: currentUser?.name || '',
        title: '',
        email: currentUser?.email || '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
        avatar: '',
      },
      careerInfo: {
        objective: '',
        summary: '',
        targetRole: 'Software Developer',
        careerInterests: [],
      },
      education: [],
      skills: {
        technical: [],
        soft: [],
        tools: [],
        languages: [],
        frameworks: [],
        databases: [],
      },
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      interests: [],
    };
  },

  saveProfile(profile) {
    const key = getUserKey('profile');
    localStorage.setItem(key, JSON.stringify(profile));
    return profile;
  },

  resetProfileToEmpty() {
    const currentUser = this.getUser();
    const clean = {
      personalInfo: {
        fullName: currentUser?.name || '',
        title: '',
        email: currentUser?.email || '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
        avatar: '',
      },
      careerInfo: {
        objective: '',
        summary: '',
        targetRole: '',
        careerInterests: [],
      },
      education: [],
      skills: { technical: [] },
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      interests: [],
    };
    return this.saveProfile(clean);
  },

  // Resumes
  getResumes() {
    const key = getUserKey('resumes');
    const data = localStorage.getItem(key);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveResumes(resumes) {
    const key = getUserKey('resumes');
    localStorage.setItem(key, JSON.stringify(resumes || []));
  },

  getResumeById(id) {
    const resumes = this.getResumes();
    return resumes.find((r) => r.id === id || r._id === id) || null;
  },

  saveResume(resume) {
    const resumes = this.getResumes();
    const resumeId = resume.id || resume._id;
    const existingIndex = resumes.findIndex((r) => (r.id && r.id === resumeId) || (r._id && r._id === resumeId));
    const updatedResume = {
      ...resume,
      id: resumeId || `res-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      resumes[existingIndex] = updatedResume;
    } else {
      resumes.unshift(updatedResume);
    }
    this.saveResumes(resumes);
    return updatedResume;
  },

  deleteResume(id) {
    const resumes = this.getResumes().filter((r) => r.id !== id && r._id !== id);
    this.saveResumes(resumes);
    return true;
  },

  deleteAllResumes() {
    this.saveResumes([]);
    return true;
  },

  duplicateResume(id) {
    const target = this.getResumeById(id);
    if (!target) return null;
    const copy = {
      ...target,
      id: `res-${Date.now()}`,
      title: `${target.title || 'Resume'} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    delete copy._id;
    const resumes = this.getResumes();
    resumes.unshift(copy);
    this.saveResumes(resumes);
    return copy;
  },

  // Cover Letters
  getCoverLetters() {
    const key = getUserKey('cover_letters');
    const data = localStorage.getItem(key);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveCoverLetters(letters) {
    const key = getUserKey('cover_letters');
    localStorage.setItem(key, JSON.stringify(letters || []));
  },

  getCoverLetterById(id) {
    const letters = this.getCoverLetters();
    return letters.find((l) => l.id === id || l._id === id) || null;
  },

  saveCoverLetter(letter) {
    const letters = this.getCoverLetters();
    const letterId = letter.id || letter._id;
    const existingIndex = letters.findIndex((l) => (l.id && l.id === letterId) || (l._id && l._id === letterId));
    const updated = {
      ...letter,
      id: letterId || `cl-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      letters[existingIndex] = updated;
    } else {
      letters.unshift(updated);
    }
    this.saveCoverLetters(letters);
    return updated;
  },

  deleteCoverLetter(id) {
    const letters = this.getCoverLetters().filter((l) => l.id !== id && l._id !== id);
    this.saveCoverLetters(letters);
    return true;
  },

  // Portfolio Settings
  getPortfolioSettings() {
    const key = getUserKey('portfolio');
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  savePortfolioSettings(settings) {
    const key = getUserKey('portfolio');
    localStorage.setItem(key, JSON.stringify(settings));
    return settings;
  },

  // Job Matches / Saved Analysis
  getJobMatches() {
    const key = getUserKey('job_matches');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveJobMatch(match) {
    const matches = this.getJobMatches();
    matches.unshift({
      ...match,
      id: match.id || `jm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    const key = getUserKey('job_matches');
    localStorage.setItem(key, JSON.stringify(matches));
    return match;
  },

  deleteJobMatch(id) {
    const matches = this.getJobMatches().filter((m) => m.id !== id);
    const key = getUserKey('job_matches');
    localStorage.setItem(key, JSON.stringify(matches));
    return true;
  },

  // Settings
  getSettings() {
    const data = localStorage.getItem(BASE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          darkMode: false,
          emailNotifications: true,
          publicPortfolio: true,
          profileVisibility: 'public',
        };
  },

  saveSettings(settings) {
    localStorage.setItem(BASE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },
};
