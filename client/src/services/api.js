// API Client Service with Axios & Standalone Mode Fallback
import axios from 'axios';
import { storageService } from './storageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful fallback to client storage if server is not yet online
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.code === 'ERR_NETWORK') {
      console.info('Backend server unreachable. Operating in Standalone Frontend Fallback Mode.');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  async login(email, password) {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.token) {
        storageService.setToken(res.data.token);
        storageService.setUser(res.data.user);
      }
      return res.data;
    } catch {
      // Standalone simulation fallback
      const user = {
        id: "usr-gopinath-1",
        name: email.includes('gopinath') ? "B. Gopinath" : email.split('@')[0],
        email: email,
        role: "MERN Stack Developer"
      };
      const token = "mock-jwt-token-" + Date.now();
      storageService.setUser(user);
      storageService.setToken(token);
      return { success: true, user, token };
    }
  },

  async register(name, email, password) {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      if (res.data?.token) {
        storageService.setToken(res.data.token);
        storageService.setUser(res.data.user);
      }
      return res.data;
    } catch {
      const user = {
        id: "usr-" + Date.now(),
        name: name || "B. Gopinath",
        email: email,
        role: "MERN Stack Developer"
      };
      const token = "mock-jwt-token-" + Date.now();
      storageService.setUser(user);
      storageService.setToken(token);
      return { success: true, user, token };
    }
  },

  async getMe() {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch {
      return { success: true, user: storageService.getUser() };
    }
  },

  // Profile
  async getProfile() {
    try {
      const res = await apiClient.get('/profile');
      if (res.data?.profile) {
        storageService.saveProfile(res.data.profile);
      }
      return res.data;
    } catch {
      return { success: true, profile: storageService.getProfile() };
    }
  },

  async updateProfile(profile) {
    try {
      const res = await apiClient.put('/profile', profile);
      const saved = res.data?.profile || profile;
      storageService.saveProfile(saved);
      return { success: true, profile: saved };
    } catch {
      const saved = storageService.saveProfile(profile);
      return { success: true, profile: saved };
    }
  },

  // Resumes
  async getResumes() {
    try {
      const res = await apiClient.get('/resumes');
      return res.data;
    } catch {
      return { success: true, resumes: storageService.getResumes() };
    }
  },

  async getResumeById(id) {
    try {
      const res = await apiClient.get(`/resumes/${id}`);
      return res.data;
    } catch {
      return { success: true, resume: storageService.getResumeById(id) };
    }
  },

  async saveResume(resume) {
    try {
      if (resume.id && !resume.id.startsWith('res-default') && !resume.id.startsWith('res-')) {
        const res = await apiClient.put(`/resumes/${resume.id}`, resume);
        return res.data;
      } else {
        const res = await apiClient.post('/resumes', resume);
        return res.data;
      }
    } catch {
      const saved = storageService.saveResume(resume);
      return { success: true, resume: saved };
    }
  },

  async deleteResume(id) {
    try {
      const res = await apiClient.delete(`/resumes/${id}`);
      storageService.deleteResume(id);
      return res.data;
    } catch {
      storageService.deleteResume(id);
      return { success: true };
    }
  },

  // Portfolio
  async getPublicPortfolio(slug = 'gopinath') {
    try {
      const res = await apiClient.get(`/portfolio/public/${slug}`);
      return res.data;
    } catch {
      return {
        success: true,
        profile: storageService.getProfile(),
        portfolioSettings: storageService.getPortfolioSettings()
      };
    }
  },

  async getPortfolioSettings() {
    try {
      const res = await apiClient.get('/portfolio');
      return res.data;
    } catch {
      return { success: true, portfolioSettings: storageService.getPortfolioSettings() };
    }
  },

  async updatePortfolioSettings(settings) {
    try {
      const res = await apiClient.put('/portfolio', settings);
      storageService.savePortfolioSettings(settings);
      return res.data;
    } catch {
      const saved = storageService.savePortfolioSettings(settings);
      return { success: true, portfolioSettings: saved };
    }
  },

  async generatePortfolioFromResume(payload) {
    if (payload instanceof FormData) {
      const res = await apiClient.post('/portfolio/generate-from-resume', payload, {
        headers: { 'Content-Type': undefined },
        timeout: 45000,
      });
      return res.data;
    } else {
      const res = await apiClient.post('/portfolio/generate-from-resume', payload, {
        timeout: 45000,
      });
      return res.data;
    }
  },

  // Cover Letters
  async getCoverLetters() {
    try {
      const res = await apiClient.get('/cover-letters');
      return res.data;
    } catch {
      return { success: true, coverLetters: storageService.getCoverLetters() };
    }
  },

  async saveCoverLetter(letter) {
    try {
      if (letter.id && !letter.id.startsWith('cl-default') && !letter.id.startsWith('cl-')) {
        const res = await apiClient.put(`/cover-letters/${letter.id}`, letter);
        return res.data;
      } else {
        const res = await apiClient.post('/cover-letters', letter);
        return res.data;
      }
    } catch {
      const saved = storageService.saveCoverLetter(letter);
      return { success: true, coverLetter: saved };
    }
  },

  async deleteCoverLetter(id) {
    try {
      const res = await apiClient.delete(`/cover-letters/${id}`);
      storageService.deleteCoverLetter(id);
      return res.data;
    } catch {
      storageService.deleteCoverLetter(id);
      return { success: true };
    }
  },

  // AI Intelligence Endpoints
  async polishBullet(rawBullet, role = "Software Developer") {
    try {
      const res = await apiClient.post('/ai/polish', { rawBullet, role });
      return res.data?.polished;
    } catch {
      return null;
    }
  },

  async generateCoverLetterAI(data) {
    try {
      const res = await apiClient.post('/ai/cover-letter', data);
      return res.data?.content;
    } catch {
      return null;
    }
  },

  async suggestKeywords(targetRole = "MERN Stack Developer") {
    try {
      const res = await apiClient.post('/ai/keywords', { targetRole });
      return res.data?.keywords;
    } catch {
      return null;
    }
  },

  async analyzeJobMatchAI(resumeData, jobDescription) {
    try {
      if (resumeData instanceof FormData) {
        const res = await apiClient.post('/ai/job-match', resumeData, {
          headers: { 'Content-Type': undefined },
          timeout: 30000
        });
        return res.data?.analysis || null;
      }
      const res = await apiClient.post('/ai/job-match', { resumeData, jobDescription }, { timeout: 25000 });
      return res.data?.analysis || null;
    } catch {
      return null;
    }
  },

  async analyzeATS(payload) {
    if (payload instanceof FormData) {
      const res = await apiClient.post('/ai/analyze-ats', payload, {
        headers: { 'Content-Type': undefined },
        timeout: 30000,
      });
      return res.data;
    } else {
      const res = await apiClient.post('/ai/analyze-ats', payload, {
        timeout: 30000,
      });
      return res.data;
    }
  },

  async getCareerRecommendations(profile, options = {}) {
    try {
      const res = await apiClient.post('/ai/career-recommendations', { profile, options }, { timeout: 15000 });
      return res.data;
    } catch {
      return null;
    }
  },

  async getCareerRoadmap(roleId, profile, completedTaskIds = []) {
    try {
      const res = await apiClient.post('/ai/career-roadmap', { roleId, profile, completedTaskIds }, { timeout: 15000 });
      return res.data?.roadmap || null;
    } catch {
      return null;
    }
  }
};

export default apiClient;
