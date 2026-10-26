// Skill Gap Engine for CareerCraft AI
// Evaluates candidate profile against role requirements with deterministic skill level detection,
// gap classification, 4-phase learning roadmap, and project recommendations.

import { hasSkillMatch, extractAllCandidateSkills } from './careerEngine.js';
import { CAREER_ROLES } from '../data/careerRolesData.js';

// Proficiency weight order
const PROFICIENCY_RANK = {
  'Not detected in profile': 0,
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3
};

/**
 * Determine a candidate's estimated proficiency in a skill based on profile evidence
 */
export const determineCandidateProficiency = (skillName, profile) => {
  const normSkill = skillName.toLowerCase();
  const allCandidateSkills = extractAllCandidateSkills(profile);

  const isMatched = hasSkillMatch(allCandidateSkills, skillName);
  if (!isMatched) {
    return 'Not detected in profile';
  }

  // Count evidence occurrences across projects, experience, and profile
  let evidencePoints = 1; // Base point for listing the skill

  const projects = profile?.projects || [];
  projects.forEach(p => {
    const pTechs = Array.isArray(p.technologies) ? p.technologies.map(t => t.toLowerCase()) : [];
    const pDesc = (p.description || '').toLowerCase();
    if (pTechs.some(t => t.includes(normSkill) || normSkill.includes(t)) || pDesc.includes(normSkill)) {
      evidencePoints += 1.5;
    }
  });

  const experience = profile?.experience || [];
  experience.forEach(exp => {
    const expText = `${exp.position || ''} ${exp.description || ''}`.toLowerCase();
    if (expText.includes(normSkill)) {
      evidencePoints += 2;
    }
  });

  const certifications = profile?.certifications || [];
  certifications.forEach(cert => {
    const certText = `${cert.name || ''} ${cert.issuer || ''}`.toLowerCase();
    if (certText.includes(normSkill)) {
      evidencePoints += 2;
    }
  });

  if (evidencePoints >= 4) return 'Advanced';
  if (evidencePoints >= 2) return 'Intermediate';
  return 'Beginner';
};

/**
 * Determine required level for a skill in a target role
 */
export const determineRequiredLevel = (skillName, role) => {
  const isRequired = (role.requiredSkills || []).some(s => s.toLowerCase() === skillName.toLowerCase());
  const isRecommended = (role.recommendedSkills || []).some(s => s.toLowerCase() === skillName.toLowerCase());

  if (isRequired) {
    return role.experienceLevel.toLowerCase().includes('senior') ? 'Advanced' : 'Intermediate';
  }
  if (isRecommended) {
    return 'Intermediate';
  }
  return 'Beginner';
};

/**
 * Calculate skill gap string
 */
export const calculateGap = (candidateLevel, requiredLevel) => {
  const cRank = PROFICIENCY_RANK[candidateLevel] || 0;
  const rRank = PROFICIENCY_RANK[requiredLevel] || 2;

  if (cRank >= rRank) return 'None';
  const diff = rRank - cRank;
  if (cRank === 0 && rRank >= 2) return 'Significant';
  if (diff === 1) return 'Minor';
  if (diff === 2) return 'Moderate';
  return 'Significant';
};

/**
 * Determine priority
 */
export const determinePriority = (skillName, role, gap) => {
  const isRequired = (role.requiredSkills || []).some(s => s.toLowerCase() === skillName.toLowerCase());
  const isRecommended = (role.recommendedSkills || []).some(s => s.toLowerCase() === skillName.toLowerCase());

  if (isRequired) {
    return gap === 'None' ? 'Low' : 'High';
  }
  if (isRecommended) {
    return gap === 'Significant' ? 'High' : gap === 'Moderate' ? 'Medium' : 'Low';
  }
  return gap === 'Significant' ? 'Medium' : 'Low';
};

/**
 * Recommended learning resource for a skill
 */
export const getResourceForSkill = (skillName, role) => {
  const resourcesMap = {
    'python': { title: 'Python for Beginners & Data Structures', provider: 'Python.org / Coursera', url: 'https://docs.python.org/3/tutorial/' },
    'react.js': { title: 'React Documentation & Tutorial', provider: 'React.dev Official', url: 'https://react.dev' },
    'node.js': { title: 'Node.js Developer Guide', provider: 'Nodejs.org Official', url: 'https://nodejs.org/en/docs' },
    'express.js': { title: 'Express.js RESTful API Guide', provider: 'Expressjs.com', url: 'https://expressjs.com' },
    'mongodb': { title: 'MongoDB University: Developer Fundamentals', provider: 'MongoDB.com', url: 'https://learn.mongodb.com' },
    'sql': { title: 'PostgreSQL Tutorial & Query Optimization', provider: 'Postgresqltutorial.com', url: 'https://www.postgresqltutorial.com' },
    'docker': { title: 'Docker for Developers Hands-on Guide', provider: 'Docker.com Docs', url: 'https://docs.docker.com/get-started/' },
    'git & github': { title: 'Pro Git Book & Interactive Branching', provider: 'Git-scm.com', url: 'https://git-scm.com/book/en/v2' },
    'aws (ec2/s3)': { title: 'AWS Cloud Practitioner Essentials', provider: 'AWS Skill Builder', url: 'https://aws.amazon.com/training/' },
    'typescript': { title: 'TypeScript for JavaScript Programmers', provider: 'TypeScriptlang.org', url: 'https://www.typescriptlang.org/docs/' },
    'network security': { title: 'Computer Networking & Security Foundations', provider: 'Coursera / Google', url: 'https://www.coursera.org' },
    'linux': { title: 'Linux Command Line Basics', provider: 'Linux Foundation', url: 'https://www.linux.org' },
    'wireshark': { title: 'Wireshark Packet Analysis Guide', provider: 'Wireshark.org', url: 'https://www.wireshark.org/docs/' },
    'siem tools (splunk)': { title: 'Splunk Fundamentals & Threat Hunting', provider: 'Splunk Training', url: 'https://www.splunk.com/en_us/training.html' },
    'vulnerability assessment': { title: 'Nessus & Nmap Vulnerability Scanning', provider: 'Cybrary', url: 'https://www.cybrary.it' },
    'data visualization': { title: 'Data Storytelling with Tableau & Seaborn', provider: 'Coursera', url: 'https://www.coursera.org' },
    'pandas': { title: 'Pandas Data Analysis Tutorial', provider: 'Pandas.pydata.org', url: 'https://pandas.pydata.org/docs/' }
  };

  const key = Object.keys(resourcesMap).find(k => skillName.toLowerCase().includes(k) || k.includes(skillName.toLowerCase()));
  if (key) return resourcesMap[key];

  return {
    title: `${skillName} Official Documentation & Best Practices`,
    provider: `${role.domain} Industry Standards`,
    url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' tutorial documentation')}`
  };
};

/**
 * Generate role-specific project recommendations
 */
export const getRoleProjects = (role) => {
  const roleId = role.id;

  if (roleId === 'python-developer') {
    return [
      {
        id: 'proj-py-1',
        title: 'RESTful E-Commerce & Inventory API',
        difficulty: 'Intermediate',
        duration: '2-3 weeks (~25 hrs)',
        description: 'Build a production-grade REST API with user authentication, inventory tracking, order processing, and automated testing.',
        skills: ['Python', 'Django REST Framework', 'PostgreSQL', 'PyTest', 'Docker'],
        technologies: ['Django', 'PostgreSQL', 'Docker', 'JWT', 'Swagger/OpenAPI'],
        plan: [
          'Design relational database schema for products, categories, orders, and users.',
          'Implement JWT authentication and role-based permissions (Customer vs Admin).',
          'Write comprehensive unit and integration tests using PyTest.',
          'Containerize the application with Docker and Docker Compose.'
        ]
      },
      {
        id: 'proj-py-2',
        title: 'Asynchronous Background Task & Report Service',
        difficulty: 'Advanced',
        duration: '2 weeks (~20 hrs)',
        description: 'Build an asynchronous task queue that ingests sales data, generates PDF invoices, and sends email notifications in the background.',
        skills: ['Python', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL'],
        technologies: ['FastAPI', 'Celery', 'Redis', 'SQLAlchemy', 'WeasyPrint'],
        plan: [
          'Set up FastAPI endpoint for triggering long-running report exports.',
          'Configure Celery worker with Redis broker for asynchronous execution.',
          'Implement automated email dispatch with PDF attachment.',
          'Deploy to cloud service with background process worker.'
        ]
      }
    ];
  }

  if (roleId === 'data-analyst') {
    return [
      {
        id: 'proj-da-1',
        title: 'Customer Churn & Revenue Retention Analytics',
        difficulty: 'Intermediate',
        duration: '2-3 weeks (~20 hrs)',
        description: 'Analyze subscription customer churn patterns, build cohort retention charts, and visualize KPI trends in an interactive dashboard.',
        skills: ['SQL', 'Python', 'Pandas', 'Data Visualization', 'Streamlit'],
        technologies: ['PostgreSQL', 'Pandas', 'Seaborn', 'Streamlit', 'Jupyter'],
        plan: [
          'Extract and clean transactional user activity data using advanced SQL window functions.',
          'Perform exploratory data analysis to identify churn triggers.',
          'Build an interactive dashboard with filterable retention cohorts.',
          'Document actionable business recommendations in an executive summary.'
        ]
      },
      {
        id: 'proj-da-2',
        title: 'Automated E-Commerce Sales Pipeline & ETL',
        difficulty: 'Intermediate',
        duration: '2 weeks (~18 hrs)',
        description: 'Extract daily sales figures from multiple sources, clean data into a dimensional data warehouse, and generate automated weekly reports.',
        skills: ['SQL', 'Python', 'ETL Pipelines', 'Excel / Sheets', 'Tableau'],
        technologies: ['Python', 'SQLAlchemy', 'Airflow / Cron', 'Excel API'],
        plan: [
          'Create Python automated ingestion script connecting to REST API or CSV feeds.',
          'Transform data into Star Schema facts and dimensions table.',
          'Automate scheduled runs and email alerts for metric discrepancies.'
        ]
      }
    ];
  }

  if (roleId === 'cybersecurity-analyst') {
    return [
      {
        id: 'proj-sec-1',
        title: 'Network Vulnerability Scanner & Incident Playbook',
        difficulty: 'Intermediate',
        duration: '2-3 weeks (~24 hrs)',
        description: 'Perform automated port discovery, identify outdated protocols, and create a comprehensive remediation playbook.',
        skills: ['Wireshark', 'Linux', 'Vulnerability Assessment', 'Python', 'Firewalls & VPNs'],
        technologies: ['Nmap', 'Wireshark', 'Python', 'UFW/Iptables', 'Bash'],
        plan: [
          'Perform network host and service discovery in a sandboxed lab environment.',
          'Analyze network traffic captures using Wireshark for cleartext credentials.',
          'Harden Linux host with firewall rules and disable vulnerable services.',
          'Draft an Incident Response Playbook following NIST guidelines.'
        ]
      },
      {
        id: 'proj-sec-2',
        title: 'Centralized SIEM Log Monitoring & Alerting System',
        difficulty: 'Advanced',
        duration: '3 weeks (~28 hrs)',
        description: 'Deploy a centralized SIEM instance, collect authentication and web logs, and configure automated alert triggers for suspicious patterns.',
        skills: ['SIEM Tools (Splunk)', 'Linux', 'Incident Response', 'OWASP Top 10'],
        technologies: ['Splunk / ELK', 'Syslog', 'Python', 'Bash Scripting'],
        plan: [
          'Deploy Splunk or Elasticsearch log forwarder on server nodes.',
          'Configure parsing rules for authentication and web server access logs.',
          'Create detection rules for brute-force logins and SQL injection attempts.',
          'Build an interactive SOC incident triage dashboard.'
        ]
      }
    ];
  }

  // Default: Full Stack / MERN / Backend / Frontend
  return [
    {
      id: 'proj-mern-1',
      title: 'Full-Stack SaaS Platform with JWT Auth & Role-Based Access',
      difficulty: 'Intermediate',
      duration: '2-3 weeks (~25 hrs)',
      description: 'End-to-end web application with secure authentication, RESTful APIs, responsive React UI, and persistent database storage.',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'RESTful APIs'],
      technologies: ['React 19', 'Express.js', 'MongoDB', 'Mongoose', 'Tailwind CSS'],
      plan: [
        'Model database schemas with Mongoose and compound indexes.',
        'Implement JWT authentication with access and refresh tokens.',
        'Develop responsive frontend UI with client-side routing and state.',
        'Deploy backend API and frontend to production cloud environment.'
      ]
    },
    {
      id: 'proj-mern-2',
      title: 'High-Concurrency Caching & Microservice Task Service',
      difficulty: 'Advanced',
      duration: '2 weeks (~20 hrs)',
      description: 'Containerized service implementing Redis caching, rate limiting, and Docker Compose for production scale execution.',
      skills: ['Docker', 'Redis', 'Node.js', 'TypeScript', 'RESTful APIs'],
      technologies: ['Docker', 'Docker Compose', 'Redis', 'Express', 'TypeScript'],
      plan: [
        'Containerize frontend, backend API, and database services.',
        'Integrate Redis caching layer to reduce database queries by 80%.',
        'Implement API rate-limiting middleware to guard against abuse.',
        'Configure GitHub Actions CI/CD pipeline for automated testing.'
      ]
    }
  ];
};

/**
 * Main Analysis Function
 */
export const runComprehensiveSkillGapAnalysis = (roleId, profile, savedTaskIds = [], skillStatusMap = {}) => {
  const role = CAREER_ROLES.find(r => r.id === roleId) || CAREER_ROLES[0];
  const allCandidateSkills = extractAllCandidateSkills(profile);

  // Combine all required, recommended, and preferred skills
  const allSkillsList = [
    ...(role.requiredSkills || []).map(s => ({ name: s, category: 'Core Required' })),
    ...(role.recommendedSkills || []).map(s => ({ name: s, category: 'Recommended Tooling' })),
    ...(role.preferredSkills || []).map(s => ({ name: s, category: 'Preferred / Advanced' }))
  ];

  // Remove duplicates by name
  const uniqueSkills = [];
  const seen = new Set();
  allSkillsList.forEach(item => {
    const key = item.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSkills.push(item);
    }
  });

  let matchedCount = 0;
  let toImproveCount = 0;
  let missingCount = 0;

  const comparisonRows = uniqueSkills.map(item => {
    const skillName = item.name;
    const yourLevel = determineCandidateProficiency(skillName, profile);
    const requiredLevel = determineRequiredLevel(skillName, role);
    const gap = calculateGap(yourLevel, requiredLevel);
    const priority = determinePriority(skillName, role, gap);
    const resource = getResourceForSkill(skillName, role);
    const currentStatus = skillStatusMap[skillName] || (yourLevel !== 'Not detected in profile' && gap === 'None' ? 'completed' : 'none');

    // Tally metrics
    if (yourLevel !== 'Not detected in profile' && (gap === 'None' || currentStatus === 'completed')) {
      matchedCount++;
    } else if (yourLevel !== 'Not detected in profile' && gap !== 'None') {
      toImproveCount++;
    } else {
      missingCount++;
    }

    const whyItMatters = (role.requiredSkills || []).includes(skillName)
      ? `Essential core prerequisite for ${role.title}. Required for foundational job tasks and technical interviews.`
      : (role.recommendedSkills || []).includes(skillName)
      ? `Standard industry tooling for ${role.domain} workflows. Significantly increases candidate productivity and hiring appeal.`
      : `Bonus competitive advantage. Demonstrates architectural depth and readiness for advanced responsibilities.`;

    const estimatedHours = gap === 'Significant' ? '20-25 hrs' : gap === 'Moderate' ? '12-16 hrs' : gap === 'Minor' ? '6-8 hrs' : '0 hrs';

    return {
      skill: skillName,
      category: item.category,
      yourLevel,
      requiredLevel,
      gap,
      priority,
      whyItMatters,
      targetProficiency: requiredLevel,
      estimatedHours,
      resource,
      status: currentStatus // 'none' | 'learning' | 'completed'
    };
  });

  const totalSkills = comparisonRows.length;
  // Coverage = (matched + 0.5 * toImprove) / totalSkills * 100
  const coveragePercent = totalSkills > 0 ? Math.round(((matchedCount + (toImproveCount * 0.5)) / totalSkills) * 100) : 0;

  // Group into High, Medium, Low priority missing / to improve
  const prioritizedMissing = {
    high: comparisonRows.filter(r => r.priority === 'High' && r.gap !== 'None'),
    medium: comparisonRows.filter(r => r.priority === 'Medium' && r.gap !== 'None'),
    low: comparisonRows.filter(r => r.priority === 'Low' && r.gap !== 'None')
  };

  // 4-Phase Roadmap
  const rawMilestones = role.milestones || [];
  const phase1Tasks = rawMilestones[0]?.tasks || [
    { id: `${role.id}-p1-1`, title: `Master core fundamentals of ${role.requiredSkills.slice(0, 2).join(' & ')}`, estimatedHours: 12 },
    { id: `${role.id}-p1-2`, title: `Set up local development environment and version control`, estimatedHours: 6 }
  ];
  const phase2Tasks = rawMilestones[1]?.tasks || [
    { id: `${role.id}-p2-1`, title: `Build practical components and exercises with ${role.recommendedSkills.slice(0, 2).join(' and ')}`, estimatedHours: 14 },
    { id: `${role.id}-p2-2`, title: `Implement clean architectural patterns and unit tests`, estimatedHours: 10 }
  ];
  const phase3Tasks = rawMilestones[2]?.tasks || [
    { id: `${role.id}-p3-1`, title: `Build production-ready portfolio project demonstrating full stack workflows`, estimatedHours: 16 },
    { id: `${role.id}-p3-2`, title: `Containerize and deploy application with automated CI/CD pipeline`, estimatedHours: 10 }
  ];
  const phase4Tasks = [
    { id: `${role.id}-p4-1`, title: `Practice technical coding challenges and ${role.title} interview questions`, estimatedHours: 12 },
    { id: `${role.id}-p4-2`, title: `Tailor resume bullet points with quantified project metrics`, estimatedHours: 6 },
    { id: `${role.id}-p4-3`, title: `Prepare for industry credential: ${role.certificationsRecommended?.[0] || 'Domain Certification'}`, estimatedHours: 15 }
  ];

  // Mark completion status for tasks
  const applyTaskCompletion = (tasks) => {
    return tasks.map(t => ({
      ...t,
      completed: savedTaskIds.includes(t.id) || hasSkillMatch(allCandidateSkills, t.title)
    }));
  };

  const roadmapPhases = [
    {
      phaseNumber: 1,
      name: 'Phase 1 — Fundamentals',
      subtitle: 'Strengthen core prerequisite skills and concepts',
      duration: 'Weeks 1-4 (~30 hrs)',
      tasks: applyTaskCompletion(phase1Tasks),
      deliverable: rawMilestones[0]?.projectDeliverable || `Solidified foundational competence in ${role.requiredSkills.slice(0, 3).join(', ')}.`,
      resources: (role.coursesRecommended || []).slice(0, 1)
    },
    {
      phaseNumber: 2,
      name: 'Phase 2 — Practical Application',
      subtitle: 'Build exercises and practical component integrations',
      duration: 'Weeks 5-8 (~35 hrs)',
      tasks: applyTaskCompletion(phase2Tasks),
      deliverable: rawMilestones[1]?.projectDeliverable || `Hands-on working components implementing ${role.recommendedSkills.slice(0, 2).join(' and ')}.`,
      resources: (role.coursesRecommended || []).slice(1, 2)
    },
    {
      phaseNumber: 3,
      name: 'Phase 3 — Role-Specific Projects',
      subtitle: 'Create real-world portfolio deliverables demonstrating target competencies',
      duration: 'Weeks 9-12 (~40 hrs)',
      tasks: applyTaskCompletion(phase3Tasks),
      deliverable: rawMilestones[2]?.projectDeliverable || `Production-grade deployed project with automated test coverage.`,
      resources: (role.coursesRecommended || []).slice(0, 2)
    },
    {
      phaseNumber: 4,
      name: 'Phase 4 — Job Readiness',
      subtitle: 'Practice technical interviews, resume review, and assessments',
      duration: 'Weeks 13-14 (~20 hrs)',
      tasks: applyTaskCompletion(phase4Tasks),
      deliverable: `Interview-ready resume with verified portfolio evidence and assessment preparation.`,
      resources: (role.certificationsRecommended || []).map(c => ({ title: c, provider: 'Industry Credential' }))
    }
  ];

  // Calculate total roadmap completion
  let allRoadmapTasksCount = 0;
  let completedRoadmapTasksCount = 0;
  roadmapPhases.forEach(p => {
    p.tasks.forEach(t => {
      allRoadmapTasksCount++;
      if (t.completed) completedRoadmapTasksCount++;
    });
  });
  const roadmapPercent = allRoadmapTasksCount > 0 ? Math.round((completedRoadmapTasksCount / allRoadmapTasksCount) * 100) : 0;

  // Single highest-priority learning task
  const topHighGap = prioritizedMissing.high[0] || prioritizedMissing.medium[0] || comparisonRows.find(r => r.gap !== 'None');
  const nextRecommendedAction = topHighGap ? {
    skill: topHighGap.skill,
    title: `Close high-priority gap: ${topHighGap.skill}`,
    desc: topHighGap.whyItMatters,
    hours: topHighGap.estimatedHours,
    resource: topHighGap.resource
  } : {
    skill: role.requiredSkills[0] || 'Technical Mastery',
    title: `Review advanced production patterns in ${role.requiredSkills[0]}`,
    desc: `Your core skills meet baseline requirements. Deepen system architecture knowledge.`,
    hours: '10 hrs',
    resource: getResourceForSkill(role.requiredSkills[0], role)
  };

  // Projects
  const recommendedProjects = getRoleProjects(role);

  return {
    role,
    metrics: {
      matched: matchedCount,
      toImprove: toImproveCount,
      missing: missingCount,
      totalSkills,
      coveragePercent
    },
    comparisonRows,
    prioritizedMissing,
    roadmapPhases,
    roadmapPercent,
    completedTasksCount: completedRoadmapTasksCount,
    totalTasksCount: allRoadmapTasksCount,
    nextRecommendedAction,
    recommendedProjects,
    certificationsRecommended: role.certificationsRecommended || [],
    coursesRecommended: role.coursesRecommended || []
  };
};
