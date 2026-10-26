import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Search,
  Check,
  CheckSquare,
  Square,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Table,
  ListTodo,
  Rocket,
  Award,
  BookOpen,
  Zap,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProfile } from '../context/ProfileContext';
import { CAREER_ROLES, getRoleById } from '../data/careerRolesData';
import { storageService } from '../services/storageService';
import { runComprehensiveSkillGapAnalysis } from '../services/skillGapEngine';
import Button from '../components/common/Button';
import { LoadingSpinner } from '../components/common/Card';
import { useToast } from '../components/common/Toast';

export const SkillGapAnalysisPage = () => {
  const { profile } = useProfile();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Target Role
  const initialRoleId = searchParams.get('role') || 'mern-developer';
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoleId);

  // Resume / Profile Selector
  const [selectedResumeId, setSelectedResumeId] = useState('active-profile');
  const [availableResumes, setAvailableResumes] = useState([]);

  // Active Main View Tab: 'matrix' (Skill Comparison Matrix) | 'roadmap' (4-Phase Roadmap & Courses) | 'projects' (Targeted Projects)
  const [activeTab, setActiveTab] = useState('matrix');

  // Persistent Progress Tracking
  const [completedTaskIds, setCompletedTaskIds] = useState(() => storageService.getCompletedTasks(initialRoleId));
  const [skillStatusMap, setSkillStatusMap] = useState(() => storageService.getSkillProgress(initialRoleId));
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState(() => storageService.getLastAnalyzed(initialRoleId));

  // Table Filters & Search
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('gaps'); // 'gaps' | 'high' | 'matched' | 'all'
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'gap' | 'alpha'
  const [expandedRows, setExpandedRows] = useState({});

  // Expanded Project Plan index
  const [expandedProjects, setExpandedProjects] = useState({});

  // Loading & Analysis State
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Sync role from query param
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && roleParam !== selectedRoleId) {
      setSelectedRoleId(roleParam);
      setCompletedTaskIds(storageService.getCompletedTasks(roleParam));
      setSkillStatusMap(storageService.getSkillProgress(roleParam));
      setLastAnalyzedTime(storageService.getLastAnalyzed(roleParam));
    }
  }, [searchParams]);

  // Load available resumes from storage
  useEffect(() => {
    const resumes = storageService.getResumes();
    setAvailableResumes(resumes || []);
  }, []);

  // Run or recompute analysis
  const executeAnalysis = (roleId, activeProfile = profile) => {
    setLoading(true);
    try {
      const savedTasks = storageService.getCompletedTasks(roleId);
      const savedSkillProgress = storageService.getSkillProgress(roleId);
      const result = runComprehensiveSkillGapAnalysis(roleId, activeProfile, savedTasks, savedSkillProgress);
      setAnalysisData(result);
      setCompletedTaskIds(savedTasks);
      setSkillStatusMap(savedSkillProgress);

      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      storageService.setLastAnalyzed(roleId, timestamp);
      setLastAnalyzedTime(timestamp);
    } catch (err) {
      console.error('[Skill Gap Analysis Error]:', err);
      addToast('Error computing skill gap diagnostics.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeAnalysis(selectedRoleId);
  }, [selectedRoleId, profile]);

  // Handle role switch
  const handleRoleChange = (newRoleId) => {
    setSelectedRoleId(newRoleId);
    setSearchParams({ role: newRoleId });
    setCompletedTaskIds(storageService.getCompletedTasks(newRoleId));
    setSkillStatusMap(storageService.getSkillProgress(newRoleId));
    setLastAnalyzedTime(storageService.getLastAnalyzed(newRoleId));
    addToast(`Target career set to ${getRoleById(newRoleId)?.title || newRoleId}`, 'info');
  };

  // Handle manual Re-Analyze click
  const handleReanalyze = () => {
    executeAnalysis(selectedRoleId);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });
    addToast('Skill Gap Analysis refreshed with current profile evidence.', 'success');
  };

  // Toggle table row expansion
  const toggleRowExpand = (skillName) => {
    setExpandedRows(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  // Toggle project plan expansion
  const toggleProjectPlan = (projId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projId]: !prev[projId]
    }));
  };

  // Update skill status ('none' | 'learning' | 'completed')
  const handleSetSkillStatus = (skillName, newStatus) => {
    const updated = storageService.setSkillStatus(selectedRoleId, skillName, newStatus);
    setSkillStatusMap(updated);

    const savedTasks = storageService.getCompletedTasks(selectedRoleId);
    const result = runComprehensiveSkillGapAnalysis(selectedRoleId, profile, savedTasks, updated);
    setAnalysisData(result);

    if (newStatus === 'completed') {
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
      addToast(`Marked ${skillName} as Completed. Coverage updated!`, 'success');
    } else if (newStatus === 'learning') {
      addToast(`Marked ${skillName} as In-Progress (Learning).`, 'info');
    } else {
      addToast(`Reset ${skillName} tracking status.`, 'info');
    }
  };

  // Toggle roadmap task completion
  const handleToggleRoadmapTask = (taskId, taskTitle) => {
    const updatedTaskIds = storageService.toggleCompletedTask(selectedRoleId, taskId);
    setCompletedTaskIds(updatedTaskIds);

    const savedSkillProgress = storageService.getSkillProgress(selectedRoleId);
    const result = runComprehensiveSkillGapAnalysis(selectedRoleId, profile, updatedTaskIds, savedSkillProgress);
    setAnalysisData(result);

    const isNowDone = updatedTaskIds.includes(taskId);
    if (isNowDone) {
      addToast(`Roadmap task completed: ${taskTitle}`, 'success');
    } else {
      addToast(`Roadmap task reopened: ${taskTitle}`, 'info');
    }
  };

  // Filtered & Sorted Comparison Rows
  const filteredComparisonRows = useMemo(() => {
    if (!analysisData?.comparisonRows) return [];
    let rows = [...analysisData.comparisonRows];

    // Quick Status Pill Filter
    if (statusFilter === 'gaps') {
      rows = rows.filter(r => r.gap !== 'None' && r.status !== 'completed');
    } else if (statusFilter === 'high') {
      rows = rows.filter(r => r.priority === 'High' && r.gap !== 'None' && r.status !== 'completed');
    } else if (statusFilter === 'matched') {
      rows = rows.filter(r => r.gap === 'None' || r.status === 'completed');
    }

    // Text search
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      rows = rows.filter(r =>
        r.skill.toLowerCase().includes(q) ||
        (r.category && r.category.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'priority') {
      const pOrder = { High: 3, Medium: 2, Low: 1 };
      rows.sort((a, b) => (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0));
    } else if (sortBy === 'gap') {
      const gOrder = { Significant: 4, Moderate: 3, Minor: 2, None: 1 };
      rows.sort((a, b) => (gOrder[b.gap] || 0) - (gOrder[a.gap] || 0));
    } else if (sortBy === 'alpha') {
      rows.sort((a, b) => a.skill.localeCompare(b.skill));
    }

    return rows;
  }, [analysisData, statusFilter, tableSearch, sortBy]);

  const currentRole = getRoleById(selectedRoleId);
  const metrics = analysisData?.metrics || { matched: 0, toImprove: 0, missing: 0, coveragePercent: 0, totalSkills: 0 };
  const nextAction = analysisData?.nextRecommendedAction;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', margin: '0 auto' }}>

      {/* 1. PAGE HEADER */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '1.15rem 1.35rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Title row & Back link */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-dark-blue)',
              margin: '0 0 0.2rem 0',
              lineHeight: 1.2
            }}>
              Skill Gap Analysis
            </h1>
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.4
            }}>
              Identify the skills you need to improve to reach your target career.
            </p>
          </div>

          <Link to="/career-recommendation" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm" icon={ArrowLeft} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              Back to Career Recommendations
            </Button>
          </Link>
        </div>

        {/* Dropdowns Row: Target Role, Profile/Resume, Analyze Button, Last Analyzed */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Target Career Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '1 1 240px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Target Career:
            </span>
            <select
              value={selectedRoleId}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.6rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-dark-blue)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              {CAREER_ROLES.map(role => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.domain})
                </option>
              ))}
            </select>
          </div>

          {/* Profile / Resume Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '1 1 220px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Candidate:
            </span>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.6rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <option value="active-profile">
                {profile?.personalInfo?.fullName || 'B. Gopinath'} (Active Profile)
              </option>
              {availableResumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.targetRole || 'Resume'})
                </option>
              ))}
            </select>
          </div>

          {/* Analyze Skills Button */}
          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            onClick={handleReanalyze}
            disabled={loading}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
          >
            {loading ? 'Analyzing...' : 'Analyze Skills'}
          </Button>

          {/* Last Analyzed Date */}
          {lastAnalyzedTime && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginLeft: 'auto'
            }}>
              <Clock size={12} />
              <span>Last analyzed: {lastAnalyzedTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. OVERALL SKILL SUMMARY (4 COMPACT METRICS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem'
      }}>
        {/* Metric 1: Skills Matched */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Skills Matched
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#16A34A', display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
            {metrics.matched}
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              of {metrics.totalSkills} skills
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#16A34A', marginTop: '0.15rem', fontWeight: 600 }}>
            ✓ Verified in profile
          </div>
        </div>

        {/* Metric 2: Skills to Improve */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Skills to Improve
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
            {metrics.toImprove}
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              needing depth
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--color-primary)', marginTop: '0.15rem', fontWeight: 600 }}>
            Partial exposure detected
          </div>
        </div>

        {/* Metric 3: Missing Skills */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Missing Skills
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#D97706', display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.15rem' }}>
            {metrics.missing}
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              not detected
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#B45309', marginTop: '0.15rem', fontWeight: 600 }}>
            Core & supporting gaps
          </div>
        </div>

        {/* Metric 4: Overall Skill Coverage */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Overall Skill Coverage
            </span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
              {metrics.coveragePercent}%
            </span>
          </div>
          <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', margin: '0.4rem 0' }}>
            <div style={{
              height: '100%',
              width: `${metrics.coveragePercent}%`,
              background: metrics.coveragePercent >= 75 ? '#16A34A' : 'var(--color-primary)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
            Technical coverage only. Does not guarantee hiring probability.
          </div>
        </div>
      </div>

      {/* 3. FOCUSED NAVIGATION TABS */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        padding: '0.35rem 0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button
          onClick={() => setActiveTab('matrix')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'matrix' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'matrix' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Table size={14} />
          Skill Comparison & Gaps
          <span style={{
            fontSize: '0.6875rem',
            padding: '0.1rem 0.4rem',
            borderRadius: '9999px',
            background: activeTab === 'matrix' ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'matrix' ? '#FFFFFF' : 'var(--color-dark-blue)'
          }}>
            {metrics.totalSkills}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'roadmap' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'roadmap' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ListTodo size={14} />
          4-Phase Learning Roadmap & Courses
          <span style={{
            fontSize: '0.6875rem',
            padding: '0.1rem 0.4rem',
            borderRadius: '9999px',
            background: activeTab === 'roadmap' ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'roadmap' ? '#FFFFFF' : 'var(--color-dark-blue)'
          }}>
            {analysisData?.roadmapPercent || 0}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'projects' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'projects' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Rocket size={14} />
          Recommended Projects
          <span style={{
            fontSize: '0.6875rem',
            padding: '0.1rem 0.4rem',
            borderRadius: '9999px',
            background: activeTab === 'projects' ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'projects' ? '#FFFFFF' : 'var(--color-dark-blue)'
          }}>
            {analysisData?.recommendedProjects?.length || 2}
          </span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}

      {/* TAB 1: SKILL COMPARISON MATRIX & GAPS */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          {/* Slim Priority Action Callout Banner (Only when gaps exist) */}
          {nextAction && metrics.toImprove + metrics.missing > 0 && (
            <div style={{
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: '#0369A1' }}>
                <Zap size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Immediate Action:</strong> Focus on <strong>{nextAction.skill}</strong> ({nextAction.hours || '15h'} prep) to increase coverage for {currentRole?.title}.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {nextAction.resource?.url && (
                  <a
                    href={nextAction.resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    Start Tutorial <ExternalLink size={10} />
                  </a>
                )}
                <button
                  onClick={() => handleSetSkillStatus(nextAction.skill, 'completed')}
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-primary)',
                    background: '#FFFFFF',
                    color: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Mark {nextAction.skill} Done
                </button>
              </div>
            </div>
          )}

          {/* Comparison Table Container */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Filter Pills, Search & Sort */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setStatusFilter('gaps')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${statusFilter === 'gaps' ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    background: statusFilter === 'gaps' ? 'var(--primary-50)' : 'transparent',
                    color: statusFilter === 'gaps' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Gaps Only ({metrics.toImprove + metrics.missing})
                </button>

                <button
                  onClick={() => setStatusFilter('high')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${statusFilter === 'high' ? '#DC2626' : 'var(--border-color)'}`,
                    background: statusFilter === 'high' ? '#FEF2F2' : 'transparent',
                    color: statusFilter === 'high' ? '#DC2626' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  High Priority ({analysisData?.prioritizedMissing?.high?.length || 0})
                </button>

                <button
                  onClick={() => setStatusFilter('matched')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${statusFilter === 'matched' ? '#16A34A' : 'var(--border-color)'}`,
                    background: statusFilter === 'matched' ? '#F0FDF4' : 'transparent',
                    color: statusFilter === 'matched' ? '#16A34A' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Matched ({metrics.matched})
                </button>

                <button
                  onClick={() => setStatusFilter('all')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${statusFilter === 'all' ? 'var(--color-dark-blue)' : 'var(--border-color)'}`,
                    background: statusFilter === 'all' ? '#F1F5F9' : 'transparent',
                    color: statusFilter === 'all' ? 'var(--color-dark-blue)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  All Skills ({metrics.totalSkills})
                </button>
              </div>

              {/* Search & Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{ position: 'relative', width: '180px' }}>
                  <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search skill..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.5rem 0.35rem 1.6rem',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      outline: 'none'
                    }}
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: '#FFFFFF',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="priority">Sort: Priority</option>
                  <option value="gap">Sort: Gap Severity</option>
                  <option value="alpha">Sort: Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Skill & Category</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Your Level</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Required</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Skill Gap</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Priority</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-dark-blue)' }}>Action / Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComparisonRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No skills match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredComparisonRows.map((row) => {
                      const isExpanded = Boolean(expandedRows[row.skill]);
                      const isCompleted = row.status === 'completed';
                      const isLearning = row.status === 'learning';

                      return (
                        <React.Fragment key={row.skill}>
                          <tr
                            onClick={() => toggleRowExpand(row.skill)}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              background: isExpanded ? '#F8FAFC' : isCompleted ? '#F0FDF4' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            {/* Skill & Category */}
                            <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-dark-blue)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                {isCompleted ? (
                                  <CheckCircle2 size={14} color="#16A34A" />
                                ) : isLearning ? (
                                  <Clock size={14} color="var(--color-primary)" />
                                ) : (
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
                                )}
                                <div>
                                  <span style={{ fontWeight: 700 }}>{row.skill}</span>
                                  {row.category && (
                                    <span style={{
                                      marginLeft: '0.4rem',
                                      fontSize: '0.6875rem',
                                      color: 'var(--text-muted)',
                                      background: 'var(--bg-surface-subtle)',
                                      padding: '0.1rem 0.35rem',
                                      borderRadius: '3px',
                                      border: '1px solid var(--border-color)'
                                    }}>
                                      {row.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Your Level */}
                            <td style={{ padding: '0.65rem 0.85rem', color: row.yourLevel === 'Not detected in profile' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                              {row.yourLevel}
                            </td>

                            {/* Required Level */}
                            <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                              {row.requiredLevel}
                            </td>

                            {/* Gap */}
                            <td style={{ padding: '0.65rem 0.85rem' }}>
                              <span style={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                background: row.gap === 'None' ? '#DCFCE7' : row.gap === 'Minor' ? '#E0F2FE' : row.gap === 'Moderate' ? '#FEF3C7' : '#FEE2E2',
                                color: row.gap === 'None' ? '#15803D' : row.gap === 'Minor' ? '#0369A1' : row.gap === 'Moderate' ? '#B45309' : '#B91C1C'
                              }}>
                                {row.gap === 'None' ? 'Matched' : `${row.gap} Gap`}
                              </span>
                            </td>

                            {/* Priority */}
                            <td style={{ padding: '0.65rem 0.85rem' }}>
                              <span style={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                color: row.priority === 'High' ? '#DC2626' : row.priority === 'Medium' ? '#D97706' : 'var(--text-secondary)'
                              }}>
                                {row.priority}
                              </span>
                            </td>

                            {/* Action / Details */}
                            <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                                {row.resource && (
                                  <a
                                    href={row.resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      fontSize: '0.6875rem',
                                      color: 'var(--color-primary)',
                                      textDecoration: 'none',
                                      fontWeight: 600,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.15rem'
                                    }}
                                  >
                                    Resource <ExternalLink size={10} />
                                  </a>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetSkillStatus(row.skill, isCompleted ? 'none' : 'completed');
                                  }}
                                  style={{
                                    fontSize: '0.6875rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    border: `1px solid ${isCompleted ? '#16A34A' : 'var(--color-primary)'}`,
                                    background: isCompleted ? '#16A34A' : '#FFFFFF',
                                    color: isCompleted ? '#FFFFFF' : 'var(--color-primary)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isCompleted ? 'Done' : 'Mark Done'}
                                </button>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  fontSize: '0.6875rem',
                                  color: 'var(--text-muted)'
                                }}>
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                              <td colSpan={6} style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    <strong style={{ color: 'var(--color-dark-blue)' }}>Role Requirement Rationale:</strong> {row.whyItMatters}
                                  </div>

                                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                                      <span><strong>Target Proficiency:</strong> {row.targetProficiency}</span>
                                      <span><strong>Est. Prep Time:</strong> {row.estimatedHours}</span>
                                      {row.resource && (
                                        <a
                                          href={row.resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {row.resource.title} <ExternalLink size={10} />
                                        </a>
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSetSkillStatus(row.skill, isLearning ? 'none' : 'learning');
                                        }}
                                        style={{
                                          fontSize: '0.6875rem',
                                          fontWeight: 600,
                                          padding: '0.2rem 0.5rem',
                                          borderRadius: '4px',
                                          border: '1px solid var(--border-color)',
                                          background: isLearning ? 'var(--primary-100)' : '#FFFFFF',
                                          color: 'var(--color-primary)',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {isLearning ? 'Learning' : 'Mark as Learning'}
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSetSkillStatus(row.skill, isCompleted ? 'none' : 'completed');
                                        }}
                                        style={{
                                          fontSize: '0.6875rem',
                                          fontWeight: 700,
                                          padding: '0.2rem 0.5rem',
                                          borderRadius: '4px',
                                          border: '1px solid #16A34A',
                                          background: isCompleted ? '#16A34A' : '#FFFFFF',
                                          color: isCompleted ? '#FFFFFF' : '#16A34A',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {isCompleted ? '✓ Completed' : 'Mark Completed'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: 4-PHASE SEQUENTIAL ROADMAP & COURSES */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Roadmap Header & Progress */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
                  4-Phase Actionable Learning Roadmap for {currentRole?.title}
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Complete milestone tasks sequentially to close your identified skill gaps.
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                {analysisData?.completedTasksCount || 0} / {analysisData?.totalTasksCount || 0} Tasks Completed ({analysisData?.roadmapPercent || 0}%)
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${analysisData?.roadmapPercent || 0}%`,
                background: '#16A34A',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* 4 Phases List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.35rem' }}>
              {(analysisData?.roadmapPhases || []).map((phase) => (
                <div
                  key={phase.phaseNumber}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-color)',
                    borderLeft: `4px solid ${phase.phaseNumber === 1 ? '#16A34A' : phase.phaseNumber === 2 ? 'var(--color-primary)' : phase.phaseNumber === 3 ? '#D97706' : '#64748B'}`,
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
                      {phase.name}
                    </h3>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {phase.duration}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {phase.subtitle}
                  </div>

                  {/* Task Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {phase.tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleRoadmapTask(task.id, task.title)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.4rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          background: task.completed ? 'rgba(22, 163, 74, 0.05)' : '#FFFFFF',
                          border: `1px solid ${task.completed ? '#BBF7D0' : 'var(--border-color)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        {task.completed ? (
                          <CheckSquare size={14} color="#16A34A" style={{ flexShrink: 0 }} />
                        ) : (
                          <Square size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        )}
                        <span style={{
                          flex: 1,
                          fontSize: '0.75rem',
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: task.completed ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          ~{task.estimatedHours}h
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Deliverable info */}
                  {phase.deliverable && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.4rem 0.6rem',
                      background: '#FFFFFF',
                      borderRadius: '4px',
                      border: '1px dashed var(--color-primary)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-dark-blue)'
                    }}>
                      <strong>Milestone Deliverable:</strong> {phase.deliverable}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Curated Courses & Certifications Section */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem 1.25rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {/* Recommended Courses */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <BookOpen size={15} color="var(--color-primary)" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
                  Recommended Courses & Tutorials
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {(analysisData?.coursesRecommended || []).map((crs, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.55rem 0.7rem',
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                        {crs.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {crs.provider} • {crs.duration || 'Self-paced'}
                      </div>
                    </div>
                    {crs.url && (
                      <a
                        href={crs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.6875rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}
                      >
                        Visit <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recognized Certifications */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Award size={15} color="#16A34A" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
                  Industry Certifications for {currentRole?.title}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {(analysisData?.certificationsRecommended || []).map((cert, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.55rem 0.7rem',
                      background: '#F0FDF4',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #BBF7D0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <CheckCircle2 size={13} color="#16A34A" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: RECOMMENDED PROJECTS */}
      {activeTab === 'projects' && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
              Role-Specific Project Deliverables
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Hands-on projects designed to demonstrate your missing and in-demand skills for {currentRole?.title}.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(analysisData?.recommendedProjects || []).map((proj) => {
              const isPlanExpanded = Boolean(expandedProjects[proj.id]);

              return (
                <div
                  key={proj.id}
                  style={{
                    padding: '0.95rem 1rem',
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          background: 'var(--primary-100)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          {proj.difficulty}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          {proj.duration}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-dark-blue)', margin: 0 }}>
                        {proj.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleProjectPlan(proj.id)}
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.55rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        background: '#FFFFFF',
                        color: 'var(--color-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {isPlanExpanded ? 'Hide Deliverable Plan' : 'View Deliverable Plan'}
                    </button>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Skills Demonstrated:
                    </span>
                    {proj.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.6875rem',
                          padding: '0.1rem 0.35rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--color-dark-blue)',
                          fontWeight: 600
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Project Plan */}
                  {isPlanExpanded && (
                    <div style={{
                      marginTop: '0.45rem',
                      padding: '0.75rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                        Step-by-Step Deliverable Plan:
                      </div>
                      <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {proj.plan.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default SkillGapAnalysisPage;
