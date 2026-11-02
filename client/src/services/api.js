// Production API Client Service with Axios for CareerCraft AI
import axios from 'axios';
import { storageService } from './storageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 45000,
});

// Request Interceptor: Attach JWT Bearer Token if present
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

// Response Interceptor: Handle 401 Unauthorized cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on protected endpoint, do not redirect if it was a login attempt
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        // Token expired or invalid
        // storageService.clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication Endpoints
  async login(email, password, rememberMe = true) {
    try {
      const res = await apiClient.post('/auth/login', { email, password, rememberMe });
      if (res.data?.token) {
        storageService.setToken(res.data.token);
        storageService.setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
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
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // continue clearing local storage even if network fails
    } finally {
      storageService.clearAuth();
    }
    return { success: true };
  },

  async getMe() {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data?.user) {
        storageService.setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to authenticate user.',
      };
    }
  },

  async forgotPassword(email) {
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to process forgot password request.',
      };
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const res = await apiClient.post('/auth/reset-password', { token, newPassword });
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed.',
      };
    }
  },

  // Dashboard Statistics & User Data
  async getDashboard() {
    try {
      const res = await apiClient.get('/dashboard');
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load dashboard data.',
      };
    }
  },

  // Profile Management
  async getProfile() {
    try {
      const res = await apiClient.get('/profile');
      if (res.data?.profile) {
        storageService.saveProfile(res.data.profile);
      }
      return res.data;
    } catch (error) {
      const cached = storageService.getProfile();
      return { success: !!cached, profile: cached };
    }
  },

  async updateProfile(profile) {
    try {
      const res = await apiClient.put('/profile', profile);
      const saved = res.data?.profile || profile;
      storageService.saveProfile(saved);
      return { success: true, profile: saved };
    } catch (error) {
      const saved = storageService.saveProfile(profile);
      return { success: true, profile: saved };
    }
  },

  // Resumes Management
  async getResumes() {
    try {
      const res = await apiClient.get('/resumes');
      if (res.data?.resumes) {
        storageService.saveResumes(res.data.resumes);
      }
      return res.data;
    } catch (error) {
      return { success: true, resumes: storageService.getResumes() };
    }
  },

  async getResumeById(id) {
    try {
      const res = await apiClient.get(`/resumes/${id}`);
      return res.data;
    } catch (error) {
      return { success: true, resume: storageService.getResumeById(id) };
    }
  },

  async saveResume(resume) {
    try {
      const targetId = resume._id || (resume.id && !resume.id.startsWith('res-') ? resume.id : null);
      let res;
      if (targetId) {
        res = await apiClient.put(`/resumes/${targetId}`, resume);
      } else {
        res = await apiClient.post('/resumes', resume);
      }
      const saved = res.data?.resume || resume;
      storageService.saveResume(saved);
      return { success: true, resume: saved };
    } catch (error) {
      const saved = storageService.saveResume(resume);
      return { success: true, resume: saved };
    }
  },

  async deleteResume(id) {
    try {
      await apiClient.delete(`/resumes/${id}`);
    } catch (e) {
      // Ignore network errors
    } finally {
      storageService.deleteResume(id);
    }
    return { success: true };
  },

  async duplicateResume(id) {
    try {
      const res = await apiClient.post(`/resumes/${id}/duplicate`);
      if (res.data?.resume) {
        storageService.saveResume(res.data.resume);
      }
      return res.data;
    } catch (error) {
      const copy = storageService.duplicateResume(id);
      return { success: true, resume: copy };
    }
  },

  // Portfolio Management
  async getPublicPortfolio(slug) {
    try {
      const res = await apiClient.get(`/portfolio/public/${slug}`);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Portfolio not found',
      };
    }
  },

  async getPortfolioSettings() {
    try {
      const res = await apiClient.get('/portfolio');
      if (res.data?.portfolioSettings) {
        storageService.savePortfolioSettings(res.data.portfolioSettings);
      }
      return res.data;
    } catch (error) {
      return { success: true, portfolioSettings: storageService.getPortfolioSettings() };
    }
  },

  async updatePortfolioSettings(settings) {
    try {
      const res = await apiClient.put('/portfolio', settings);
      const saved = res.data?.portfolioSettings || settings;
      storageService.savePortfolioSettings(saved);
      return { success: true, portfolioSettings: saved };
    } catch (error) {
      const saved = storageService.savePortfolioSettings(settings);
      return { success: true, portfolioSettings: saved };
    }
  },

  async generatePortfolioFromResume(payload) {
    const isFormData = payload instanceof FormData;
    const res = await apiClient.post('/portfolio/generate-from-resume', payload, {
      headers: isFormData ? { 'Content-Type': undefined } : undefined,
      timeout: 45000,
    });
    return res.data;
  },

  // Cover Letters Management
  async getCoverLetters() {
    try {
      const res = await apiClient.get('/cover-letters');
      if (res.data?.coverLetters) {
        storageService.saveCoverLetters(res.data.coverLetters);
      }
      return res.data;
    } catch (error) {
      return { success: true, coverLetters: storageService.getCoverLetters() };
    }
  },

  async saveCoverLetter(letter) {
    try {
      const targetId = letter._id || (letter.id && !letter.id.startsWith('cl-') ? letter.id : null);
      let res;
      if (targetId) {
        res = await apiClient.put(`/cover-letters/${targetId}`, letter);
      } else {
        res = await apiClient.post('/cover-letters', letter);
      }
      const saved = res.data?.coverLetter || letter;
      storageService.saveCoverLetter(saved);
      return { success: true, coverLetter: saved };
    } catch (error) {
      const saved = storageService.saveCoverLetter(letter);
      return { success: true, coverLetter: saved };
    }
  },

  async deleteCoverLetter(id) {
    try {
      await apiClient.delete(`/cover-letters/${id}`);
    } catch (e) {
      // continue
    } finally {
      storageService.deleteCoverLetter(id);
    }
    return { success: true };
  },

  // ATS Analysis Endpoints
  async analyzeATS(payload) {
    const isFormData = payload instanceof FormData;
    const res = await apiClient.post('/ats/analyze', payload, {
      headers: isFormData ? { 'Content-Type': undefined } : undefined,
      timeout: 45000,
    });
    return res.data;
  },

  async getAtsHistory() {
    try {
      const res = await apiClient.get('/ats/history');
      return res.data;
    } catch (error) {
      return { success: false, history: [] };
    }
  },

  async getAtsById(id) {
    try {
      const res = await apiClient.get(`/ats/${id}`);
      return res.data;
    } catch (error) {
      return { success: false, message: 'Analysis not found' };
    }
  },

  // Settings Endpoints
  async getSettings() {
    try {
      const res = await apiClient.get('/settings');
      if (res.data?.settings) {
        storageService.saveSettings(res.data.settings);
      }
      return res.data;
    } catch (error) {
      return { success: true, settings: storageService.getSettings() };
    }
  },

  async updateSettings(settings) {
    try {
      const res = await apiClient.put('/settings', settings);
      if (res.data?.settings) {
        storageService.saveSettings(res.data.settings);
      }
      if (res.data?.user) {
        storageService.setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update settings',
      };
    }
  },

  // AI Intelligence Endpoints
  async polishBullet(rawBullet, role = 'Software Developer') {
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

  async suggestKeywords(targetRole = 'Software Developer') {
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
          timeout: 45000,
        });
        return res.data?.analysis || null;
      }
      const res = await apiClient.post('/ai/job-match', { resumeData, jobDescription }, { timeout: 45000 });
      return res.data?.analysis || null;
    } catch {
      return null;
    }
  },

  async getCareerRecommendations(profile, options = {}) {
    try {
      const res = await apiClient.post('/ai/career-recommendations', { profile, options }, { timeout: 30000 });
      return res.data;
    } catch {
      return null;
    }
  },

  async getCareerRoadmap(roleId, profile, completedTaskIds = []) {
    try {
      const res = await apiClient.post('/ai/career-roadmap', { roleId, profile, completedTaskIds }, { timeout: 30000 });
      return res.data?.roadmap || null;
    } catch {
      return null;
    }
  },
};

export default apiClient;
