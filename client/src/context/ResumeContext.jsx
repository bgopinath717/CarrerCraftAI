import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { atsEngine } from '../services/atsEngine';
import { apiService } from '../services/api';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState(() => storageService.getResumes());
  const [activeResume, setActiveResume] = useState(null);

  // Sync with backend on mount
  useEffect(() => {
    apiService.getResumes().then((res) => {
      if (res?.resumes && res.resumes.length > 0) {
        setResumes(res.resumes);
      }
    }).catch(() => {
      setResumes(storageService.getResumes());
    });
  }, []);

  const saveResume = (resumeData) => {
    // Recalculate ATS score before saving
    const atsResult = atsEngine.analyzeResume(resumeData);
    const resumeWithScore = {
      ...resumeData,
      atsScore: atsResult.score,
      updatedAt: new Date().toISOString()
    };
    const saved = storageService.saveResume(resumeWithScore);
    setResumes(storageService.getResumes());
    if (activeResume && activeResume.id === saved.id) {
      setActiveResume(saved);
    }
    // Asynchronously sync with MongoDB backend
    apiService.saveResume(resumeWithScore).catch(() => {});
    return saved;
  };

  const deleteResume = (id) => {
    storageService.deleteResume(id);
    setResumes(storageService.getResumes());
    if (activeResume && activeResume.id === id) {
      setActiveResume(null);
    }
    apiService.deleteResume(id).catch(() => {});
  };

  const duplicateResume = (id) => {
    const copy = storageService.duplicateResume(id);
    setResumes(storageService.getResumes());
    if (copy) {
      apiService.saveResume(copy).catch(() => {});
    }
    return copy;
  };

  const createNewResume = (initialData = null) => {
    const profile = storageService.getProfile();
    const newResume = {
      id: `res-${Date.now()}`,
      title: initialData?.title || "New ATS Resume",
      template: initialData?.template || "classic-ats",
      targetRole: profile?.careerInfo?.targetRole || "MERN Stack Developer",
      personalInfo: { ...(initialData?.personalInfo || profile?.personalInfo) },
      summary: initialData?.summary || profile?.careerInfo?.summary || "",
      education: [...(initialData?.education || profile?.education || [])],
      experience: [...(initialData?.experience || profile?.experience || [])],
      skills: { ...(initialData?.skills || profile?.skills || {}) },
      projects: [...(initialData?.projects || profile?.projects || [])],
      certifications: [...(initialData?.certifications || profile?.certifications || [])],
      achievements: [...(initialData?.achievements || profile?.achievements || [])],
      languages: [...(initialData?.languages || profile?.languages || [])],
      interests: [...(initialData?.interests || profile?.interests || [])],
      atsScore: 85,
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return saveResume(newResume);
  };

  const deleteAllResumes = () => {
    storageService.deleteAllResumes();
    setResumes([]);
    setActiveResume(null);
    resumes.forEach(r => {
      apiService.deleteResume(r.id).catch(() => {});
    });
  };

  return (
    <ResumeContext.Provider value={{
      resumes,
      activeResume,
      setActiveResume,
      saveResume,
      deleteResume,
      deleteAllResumes,
      duplicateResume,
      createNewResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
