// Explainable Weighted Scoring Engine for Career Recommendations
// CareerCraft AI Competency Evaluation Architecture

import { CAREER_ROLES } from '../data/careerRolesData.js';

// Common aliases for technical skills
const SKILL_ALIASES = {
  'react.js': ['react', 'reactjs', 'react.js', 'react native'],
  'node.js': ['node', 'nodejs', 'node.js', 'node runtime'],
  'express.js': ['express', 'expressjs', 'express.js', 'express rest'],
  'mongodb': ['mongo', 'mongodb', 'mongoose', 'nosql'],
  'javascript (es6+)': ['javascript', 'js', 'es6', 'es6+', 'ecmascript', 'modern javascript'],
  'typescript': ['typescript', 'ts'],
  'html5 & css3': ['html', 'html5', 'css', 'css3', 'html5 & css3', 'web markup'],
  'tailwind css': ['tailwind', 'tailwindcss', 'tailwind css'],
  'redux toolkit': ['redux', 'redux toolkit', 'rtk', 'state management'],
  'next.js': ['next', 'nextjs', 'next.js', 'next.js app router'],
  'restful apis': ['rest', 'rest api', 'rest apis', 'restful', 'restful apis', 'api integration', 'apis', 'crud'],
  'jwt authentication': ['jwt', 'json web token', 'jwt authentication', 'authentication', 'auth', 'oauth', 'token auth'],
  'git & github': ['git', 'github', 'gitlab', 'git & github', 'version control'],
  'sql': ['sql', 'relational database', 'rdbms', 'mysql', 'postgresql', 'postgres', 'sqlite', 'queries'],
  'python': ['python', 'python3', 'django', 'flask', 'fastapi'],
  'docker': ['docker', 'container', 'containerization', 'docker compose', 'dockerfile'],
  'kubernetes': ['kubernetes', 'k8s'],
  'aws (amazon web services)': ['aws', 'amazon web services', 'amazon s3', 'aws s3', 's3', 'ec2', 'lambda', 'dynamodb'],
  'ci/cd pipelines': ['ci/cd', 'ci cd', 'continuous integration', 'github actions', 'jenkins', 'pipeline'],
  'redis': ['redis', 'caching', 'cache'],
  'linux': ['linux', 'ubuntu', 'bash', 'shell', 'unix']
};

/**
 * Standardize text string for token comparison
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9#+.]/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Checks if candidate has matching evidence for a target skill
 */
export const hasSkillMatch = (candidateSkills = [], targetSkill = '') => {
  const normTarget = normalizeText(targetSkill);
  if (!normTarget) return false;

  // 1. Direct normalized match
  for (const cs of candidateSkills) {
    const normCand = normalizeText(cs);
    if (!normCand) continue;
    if (normCand === normTarget) return true;
    if (normCand.length >= 3 && normTarget.includes(normCand)) return true;
    if (normTarget.length >= 3 && normCand.includes(normTarget)) return true;
  }

  // 2. Alias dictionary match
  const aliasList = SKILL_ALIASES[targetSkill.toLowerCase()] || [];
  for (const alias of aliasList) {
    const normAlias = normalizeText(alias);
    for (const cs of candidateSkills) {
      const normCand = normalizeText(cs);
      if (normCand === normAlias || (normAlias.length >= 3 && normCand.includes(normAlias))) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Extract unified skills from all profile areas (technical, tools, projects, experience)
 */
export const extractAllCandidateSkills = (profile, resumeData = null) => {
  const skillsSet = new Set();

  // Skills section
  const skillsObj = profile?.skills || {};
  Object.values(skillsObj).forEach(val => {
    if (Array.isArray(val)) {
      val.forEach(s => { if (typeof s === 'string' && s.trim()) skillsSet.add(s.trim()); });
    }
  });

  // Projects technologies
  const projects = profile?.projects || [];
  projects.forEach(p => {
    if (Array.isArray(p.technologies)) {
      p.technologies.forEach(t => { if (typeof t === 'string' && t.trim()) skillsSet.add(t.trim()); });
    }
    if (p.description) {
      // Look for keyword mentions in project description
      Object.keys(SKILL_ALIASES).forEach(skillName => {
        if (p.description.toLowerCase().includes(skillName.split(' ')[0].toLowerCase())) {
          skillsSet.add(skillName);
        }
      });
    }
  });

  // Experience descriptions & positions
  const experience = profile?.experience || [];
  experience.forEach(exp => {
    const text = `${exp.position || ''} ${exp.description || ''}`.toLowerCase();
    Object.keys(SKILL_ALIASES).forEach(skillName => {
      if (text.includes(skillName.split(' ')[0].toLowerCase())) {
        skillsSet.add(skillName);
      }
    });
  });

  // Certifications
  const certs = profile?.certifications || [];
  certs.forEach(c => {
    if (c.name) {
      const text = c.name.toLowerCase();
      if (text.includes('aws')) skillsSet.add('AWS (Amazon Web Services)');
      if (text.includes('react')) skillsSet.add('React.js');
      if (text.includes('node')) skillsSet.add('Node.js');
      if (text.includes('mongo')) skillsSet.add('MongoDB');
      if (text.includes('python')) skillsSet.add('Python');
    }
  });

  // Resume text keywords if supplied
  if (typeof resumeData === 'string' && resumeData.length > 50) {
    const lower = resumeData.toLowerCase();
    Object.keys(SKILL_ALIASES).forEach(skillName => {
      const base = skillName.split(' ')[0].toLowerCase();
      if (lower.includes(base)) {
        skillsSet.add(skillName);
      }
    });
  }

  return Array.from(skillsSet);
};

/**
 * Calculate candidate profile completeness & health
 */
export const evaluateProfileQuality = (profile) => {
  let completeness = 0;
  const warnings = [];
  const recommendations = [];

  const techSkills = profile?.skills?.technical || [];
  const totalSkills = Object.values(profile?.skills || {}).flat().filter(Boolean);
  const projects = profile?.projects || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const personalInfo = profile?.personalInfo || {};

  // Personal Info (20%)
  if (personalInfo.fullName && personalInfo.email) {
    completeness += 15;
    if (personalInfo.linkedin || personalInfo.github) completeness += 5;
  } else {
    warnings.push("Contact details are incomplete.");
    recommendations.push("Add full name and professional email.");
  }

  // Skills (30%)
  if (techSkills.length >= 6) {
    completeness += 30;
  } else if (techSkills.length >= 3) {
    completeness += 20;
    warnings.push(`Only ${techSkills.length} technical skills found.`);
    recommendations.push("List at least 6 technical skills for higher recommendation accuracy.");
  } else if (techSkills.length > 0) {
    completeness += 10;
    warnings.push("Fewer than 3 technical skills listed.");
    recommendations.push("Add core programming languages and frameworks in your profile.");
  } else {
    warnings.push("No technical skills registered in profile.");
    recommendations.push("Add your technical skills to generate personalized recommendations.");
  }

  // Projects (25%)
  if (projects.length >= 2) {
    completeness += 25;
  } else if (projects.length === 1) {
    completeness += 15;
    recommendations.push("Add a second project to showcase breadth of technical implementation.");
  } else {
    warnings.push("No technical projects found.");
    recommendations.push("Add development projects to prove practical skills to employers.");
  }

  // Experience (15%)
  if (experience.length >= 1) {
    completeness += 15;
  } else {
    recommendations.push("Add internships, freelance work, or open-source experience.");
  }

  // Education (10%)
  if (education.length >= 1) {
    completeness += 10;
  } else {
    warnings.push("No education background recorded.");
    recommendations.push("Specify your degree or college program.");
  }

  const isComplete = completeness >= 60 && totalSkills.length >= 3;
  const isIncomplete = completeness < 50 || totalSkills.length < 3;

  return {
    completenessScore: Math.min(100, completeness),
    isComplete,
    isIncomplete,
    warnings,
    recommendations
  };
};

/**
 * Main Explainable Evaluation Algorithm
 * Evaluates user profile against all career roles with transparent weighted breakdown
 */
export const evaluateRecommendations = (profile, options = {}) => {
  const {
    region = 'IN',
    domainFilter = 'All',
    experienceFilter = 'All',
    remoteOnly = false,
    workMode = 'All',
    salaryRange = 'All',
    minSalary = 0,
    searchQuery = '',
    savedRoleIds = []
  } = options;

  const quality = evaluateProfileQuality(profile);
  const candidateSkills = extractAllCandidateSkills(profile);
  const projects = profile?.projects || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const certifications = profile?.certifications || [];

  // Weights configuration (Sum = 100)
  const weights = {
    skills: 40,      // 40% Core & Secondary Skills
    experience: 25,  // 25% Experience & Seniority Alignment
    projects: 20,    // 20% Practical Project Evidence
    education: 15    // 15% Education & Certifications
  };

  const results = CAREER_ROLES.map(role => {
    // -------------------------------------------------------------
    // PILLAR 1: Skills Evaluation (Max 40 points)
    // -------------------------------------------------------------
    const matchedRequired = [];
    const missingRequired = [];
    role.requiredSkills.forEach(req => {
      if (hasSkillMatch(candidateSkills, req)) {
        matchedRequired.push(req);
      } else {
        missingRequired.push(req);
      }
    });

    const matchedRecommended = [];
    const missingRecommended = [];
    role.recommendedSkills.forEach(rec => {
      if (hasSkillMatch(candidateSkills, rec)) {
        matchedRecommended.push(rec);
      } else {
        missingRecommended.push(rec);
      }
    });

    const reqFraction = role.requiredSkills.length > 0
      ? (matchedRequired.length / role.requiredSkills.length)
      : 0;
    const recFraction = role.recommendedSkills.length > 0
      ? (matchedRecommended.length / role.recommendedSkills.length)
      : 0;

    // Required skills carry 75% of skill points (up to 30 pts), recommended carry 25% (up to 10 pts)
    const earnedSkills = Math.min(40, Math.round((reqFraction * 30) + (recFraction * 10)));

    // -------------------------------------------------------------
    // PILLAR 2: Experience & Seniority Alignment (Max 25 points)
    // -------------------------------------------------------------
    let earnedExperience = 0;
    let expExplanation = "";

    const expCount = experience.length;
    const isEntryFriendly = Boolean(role.entryLevelEligible);

    if (isEntryFriendly) {
      if (expCount >= 1) {
        earnedExperience = 25;
        expExplanation = `Fully aligns with ${role.title} entry-level / junior profile with verified practical work experience.`;
      } else {
        // Fresher applying to entry-level friendly role
        earnedExperience = 21;
        expExplanation = `Entry-level friendly track (0–2 years). Ideal starting path for freshers and junior developers.`;
      }
    } else {
      // Role requires experience (e.g., DevOps, AI Engineer, Mid-Level)
      if (expCount >= 2) {
        earnedExperience = 23;
        expExplanation = `Your multiple prior software roles fulfill the prerequisite experience requirement.`;
      } else if (expCount === 1) {
        earnedExperience = 16;
        expExplanation = `You have foundational work experience, but mid-level roles typically prefer 1–2+ years of production experience.`;
      } else {
        earnedExperience = 10;
        expExplanation = `Typically requires 1–2+ years of industry experience. Building hands-on milestone projects will bridge this gap.`;
      }
    }

    // Check if any experience description matches role keywords
    const relevantExpItems = experience.filter(exp => {
      const text = `${exp.position || ''} ${exp.company || ''} ${exp.description || ''}`.toLowerCase();
      return role.requiredSkills.some(s => text.includes(s.split(' ')[0].toLowerCase()));
    });

    // -------------------------------------------------------------
    // PILLAR 3: Project & Practical Evidence (Max 20 points)
    // -------------------------------------------------------------
    let earnedProjects = 0;
    const matchedProjects = [];

    projects.forEach(proj => {
      const projSkills = Array.isArray(proj.technologies) ? proj.technologies : [];
      const projText = `${proj.name || ''} ${proj.description || ''} ${projSkills.join(' ')}`.toLowerCase();

      const matchedInProj = role.requiredSkills.filter(s => {
        const base = s.split(' ')[0].toLowerCase();
        return projText.includes(base) || projSkills.some(t => t.toLowerCase().includes(base));
      });

      if (matchedInProj.length > 0) {
        matchedProjects.push({
          name: proj.name,
          matchedSkills: matchedInProj,
          hasLink: Boolean(proj.githubUrl || proj.liveUrl)
        });
      }
    });

    if (projects.length === 0) {
      earnedProjects = 4; // Baseline minimal for incomplete profile
    } else if (matchedProjects.length >= 2) {
      earnedProjects = 20;
    } else if (matchedProjects.length === 1) {
      earnedProjects = 15;
    } else {
      // User has projects, but they don't directly match this specific role's tech
      earnedProjects = 9;
    }

    // -------------------------------------------------------------
    // PILLAR 4: Education & Certifications (Max 15 points)
    // -------------------------------------------------------------
    let earnedEducation = 0;
    const eduCount = education.length;
    let hasSTEM = false;

    education.forEach(edu => {
      const deg = (edu.degree || '').toLowerCase();
      if (deg.includes('computer') || deg.includes('technology') || deg.includes('engineering') || deg.includes('science') || deg.includes('it')) {
        hasSTEM = true;
      }
    });

    if (hasSTEM) {
      earnedEducation += 10;
    } else if (eduCount > 0) {
      earnedEducation += 7;
    } else {
      earnedEducation += 3;
    }

    // Certifications boost
    const relevantCerts = certifications.filter(c => {
      const name = (c.name || '').toLowerCase();
      return role.requiredSkills.some(s => name.includes(s.split(' ')[0].toLowerCase()));
    });
    if (relevantCerts.length > 0) {
      earnedEducation = Math.min(15, earnedEducation + 5);
    } else if (certifications.length > 0) {
      earnedEducation = Math.min(15, earnedEducation + 2);
    }

    // -------------------------------------------------------------
    // OVERALL SCORE CALCULATION
    // -------------------------------------------------------------
    let totalScore = earnedSkills + earnedExperience + earnedProjects + earnedEducation;

    // Gracefully clamp between realistic bounds
    if (quality.isIncomplete && candidateSkills.length < 3) {
      totalScore = Math.min(45, Math.max(18, totalScore));
    } else {
      totalScore = Math.min(98, Math.max(22, totalScore));
    }

    // -------------------------------------------------------------
    // PERSONALIZED EXPLAINABLE REASON
    // -------------------------------------------------------------
    let reason = "";
    if (matchedRequired.length >= 6) {
      reason = `Strong candidate fit: You already possess ${matchedRequired.length} of ${role.requiredSkills.length} core technical requirements (${matchedRequired.slice(0, 4).join(', ')}).`;
    } else if (matchedRequired.length >= 3) {
      reason = `Moderate candidate fit: You have verified foundation in ${matchedRequired.join(', ')}. Closing ${missingRequired.slice(0, 2).join(' and ')} will boost eligibility above 85%.`;
    } else {
      reason = `Emerging candidate path: You match foundational skills (${matchedRequired.join(', ') || 'general web concepts'}). Follow the 12-week roadmap to build core competencies in ${missingRequired.slice(0, 3).join(', ')}.`;
    }

    if (matchedProjects.length > 0) {
      reason += ` Your project "${matchedProjects[0].name}" provides verified implementation evidence.`;
    }

    // Prioritize missing skills
    const prioritizedMissing = {
      critical: missingRequired,
      important: missingRecommended,
      niceToHave: role.preferredSkills.filter(s => !hasSkillMatch(candidateSkills, s))
    };

    // Regional salary lookup
    const activeSalary = role.salaryByRegion[region] || role.salaryByRegion['IN'] || {
      formatted: 'Data unavailable',
      source: 'Unavailable',
      updated: 'N/A'
    };

    return {
      ...role,
      matchPercentage: totalScore,
      scoreBreakdown: {
        skills: {
          earned: earnedSkills,
          max: weights.skills,
          percentage: Math.round((earnedSkills / weights.skills) * 100),
          explanation: `Matched ${matchedRequired.length}/${role.requiredSkills.length} core skills and ${matchedRecommended.length}/${role.recommendedSkills.length} recommended skills.`
        },
        experience: {
          earned: earnedExperience,
          max: weights.experience,
          percentage: Math.round((earnedExperience / weights.experience) * 100),
          explanation: expExplanation
        },
        projects: {
          earned: earnedProjects,
          max: weights.projects,
          percentage: Math.round((earnedProjects / weights.projects) * 100),
          explanation: matchedProjects.length > 0
            ? `${matchedProjects.length} projects demonstrated practical role execution.`
            : "No directly matching project evidence found. Building a milestone project is recommended."
        },
        education: {
          earned: earnedEducation,
          max: weights.education,
          percentage: Math.round((earnedEducation / weights.education) * 100),
          explanation: hasSTEM
            ? "Degree in Computer Science / Engineering aligns with technical requirements."
            : "Degree or credentials documented in profile."
        }
      },
      matchedSkills: Array.from(new Set([...matchedRequired, ...matchedRecommended])),
      missingSkills: missingRequired,
      prioritizedMissing,
      evidence: {
        projects: matchedProjects,
        experience: relevantExpItems,
        certifications: relevantCerts
      },
      reason,
      activeSalary,
      isSaved: savedRoleIds.includes(role.id)
    };
  });

  // Sort by highest match score
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Apply filters
  let filtered = results;

  if (domainFilter && domainFilter !== 'All') {
    filtered = filtered.filter(r => r.domain.toLowerCase() === domainFilter.toLowerCase() || r.category.toLowerCase().includes(domainFilter.toLowerCase()));
  }

  if (experienceFilter && experienceFilter !== 'All') {
    if (experienceFilter.includes('Entry') || experienceFilter.includes('Junior')) {
      filtered = filtered.filter(r => r.entryLevelEligible);
    } else if (experienceFilter.includes('Mid')) {
      filtered = filtered.filter(r => r.experienceLevel.includes('Mid'));
    }
  }

  if (remoteOnly || workMode === 'Remote') {
    filtered = filtered.filter(r => r.remoteFriendly);
  }

  if (salaryRange && salaryRange !== 'All') {
    const minLPA = parseFloat(salaryRange);
    if (!isNaN(minLPA)) {
      filtered = filtered.filter(r => {
        const sal = r.salaryByRegion?.IN || r.salaryByRegion?.[region] || r.activeSalary;
        return sal && sal.max >= minLPA;
      });
    }
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.domain.toLowerCase().includes(q) ||
      r.requiredSkills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (options.savedOnly) {
    filtered = filtered.filter(r => r.isSaved);
  }

  return {
    recommendations: filtered,
    allRecommendations: results,
    profileQuality: quality,
    totalRolesEvaluated: results.length,
    activeRegion: region,
    methodology: {
      name: "CareerCraft Explainable Competency Matrix",
      weights: "Skills (40%) + Experience Fit (25%) + Project Evidence (20%) + Education (15%)",
      algorithm: "Deterministic rule-based evaluation with multi-attribute skill alias mapping"
    }
  };
};

/**
 * Generate personalized roadmap milestone progress for a specific role
 */
export const getPersonalizedRoadmap = (roleId, profile, savedCompletedTaskIds = []) => {
  const role = CAREER_ROLES.find(r => r.id === roleId) || CAREER_ROLES[0];
  const candidateSkills = extractAllCandidateSkills(profile);

  // Deep clone milestones
  const milestones = JSON.parse(JSON.stringify(role.milestones || []));

  let totalTasks = 0;
  let completedTasks = 0;

  milestones.forEach(ms => {
    (ms.tasks || []).forEach(task => {
      totalTasks++;

      // Automatically mark complete if user already has skill match or manually ticked
      const autoMatch = hasSkillMatch(candidateSkills, task.title);
      const isManuallyChecked = savedCompletedTaskIds.includes(task.id);

      if (autoMatch || isManuallyChecked) {
        task.completed = true;
        completedTasks++;
      } else {
        task.completed = false;
      }
    });
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    roleId: role.id,
    roleTitle: role.title,
    domain: role.domain,
    milestones,
    totalTasks,
    completedTasks,
    progressPercent,
    certificationsRecommended: role.certificationsRecommended || [],
    coursesRecommended: role.coursesRecommended || []
  };
};
