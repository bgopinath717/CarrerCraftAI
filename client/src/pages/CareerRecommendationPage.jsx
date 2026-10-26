import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Briefcase,
  DollarSign,
  Zap,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Scale,
  Search,
  Filter,
  RefreshCw,
  CheckSquare,
  Square,
  Globe,
  Award,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  BarChart3,
  GraduationCap,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProfile } from '../context/ProfileContext';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';
import Button from '../components/common/Button';
import { Card, LoadingSpinner } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

const REGIONS = [
  { code: 'IN', label: 'India (₹ INR)', flag: '🇮🇳' },
  { code: 'US', label: 'United States ($ USD)', flag: '🇺🇸' },
  { code: 'UK', label: 'United Kingdom (£ GBP)', flag: '🇬🇧' },
  { code: 'EU', label: 'European Union (€ EUR)', flag: '🇪🇺' },
  { code: 'REMOTE', label: 'Global Remote ($ USD)', flag: '🌐' }
];

export const CareerRecommendationPage = () => {
  const { profile } = useProfile();
  const { addToast } = useToast();

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [profileQuality, setProfileQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'roadmap' | 'compare'

  // Saved roles & Comparison set
  const [savedRoleIds, setSavedRoleIds] = useState(() => storageService.getSavedRoles());
  const [compareRoleIds, setCompareRoleIds] = useState([]);

  // Filters
  const [selectedRegion, setSelectedRegion] = useState(() => storageService.getRegionPreference() || 'IN');
  const [domainFilter, setDomainFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All'); // 'All' | 'Remote' | 'On-site / Hybrid'
  const [salaryFilter, setSalaryFilter] = useState('All'); // 'All' | '6' | '10' | '15' | '20'
  const [savedOnly, setSavedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Roadmap task state for selected role
  const [roadmapProgress, setRoadmapProgress] = useState(null);
  const [recalculating, setRecalculating] = useState(false);

  // Active filters count for reset check
  const hasActiveFilters = Boolean(
    domainFilter !== 'All' ||
    experienceFilter !== 'All' ||
    workModeFilter !== 'All' ||
    salaryFilter !== 'All' ||
    savedOnly ||
    searchQuery.trim()
  );

  // Fetch / Calculate recommendations
  const fetchRecommendations = async (customCompletedTasks = null) => {
    setLoading(true);
    try {
      const options = {
        region: selectedRegion,
        domainFilter,
        experienceFilter,
        workMode: workModeFilter,
        salaryRange: salaryFilter,
        remoteOnly: workModeFilter === 'Remote',
        savedOnly,
        searchQuery,
        savedRoleIds
      };

      // If user checked off roadmap skills, merge them into active profile skills for dynamic recalculation
      let activeProfile = profile;
      if (customCompletedTasks && customCompletedTasks.length > 0) {
        const addedSkills = customCompletedTasks.map(t => t.skill).filter(Boolean);
        activeProfile = {
          ...profile,
          skills: {
            ...profile?.skills,
            technical: Array.from(new Set([...(profile?.skills?.technical || []), ...addedSkills]))
          }
        };
      }

      const res = await aiService.getCareerRecommendations(activeProfile, options);
      const recs = res.recommendations || [];
      const allRecs = res.allRecommendations || recs;

      setRecommendations(recs);
      setAllRecommendations(allRecs);
      setProfileQuality(res.profileQuality || null);

      // Keep current selection or default to top role
      if (recs.length > 0) {
        const currentStillExists = selectedRole ? recs.find(r => r.id === selectedRole.id) : null;
        setSelectedRole(currentStillExists || recs[0]);
      } else {
        setSelectedRole(null);
      }
    } catch (err) {
      console.error('[Career Recs Error]:', err);
      addToast('Error generating recommendations. Loaded fallback roles.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profile, selectedRegion, domainFilter, experienceFilter, workModeFilter, salaryFilter, savedOnly, searchQuery]);

  // Load Roadmap when selected role changes
  useEffect(() => {
    if (!selectedRole) return;
    const completedTaskIds = storageService.getCompletedTasks(selectedRole.id);
    aiService.analyzeSkillGap(selectedRole.id, profile, completedTaskIds).then(roadmap => {
      setRoadmapProgress(roadmap);
    });
  }, [selectedRole, profile]);

  // Handle region switch
  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    storageService.setRegionPreference(newRegion);
    addToast(`Updated salary benchmark region to ${newRegion}`, 'info');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setDomainFilter('All');
    setExperienceFilter('All');
    setWorkModeFilter('All');
    setSalaryFilter('All');
    setSavedOnly(false);
    setSearchQuery('');
  };

  // Bookmark / Save Role
  const handleToggleSaveRole = (e, roleId) => {
    if (e) e.stopPropagation();
    const updated = storageService.toggleSavedRole(roleId);
    setSavedRoleIds(updated);
    const isSaved = updated.includes(roleId);
    addToast(isSaved ? 'Role bookmarked in your saved list' : 'Role removed from saved list', 'success');

    setRecommendations(prev => prev.map(r => r.id === roleId ? { ...r, isSaved } : r));
    setAllRecommendations(prev => prev.map(r => r.id === roleId ? { ...r, isSaved } : r));
    if (selectedRole?.id === roleId) {
      setSelectedRole(prev => ({ ...prev, isSaved }));
    }
  };

  // Toggle role in comparison set (up to 3)
  const handleToggleCompare = (e, roleId) => {
    if (e) e.stopPropagation();
    if (compareRoleIds.includes(roleId)) {
      setCompareRoleIds(prev => prev.filter(id => id !== roleId));
      addToast('Removed role from comparison', 'info');
    } else {
      if (compareRoleIds.length >= 3) {
        addToast('You can compare a maximum of 3 career roles at a time.', 'warning');
        return;
      }
      setCompareRoleIds(prev => [...prev, roleId]);
      addToast('Added role to comparison set', 'success');
    }
  };

  // Toggle roadmap task completion
  const handleToggleTask = (taskId, taskTitle) => {
    if (!selectedRole) return;
    const updatedTaskIds = storageService.toggleCompletedTask(selectedRole.id, taskId);

    setRoadmapProgress(prev => {
      if (!prev) return null;
      const updatedMilestones = prev.milestones.map(ms => ({
        ...ms,
        tasks: ms.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      }));

      const total = prev.totalTasks;
      const completed = updatedTaskIds.length;
      return {
        ...prev,
        milestones: updatedMilestones,
        completedTasks: completed,
        progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    const isNowDone = updatedTaskIds.includes(taskId);
    addToast(isNowDone ? `Milestone checked: ${taskTitle}` : `Task reopened: ${taskTitle}`, isNowDone ? 'success' : 'info');
  };

  // Recalculate Career Match after completing roadmap tasks
  const handleRecalculateMatch = async () => {
    if (!selectedRole || !roadmapProgress) return;
    setRecalculating(true);

    const completedTasksList = [];
    (roadmapProgress.milestones || []).forEach(ms => {
      (ms.tasks || []).forEach(t => {
        if (t.completed) completedTasksList.push(t);
      });
    });

    try {
      await fetchRecommendations(completedTasksList);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      addToast('Career match scores dynamically recalculated with your completed milestone skills!', 'success');
    } catch {
      addToast('Failed to recalculate match score.', 'danger');
    } finally {
      setRecalculating(false);
    }
  };

  // Roles to compare
  const rolesBeingCompared = useMemo(() => {
    return allRecommendations.filter(r => compareRoleIds.includes(r.id));
  }, [allRecommendations, compareRoleIds]);

  // Derive top 3 next actionable steps for selected role
  const nextSteps = useMemo(() => {
    if (!selectedRole) return [];
    const steps = [];

    // Step 1: Missing core skill
    const topMissing = selectedRole.prioritizedMissing?.critical?.[0] || selectedRole.missingSkills?.[0];
    if (topMissing) {
      steps.push({
        num: 1,
        title: `Master ${topMissing} fundamentals`,
        desc: `This is a high-priority core prerequisite for ${selectedRole.title}. Completing it closes a major qualification gap.`
      });
    } else {
      steps.push({
        num: 1,
        title: `Deepen advanced specialization`,
        desc: `Strengthen production patterns and performance tuning in ${selectedRole.matchedSkills.slice(0, 2).join(' and ')}.`
      });
    }

    // Step 2: Milestone project
    const topSecondary = selectedRole.prioritizedMissing?.important?.[0] || selectedRole.recommendedSkills?.[0];
    steps.push({
      num: 2,
      title: `Build a portfolio project with ${topSecondary || 'modern tooling'}`,
      desc: `Add a deployed application to your portfolio proving hands-on competence with ${selectedRole.domain} workflows.`
    });

    // Step 3: Certification / Verification
    const cert = roadmapProgress?.certificationsRecommended?.[0] || `${selectedRole.domain} Professional Certification`;
    steps.push({
      num: 3,
      title: `Prepare for credential: ${cert}`,
      desc: `Validate your technical proficiency with an industry-recognized certification to rank higher with hiring teams.`
    });

    return steps;
  }, [selectedRole, roadmapProgress]);

  // Categorized skills for Section 5D: Matched, Needs Improvement, Missing
  const categorizedSkills = useMemo(() => {
    if (!selectedRole) return { matched: [], needsImprovement: [], missing: [] };

    const matched = selectedRole.matchedSkills || [];
    const missing = selectedRole.missingSkills || [];
    // Skills that need improvement: recommended/secondary skills that candidate has partial or related exposure to
    const needsImprovement = (selectedRole.recommendedSkills || []).filter(
      sk => !matched.includes(sk) && !missing.includes(sk)
    ).slice(0, 6);

    return {
      matched,
      needsImprovement: needsImprovement.length > 0 ? needsImprovement : (selectedRole.prioritizedMissing?.important || []).slice(0, 5),
      missing: missing.length > 0 ? missing : (selectedRole.prioritizedMissing?.critical || []).slice(0, 5)
    };
  }, [selectedRole]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '100%', margin: '0 auto' }}>

      {/* 2. COMPACT PROFESSIONAL PAGE HEADER */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Title and Top Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: 'var(--color-dark-blue)',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2
            }}>
              Career Recommendations
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5
            }}>
              Explore career opportunities that match your skills, projects, education, and experience.
            </p>
          </div>

          {/* Market Region & Compare Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-surface-subtle)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <Globe size={14} color="var(--primary-600)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Market:</span>
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-dark-blue)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {REGIONS.map(reg => (
                  <option key={reg.code} value={reg.code}>
                    {reg.flag} {reg.label}
                  </option>
                ))}
              </select>
            </div>

            {compareRoleIds.length > 0 && (
              <Button
                variant="outline"
                icon={Scale}
                onClick={() => setActiveTab('compare')}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  background: activeTab === 'compare' ? 'var(--primary-100)' : 'var(--primary-50)',
                  borderColor: 'var(--primary-300)',
                  color: 'var(--color-primary)'
                }}
              >
                Compare ({compareRoleIds.length}/3)
              </Button>
            )}
          </div>
        </div>

        {/* Compact Filters & Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.65rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Search field */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search job roles or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                background: '#FFFFFF',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Domain Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{
                padding: '0.42rem 0.6rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Domains</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Quality Assurance">Quality Assurance</option>
            </select>
          </div>

          {/* Experience Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Level:</span>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              style={{
                padding: '0.42rem 0.6rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Levels</option>
              <option value="Entry">Entry-Level / Junior (0-2 yrs)</option>
              <option value="Mid">Mid-Level (2-4 yrs)</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Work Mode:</span>
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              style={{
                padding: '0.42rem 0.6rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote-Friendly</option>
              <option value="On-site / Hybrid">On-site / Hybrid</option>
            </select>
          </div>

          {/* Salary Range Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Salary Range:</span>
            <select
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value)}
              style={{
                padding: '0.42rem 0.6rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Salary Ranges</option>
              <option value="6">₹6+ LPA</option>
              <option value="10">₹10+ LPA</option>
              <option value="15">₹15+ LPA</option>
              <option value="20">₹20+ LPA</option>
            </select>
          </div>

          {/* Saved Roles Toggle */}
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.42rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${savedOnly ? 'var(--color-primary)' : 'var(--border-color)'}`,
              background: savedOnly ? 'var(--primary-50)' : '#FFFFFF',
              color: savedOnly ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Bookmark size={13} fill={savedOnly ? 'var(--color-primary)' : 'none'} />
            Saved ({savedRoleIds.length})
          </button>

          {/* Reset Filters Option */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.42rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              <X size={13} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* PROFILE INCOMPLETE WARNING (if applicable) */}
      {profileQuality?.isIncomplete && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid #FCD34D',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', color: '#92400E' }}>
              <strong>Profile Incomplete ({profileQuality.completenessScore}%):</strong>{' '}
              {profileQuality.warnings[0] || 'Add more verified skills, projects, and work experience to increase recommendation accuracy.'}
            </div>
          </div>
          <Link to="/profile">
            <Button variant="outline" size="sm" style={{ borderColor: '#D97706', color: '#B45309', background: '#FFFFFF', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* 3. MAIN TWO-COLUMN LAYOUT */}
      {loading ? (
        <div style={{ height: '45vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <LoadingSpinner size="lg" message="Loading career recommendations based on your profile..." />
        </div>
      ) : recommendations.length === 0 ? (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <Filter size={36} color="var(--primary-400)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: 0 }}>
            No Matching Career Roles Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: 0 }}>
            No roles matched your current search and filter settings. Try resetting filters to explore all available career paths.
          </p>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 40%) 1fr',
          gap: '1.25rem',
          alignItems: 'flex-start'
        }}
        className="career-rec-layout"
        >

          {/* 4. LEFT COLUMN (APPROX. 40%): RANKED CAREER RECOMMENDATIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                {recommendations.length} {recommendations.length === 1 ? 'Career Path' : 'Career Paths'} Recommended
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Ranked by match fit
              </span>
            </div>

            {/* List of Roles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recommendations.map((role, idx) => {
                const isSelected = selectedRole?.id === role.id && activeTab !== 'compare';
                const isCompared = compareRoleIds.includes(role.id);
                const isSaved = savedRoleIds.includes(role.id);

                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role);
                      if (activeTab === 'compare') setActiveTab('details');
                    }}
                    style={{
                      background: isSelected ? '#F3FAFE' : '#FFFFFF',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                      borderLeft: isSelected ? '4px solid var(--color-primary)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.9rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    {/* Top Row: Rank, Domain & Match Percentage */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-dark-blue)',
                          background: isSelected ? 'var(--primary-100)' : 'var(--bg-surface-subtle)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          #{idx + 1}
                        </span>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          background: '#F1F5F9',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          {role.domain}
                        </span>
                      </div>

                      {/* Match Score Badge */}
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: role.matchPercentage >= 75 ? '#16A34A' : role.matchPercentage >= 50 ? '#0B3A5B' : '#D97706',
                        background: role.matchPercentage >= 75 ? '#F0FDF4' : '#F3FAFE',
                        border: `1px solid ${role.matchPercentage >= 75 ? '#BBF7D0' : '#BAE6FD'}`,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}>
                        {role.matchPercentage}% match
                      </span>
                    </div>

                    {/* Job Title & Experience */}
                    <div>
                      <h3 style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-dark-blue)',
                        margin: '0 0 0.15rem 0',
                        lineHeight: 1.3
                      }}>
                        {role.title}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {role.entryLevelEligible ? 'Entry-Level / Junior (0-2 yrs)' : role.experienceLevel} • {role.activeSalary.formatted}
                      </div>
                    </div>

                    {/* Required Skill Summary */}
                    <div style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      background: 'rgba(241, 245, 249, 0.6)',
                      padding: '0.3rem 0.45rem',
                      borderRadius: '4px'
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Key Skills:</strong>{' '}
                      {role.requiredSkills.slice(0, 4).join(', ')}
                      {role.requiredSkills.length > 4 ? ` +${role.requiredSkills.length - 4} more` : ''}
                    </div>

                    {/* Bottom Actions: Compare Checkbox, Save Bookmark, View Details */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.45rem',
                      marginTop: '0.15rem'
                    }}>
                      {/* Compare Checkbox */}
                      <label
                        onClick={(e) => handleToggleCompare(e, role.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: isCompared ? 'var(--color-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {isCompared ? (
                          <CheckSquare size={13} color="var(--color-primary)" />
                        ) : (
                          <Square size={13} color="var(--text-muted)" />
                        )}
                        <span>Compare</span>
                      </label>

                      {/* Right actions: Save Bookmark & View Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <button
                          onClick={(e) => handleToggleSaveRole(e, role.id)}
                          title={isSaved ? "Saved" : "Save role"}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSaved ? 'var(--color-primary)' : 'var(--text-muted)',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {isSaved ? <BookmarkCheck size={14} fill="var(--color-primary)" /> : <Bookmark size={14} />}
                        </button>

                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.15rem'
                          }}
                        >
                          View Details <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. RIGHT COLUMN (APPROX. 60%): SELECTED CAREER DETAILS */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '600px'
          }}>

            {/* TAB NAVIGATION FOR SUB-VIEWS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setActiveTab('details')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: activeTab === 'details' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'details' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginBottom: '-0.55rem'
                  }}
                >
                  <Briefcase size={14} />
                  Role Details & Fit
                </button>

                <button
                  onClick={() => setActiveTab('roadmap')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: activeTab === 'roadmap' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'roadmap' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginBottom: '-0.55rem'
                  }}
                >
                  <BookOpen size={14} />
                  Learning Roadmap
                  {roadmapProgress && (
                    <span style={{
                      fontSize: '0.625rem',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-800)',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '9999px',
                      fontWeight: 800
                    }}>
                      {roadmapProgress.progressPercent}%
                    </span>
                  )}
                </button>

                {compareRoleIds.length > 0 && (
                  <button
                    onClick={() => setActiveTab('compare')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: activeTab === 'compare' ? 'var(--color-primary)' : 'var(--text-secondary)',
                      borderBottom: activeTab === 'compare' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginBottom: '-0.55rem'
                    }}
                  >
                    <Scale size={14} />
                    Compare ({compareRoleIds.length})
                  </button>
                )}
              </div>

              {selectedRole && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ref: {selectedRole.id}
                </span>
              )}
            </div>

            {/* TAB CONTENT: ROLE DETAILS */}
            {activeTab === 'details' && selectedRole && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* 5A. CAREER OVERVIEW */}
                <div style={{
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  {/* Top Header: Title, Domain, Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          background: 'var(--primary-50)',
                          border: '1px solid var(--primary-200)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          {selectedRole.domain}
                        </span>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          background: '#F1F5F9',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          {selectedRole.entryLevelEligible ? 'Entry-Level Friendly (0-2 yrs)' : selectedRole.experienceLevel}
                        </span>
                        {selectedRole.remoteFriendly && (
                          <span style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: '#16A34A',
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px'
                          }}>
                            Remote-Friendly
                          </span>
                        )}
                      </div>

                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--color-dark-blue)',
                        margin: 0,
                        lineHeight: 1.25
                      }}>
                        {selectedRole.title}
                      </h2>
                    </div>

                    {/* Primary Actions: Save Role, Compare, View Learning Roadmap */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Button
                        variant={savedRoleIds.includes(selectedRole.id) ? "primary" : "outline"}
                        size="sm"
                        icon={savedRoleIds.includes(selectedRole.id) ? BookmarkCheck : Bookmark}
                        onClick={(e) => handleToggleSaveRole(e, selectedRole.id)}
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                      >
                        {savedRoleIds.includes(selectedRole.id) ? 'Saved' : 'Save Role'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={Scale}
                        onClick={(e) => handleToggleCompare(e, selectedRole.id)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0.65rem',
                          borderColor: compareRoleIds.includes(selectedRole.id) ? 'var(--color-primary)' : 'var(--border-color)',
                          color: compareRoleIds.includes(selectedRole.id) ? 'var(--color-primary)' : 'var(--text-secondary)',
                          background: compareRoleIds.includes(selectedRole.id) ? 'var(--primary-50)' : '#FFFFFF'
                        }}
                      >
                        {compareRoleIds.includes(selectedRole.id) ? 'In Compare' : 'Compare'}
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={BookOpen}
                        onClick={() => setActiveTab('roadmap')}
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                      >
                        View Learning Roadmap
                      </Button>
                    </div>
                  </div>

                  {/* Match Percentage with Simple Progress Bar & Salary */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'var(--bg-surface-subtle)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {/* Match Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Profile Match Fit
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 800,
                          color: selectedRole.matchPercentage >= 75 ? '#16A34A' : 'var(--color-primary)'
                        }}>
                          {selectedRole.matchPercentage}%
                        </span>
                      </div>
                      <div style={{
                        height: '7px',
                        background: '#E2E8F0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${selectedRole.matchPercentage}%`,
                          background: selectedRole.matchPercentage >= 75 ? '#16A34A' : 'var(--color-primary)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        Estimated Salary Range ({selectedRegion})
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                        {selectedRole.activeSalary.formatted}
                      </div>
                    </div>

                    {/* Experience Requirement */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        Experience Requirement
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {selectedRole.experienceLevel}
                      </div>
                    </div>
                  </div>

                  {/* Short Job Description */}
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.55,
                    margin: 0
                  }}>
                    {selectedRole.description}
                  </p>
                </div>

                {/* 5B. WHY THIS ROLE MATCHES YOU */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <h3 style={{
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    color: 'var(--color-dark-blue)',
                    margin: 0
                  }}>
                    Why This Role Matches You
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {/* Matching Skills */}
                    <div style={{
                      padding: '0.75rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: '#16A34A' }}>
                        <CheckCircle2 size={15} color="#16A34A" />
                        Matching Skills ({selectedRole.matchedSkills.length})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {selectedRole.matchedSkills.length > 0 ? (
                          <>Matched: <strong>{selectedRole.matchedSkills.slice(0, 5).join(', ')}</strong>{selectedRole.matchedSkills.length > 5 ? ` and ${selectedRole.matchedSkills.length - 5} more.` : '.'}</>
                        ) : (
                          'No direct skill overlap registered in active profile.'
                        )}
                      </div>
                    </div>

                    {/* Relevant Projects */}
                    <div style={{
                      padding: '0.75rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        <Code2 size={15} color="var(--color-primary)" />
                        Relevant Projects ({selectedRole.evidence.projects.length})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {selectedRole.evidence.projects.length > 0 ? (
                          <>Verified from: <strong>{selectedRole.evidence.projects.map(p => p.name).join(', ')}</strong>.</>
                        ) : (
                          'Adding projects demonstrating role competencies will boost this score.'
                        )}
                      </div>
                    </div>

                    {/* Education & Certifications */}
                    <div style={{
                      padding: '0.75rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                        <GraduationCap size={15} color="var(--color-dark-blue)" />
                        Education & Credentials
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {selectedRole.scoreBreakdown.education.explanation}
                      </div>
                    </div>

                    {/* Relevant Experience */}
                    <div style={{
                      padding: '0.75rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                        <Briefcase size={15} color="var(--color-dark-blue)" />
                        Relevant Experience
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {selectedRole.scoreBreakdown.experience.explanation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5C. MATCH BREAKDOWN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: 'var(--color-dark-blue)',
                      margin: 0
                    }}>
                      Match Breakdown
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Total: {selectedRole.matchPercentage} / 100 pts
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {/* Pillar 1: Core & Secondary Skills */}
                    <div style={{
                      padding: '0.75rem 0.85rem',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                          Core & Secondary Skills
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {selectedRole.scoreBreakdown.skills.earned} / {selectedRole.scoreBreakdown.skills.max} pts
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                        <div style={{ height: '100%', width: `${selectedRole.scoreBreakdown.skills.percentage}%`, background: 'var(--color-primary)', borderRadius: '3px' }} />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        {selectedRole.scoreBreakdown.skills.explanation}
                      </div>
                    </div>

                    {/* Pillar 2: Experience & Seniority */}
                    <div style={{
                      padding: '0.75rem 0.85rem',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                          Experience & Seniority
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#16A34A' }}>
                          {selectedRole.scoreBreakdown.experience.earned} / {selectedRole.scoreBreakdown.experience.max} pts
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                        <div style={{ height: '100%', width: `${selectedRole.scoreBreakdown.experience.percentage}%`, background: '#16A34A', borderRadius: '3px' }} />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        {selectedRole.scoreBreakdown.experience.explanation}
                      </div>
                    </div>

                    {/* Pillar 3: Project Evidence */}
                    <div style={{
                      padding: '0.75rem 0.85rem',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                          Project Evidence
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {selectedRole.scoreBreakdown.projects.earned} / {selectedRole.scoreBreakdown.projects.max} pts
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                        <div style={{ height: '100%', width: `${selectedRole.scoreBreakdown.projects.percentage}%`, background: 'var(--color-primary)', borderRadius: '3px' }} />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        {selectedRole.scoreBreakdown.projects.explanation}
                      </div>
                    </div>

                    {/* Pillar 4: Education & Credentials */}
                    <div style={{
                      padding: '0.75rem 0.85rem',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                          Education & Credentials
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#D97706' }}>
                          {selectedRole.scoreBreakdown.education.earned} / {selectedRole.scoreBreakdown.education.max} pts
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                        <div style={{ height: '100%', width: `${selectedRole.scoreBreakdown.education.percentage}%`, background: '#D97706', borderRadius: '3px' }} />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        {selectedRole.scoreBreakdown.education.explanation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5D. REQUIRED SKILLS (GROUPED WITH SIMPLE TEXT LABELS) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    color: 'var(--color-dark-blue)',
                    margin: 0
                  }}>
                    Required Skills
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {/* Group 1: Skills You Already Have (Matched) */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Check size={13} color="#16A34A" />
                        Skills you already have (Matched)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {categorizedSkills.matched.length > 0 ? (
                          categorizedSkills.matched.map((sk, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.5rem',
                                background: '#F0FDF4',
                                color: '#16A34A',
                                border: '1px solid #BBF7D0',
                                borderRadius: '4px',
                                fontWeight: 500
                              }}
                            >
                              ✓ {sk}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None recorded in profile.</span>
                        )}
                      </div>
                    </div>

                    {/* Group 2: Skills that Need Improvement */}
                    {categorizedSkills.needsImprovement.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <TrendingUp size={13} color="var(--color-primary)" />
                          Skills that need improvement (Needs Improvement)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {categorizedSkills.needsImprovement.map((sk, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.5rem',
                                background: 'var(--primary-50)',
                                color: 'var(--color-dark-blue)',
                                border: '1px solid var(--primary-200)',
                                borderRadius: '4px',
                                fontWeight: 500
                              }}
                            >
                              • {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Group 3: Skills You Are Missing */}
                    {categorizedSkills.missing.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertCircle size={13} color="#D97706" />
                          Skills you are missing (Missing)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {categorizedSkills.missing.map((sk, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.5rem',
                                background: '#FFFBEB',
                                color: '#B45309',
                                border: '1px solid #FDE68A',
                                borderRadius: '4px',
                                fontWeight: 500
                              }}
                            >
                              + {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5E. RECOMMENDED NEXT STEPS */}
                <div style={{
                  padding: '1rem 1.15rem',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: 'var(--color-dark-blue)',
                      margin: 0
                    }}>
                      Recommended Next Steps
                    </h3>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                      3 actions to improve your suitability
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {nextSteps.map(step => (
                      <div
                        key={step.num}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          background: '#FFFFFF',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: 'var(--color-primary)',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {step.num}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                            {step.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Open Skill Gap Analysis CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Analyze comprehensive gap metrics for this role:
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link to={`/skill-gap?role=${selectedRole.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={ArrowRight}
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                        >
                          Open Skill Gap Analysis
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('roadmap')}
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#FFFFFF' }}
                      >
                        View Learning Roadmap
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: LEARNING ROADMAP (PRESERVED FULL FUNCTIONALITY) */}
            {activeTab === 'roadmap' && selectedRole && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Roadmap Header & Progress */}
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Roadmap Milestone Progress for {selectedRole.title}:
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-dark-blue)', marginTop: '0.15rem' }}>
                      {roadmapProgress?.completedTasks || 0} of {roadmapProgress?.totalTasks || 0} Tasks Completed ({roadmapProgress?.progressPercent || 0}%)
                    </div>
                    <div style={{ width: '220px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginTop: '0.35rem' }}>
                      <div style={{ height: '100%', width: `${roadmapProgress?.progressPercent || 0}%`, background: '#16A34A', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    icon={RefreshCw}
                    size="sm"
                    onClick={handleRecalculateMatch}
                    disabled={recalculating}
                    style={{ fontSize: '0.8125rem' }}
                  >
                    {recalculating ? 'Recalculating...' : 'Recalculate Career Fit'}
                  </Button>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Check off the skills and tasks you complete. CareerCraft AI will recalculate your profile match score and update your technical ranking.
                </div>

                {/* Milestone Stages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {roadmapProgress?.milestones?.map((ms, msIdx) => (
                    <div
                      key={ms.id || msIdx}
                      style={{
                        padding: '1rem',
                        background: '#FFFFFF',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        borderLeft: `4px solid ${msIdx === 0 ? '#16A34A' : msIdx === 1 ? 'var(--color-primary)' : '#D97706'}`
                      }}
                    >
                      <div style={{ marginBottom: '0.65rem' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: msIdx === 0 ? '#16A34A' : msIdx === 1 ? 'var(--color-primary)' : '#B45309',
                          background: msIdx === 0 ? '#F0FDF4' : msIdx === 1 ? 'var(--primary-50)' : '#FFFBEB',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          {ms.stage} • {ms.timeframe}
                        </span>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: '0.3rem 0 0 0' }}>
                          {ms.objective}
                        </h4>
                      </div>

                      {/* Checklist */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
                        {ms.tasks.map(task => (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id, task.title)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.45rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              background: task.completed ? 'rgba(22, 163, 74, 0.05)' : 'var(--bg-surface-subtle)',
                              border: `1px solid ${task.completed ? '#BBF7D0' : 'transparent'}`,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {task.completed ? (
                              <CheckSquare size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                            ) : (
                              <Square size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            )}
                            <span style={{
                              flex: 1,
                              fontSize: '0.8125rem',
                              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}>
                              {task.title}
                            </span>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              ~{task.estimatedHours} hrs
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Milestone Project Deliverable */}
                      {ms.projectDeliverable && (
                        <div style={{
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(33, 150, 211, 0.05)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px dashed var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          <Zap size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-dark-blue)' }}>
                            <strong>Project Deliverable:</strong> {ms.projectDeliverable}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Courses & Certifications */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {/* Curated Courses */}
                  <div style={{ padding: '0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: '0 0 0.45rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BookOpen size={14} color="var(--color-primary)" />
                      Curated Learning Courses
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {(roadmapProgress?.coursesRecommended || []).map((crs, i) => (
                        <div key={i} style={{ padding: '0.35rem 0.5rem', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{crs.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{crs.provider}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div style={{ padding: '0.85rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)', margin: '0 0 0.45rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Award size={14} color="#16A34A" />
                      Recognized Certifications
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {(roadmapProgress?.certificationsRecommended || []).map((cert, i) => (
                        <div key={i} style={{ padding: '0.35rem 0.5rem', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={13} color="#16A34A" />
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('details')}>
                    ← Back to Role Details
                  </Button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SIDE-BY-SIDE ROLE COMPARISON */}
            {activeTab === 'compare' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
                      Side-by-Side Role Comparison
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                      Compare match scores, prerequisites, and salary potential across selected paths.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCompareRoleIds([])}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Clear Comparison
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('details')}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Back to Details
                    </Button>
                  </div>
                </div>

                {rolesBeingCompared.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No roles selected for comparison. Click "Compare" on any role card in the left column.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-surface-subtle)' }}>
                          <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)', minWidth: '140px' }}>Attribute</th>
                          {rolesBeingCompared.map(r => (
                            <th key={r.id} style={{ padding: '0.65rem 0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)', minWidth: '180px' }}>
                              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-dark-blue)' }}>{r.title}</div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{r.domain}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Overall Match</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                              <span style={{
                                fontWeight: 800,
                                fontSize: '0.8125rem',
                                color: r.matchPercentage >= 75 ? '#16A34A' : 'var(--color-primary)',
                                background: r.matchPercentage >= 75 ? '#F0FDF4' : '#F3FAFE',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px'
                              }}>
                                {r.matchPercentage}% Fit
                              </span>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Skills Fit (40 pts)</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                              <div><strong>{r.scoreBreakdown.skills.earned} / 40</strong> ({r.scoreBreakdown.skills.percentage}%)</div>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Experience (25 pts)</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                              <div><strong>{r.scoreBreakdown.experience.earned} / 25</strong></div>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Project Evidence (20 pts)</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                              <div><strong>{r.scoreBreakdown.projects.earned} / 20</strong></div>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Salary ({selectedRegion})</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                              <div style={{ fontWeight: 800, color: 'var(--color-dark-blue)' }}>{r.activeSalary.formatted}</div>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Entry-Level Eligibility</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                              {r.entryLevelEligible ? (
                                <span style={{ color: '#16A34A', fontWeight: 600 }}>Yes (0-2 years)</span>
                              ) : (
                                <span style={{ color: 'var(--text-secondary)' }}>Prerequisite: {r.experienceLevel}</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Actions</td>
                          {rolesBeingCompared.map(r => (
                            <td key={r.id} style={{ padding: '0.65rem 0.75rem' }}>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button
                                  onClick={() => {
                                    setSelectedRole(r);
                                    setActiveTab('details');
                                  }}
                                  className="btn btn-primary"
                                  style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem' }}
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={(e) => handleToggleCompare(e, r.id)}
                                  className="btn btn-outline"
                                  style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem' }}
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* Global CSS for layout responsiveness */}
      <style>{`
        @media (max-width: 960px) {
          .career-rec-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};

export default CareerRecommendationPage;
