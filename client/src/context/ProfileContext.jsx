import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingSections, setMissingSections] = useState([]);

  // Sync with backend whenever user or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      apiService
        .getProfile()
        .then((res) => {
          if (res?.profile) {
            setProfile(res.profile);
          }
        })
        .catch(() => {});
    } else {
      setProfile(storageService.getProfile());
    }
  }, [isAuthenticated, user?.id]);

  // Calculate profile completion score dynamically
  const calculateCompletion = (prof) => {
    if (!prof) {
      setCompletionPercentage(0);
      setMissingSections(['Basic Profile Information']);
      return;
    }

    let score = 0;
    const missing = [];

    // Personal details (25%)
    if (prof?.personalInfo?.fullName) score += 5;
    if (prof?.personalInfo?.email) score += 5;
    if (prof?.personalInfo?.phone) score += 5;
    if (prof?.personalInfo?.location) score += 5;
    if (prof?.personalInfo?.linkedin || prof?.personalInfo?.github) score += 5;
    else missing.push('Social Links (LinkedIn / GitHub)');

    // Career info (15%)
    if (prof?.careerInfo?.summary && prof.careerInfo.summary.length > 30) score += 10;
    else missing.push('Professional Summary');
    if (prof?.careerInfo?.targetRole) score += 5;

    // Skills (20%)
    const techSkills = prof?.skills?.technical || [];
    if (techSkills.length >= 5) score += 20;
    else if (techSkills.length > 0) score += 10;
    else missing.push('Technical Skills (min 5)');

    // Education (15%)
    if (prof?.education && prof.education.length > 0) score += 15;
    else missing.push('Education History');

    // Experience (15%)
    if (prof?.experience && prof.experience.length > 0) score += 15;
    else missing.push('Work Experience / Internships');

    // Projects (10%)
    if (prof?.projects && prof.projects.length > 0) score += 10;
    else missing.push('Featured Projects');

    setCompletionPercentage(Math.min(100, score));
    setMissingSections(missing);
  };

  useEffect(() => {
    calculateCompletion(profile);
  }, [profile]);

  const updateProfile = async (updatedData) => {
    const saved = storageService.saveProfile(updatedData);
    setProfile(saved);
    try {
      const res = await apiService.updateProfile(updatedData);
      if (res?.profile) {
        setProfile(res.profile);
      }
    } catch {
      // offline fallback
    }
    return saved;
  };

  const resetToEmpty = () => {
    const clean = storageService.resetProfileToEmpty();
    setProfile(clean);
    apiService.updateProfile(clean).catch(() => {});
    return clean;
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        completionPercentage,
        missingSections,
        updateProfile,
        resetToEmpty,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
