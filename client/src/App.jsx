import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { ResumeProvider } from './context/ResumeContext';
import { ToastProvider } from './components/common/Toast';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ATSCheckerPage from './pages/ATSCheckerPage';
import JobMatchPage from './pages/JobMatchPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import CoverLetterPage from './pages/CoverLetterPage';
import CareerRecommendationPage from './pages/CareerRecommendationPage';
import SkillGapAnalysisPage from './pages/SkillGapAnalysisPage';
import SavedDocumentsPage from './pages/SavedDocumentsPage';
import SettingsPage from './pages/SettingsPage';

// Global Styles
import './styles/index.css';
import './styles/resume.css';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <ResumeProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Marketing & Auth Routes */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Public Shareable Portfolio Route */}
                  <Route path="/portfolio/:slug" element={<PublicPortfolioPage />} />

                  {/* Protected SaaS Dashboard Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/resumes/builder" element={<ResumeBuilderPage />} />
                    <Route path="/ats-checker" element={<ATSCheckerPage />} />
                    <Route path="/job-match" element={<JobMatchPage />} />
                    <Route path="/portfolio" element={<PortfolioBuilderPage />} />
                    <Route path="/cover-letter" element={<CoverLetterPage />} />
                    <Route path="/career-recommendation" element={<CareerRecommendationPage />} />
                    <Route path="/skill-gap" element={<SkillGapAnalysisPage />} />
                    <Route path="/documents" element={<SavedDocumentsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </ResumeProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
