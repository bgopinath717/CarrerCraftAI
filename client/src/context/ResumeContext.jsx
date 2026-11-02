import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { atsEngine } from '../services/atsEngine';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { profile } = useProfile();
  const [resumes, setResumes] = useState(() => storageService.getResumes());
  const [activeResume, setActiveResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync with backend on mount and auth state change
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      apiService
        .getResumes()
        .then((res) => {
          if (res?.resumes) {
            setResumes(res.resumes);
            storageService.saveResumes(res.resumes);
            if (res.resumes.length > 0 && !activeResume) {
              setActiveResume(res.resumes[0]);
            }
          }
        })
        .catch(() => {
          setResumes(storageService.getResumes());
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResumes([]);
      setActiveResume(null);
    }
  }, [isAuthenticated, user?.id]);

  const saveResume = async (resumeData) => {
    const atsResult = atsEngine.analyzeResume(resumeData);
    const resumeWithScore = {
      ...resumeData,
      atsScore: atsResult?.score || 0,
      updatedAt: new Date().toISOString(),
    };

    // Save locally first for optimistic UI response
    const savedLocal = storageService.saveResume(resumeWithScore);
    setResumes(storageService.getResumes());
    if (activeResume && (activeResume.id === savedLocal.id || activeResume._id === savedLocal.id)) {
      setActiveResume(savedLocal);
    }

    // Persist to MongoDB backend
    try {
      const res = await apiService.saveResume(resumeWithScore);
      if (res?.resume) {
        const persisted = res.resume;
        storageService.saveResume(persisted);
        setResumes(storageService.getResumes());
        if (activeResume && (activeResume.id === savedLocal.id || activeResume.id === persisted.id)) {
          setActiveResume(persisted);
        }
        return persisted;
      }
    } catch (e) {
      console.error('[Resume Save Error]:', e);
    }
    return savedLocal;
  };

  const deleteResume = async (id) => {
    storageService.deleteResume(id);
    const updated = storageService.getResumes();
    setResumes(updated);
    if (activeResume && (activeResume.id === id || activeResume._id === id)) {
      setActiveResume(updated.length > 0 ? updated[0] : null);
    }
    try {
      await apiService.deleteResume(id);
    } catch (e) {
      console.error('[Resume Delete Error]:', e);
    }
  };

  const duplicateResume = async (id) => {
    try {
      const res = await apiService.duplicateResume(id);
      if (res?.resume) {
        storageService.saveResume(res.resume);
        setResumes(storageService.getResumes());
        return res.resume;
      }
    } catch {
      // fallback to local duplication
    }
    const copy = storageService.duplicateResume(id);
    setResumes(storageService.getResumes());
    return copy;
  };

  const createNewResume = (initialData = null) => {
    const prof = profile || storageService.getProfile();
    const newResume = {
      title: initialData?.title || `${user?.name || 'My'} ATS Resume`,
      template: initialData?.template || 'classic-ats',
      targetRole: initialData?.targetRole || prof?.careerInfo?.targetRole || 'Software Developer',
      personalInfo: {
        fullName: initialData?.personalInfo?.fullName || prof?.personalInfo?.fullName || user?.name || '',
        title: initialData?.personalInfo?.title || prof?.personalInfo?.title || 'Software Developer',
        email: initialData?.personalInfo?.email || prof?.personalInfo?.email || user?.email || '',
        phone: initialData?.personalInfo?.phone || prof?.personalInfo?.phone || '',
        location: initialData?.personalInfo?.location || prof?.personalInfo?.location || '',
        linkedin: initialData?.personalInfo?.linkedin || prof?.personalInfo?.linkedin || '',
        github: initialData?.personalInfo?.github || prof?.personalInfo?.github || '',
        website: initialData?.personalInfo?.website || prof?.personalInfo?.website || '',
      },
      summary: initialData?.summary || prof?.careerInfo?.summary || '',
      education: [...(initialData?.education || prof?.education || [])],
      experience: [...(initialData?.experience || prof?.experience || [])],
      skills: { ...(initialData?.skills || prof?.skills || {}) },
      projects: [...(initialData?.projects || prof?.projects || [])],
      certifications: [...(initialData?.certifications || prof?.certifications || [])],
      achievements: [...(initialData?.achievements || prof?.achievements || [])],
      languages: [...(initialData?.languages || prof?.languages || [])],
      interests: [...(initialData?.interests || prof?.interests || [])],
      atsScore: 0,
      status: 'Draft',
    };
    return saveResume(newResume);
  };

  const deleteAllResumes = () => {
    const currentResumes = [...resumes];
    storageService.deleteAllResumes();
    setResumes([]);
    setActiveResume(null);
    currentResumes.forEach((r) => {
      const id = r._id || r.id;
      if (id) apiService.deleteResume(id).catch(() => {});
    });
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        activeResume,
        setActiveResume,
        saveResume,
        deleteResume,
        duplicateResume,
        createNewResume,
        deleteAllResumes,
        loading,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
